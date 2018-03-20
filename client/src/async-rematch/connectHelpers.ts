import { dequery } from './encoders';

export const getQuery = (state, query) => {
    const { collectionName } = dequery(query);

    return state[collectionName].queries[query];
};

export const getItems = (state, query) => {
    const { collectionName } = dequery(query);

    const q = getQuery(state, query);

    if (q.normalized) {
        if (q.normalized instanceof Array) {
            // TODO mark a cache miss if can't map item
            return q.normalized.map((key) => {
                return state[collectionName].items[key];
            });
        } else {
            return state[collectionName].items[q.normalized];
        }
    } else if (q.optimisticQuery) {
        return q.optimisticQuery(state[collectionName]);
    } else {
        return [];
    }
};
