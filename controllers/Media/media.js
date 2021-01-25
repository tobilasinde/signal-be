// IMPORT DATABASE FILE
const DB = require('../DB/db');
const { validationResult } = require('express-validator');

/**
 * CREATE SINGLE MEDIA
 * @param {media object} req 
 * @param {*} res 
 */
const createMedia = async (req, res) => {
    try{
        // CHECK FOR VALIDATIONS
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ status:false, errors: errors.array() });

        // CREATE MEDIA IN DATABASE
        let insert_data = {
            PublicId: req.body.public_id,
            Category: req.body.category,
            Tag: req.body.tag,
            UserId: res.locals.user.id
        }

        let result = await DB.Media.create(insert_data);

        // RETURN SUCCESS RESPONSE
        return res.status(200).send({status: true, data: result})
    }
    catch(error){
        console.log(error)
        // RETURN RESPONSE
        return res.status(500).send({status: false, message: error.message})
    }
}

/**
 * GET MEDIAS FROM DATABASE, CALLED FROM MEDIAS LISTING PAGE
 * @param {*} req 
 * @param {*} res 
 */

const getMedias = async (req, res) => {
    try{
        console.log(req.query)
        // CHECK FOR VALIDATIONS
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ status:false, errors: errors.array() });

        //CHECK FOR FILTERS
        let where = {}

        if(req.query.hasOwnProperty('personal') && req.query.personal==="true"){
            where.UserId = res.locals.user.id
        }
        let media_data = await DB.Media.findAll({
            where:where,
        })

        let medias = []
        // IF NO MEDIAS IN DATABASE
        if(media_data.length === 0){
            // RETURN EMPTY RESPONSE
            return res.status(200).send({status: true, data: media_data})
        }
        else{
            // LOOP OVER ALL MEDIAS
            for(let i=0;i<media_data.length;i++) {
                let push_data = {
                    id: media_data[i].id,
                    public_id: media_data[i].PublicId,
                    category: media_data[i].Category,
                    tag: media_data[i].Tag,
                }
                medias.push(push_data)
            }

            // RETURN SUCCESS RESPONSE
            return res.status(200).send({status: true, data: medias})
        }
    }
    catch(error){
        // RETURN ERROR RESPONSE
        console.log(error.message)
        return res.status(500).json({status:false, message: error.message})
    }
}

module.exports = {getMedias,createMedia
}