if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
/*************************************************************************
ADD LIBRARIES
*************************************************************************/

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var routes = require("./routes/routes");
var authenticate = require('./controllers/Auth/authentication');

/*************************************************************************
CREATE APP
*************************************************************************/

var app = express()
/*************************************************************************
PARSE JSON
*************************************************************************/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*************************************************************************
ENABLE CORS AND START SERVER
*************************************************************************/
app.use(cors({ origin: true }))
app.listen(process.env.PORT,async function(){
    console.log("Server started On PORT: "+process.env.PORT);
});

//Routes
app.all('*', authenticate.isAuthorized);

app.use(routes);