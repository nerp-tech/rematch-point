import getNestedValue from './getNestedValue';

export const normalize = (data: any, key: string = 'id'): string | string[] => {
    if (data instanceof Array) {
        return data.map((d) => normalize(d, key)) as string[];
    } else {
        return getNestedValue(key, data);
    }
};
