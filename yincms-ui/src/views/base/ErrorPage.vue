<template>
  <div class="errBody">
    <div class="errBox">
      <div class="errImg">
        <img src="@/static/index/img/error.png" />
      </div>
      <div class="errTxt">
        <p>抱歉，您访问的页面不存在...</p>
        <div class="errTxtBtn">
          <a href="javascript:history.go(-1);" class="errTxtA">返回上一页</a>
          <a href="/" class="errTxtB">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage'
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #fff4f4;
}
.errBody {
  background-color: #fff4f4;
}
.errBox {
  width: 900px;
  margin: 0 auto;
  text-align: center;
}
.errImg {
  width: 899px;
  margin: 0 auto;
  padding-top: 50px;
}
.errTxt {
  font-size: 16px;
  color: #333;
  position: relative;
  top: -56px;
}
.errTxt a {
  text-decoration: none;
}
.errTxtBtn {
  padding-top: 10px;
}
.errTxtA,
.errTxtB {
  width: 96px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  border-radius: 100px;
  font-size: 14px;
  margin: 0 4px;
}
.errTxtA {
  background: linear-gradient(left, #fddc99, #feb626);
  background: -o-linear-gradient(left, #fddc99, #feb626);
  background: -moz-linear-gradient(left, #fddc99, #feb626);
  background: -webkit-linear-gradient(left, #fddc99, #feb626);
  -moz-box-shadow: 0px 3px 0px #df8e00;
  -webkit-box-shadow: 0px 3px 0px #df8e00;
  box-shadow: 0px 3px 0px #df8e00;
  color: #000;
}
.errTxtA:hover {
  background: #f6a80b;
}
.errTxtB {
  background: linear-gradient(left, #f1273a, #e70423);
  background: -o-linear-gradient(left, #f1273a, #e70423);
  background: -moz-linear-gradient(left, #f1273a, #e70423);
  background: -webkit-linear-gradient(left, #f1273a, #e70423);
  -moz-box-shadow: 0px 3px 0px #c40114;
  -webkit-box-shadow: 0px 3px 0px #c40114;
  box-shadow: 0px 3px 0px #c40114;
  color: #fff;
}
.errTxtB:hover {
  background: #f10015;
}
</style>
