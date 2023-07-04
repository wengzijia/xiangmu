import api from '@/api/index.js';
import {post,get} from '@/utils/request';
const {getOperators,punch} = api.punchin
export const getDeviceOperatorsList = (id) => {
    return get({url:getOperators+id})
}
export const punchConfirm = (parameter) => {
    return post({url:punch,data:parameter})
}


