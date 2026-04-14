export async function asyncMap (array, asyncFunc) {
    const promises = array.map(async (item)=> {
        const result = await asyncFunc(item);
        return result;
    });
    return Promise.all(promises);
}