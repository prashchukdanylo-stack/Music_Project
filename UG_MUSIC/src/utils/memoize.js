const memoize = (fn, maxSize = Infinity) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
    
    const result = fn(...args);

    if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
    cache.set(key, result);
    console.log(cache);
    return result;
    };
};

const plus = (a, b) => {
    return a + b;
}

const memoizedPlus = memoize(plus, 2);
console.log(memoizedPlus(20000000000, 2000000000000000));
console.log(memoizedPlus(1, 2));
console.log(memoizedPlus(2, 3));
console.log(memoizedPlus(3, 4));