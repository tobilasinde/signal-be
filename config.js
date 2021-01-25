var config = {}

config.DBNAME = "bookme"
config.DBUSERNAME="starlight"
config.DBPASSWORD="14/56Ee241"
config.DBDIALECT = "postgres"
config.DBPORT = 5432
config.DBREGION = 'us-east-1'
config.DBHOST = 'localhost'
config.PORT = process.env.PORT || 5000
config.USER_MODULE_API_URL = 'https://d5sqweaij8.execute-api.us-east-1.amazonaws.com/UserModuleStageDev2'
config.JWTSECRET = 'P)$TB!)G'
config.JWT_EXPIRY_TIME = '1h'

config.API_NAME_GET_USERS_LIST = 'api_users_list'
config.FRONTENDLINK = 'http://localhost:3000'
config.API_NAME = 'module_access'
config.FRONTENDREACTPATH = 'https://manifest-articles-react-app.herokuapp.com'
config.FRONTENDLOGINPATH = '/auth/login'
config.BUCKETNAME = 'tobilasinde'
config.REGION = 'us-east-2'
config.ACL = 'public-read'
config.ACCESSKEY = 'AKIAJU2N3O62STLUPQ2Q'
config.SECRETKEY = '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'
// config.CHECKPERMISSION = 'EVERYTIME'
config.CHECKPERMISSION = 'TOKEN'
config.S3_SIGNED_URL_EXPIRYTIME = 3600

config.public_key = 'eoGAfBsXNqr0HxZKFg8pNUVOHyCUjf'
config.private_key = 'U2FsdGVkX1+wNhMouSHUme1M3vSMz0CAsCyMZMOl6Kke230eqhBVlW462jOmmIBc'
config.module_name = '366', //'367'
config.SALT = '7sd!O(!@$*!#*#!a989!!@*#!@#&!^#*!&3hASD987*(#*%$&'
// config.authentication_method = 'POST'
config.authentication_method = 'CONFIG'

// EMAIL CREDENTIALS
config.MAIL_HOST = 'smtp.gmail.com'
config.MAIL_SECURE = 'ssl'
config.MAIL_USERNAME = 'email' //'babatope.olajide@gmail.com'
config.MAIL_PASSWORD = 'password' //'wtdyucsmshylaahb'
config.MAIL_FROM = 'info@manifest.ng'

///// RESPONSE MESSAGES //////
config.SUCCESS = "{{MODEL}} {{FUNCTION}} successfully"
config.SUCCESSWITHERROR = "Some {{MODEL}} {{FUNCTION}} with {{ERRORCOUNT}} errors"
config.ERROR = "{{MODEL}} not {{FUNCTION}} successfully"
config.NOTFOUND = "Not Found"
config.NOTFOUNDWITHVALUE = "{{VALUE}} not found"
config.INTERNALSERVERERROR = "Internal server error"


////// BUSINESS SETTINGS //////
config.BUSINESS_START_TIME = "8:00"
config.BUSINESS_END_TIME = "16:00"
config.PAYSTACK_PUBLIC_KEY = ''
config.BUSINESS_NAME = ''
config.BUSINESS_ADDRESS = ''
config.view = {}
config.view.BUSINESS_START_TIME = "8:00"
config.view.BUSINESS_END_TIME = "16:00"
config.view.PAYSTACK_PUBLIC_KEY = ''
config.view.BUSINESS_NAME = ''
config.view.BUSINESS_ADDRESS = ''

config.ROUTES_EXCLUDED_FROM_AUTH = ["/test",'','/','/auth','/uploadFileToS3','/getDownloadUrl','/fetchSignature']
module.exports = config



// RESPONSE CODE
// Success 200
// Error 400
// Not Authorize 403
// Params Required 411
