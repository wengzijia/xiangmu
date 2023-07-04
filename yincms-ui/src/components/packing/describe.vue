<template>
  <div class="describebox">
    <div class="comBox" v-if="$route.query.orderType == 7">
      <div class="brickBox">
        <div class="brickContenBox">
          <div class="brick">
            <div class="brick-img-box">
              <h2>描述对方案设计的需求</h2>
              <!-- <p>已有结构设计文件 需要专业设计师进行设计</p> -->
            </div>
            <div class="box-info">
              <div class="price-box">
                <p style="width:80px;text-align:right;">商品名：</p>
                <div class="price">
                  <!-- <span>213</span> -->
                  <el-input type="text" placeholder="输入您的商品名" v-model="shopname" show-word-limit class="ptext"> </el-input>
                </div>
                <p style="margin-top:20px;">需求描述：</p>
                <div class="price" style="margin-top:20px;">
                  <!-- <span>213</span> -->
                  <el-input type="textarea" placeholder="请描述您希望包装达成什么效果；如：这款包装我们需要有抗摔的效果，做成双插盒..." v-model="textarea" show-word-limit class="ptext" :autosize="{ minRows: 13, maxRows: 15 }"> </el-input>
                </div>
              </div>
            </div>
            <p class="packingbtn"><button @click="dnext()">下一步</button></p>
          </div>
        </div>
      </div>
    </div>

    <div class="comBox" v-else>
      <div class="brickBox">
        <div class="brickContenBox">
          <div class="brick">
            <div class="brick-img-box">
              <h2 v-if="$route.query.orderType == 5">描述对平面设计的需求</h2>
              <h2 v-else>描述对结构设计的需求</h2>
            </div>
            <div class="box-info">
              <div class="price-box">
                <p>需求描述：</p>
                <div class="price">
                  <!-- <span>213</span> -->
                  <el-input type="textarea" placeholder="请描述您希望包装达成什么效果；如：这款包装我们需要有抗摔的效果，做成双插盒..." v-model="textarea" show-word-limit class="ptext" :autosize="{ minRows: 13, maxRows: 15 }"> </el-input>
                </div>
                <p style="margin-top:40px">商品尺寸：</p>
                <div class="flex inputBx" style="margin-top:40px">
                  <div class="inputBxrow inputBxrowSize">
                    <el-input onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" v-model="input" placeholder="长" style="width: 180px" size="small">
                      <template slot="append">x</template>
                    </el-input>
                    <el-input onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" v-model="input2" placeholder="长" style="width: 180px" size="small">
                      <template slot="append">x</template>
                    </el-input>
                    <el-input onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" v-model="input3" placeholder="长" style="width: 180px" size="small">
                      <template slot="append">mm</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
            <p class="packingbtn"><button @click="dnext()">下一步</button></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'describe',
  props: {
    active: Number,
    getDdata: Function
  },
  components: {},
  data() {
    return {
      textarea: '',
      shopname: '',
      input: '',
      input2: '',
      input3: ''
    };
  },
  methods: {
    dnext() {
      if ((this.textarea && this.input && this.input2 && this.input3) || (this.shopname && this.textarea)) {
        this.getDdata();
        this.$emit('changeactive', 1);
      } else {
        this.$message.error('请完善描述需求');
      }
    }
  }
};
</script>
<style src="../../static/mulindex/css/attr.css" />
<style>
.comBox .el-input-group__append {
  width: 25px;
  padding: 0 5px;
  text-align: center;
}
</style>
<style scoped>
.describebox {
  font-size: 16px;
}
.brickBox {
  /* border: 1px solid red; */
  margin-top: 50px;
  padding-bottom: 50px;
}
.brickContenBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.ironTitle {
  width: 100%;
  height: 102px;
  line-height: 114px;
  font-size: 28px;
  text-align: center;
  margin: 30px 0;
}
.brick {
  width: 1240px;
  /* height: 430px; */
  padding-bottom: 60px;
  background-color: #fff;
  box-sizing: border-box;
}
.brick-img-box {
  margin: 30px auto;
  text-align: center;
  box-sizing: border-box;
}
.brick-img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.box-info {
  width: 65%;
  margin: auto;
  box-sizing: border-box;
  padding: 8px 15px;
}
.price-box {
  display: flex;
  flex-flow: row wrap;
  /* justify-content: space-between; */
  line-height: 32px;
}
.price {
  color: #ff0036;
  font-size: 14px;
}
.price span {
  font-size: 20px;
}
.packingbtn {
  text-align: center;
}
.brick .packingbtn button {
  border: none;
  outline: none;
  width: 125px;
  height: 40px;
  color: #fff;
  background: url('../../static/upload/images/packing2.png') no-repeat;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  margin-top: 50px;
}
.price-box button:hover {
  background-color: #ee0030;
}
.info > div {
  line-height: 25px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
}
.info > div:hover {
  cursor: default;
}
.info > div::before {
  content: '·';
  font-size: 15px;
  font-weight: 700;
  margin-right: 6px;
}
.brick-img-box:hover {
  cursor: pointer;
}
button:hover {
  cursor: pointer;
}
.ptext {
  width: 690px;
  /* height: 300px; */
}
</style>
