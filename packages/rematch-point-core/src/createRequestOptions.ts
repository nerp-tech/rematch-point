import { HttpMethod } from './types/HttpMethod';

export default ({ method, body, json } : {
    method: HttpMethod, body: any, json: boolean
}): any => {
    const options: any = { method, json };

    if (method !== HttpMethod.Get) {
        options.body = body;
    }

    return options;
};
