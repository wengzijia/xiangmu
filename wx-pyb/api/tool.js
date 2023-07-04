 // const app = getApp()
import {http} from "../utils/request.js"
 /**
    * 3D软打样保存分享的链接
    * @param {*} parameter 
    * @returns 
    */
  export  function saveShareLink(data) {
    return http({
      url: '/quotation/miniShareLink/saveShareLink',
      method: 'POST',
      data: data
    });
  }

    /**
    * 获取3D软打样分享链接的数据
    * @param {*} parameter 
    * @returns 
    */
     export  function getShareLink(data) {
      return http({
        url: '/certifyFree/quotation/miniShareLink/getByUuid',
        method: 'POST',
        data: data
      });
    }
 

     /**
    * 删除3D软打样分享链接的数据
    * @param {*} parameter 
    * @returns 
    */
      export  function removeByUuid(data) {
        return http({
          url: '/certifyFree/quotation/miniShareLink/removeByUuid',
          method: 'POST',
          data: data
        });
      }
   
  
    