<template>
  <canvas id="example"></canvas>
</template>

<script>
import * as Three from 'three';
// import OrbitControls from 'three-orbitcontrols';
// import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
var scene;
var rotating = true;
export default {
  data() {
    return {
      // 相机
      camera: null,
      // 场景
      //scene: null,
      // 渲染器对象
      renderer: null,
      // 材质对象
      //mesh: null,
      controls: null
    };
  },
  methods: {
    // 初始化
    init() {
      this.renderer = new Three.WebGLRenderer({
        canvas: document.getElementById('example'),
        antialias: true,
        autoClear: true
      });
      this.renderer.setClearColor(0xffffff);

      // 相机位置
      let width = window.innerWidth;
      let height = window.innerHeight;
      // 创建场景
      scene = new Three.Scene();
      scene.background = new Three.Color(0xffffff);

      // let k = width/height;
      // let s = 150;
      // this.camera = new Three.OrthographicCamera(-s*k,s*k,s,-s,1,1000);
      // this.camera.position.set(0.0, 175.0, 500.0 );
      // this.camera.lookAt(new Three.Vector3(0, 0, 0));
      // scene.add(this.camera);
      this.cameraDefaults = {
        posCamera: new Three.Vector3(0.0, 175.0, 500.0),
        posCameraTarget: new Three.Vector3(0, 0, 0),
        near: 0.1,
        far: 10000,
        fov: 45
      };
      this.camera = null;
      this.cameraTarget = this.cameraDefaults.posCameraTarget;
      this.aspectRatio = width / height;
      this.controls = null;
      this.camera = new Three.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
      this.resetCamera();

      // 创建点光源
      // let light=new Three.DirectionalLight(0xffaaff);
      // light.position.set(80,100,50);
      // scene.add(light);
      let ambientLight = new Three.AmbientLight(0xc0c0c0, 0.5);
      let directionalLight1 = new Three.DirectionalLight(0xffffff, 0.8);
      let directionalLight2 = new Three.DirectionalLight(0xffffff, 0.8);
      directionalLight1.position.set(-100, -50, 100);
      directionalLight2.position.set(100, 50, -100);
      scene.add(ambientLight);
      scene.add(directionalLight1);
      scene.add(directionalLight2);

      let directionalLight3 = new Three.DirectionalLight(0xffffff, 0.2);
      directionalLight3.position.set(0, 100, 0);
      scene.add(directionalLight3);

      //网格
      // let helper = new Three.GridHelper( 1200, 60, 0xFF4444, 0x404040 );
      // scene.add( helper );

      // 创建渲染器
      this.renderer = new Three.WebGLRenderer({ canvas: document.getElementById('example'), antialias: true });
      this.renderer.setSize(width - 8, height - 8);
      this.renderer.domElement.removeAttribute('tabindex');
      document.body.appendChild(this.renderer.domElement);

      // 创建控件对象
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.addEventListener('change', function() {
      // 	rotating = false;
      // });
      //this.controls.addEventListener('change',this.animate);
    },

    // 创建obj模型
    loadObj(objname) {
      //let that = this;
      let objLoader = new OBJLoader();
      let mtlLoader = new MTLLoader();
      mtlLoader.load('', function(materials) {
        objLoader.setMaterials(materials);
        objLoader.load(
          objname,
          function(obj) {
            obj.position.set(10, 0, -6); //模型摆放的位置
            //obj.scale.set(0.01, 0.01, 0.01);//模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
            scene.add(obj); //将模型加入场景中
          },
          // called while loading is progressing
          function(xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          // called when loading has errors
          // eslint-disable-next-line no-unused-vars
          function(error) {
            console.log('An error happened');
          }
        );
      });
    },
    // 创建动画
    // animate () {
    //   this.renderer.render(scene, this.camera)
    // },
    animate() {
      //console.log(scene.rotation.y)
      requestAnimationFrame(this.animate);
      if (rotating) {
        scene.rotation.y += -0.005;
      } else {
        //scene.rotation.y;
      }
      this.renderer.domElement.removeAttribute('tabindex');
      this.renderer.render(scene, this.camera);
    },

    pauseRotation() {
      var modelBorder = document.getElementById('example');
      console.log(modelBorder);
      modelBorder.addEventListener('mouseenter', function() {
        console.log('mouseenter');
        rotating = false;
      });
      modelBorder.addEventListener('mouseleave', function() {
        console.log('mouseleave');
        rotating = true;
      });
      modelBorder.addEventListener(
        'touchmove',
        function() {
          console.log('touchmove');
          rotating = false;
        },
        false
      );
      modelBorder.addEventListener(
        'touchstart',
        function() {
          console.log('touchstart');
          rotating = false;
        },
        false
      );
      modelBorder.addEventListener(
        'touchend',
        function() {
          console.log('touchend');
          rotating = true;
        },
        false
      );
    },
    resetCamera() {
      this.camera.position.copy(this.cameraDefaults.posCamera);
      this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);

      this.updateCamera();
    },
    updateCamera: function() {
      this.camera.aspect = this.aspectRatio;
      this.camera.lookAt(this.cameraTarget);
      this.camera.updateProjectionMatrix();
    }
    // resetCamera: function () {
    // 		this.camera.position.copy( this.cameraDefaults.posCamera );
    // 		this.cameraTarget.copy( this.cameraDefaults.posCameraTarget );

    // 		this.updateCamera();
    // 	},
  },

  mounted() {
    this.objname = this.$route.query.objname;
    //this.objname = 'uploads/picture/20210806/1f68af6948c66515ed70d4a1c26cab68.obj';
    this.init();
    this.loadObj(this.objname);
    this.pauseRotation();
    this.animate();
  }
};
</script>
<style scoped>
#glFullscreen {
  width: 100%;
  height: 100vh;
  min-width: 640px;
  min-height: 360px;
  position: relative;
  overflow: hidden;
  z-index: 0;
}
#example {
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #ffffff;
}
#feedback {
  color: darkorange;
}
#dat {
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 200;
}
body {
  margin: 100px 100px;
}
</style>
