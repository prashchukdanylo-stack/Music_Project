const memoize = (fn, options) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      const cached = cache.get(key);
      cached.frequency += 1;
      cache.set(key, cached);
      console.log(cache);
      return cached.value;
    }

    const result = { value: fn(...args), frequency: 1 };

    if (cache.size >= options.maxSize) {
      if (options.strategy === "LRU") {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      } else if (options.strategy === "LFU") {
        let leastFreaqKey = null;
        let leastFreaqValue = Infinity;
        for (const [key, value] of cache.entries()) {
          if (value.frequency < leastFreaqValue) {
            leastFreaqValue = value.frequency;
            leastFreaqKey = key;
          }
        }
        cache.delete(leastFreaqKey);
      }
    }
    if (options.strategy === "TTL") {
      setTimeout(() => {
        cache.delete(key);
        console.log(cache);
      }, options.ttl);
    }
    cache.set(key, result);
    console.log(cache);
    return result.value;
  };
};

const plus = (a, b) => {
  return a + b;
};

const memoizedPlus = memoize(plus, { maxSize: 3, strategy: "TTL", ttl: 5000 });
console.log(memoizedPlus(1, 3));
console.log(memoizedPlus(1, 4));
console.log(memoizedPlus(1, 5));
console.log(memoizedPlus(1, 6));
console.log(memoizedPlus(1, 7));
setTimeout(() => {
  console.log(memoizedPlus(1, 9));
}, 3000);
