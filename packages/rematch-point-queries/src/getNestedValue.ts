/**
 * Given a key and an object, this will return the 
 * value of that key in the object. You can also
 * pass a path as the key using a dot (.) as the delimiter,
 * and this will return the nested value of that path.
 * 
 * @param String key
 * @param any obj
 * @returns value
 */
export default (key: string, obj: any): any => {
    const nest: string[] = key.split('.');
    let current = obj;

    do {
        current = current[nest[0]];
        nest.shift();
    } while (nest.length > 0);

    return current;
};
