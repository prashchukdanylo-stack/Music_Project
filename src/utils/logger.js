const logger = function (func, message) {
  return function (...args) {
    const result = func(...args);

    if (result instanceof Promise) {
      return result
        .then((resolve) => console.log(message, resolve))
        .catch((e) => {
          console.error(message + "Error: ", e);
        });
    }
    else {
        console.log(message, result);
        return result;
    }

    
  };
};

export default logger;
