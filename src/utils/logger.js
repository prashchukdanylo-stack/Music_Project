const logger = function (func, message) {

    return function (...args) {
        console.log(message);
        return func(...args);
    }
}

export default logger;