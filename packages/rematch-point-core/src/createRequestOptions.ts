import { HttpMethod } from './types/HttpMethod';

export default ({ method, body, json }: {
    body: any,
    json: boolean,
    method: HttpMethod,
}): any => {
    const options: any = { method, json };

    if (method !== HttpMethod.Get) {
        options.body = body;
    }

    return options;
};
