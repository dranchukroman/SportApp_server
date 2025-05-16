export function errorHandler(err, req, res, next) {
    const isProd = process.env.NODE_ENV === 'production';

    const statusCode = err.statusCode || 500;
    const message = isProd 
        ? (statusCode === 500 ? 'Internal server error' : err.message)
        : err.message

    const response = {
        success: false,
        status: statusCode,
        message,
    }

    if(!isProd){
        response.stack = err.stack;
        response.stackTrace = err.stackTrace;
    };

    console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);
    res.status(statusCode).json(response);
}