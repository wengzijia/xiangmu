
import { getMaterialSubclass, getMaterialType,getConsumablesType} from '@/api/basicDatabase'
//获得所有材质类别
export function GetMaterialTypeList() {
  return new Promise((resolve, reject) => {
    getMaterialType().then((res) => {
      if (res.code === 200) {
        resolve(res.data);
      } else {
        reject(res);
      }
    });
  });
}
//获得材质小类集合
export function GetMaterialSubclassList(id) {
  return new Promise((resolve, reject) => {
    if (id||id===0) {
      getMaterialSubclass(id).then((res) => {
        if (res.code === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      });
    }else{
      resolve([])
    }
  });
}
//获得耗材类别集合
export function GetConsumablesTypeList() {
  return new Promise((resolve, reject) => {
      getConsumablesType().then((res) => {
        if (res.code === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      });
  });
}
