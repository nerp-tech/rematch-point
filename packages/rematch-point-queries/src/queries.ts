import { QueryString } from './types/QueryString';

export const querify = (collectionName = '', url = ''): QueryString => {
    return `${encodeURIComponent(collectionName)}:${encodeURIComponent(url)}`;
};

export const parse = (queryString: string): any => {
    const [a = '', b = ''] = queryString.split(':');
    return {
        collectionName: decodeURIComponent(a),
        url: decodeURIComponent(b),
    };
};
