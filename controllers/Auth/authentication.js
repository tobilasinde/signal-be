let jwt = require('jsonwebtoken')
const CryptoJS = require('crypto-js')
let DB = require('../DB/db')
let ShortUniqueId = require('short-unique-id');
const { Op } = require('sequelize');
let bCrypt = require('bcryptjs');

function generateHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

function isValidPassword(userpass, password) {
    return bCrypt.compareSync(password, userpass);
}
/**
 * check if user is authorized
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

const isAuthorized = async (req, res, next) => {

    //we have called this middleware on all routes, but there are some routes which run regardless of auth
    //so we have put those routes in process.env, and we will check if current route is one of those routes then return next, otherwise check auth

    //this is the url without query params
    let current_route_path = req.originalUrl.split("?").shift()

    let routes_excluded_from_auth = process.env.ROUTES_EXCLUDED_FROM_AUTH
    if(routes_excluded_from_auth.indexOf(current_route_path)>-1){
        return next();
    }

    //headers should have authorization field
    const { authorization } = req.headers

    //if authorization token is undefined or null or empty return unauthorized
    if (!authorization)
        return res.status(401).send({ message: 'Unauthorized' });
    //token should be in the form of Bearer asdada32424ilsnk.......

    //if authorization token does not contain Bearer then return unauthorized
    if (!authorization.startsWith('Bearer'))
        return res.status(401).send({ message: 'Unauthorized' });

    //token contains Bearer, let's check if token has data along sides Bearer key
    //we will split token with 'Bearer ', if we get an array of exact length 2 then it means token has data otherwise it does not have or it is malformed
    const split = authorization.split('Bearer ')
    if (split.length !== 2)
        return res.status(401).send({ message: 'Unauthorized' });

    //at this point we are sure that we have a valid(format) token, now let's get the token data
    const token = split[1]
    //lets decode this token
    //JSON WEB TOKENS are designed in a way that they generate exception while decoding if they are not valid or expired

    try {
        let jwtSecret = process.env.JWTSECRET
        // Decode JWT token
        let decodedToken = jwt.verify(token, jwtSecret);
        
        //if token is not valid, then we will surely not reach at this point, because non valid token would generate exception

        //so token is valid, now let's get details from this token and store in locals for later use
        //store in locals for later use
        let user = decodedToken.user;
        res.locals = { ...res.locals, user}
        
        //move from middleware to next
        return next();
    }
    catch (err) {
        console.error('error')
        console.error('error1')
        console.error(`${err.code} -  ${err.message}`)
        return res.status(403).send(JSON.stringify({token: ''}))
    }
}

/**
 * creates or refresh auth tokens
 * @param {*} req 
 * @param {*} res 
 */

const createJWTToken = async (req, res) => {
    try{
        let app_key_hash = ''
        let refreshTokenData = ''
        //we need to create a new token or refresh the existing one
        if((req.body).hasOwnProperty('key') && req.body.key === 'refresh' )
        {
            //refresh the existing token with help of refresh token sent from the express ejs client

            refreshTokenData = req.body.refreshToken

            //get user details from database with the help of refresh token
            let token = await DB.token.findOne({
                where:{
                    RefreshToken: req.body.refreshToken
                }
            })

            // IF details NOT FOUND, return with empty token 
            if(token === null){
                return res.status(200).send(JSON.stringify({token: ''}))
            }
            else{

                //get app key hash from the DB
                app_key_hash = token.get('KeysHash')
            }
        }
        else if((req.body).hasOwnProperty('app_key' && req.body.app_key !== '')){
            //create new token with the help of data sent from the express client
            app_key_hash = req.body.app_key
        }
        else {
            let data = {};
            data.email = req.body.email
            data.password = req.body.password
            let data_json = JSON.stringify(data);
            
            //create hash key from the API keys
            var ciphertext = CryptoJS.AES.encrypt(data_json,process.env.SALT);
            app_key_hash = ciphertext.toString()
        }
        let unciphered_data = CryptoJS.AES.decrypt(app_key_hash,process.env.SALT).toString(CryptoJS.enc.Utf8);
        let {email, password} = JSON.parse(unciphered_data)
        let user_data = await DB.User.findOne({
            where: {
                Email: email
            }
        })
        if(user_data == null){
            return res.status(400).send(JSON.stringify({token: ''}))
        }
        if (!isValidPassword(user_data.Password, password)) {
            return res.status(400).send(JSON.stringify({token: ''}))
        }

        let jwt_secret = process.env.JWTSECRET
        let jwt_expiry_time = process.env.JWT_EXPIRY_TIME

        let user = {
            id: user_data.id,
            email: user_data.Email,
            fullName: user_data.FullName,
            userName: user_data.UserName,
            profilePic: user_data.profilePicURL
        }
        // Create New JWT Token For User with a salt saved in process.env
        let token = jwt.sign({
            user
        }, jwt_secret, { expiresIn: jwt_expiry_time });

        //we have new access token here, we need to do one thing here

        //we need to check whether there is already a token for this user

        let result = await DB.token.findOne({
            where:{
                [Op.or]:{
                    RefreshToken: refreshTokenData,
                    UID: user_data.id.toString(),
                }
            }
        })


        // CREATE REFRESH TOKEN
        const suid = new ShortUniqueId();
        let RefreshToken = suid.randomUUID(32);
        //we must have exactly 1 record against 1 user

        //if record does not exist, then create
        if(result === null){
            // CREATE RECORD IN TOKEN TABLE
            await DB.token.create({
                RefreshToken: RefreshToken,
                UID: user_data.Id,
                KeysHash: app_key_hash
            })
        }
        else{
            // UPDATE RECORD IN TOKEN TABLE as record exists
            await DB.token.update({
                RefreshToken: RefreshToken,
                UID: user_data.Id,
                KeysHash: app_key_hash
            },
            {
                where: {
                    id: result.id,
            }})
        }
        
        return res.status(200).send(JSON.stringify({token, RefreshToken}))
    }
    catch(error){
        console.log(error)
        return res.status(400).send(JSON.stringify({token: ''}))
    }
}

/**
 * Create a new user
 * @param {*} req 
 * @param {*} res 
 */

const signUp = async (req, res) => {
    try{
        let password = generateHash(req.body.password)
        let input_data = {
            Email: req.body.email,
            UserName: req.body.username,
            FullName: req.body.fullname,
            Password: password,
            Status: "1"
        }
        await DB.User.create(input_data)
        return createJWTToken(req,res)
    }
    catch(error){
        console.log(error)
        return res.status(400).send(JSON.stringify({token: ''}))
    }
}

module.exports = {
    createJWTToken,isAuthorized,signUp
}