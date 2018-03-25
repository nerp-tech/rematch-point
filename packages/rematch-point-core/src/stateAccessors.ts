import { parse } from '@rematch-point/queries';
import { Query } from './types/Query';
import { CREATING, UPDATING } from './constants';

export const getQuery = (state: any, queryString: string): Query => {
    const { collectionName } = parse(queryString);

    return state[collectionName].queries[queryString];
};

const denormalize = (state: any, query: Query, collectionName: string): any => {
    if (query.normalized) {
        if (query.normalized instanceof Array) {
            // TODO mark a cache miss if can't map item
            return query.normalized.map((key) => {
                return state[collectionName].items[key];
            });
        } else {
            // TODO query.normalized should always be an array
            return state[collectionName].items[query.normalized];
        }
    } else {
        return null;
    }
};

export const getItems = (state: any, queryString: string): any => {
    const { collectionName } = parse(queryString);

    const q = getQuery(state, queryString);
    const denormalized = denormalize(state, q, collectionName);
    const isModifying = q.queryState === UPDATING || q.queryState === CREATING;

    if (isModifying && q.optimisticQuery) {
        return q.optimisticQuery(state[collectionName], denormalized);
    } else if (q.normalized) {
        return denormalized;
    } else if (q.optimisticQuery) {
        return q.optimisticQuery(state[collectionName]);
    } else {
        return [];
    }
};
