import request from "@/utils/request";
import request2 from "@/utils/request2";
const BASE_URL = '/base-data'
/**
 * 分页查询材质信息
 * @param {Object} params
 * @param {number} params.size 分页大小
 * @param {number} params.current 页码
 * @param {string} params.materialName 材质名称
 * @param {number} params.materialTypeId 材质类别id
 * @param {number} params.materialSubclassId 材质小类id
 * @param {string} params.materialNo 材质编号
 * @returns
 */
export function getMaterialQuality(params) {
  return request({
    url: BASE_URL + "/base-material",
    method: "get",
    params,
  });
}
/**
 * 新增材质
 * @param {*} data
 * @returns
 */
export function addMaterialQuality(data) {
  return request({
    url: BASE_URL + "/base-material",
    method: "post",
    data,
  });
}
/**
 * 修改材质
 * @param {*} data
 * @returns
 */
export function changeMaterialQuality(data) {
  return request({
    url: BASE_URL + "/base-material",
    method: "put",
    data,
  });
}
/**
 * 删除材质
 * @param {*} data
 * @returns
 */
export function delMaterialQuality(id) {
  return request({
    url: BASE_URL + "/base-material/" + id,
    method: "delete",
  });
}

/**
 * 分页物料信息
 * @param {Object} params
 * @param {number} params.size 分页大小
 * @param {number} params.current 页码
 * @param {number} params.materialTypeId 材质类别id
 * @param {number} params.materialSubclassId 材质小类id
 * @param {string} params.materialNo 材质编号
 * @param {string} params.materialInfoNo 物料编码
 * @returns
 */
export function getMaterialInfo(params) {
  return request({
    url: BASE_URL + "/base-material-info",
    method: "get",
    params,
  });
}
/**
 * 添加物料
 * @param {*} data
 * @returns
 */
export function addMaterial(data) {
  return request({
    url: BASE_URL + "/base-material-info",
    method: "post",
    data,
  });
}
/**
 * 修改物料
 * @param {*} data
 * @returns
 */
export function changeMaterial(data) {
  return request({
    url: BASE_URL + "/base-material-info",
    method: "put",
    data,
  });
}
/**
 * 删除物料
 * @param {*} data
 * @returns
 */
export function delMaterial(id) {
  return request({
    url: BASE_URL + "/base-material-info/" + id,
    method: "delete",
  });
}

/**
 * 分页查询配件信息
 * @param {Object} params
 * @param {number} params.size 分页大小
 * @param {number} params.current 页码
 * @param {number} params.accessoryName 配件名称
 * @param {number} params.materialId 材质id
 * @param {string} params.materialName 材质名称
 * @returns
 */
export function getAccessory(params) {
  return request({
    url: BASE_URL + "/base-accessory",
    method: "get",
    params,
  });
}
/**
 * 添加配件
 * @param {Object} data
 * @returns
 */
export function addAccessory(data) {
  return request({
    url: BASE_URL + "/base-accessory",
    method: "post",
    data,
  });
}
/**
 * 编辑配件信息
 * @param {Object} data
 * @returns
 */
export function changeAccessory(data) {
  return request({
    url: BASE_URL + "/base-accessory",
    method: "put",
    data,
  });
}
/**
 * 删除配件信息
 * @param {string} id
 * @returns
 */
export function delAccessory(id) {
  return request({
    url: BASE_URL + "/base-accessory/" + id,
    method: "delete",
  });
}
/**
 * 获得所有材质类别
 * @returns
 */
export function getMaterialType() {
  return request({
    url: BASE_URL + "/base-material-type",
    method: "get",
  });
}

/**
 * 通过材质类别id获得材质小类集合
 * @param {number} materialTypeId
 * @returns
 */
export function getMaterialSubclass(materialTypeId) {
  return request({
    url: BASE_URL + "/base-material-subclass/type/" + materialTypeId,
    method: "get",
  });
}
/**
 * 基础信息数据库上传文件
 * @param {*} data
 * @returns
 */
export function uploadefile(data) {
  return request2({
    url: "/alibaba/oss/uploadFile?folder=basicdatabase/",
    method: "post",
    data,
  });
}

/**
 * 通过材质小类id查询材质规格集合
 * @param {number} id
 * @returns
 */
export function getMaterialSpecsSubclass(id) {
  return request({
    url: BASE_URL + "/base-material-specs/subclass/" + id,
    method: "get",
  });
}

/**
 * 通过材质id查询材质规格集合
 * @param {number} materialId
 * @returns
 */
export function getSpecs(materialId) {
  return request({
    url: BASE_URL + "/base-material-specs/" + materialId,
    method: "get",
  });
}
/**
 * 添加材质规格
 * @param {*} data
 * @returns
 */
 export function addMaterialSpecs(data) {
  return request({
    url: BASE_URL + "/base-material-specs",
    method: "post",
    data
  });
}
/**
 * 修改材质规格
 * @param {*} data
 * @returns
 */
 export function changeMaterialSpecs(data) {
  return request({
    url: BASE_URL + "/base-material-specs",
    method: "put",
    data
  });
}
/**
 * 删除材质规格
 * @param {*} data
 * @returns
 */
 export function delMaterialSpecs(id) {
  return request({
    url: BASE_URL + "/base-material-specs/"+id,
    method: "delete",
  });
}
/**
 * 通过材质小类id查询材质集合
 * @param {number} materialId
 * @returns
 */
export function getSubClass(materialSubclassId) {
  return request({
    url: BASE_URL + "/base-material/sub-class/" + materialSubclassId,
    method: "get",
  });
}
/**
 * 通过配件id查询配件规格集合
 * @param {number} materialId
 * @returns
 */
export function getAccessorySpecs(accessoryId) {
  return request({
    url: BASE_URL + "/base-accessory-specs/" + accessoryId,
    method: "get",
  });
}
/**
 * 添加配件规格
 * @param {*} data 
 * @returns 
 */
export function addAccessorySpecs(data) {
  return request({
    url: BASE_URL + "/base-accessory-specs",
    method: "post",
    data
  });
}
/**
 * 修改配件规格
 * @param {*} data 
 * @returns 
 */
 export function changeAccessorySpecs(data) {
  return request({
    url: BASE_URL + "/base-accessory-specs",
    method: "put",
    data
  });
}
/**
 * 删除配件规格
 * @param {*} data 
 * @returns 
 */
 export function delAccessorySpecs(id) {
  return request({
    url: BASE_URL + "/base-accessory-specs/"+id,
    method: "delete",
  });
}

/**
 * 分页查询耗材信息
 * @param {Object} params
 * @param {number} params.size 分页大小
 * @param {number} params.current 页码
 * @param {number} params.consumablesName 耗材名称
 * @param {number} params.consumablesTypeId 耗材类别id
 * @param {string} params.consumablesNo 耗材编码
 * @returns
 */
export function getConsumables(params) {
  return request({
    url: BASE_URL + "/base-consumables",
    method: "get",
    params,
  });
}

/**
 * 获得所有耗材类别
 * @returns
 */
export function getConsumablesType() {
  return request({
    url: BASE_URL + "/base-consumables-type",
    method: "get",
  });
}

/**
 * 修改耗材
 * @param {*} data
 * @returns
 */
export function changeConsumables(data) {
  return request({
    url: BASE_URL + "/base-consumables",
    method: "put",
    data,
  });
}

/**
 * 新增耗材
 * @param {*} data
 * @returns
 */
export function addConsumables(data) {
  return request({
    url: BASE_URL + "/base-consumables",
    method: "post",
    data,
  });
}

/**
 * 删除耗材
 * @param {*} data
 * @returns
 */
export function delConsumables(id) {
  return request({
    url: BASE_URL + "/base-consumables/" + id,
    method: "delete",
  });
}

/**
 * 分页查询压纹工艺纹理
 * @param {Object} params
 * @param {number} params.size 分页大小
 * @param {number} params.current 页码
 * @param {number} params.embossTextureName 纹理名称
 * @param {number} params.embossTextureNo 纹理编码
 * @returns
 */
export function getTexture(params) {
  return request({
    url: BASE_URL + "/base-emboss-texture",
    method: "get",
    params,
  });
}
/**
 * 添加压纹工艺纹理
 * @param {Object} data
 * @param {number} data.embossTextureName 纹理名称
 * @param {number} data.id 纹理ID
 * @param {number} data.imageUrl 纹理图片
 * @param {number} data.unsuitedCraftStr 不适用工艺
 * @returns
 */
export function addTexture(data) {
  return request({
    url: BASE_URL + "/base-emboss-texture",
    method: "post",
    data,
  });
}
/**
 * 修改压纹工艺纹理
 * @param {Object} data
 * @param {number} data.embossTextureName 纹理名称
 * @param {number} data.id 纹理ID
 * @param {number} data.imageUrl 纹理图片
 * @param {number} data.unsuitedCraftStr 不适用工艺
 * @returns
 */
export function changeTexture(data) {
  return request({
    url: BASE_URL + "/base-emboss-texture",
    method: "put",
    data,
  });
}
/**
 * 删除压纹工艺纹理
 * @param {number} id
 * @returns
 */
export function delTexture(id) {
  return request({
    url: BASE_URL + "/base-emboss-texture/" + id,
    method: "delete",
  });
}

/**
 * 分页查询烫金工艺颜色
 * @param {Object} params
 * @param {number} params.size 分页大小
 * @param {number} params.current 页码
 * @param {number} params.bronzeColorName 烫金颜色名称
 * @param {number} params.bronzeColorNo 烫金工艺颜色编号
 * @returns
 */
export function getBronzeColor(params) {
  return request({
    url: BASE_URL + "/base-bronze-color",
    method: "get",
    params,
  });
}
/**
 * 增加烫金
 * @param {*} data 
 * @returns 
 */
export function addBronzeColor(data) {
  return request({
    url: BASE_URL + "/base-bronze-color",
    method: "post",
    data,
  });
}
/**
 * 删除烫金
 * @param {*} data 
 * @returns 
 */
export function delBronzeColor(id) {
  return request({
    url: BASE_URL + "/base-bronze-color/"+id,
    method: "delete",
  });
}
/**
 * 修改烫金
 * @param {*} data 
 * @returns 
 */
export function changeBronzeColor(data) {
  return request({
    url: BASE_URL + "/base-bronze-color",
    method: "put",
    data,
  });
}

