<!-- fengjianbo -->
<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>

<script>
import E from 'wangeditor';

export default {
  name: 'editoritem',
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null
    };
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = 'http://otp.cdinfotech.top/file/upload_images'; // 配置服务器端地址(自己更换为自己项目的服务器)
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = 'file'; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'justify', // 对齐方式
        'quote', // 引用
        'image', // 插入图片
        'video', // 插入视频
        'code', // 插入代码
        'fullscreen' // 全屏
      ];
      this.editor.customConfig.colors = ['#000000', '#FF0000', '#999999', '#0000FF', '#00FF00', '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF'];
      // this.editor.customConfig.colors = {
      //   '#000000': '黑色', '#999999': '灰色', '#FFFFFF': '白色',
      //   '#0000FF': '蓝色', '#00FF00': '绿色', '#FFFF00': '黄色',
      //   '#00FFFF': '青色', '#FF00FF': '紫红', '#FF0000': '红色',
      //   }
      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
          console.log(xhr, editor, result);
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
          console.log(xhr, editor, result);
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
          console.log(xhr, editor);
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
          console.log(xhr, editor);
        },
        customInsert: (insertImg, result, editor) => {
          console.log(editor, result);
          // 图片上传成功，插入图片的回调
          //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
          // console.log(result.data[0].url)
          //insertImg()为插入图片的函数
          //循环插入图片
          // for (let i = 0; i < 1; i++) {
          // console.log(result)
          let url = result.url;
          //这里插一句, 如果项目在本地开发的,图片在服务器存着的
          //在编辑器里面回显的话url要加上ip,ip是看你们开发的时候怎么拿的,
          //我们是store存的直接拿来拼接上的
          insertImg(url);
          // }
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit('change', this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}

.w-e-text {
  height: 250px !important;
}

.toolbar {
  border: 1px solid #ccc;
}

.text {
  border: 1px solid #ccc;
  min-height: 250px;
}
</style>
