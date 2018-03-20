import * as omit from 'lodash.omit';
import { Query, Items, Item } from './types';

const getErrorMessage = (error) => {
    return error.error;
};

// TODO better error parsing
const error = (state, { query, queryState, error }) => {
    return {
        ...state,
        queries: {
            ...state.queries,
            [query]: {
                ...state.queries[query],
                queryState,
                error: getErrorMessage(error),
            },
        },
    };
};

const updateQuery = (state, { query, queryState, normalized, optimisticQuery }: Query) => {
    return {
        ...state,
        queries: {
            ...state.queries,
            [query]: {
                ...state.queries[query],
                queryState,
                normalized: normalized || (state.queries[query] ? state.queries[query].normalized : undefined),
                optimisticQuery,
                error: null,
            },
        },
    };
};

const addItems = (state, { normalized, data }: Items) => {
    let s = { ...state };

    normalized.forEach((n, i) => {
        s = addItem(s, { normalized: n, data: data[i] });
    });

    return s;
};

const addItem = (state, { normalized, data }: Item) => {
    return {
        ...state,
        items: {
            ...state.items,
            [normalized]: {
                ...state.items[normalized],
                ...data,
            },
        },
    };
};

const removeFromItems = (items, normalized) => {
    return omit(items, normalized);
};

const removeFromQueries = (queries, normalized) => {
    return Object.keys(queries).reduce((all, key) => {
        const q = queries[key];

        all[key] = {
            ...q,
            normalized: q.normalized ? q.normalized.filter(n => n !== normalized) : undefined,
        };

        return all;
    }, {});
};

const removeItem = (state, { normalized }: Item) => {
    return {
        ...state,
        // TODO noooo, no zero index stuff
        items: removeFromItems(state.items, normalized[0]),
        queries: removeFromQueries(state.queries, normalized[0]),
    };
};


export default {
    error,
    updateQuery,
    addItem,
    addItems,
    removeItem,
};
