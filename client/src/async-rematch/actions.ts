import { query, normalize } from './encoders';
import { LOADING, LOADED, ERROR, DELETING, CREATING, UPDATING } from './constants';

let request = null;

// TODO move to types
type AsyncAction = {
    collection: string,
    url: string,
    key?: string,
    body?: any,
    json?: boolean,
    method?: string
    relatedQueries?: Array<String>,
    optimisticQuery?: Function,
    getResponseData: Function,
}

const getLoadingQueryState = (method: string): string => {
    switch (method) {
        case 'DELETE':
            return DELETING;
        case 'PUT':
            return UPDATING;
        case 'POST':
            return CREATING;
        default:
            return LOADING;
    }
};

const performEffects = (method: string, context: any, query, normalized: string, data: any, relatedQueries?: Array<String>) => {
    switch (method) {
        case 'DELETE': {
            context.removeItem({
                normalized,
                data,
            });
            context.updateQuery({
                query,
                queryState: LOADED,
            });
            break;
        }
        case 'POST': {
            context.addItems({
                normalized,
                data,
                queries: [query, ...(relatedQueries || [])],
            });
            context.updateQuery({
                query,
                queryState: LOADED,
                // normalized,
            });
            break;
        }
        case 'PUT': {
            context.updateItems({
                normalized,
                data,
            });
            context.updateQuery({
                query,
                queryState: LOADED,
                normalized,
            });
            break;
        }
        case 'GET':
        default: {
            context.setItems({
                normalized,
                data,
            });
            context.updateQuery({
                query,
                queryState: LOADED,
                normalized,
            });
        }
    }
}

const createOptions = (method, body, json) => {
    const options: any = { method, json };

    if (method !== 'GET') {
        options.body = body;
    }

    return options;
};

export const setRequestLibrary = (r) => {
    request = r;
}

export const asyncAction = (context, {
    collection,
    url,
    method = 'GET',
    key = 'id',
    json = true,
    body,
    optimisticQuery,
    relatedQueries,
    getResponseData,
}: AsyncAction) => {
    const q = query(collection, url);

    context.updateQuery({
        query: q,
        queryState: getLoadingQueryState(method),
        optimisticQuery,
    });

    const options = createOptions(
        method,
        body,
        json,
    );

    request(url, options).then((raw) => {
        let data = getResponseData(raw);
        let normalized = normalize(data, key);

        if (!(data instanceof Array)) {
            data = [data];
        }

        if (!(normalized instanceof Array)) {
            normalized = [normalized];
        }

        performEffects(method, context, q, normalized, data, relatedQueries);

        return {
            query: q,
            data,
        };
    }).catch((err) => {
        context.error({
            query: q,
            queryState: ERROR,
            error: err,
        });

        return {
            error: err,
        };
    });

    return q;
};
