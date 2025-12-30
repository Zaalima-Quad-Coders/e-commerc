import HandleError from "../utils/handleError.mjs";

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    //castError
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new HandleError(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        message: err.stack
    });
}       
         