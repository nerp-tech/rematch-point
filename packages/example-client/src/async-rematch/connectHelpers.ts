import { CREATING, UPDATING } from './constants';
import { dequery } from './encoders';

export const getQuery = (state, query) => {
    const { collectionName } = dequery(query);

    return state[collectionName].queries[query];
};

const denormalize = (state, q, collectionName) => {
    if (q.normalized) {
        if (q.normalized instanceof Array) {
            // TODO mark a cache miss if can't map item
            return q.normalized.map((key) => {
                return state[collectionName].items[key];
            });
        } else {
            return state[collectionName].items[q.normalized];
        }
    } else {
        return null;
    }
};

export const getItems = (state, query) => {
    const { collectionName } = dequery(query);

    const q = getQuery(state, query);
    const denormalized = denormalize(state, q, collectionName);

    if ((q.queryState === UPDATING || q.queryState === CREATING) && q.optimisticQuery) {
        return q.optimisticQuery(state[collectionName], denormalized);
    } else if (q.normalized) {
        return denormalized;
    } else if (q.optimisticQuery) {
        return q.optimisticQuery(state[collectionName]);
    } else {
        return [];
    }
};
