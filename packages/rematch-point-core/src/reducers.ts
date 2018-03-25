import omit = require('lodash.omit');
import { Item, Items } from './types/Items';
import { Query } from './types/Query';

const getErrorMessage = (error: any) => {
    return error.error;
};

// TODO better error parsing
export const error = (state: any, { queryString, queryState, error }: {
    queryString: string,
    queryState: string,
    error: any,
}) => {
    return {
        ...state,
        queries: {
            ...state.queries,
            [queryString]: {
                ...state.queries[queryString],
                error: getErrorMessage(error),
                queryState,
            },
        },
    };
};

export const updateQuery = (state: any, { queryString, queryState, normalized, optimisticQuery }: Query) => {
    const queryNormalized = state.queries[queryString] ? state.queries[queryString].normalized : undefined;
    const newNormalized = normalized || queryNormalized;

    return {
        ...state,
        queries: {
            ...state.queries,
            [queryString]: {
                ...state.queries[queryString],
                error: null,
                normalized: newNormalized,
                optimisticQuery,
                queryState,
            },
        },
    };
};

export const setItems = (state: any, { normalized, data }: Items) => {
    let s = { ...state };

    normalized.forEach((n, i) => {
        s = setItem(s, { normalized: n, data: data[i] });
    });

    return s;
};

const setItem = (state: any, { normalized, data }: Item) => {
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

const updateItem = (state: any, { normalized, data }: Item) => {
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

export const updateItems = (state: any, { normalized, data }: Items) => {
    let s = { ...state };

    normalized.forEach((n, i) => {
        s = updateItem(s, { normalized: n, data: data[i] });
    });

    return s;
};

const removeFromItems = (items: any, normalized: string) => {
    return omit(items, normalized);
};

const removeFromQueries = (queries: any, normalized: string) => {
    return Object.keys(queries).reduce((all: any, key) => {
        const q = queries[key];

        all[key] = {
            ...q,
            normalized: q.normalized ? q.normalized.filter((n: string) => n !== normalized) : undefined,
        };

        return all;
    }, {});
};

// TODO rename to removeItems and handle an array
export const removeItems = (state: any, { normalized }: Items) => {
    return {
        ...state,
        // TODO noooo, no zero index stuff
        items: removeFromItems(state.items, normalized[0]),
        queries: removeFromQueries(state.queries, normalized[0]),
    };
};

const addToQueries = (state: any, { queries, normalized }: {
    queries: any[],
    normalized: string,
}) => {
    const s = {
        ...state,
    };

    queries.forEach((q: any) => {
        if (s[q]) {
            s[q] = {
                ...s[q],
                normalized: [...s[q].normalized, normalized],
            };
        }
    });

    return s;
};

// TODO handle an array
export const addItems = (state: any, { queries, normalized, data }: {
    queries: any[],
    normalized: string[],
    data: any,
}) => {
    return {
        ...state,
        items: setItem(state, { normalized: normalized[0], data: data[0] }).items,
        queries: addToQueries(state.queries, { queries, normalized: normalized[0] }),
    };
};
