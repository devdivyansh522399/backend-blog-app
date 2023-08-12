const errorResponsehandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 400
    res.status(statusCode).json({
        succuss : false,
        message : err.message,
        stack : process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {errorResponsehandler};