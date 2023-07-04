
import request from '@/utils/request'
const BASE_URL = '/base-data'

class Translate{
  #url;
  constructor(){
    this.#url = BASE_URL+`/base-translate-relation`
  }
  list(params) {
    return request({
      url:this.#url,
      method: 'get',
      params,
    })
  }
  del(id){
    return request({
      url:this.#url+'/'+id,
      method: 'delete'
    })
  }
  edit(data){
    return request({
      url:this.#url,
      method: 'put',
      data,
    })
  }
  add(data){
    return request({
      url:this.#url,
      method: 'post',
      data,
    })
  }
  static
}

export const translateRelation = new Translate()