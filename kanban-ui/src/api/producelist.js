import api from '@/api/index.js';
import {post,get} from '@/utils/request';
const {inlineList,errorList,errorReproduce,tobeScheduledList,chooseTobeScheduledOrder,getFinishList} = api.list
export const getProduceInlineList = (parameter) => {
    return post({url:inlineList,data:parameter})
}
export const getProduceErrorList = (parameter) => {
    return post({url:errorList,data:parameter})
}
export const ReproduceProduceErrorOrder = (parameter) => {
    return post({url:errorReproduce + parameter})
}
export const getScheduledList = (parameter) => {
    return post({url:tobeScheduledList,data:parameter})
}
export const tobeScheduledOrder = (parameter) => {
    return post({url:chooseTobeScheduledOrder,data:parameter})
}
export const getFinshedList = (parameter) => {
    return post({url:getFinishList,data:parameter})
}

