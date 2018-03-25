import { normalize, querify } from '@rematch-point/queries';
import { QueryString } from '@rematch-point/queries/dist/types/QueryString';
import { AsyncActionOptions } from './types/AsyncActionOptions';
import { HttpMethod } from './types/HttpMethod';
import { RematchPoint } from './types/RematchPoint';
import createRequestOptions from './createRequestOptions';
import getBeforeQueryState from './getBeforeQueryState';
import { ERROR, LOADED } from './constants';

let request: Function = null;

export const setRequestLibrary = (r: Function) => {
    request = r;
};

const before = (context: RematchPoint, { queryString, method, optimisticQuery }: {
    queryString: string,
    method: HttpMethod,
    optimisticQuery?: Function
}): void => {
    context.updateQuery({
        queryString,
        queryState: getBeforeQueryState(method),
        optimisticQuery,
    });
};

const after = (context: RematchPoint, {
    method,
    queryString,
    normalized,
    data,
    relatedQueries,
}: {
    method: HttpMethod,
    queryString: string,
    normalized: string[],
    data: any,
    relatedQueries?: string[]
}) => {
    switch (method) {
        case 'DELETE': {
            context.removeItems({
                normalized,
                data,
            });
            context.updateQuery({
                queryString,
                queryState: LOADED,
            });
            break;
        }
        case 'POST': {
            context.addItems({
                normalized,
                data,
                queries: [queryString, ...(relatedQueries || [])],
            });
            context.updateQuery({
                queryString,
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
                queryString,
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
                queryString,
                queryState: LOADED,
                normalized,
            });
        }
    }
};

export default (context: RematchPoint, options: AsyncActionOptions): QueryString => {
    const {
        collection,
        url,
        method = HttpMethod.Get,
        key = 'id',
        json = true,
        body,
        optimisticQuery,
        relatedQueries,
        getResponseData,
    } = options;

    // XXX check that context has an updateQuery function

    const queryString = querify(collection, url);

    before(context, {
        queryString,
        method,
        optimisticQuery,
    });

    const requestOptions = createRequestOptions({
        method,
        body,
        json,
        // TODO allow custom options
    });

    request(url, requestOptions).then((raw: any) => {
        let data = getResponseData(raw);
        let normalized = normalize(data, key);

        if (!(data instanceof Array)) {
            data = [data];
        }

        if (!(normalized instanceof Array)) {
            normalized = [normalized];
        }

        after(context, { method, queryString, normalized, data, relatedQueries });

        return {
            queryString,
            data,
        };
    }).catch((err: Error) => {
        context.error({
            queryString,
            queryState: ERROR,
            error: err,
        });

        return {
            error: err,
        };
    });

    return queryString;
};
