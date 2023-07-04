// import OrbitControls from "three-orbitcontrols";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from 'three/examples/jsm/';
// import { WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, Object3D,Box3,Group,BoxHelper,AxesHelper } from "three";
import { WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, Box3, Group } from 'three';
import { loadObjFun } from './loadObj';

export class Engine {
  /**
   * 是否旋转
   */
  rotating = true;
  /**
   * 存放模型数组；
   */
  groupList = [];

  /**
   * 模型间隔
   */
  interval = 5;

  /**
   * 加载状态
   */
  loading = true;

  constructor(dom, fileList, goodsId = 'all') {
    let _this = this;
    this._dom = dom;
    this._renderer = new WebGLRenderer({
      antialias: true
    }); //初始化渲染器
    this._renderer.shadowMap.enabled = true;
    this._renderer.setClearColor(0xffffff);
    this._renderer.domElement.removeAttribute('tabindex');

    this._scene = new Scene();
    // this._scene.add(new AxesHelper(500));//三维坐标系辅助线
    this._scene.background = new Color(0xf0f0f0);

    this._fileList = fileList;
    this._camera = new PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 0.1, 10000); //设置相机视角大小，长宽比例，最近/最远可视距离
    this._camera.position.set(0.0, 175.0, 500.0); //设置相机位置
    this._camera.lookAt(new Vector3(0, 0, 0)); //相机面向原点
    this._camera.up = new Vector3(0, 1, 0); //摆正相机上下方向

    //渲染器设为窗口大小
    this._renderer.setSize(this._dom.offsetWidth, this._dom.offsetHeight);

    /**初始化轨道控制器 */
    const orbitControls = new OrbitControls(this._camera, this._renderer.domElement);
    orbitControls.enableDamping = true; //惯性
    orbitControls.autoRotate = true; //轨道控制器旋转
    let group = new Group();
    this._scene.add(group); //先把组放入场景，这样就能一个个的出来，防止加载时间太长
    // 摆放位置
    let sortList = ['1','12', '213', '3124', '21345', '213456', '3124657', '31247568'].map(e => e.split('')).find(e => e.length === _this._fileList.length);
    console.log('sortList', sortList);
    // 加载模型，并且添加goodsId后续修改快速找到
    let objList = this._fileList.map((goods, index) => {
      return new Promise((resolve, reject) => {
        loadObjFun(goods)
          .then(item => {
            if (goodsId === 'all') group.add(item);
            item.goodsId = goods.id;
            // _this.groupList.push(item);
            // _this.groupList[sortList[index] - 1] = item;
            _this.loading = false; //取消加载状态
            resolve(item);
          })
          .catch(() => {
            reject();
          });
      });
    });
    Promise.all(objList)
      .then(arr => {
        // 根据sortList的位置排序
        for (let index = 0; index < arr.length; index++) {
          let index2 = sortList[index] - 1;
          _this.groupList[index] = arr[index2];
        }
        // 全部加载完成开始设置每个item的位置
        _this.setItemPosition();
        // 根据goodsId选择渲染的模型
        _this.setModel(goodsId);
      })
      .catch(() => {
        console.log('err');
      });
    //插入DOM
    dom.appendChild(this._renderer.domElement);
    /**
     * 渲染函数
     */
    const renderFun = () => {
      //更新场景和相机
      this._renderer.render(this._scene, this._camera);
      // 轨道控制器更新
      orbitControls.update();
      //循环渲染
      requestAnimationFrame(renderFun);
    };
    renderFun();
  }
  /**
   * 向场景中添加3D对象
   * @param {*} Object3D
   */
  addObject(Object3D) {
    Object3D.forEach(item => {
      this._scene.add(item);
    });
  }
  /**
   * 切换模型
   * @param {*} id id等于all的时候渲染groupList里面的全部模型，否则根据id查找groupList里面的goodsid渲染
   */
  setModel(id) {
    let oldIiem = this._scene.children.find(e => e.isGroup);
    if (oldIiem) {
      this._scene.remove(oldIiem);
    }
    let group = new Group();
    if (id === 'all') {
      group.add(...this.groupList);
    } else {
      console.log('item', this.groupList);
      let item = this.groupList.find(e => e.goodsId == id);
      if (item) {
        group.add(item);
      }
    }
    this._scene.add(group); //把组放入场景
    this.setGroup(group);
  }

  /**
   * 设置整个组的放大和中心点位置
   * @param {*} group
   */
  setGroup(group) {
    const _this = this;
    // 新建组
    let { x, y, z, box_height, box_long, box_width } = this.getCenterInfo(group);
    let scale = 300 / Math.max(box_height, box_long, box_width);
    x = x * scale;
    y = y * scale;
    z = z * scale;
    group.scale.set(scale, scale, scale);
    group.position.set(x, y, z);
  }
  /**
   * 获取模型的信息，包括xyz的中心点，和物体的长宽高
   * @param {*} group
   * @returns
   */
  getCenterInfo(group) {
    let boxinfo = new Box3().setFromObject(group);
    let centerX = 0;
    let centerZ = 0;
    let centerY = 0;
    let box_long = boxinfo.max.x - boxinfo.min.x;
    let box_width = boxinfo.max.z - boxinfo.min.z;
    let box_height = boxinfo.max.y - boxinfo.min.y;
    centerX = -((boxinfo.max.x - boxinfo.min.x) / 2 + boxinfo.min.x);
    centerZ = -((boxinfo.max.z - boxinfo.min.z) / 2 + boxinfo.min.z);
    centerY = -((boxinfo.max.y - boxinfo.min.y) / 2 + boxinfo.min.y);
    return {
      x: centerX,
      y: centerY,
      z: centerZ,
      box_height,
      box_width,
      box_long
    };
  }
  /**
   * 设置整个组里面的item的位置
   * @param {*} group
   */
  setItemPosition() {
    let _this = this;
    let sort = Math.ceil(_this.groupList.length / 2);
    if (sort <= 2) sort = 4;
    else _this.interval = 10;
    try {
      let shifting = 0;
      let maxWidth = 0;
      let widthList = [];

      _this.groupList.forEach((item, index) => {
        let { x, y, z, box_long, box_width, box_height } = _this.getCenterInfo(item);
        if (index == sort) {
          shifting = 0;
          maxWidth = maxWidth + Math.max(...widthList);
        }
        if (index >= sort) {
          z = (z + maxWidth + box_width / 2 + _this.interval) * -1;
        }
        item.position.set(x + shifting + box_long / 2, 0, z);
        shifting = shifting + box_long + _this.interval;
        widthList.push(box_width);
      });
    } catch (error) {
      console.log('err');
    }
  }
}
