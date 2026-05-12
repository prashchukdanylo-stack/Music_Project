const logger = function (func, message) {

    return function (...args) {
        const result = func(...args);
        console.log(message, result);
        return result;
    }
}

export default logger;