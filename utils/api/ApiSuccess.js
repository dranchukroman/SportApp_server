export function ApiSuccess(res, statusCode = 200, data = null, message = "Success") {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}