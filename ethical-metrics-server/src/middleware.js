// middleware.js

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).send('Something went wrong');
};

module.exports = {
    errorHandler,
};
