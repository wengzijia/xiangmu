import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { loadAsync } from 'jszip';
export function loadObjFun({ zipUrl, objUrl, imgUrl }) {
  return new Promise((resolve, reject) => {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    let objFile = objUrl;
    let zipFile = zipUrl;
    //下载并解压mtl压缩包
    const downloadMtl = url => {
      fetch(url)
        .then(response => {
          return response.blob(); //解析成blob对象
        })
        .then(loadAsync)
        .then(function(zip) {
          let urlList = [],
            mtl = new Promise(() => {});
          Object.values(zip.files).forEach(item => {
            // 判断是否是mtl文件
            if (item.name.endsWith('.mtl')) {
              mtl = item.async('string'); //把文件转成字符串对象
            } else {
              // 把非mtl文件加入到urlList数组
              urlList.push(
                new Promise((resolve, reject) => {
                  //把文件转成blob对象
                  item.async('blob').then(res => {
                    resolve({
                      newUrl: imgUrl || URL.createObjectURL(res), //判断是否有自定义的图片，有就用自定义的图片,没有就把blob对象转成url
                      oldName: item.name
                    });
                  });
                })
              );
            }
          });
          mtl.then(mtlContent => {
            Promise.all(urlList).then(res => {
              res.forEach(item => {
                // 把mtl内的图片路径换成用户端的图片路径
                mtlContent = mtlContent.replace(new RegExp(`\\S*${item.oldName}`, 'g'), item.newUrl);
              });
              loadModel(mtlContent);
            });
          });
        })
        .catch(err => {
          console.log('err', err);
          reject();
        });
    };
    if (zipFile && objFile) {
      downloadMtl(zipFile);
    }

    //加载mtl+obj模型
    const loadModel = mtlContent => {
      let materials = mtlLoader.parse(mtlContent);
      materials.preload();
      objLoader.setMaterials(materials).load(
        objFile,
        function(object) {
          object.position.set(0, 0, 0); //模型摆放的位置
          // group.add(object);
          resolve(object);
        },
        onProgress
      );
    };

    const onProgress = function(xhr) {
      if (xhr.lengthComputable) {
        // const percentComplete = (xhr.loaded / xhr.total) * 100;
        // console.log(Math.round(percentComplete, 2) + "% downloaded");
      }
    };
  });
}
