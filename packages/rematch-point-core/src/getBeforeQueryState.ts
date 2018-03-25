import {
    CREATING,
    DELETING,
    LOADING,
    UPDATING,
} from './constants';
import { HttpMethod } from './types/HttpMethod';

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
