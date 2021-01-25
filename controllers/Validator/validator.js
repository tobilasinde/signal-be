const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
        /////// MEDIA API ENDPOINTS ////////
    case '/media/create': {
      return [ 
        body('tag').optional().isString().withMessage('Invalid value for tag field'),
        body('category').optional().isString().withMessage('Invalid value for category field')
      ]   
    }
  }
}
