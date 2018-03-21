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

const setItems = (state, { normalized, data }: Items) => {
    let s = { ...state };

    normalized.forEach((n, i) => {
        s = setItem(s, { normalized: n, data: data[i] });
    });

    return s;
};

const setItem = (state, { normalized, data }: Item) => {
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

const updateItem = (state, { normalized, data }: Item) => {
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

const updateItems = (state, { normalized, data }: Items) => {
    let s = { ...state };

    normalized.forEach((n, i) => {
        s = updateItem(s, { normalized: n, data: data[i] });
    });

    return s;
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

// TODO rename to removeItems and handle an array
const removeItem = (state, { normalized }: Item) => {
    return {
        ...state,
        // TODO noooo, no zero index stuff
        items: removeFromItems(state.items, normalized[0]),
        queries: removeFromQueries(state.queries, normalized[0]),
    };
};

const addToQueries = (state, { queries, normalized }) => {
    const s = {
        ...state,
    };

    queries.forEach((q) => {
        if (s[q]) {
            s[q] = {
                ...s[q],
                normalized: [...s[q].normalized, normalized],
            }
        }
    });

    return s;
};

// TODO handle an array
const addItems = (state, { queries, normalized, data }) => {
    return {
        ...state,
        items: setItem(state, { normalized: normalized[0], data: data[0] }).items,
        queries: addToQueries(state.queries, { queries, normalized: normalized[0] }),
    };
};


export default {
    error,
    updateQuery,
    addItems,
    setItem,
    setItems,
    updateItems,
    removeItem,
};
