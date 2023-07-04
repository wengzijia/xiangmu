import request from '@/utils/request2';

/**
 * 获取全部品类
 * @returns 
 */
export function getAllNavs() {
  return request({
    url: '/certifyFree/category/getAllNavs',
    method: 'post',
    headers:{repeatSubmit:false }
  })
}


/**
 * 获取品类属性数据
 * @returns 
 */
export function getTreeVoList(data) {
  return request({
    url: '/certifyFree/attrGroup/getTreeVoList',
    method: 'post',
    headers:{repeatSubmit:false },
    data
  })
}

/**
 * 获取品类属性数据
 * @returns 
 */
 export function getAttrList(data) {
  return request({
    url: '/certifyFree/attrGroup/getAttrList',
    method: 'post',
    headers:{repeatSubmit:false },
    data
  })
}


/**
 * 添加/更新属性
 * @returns 
 */
 export function addGroupAttr(data) {
  return request({
    url: '/certifyFree/attrGroup/addGroupAttr',
    method: 'post',
    headers:{repeatSubmit:false },
    data
  })
}

/**
 * oss上传文件
 * @returns 
 */
 export function uploadFile(data) {
  return request({
    url: '/alibaba/oss/uploadFile?folder=filemanage/',
    method: 'post',
    data
  })
}


