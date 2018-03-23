import getNestedValue from './getNestedValue';

export const normalize = (data: any, key: string = 'id'): string | string[] => {
    if (data instanceof Array) {
        return <string[]> data.map(d => normalize(d, key));
    } else {
        return getNestedValue(key, data);
    }
};
