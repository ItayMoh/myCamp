class ErrorGen extends Error{
    constructor(code, message){
        super()
        this.statusCode = code;
        this.message = message;
    }
}
module.exports = ErrorGen;