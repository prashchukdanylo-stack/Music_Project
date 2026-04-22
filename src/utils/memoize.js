export const memoize = (fn, options) => {
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