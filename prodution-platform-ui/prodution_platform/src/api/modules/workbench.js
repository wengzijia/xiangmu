import {post,get} from '@/utils/request';
//isLoading:true;表示当前接口调用的时候禁用正在加载的提示框

/**
 * 获取待办事项的列表数据
 */
 export const getPendingPage = (data) => {
    return post({url: `/api/mes/msg/pending/page`,data})
}

