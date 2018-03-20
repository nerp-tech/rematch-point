import { query, normalize } from './encoders';
import { LOADING, LOADED, ERROR, DELETING } from './constants';

export const queryBuilder = (request) => (context, {
    collection,
    url,
    method = 'GET',
    key = 'id',
    optimisticQuery,
    getResponseData,
}) => {
    const q = query(collection, url);

    context.updateQuery({
        query: q,
        queryState: method === 'DELETE' ? DELETING : LOADING,
        optimisticQuery,
    });

    request(url, {
        method,
    }).then((raw) => {
        let data = getResponseData(raw);
        let normalized = normalize(data, key);

        if (!(data instanceof Array)) {
            data = [data];
        }

        if (!(normalized instanceof Array)) {
            normalized = [normalized];
        }

        switch (method) {
            case 'DELETE': {
                context.removeItem({
                    normalized,
                    data,
                });
                context.updateQuery({
                    query: q,
                    queryState: LOADED,
                });
                break;
            }
            case 'GET':
            default: {
                context.addItems({
                    normalized,
                    data,
                });
                context.updateQuery({
                    query: q,
                    queryState: LOADED,
                    normalized,
                });
            }
        }

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
