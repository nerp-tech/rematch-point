export const query = (collectionName: string, url: string): string => {
    return `${collectionName}:${encodeURIComponent(url)}`;
};

export const dequery = (query: string): any => {
    const [a, b] = query.split(':');
    return {
        collectionName: a,
        url: decodeURIComponent(b),
    };
};

export const normalize = (data: Object, key: string = 'id') => {
    if (data instanceof Array) {
        return data.map(d => normalize(d, key));
    } else {
        return data[key];
    }
};
