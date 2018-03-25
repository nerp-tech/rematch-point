import { HttpMethod } from './types/HttpMethod';
import {
    DELETING,
    UPDATING,
    CREATING,
    LOADING,
} from './constants';

export default (method: HttpMethod): string => {
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
