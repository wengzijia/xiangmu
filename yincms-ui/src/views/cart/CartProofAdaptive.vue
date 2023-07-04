<template>
  <div>
    <div class="catbj">
      <!--content start-->
      <div class="container clear">
        <!--主要内容-->
        <div class="catBox">
          <div class="ShopCarTile">
            <span style="color: red;cursor: pointer;">盒型适配操作：勾选需要适配盒型，并点击开始适配 删除适配组可释放产品重新适配</span>
          </div>
          <table class="ShopCartTable">
            <thead>
              <tr>
                <th width="28%" class="selectLeft">
                  <label class="el-checkbox curr">
                    <span class="el-checkbox__input">
                      <input type="checkbox" id="selectAll" value="" @click="allChecked(allCheckedId)" :checked="allCheckedId == -2 ? 'checked' : ''" />
                    </span>
                    <span class="el-checkbox__label">全选</span>
                  </label>
                  <span style="margin-left:7px;"><button type="button" @click="StartAdaptation" class="layui-btn layui-btn-warm layui-btn-sm batch-adaptive">开始适配</button></span>
                  <span class="selectLeftGoods">打样类别</span>
                </th>

                <th width="24%" class="leftxt">规格</th>
                <th>数量</th>
                <th>款数</th>
                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vo, index) in cartProofList" :key="index">
                <td class="selectLeft">
                  <label class="el-checkbox">
                    <span class="el-checkbox__input">
                      <input type="checkbox" name="cart_id" @click="allChecked(index)" :checked="vo.ischeck == 0 ? '' : 'checked'" />
                    </span>
                  </label>
                  <span class="inline"><img class="goodImg" src="/uploads/picture/20181208/f34163b2254efbc498a3938a07ae587f.jpg"/></span>
                  <span class="inline goodsName1">
                    <h2 class="inline">{{ vo.cateStr }}</h2>
                    <span class="layui-badge layui-bg-badge">未适配</span>
                  </span>
                </td>

                <td class="danPrice gattr{$vo.id}">{{ vo.goodsAttr }}</td>
                <td class="numberTd">
                  <!-- @click="updateNums(index)" -->
                  <el-input-number @change="updateNums(index)" @input.native="updateNums(index)" :ref="'cartNumInput' + index" v-model="vo.num" :min="1" size="mini"></el-input-number>
                </td>
                <td class="fnumTd">
                  <!-- @click="updateNums(index)" -->
                  <el-input-number @change="updateNums(index)" @input.native="updateNums(index)" :ref="'cartfnumTdInput' + index" v-model="vo.fnumber" :min="1" size="mini"></el-input-number>
                </td>
                <td>
                  <p class="totalPrice price{$vo.id}">{{ vo.goodsTotal }}</p>
                </td>
                <td class="gongneng">
                  <p class="deletegoods" data-id="{$vo.id}"><button @click="deleteProof(vo.id)" type="button" class="layui-btn layui-btn-primary layui-btn-sm ">删 除</button></p>
                </td>
              </tr>
            </tbody>
            <template v-for="(gplist, index) in adaptiveMap">
              <tbody :key="'tbody_' + index">
                <tr class="sep-row">
                  <td colspan="6"></td>
                </tr>
              </tbody>
              <thead :key="'thead_' + index">
                <tr style="background-color:#7abd54;border: 2px solid #7abd54;">
                  <td colspan="5" style="text-align: left;">
                    <input type="checkbox" :checked="adaptiveMapIs[index]" value="" @click="adaptiveCheck(index)" style="margin-right: 10px" />
                    <button type="button" class="layui-btn layui-btn-warm layui-btn-sm">适配编码:<i class="layui-icon"></i>{{ index }}</button>
                  </td>
                  <td>
                    <a class="group_dell" href="javascript:;" data-id="{$gplist.ap}"><button type="button" @click="deleteByAdaptive(index)" class="layui-btn layui-btn-primary layui-btn-sm ">删除适配</button></a>
                  </td>
                </tr>
              </thead>
              <tbody :key="index">
                <tr v-for="(gro, indexs) in gplist" :key="indexs" style="border: 2px solid #7abd54;">
                  <td width="34%" class="selectLeft">
                    <label class="el-checkbox">
                      <span class="el-checkbox__input">
                        <!-- <input type="checkbox" name="cart_id" data-id="{$gro.id|default='0'}" data-val="{$gro.goods_total}" {if $gro.ischeck}checked="checked"{/if}> -->
                      </span>
                    </label>
                    <span class="inline"><img class="goodImg" src="/uploads/picture/20181208/f34163b2254efbc498a3938a07ae587f.jpg"/></span>
                    <span class="inline goodsName">
                      <h2 class="inline">{{ gro.cateStr }}</h2>
                      <span class="layui-badge layui-bg-cyan">已适配</span>
                    </span>
                  </td>
                  <td width="24%" class="danPrice gattr{$gro.id}">{{ gro.goodsAttr }}</td>
                  <td class="numberTd">
                    <el-input-number @change="updateAdaptiveNums(index, indexs)" @input.native="updateAdaptiveNums(index, indexs)" :ref="'cartAdaptiveInput' + index + '_' + indexs" v-model="gro.num" :min="1" size="mini"></el-input-number>
                  </td>
                  <td class="fnumTd">
                    <el-input-number @change="updateAdaptiveNums(index, indexs)" @input.native="updateAdaptiveNums(index, indexs)" :ref="'cartfnumTdAdaptiveInput' + index + '_' + indexs" v-model="gro.fnumber" :min="1" size="mini"></el-input-number>
                  </td>
                  <td>
                    <p class="totalPrice price{$gro.id}">￥{{ gro.goodsTotal }}</p>
                  </td>
                  <td class="gongneng">
                    <!--                  <p class="deletegoods" data-id="{$gro.id}"><button type="button" class="layui-btn layui-btn-primary layui-btn-sm">删 除</button></p>-->
                  </td>
                </tr>
                <tr style="border: 2px solid #7abd54;">
                  <td width="34%"></td>
                  <td width="24%" class="danPrice"><p>适配新增工艺:无</p></td>
                  <td class="numberTd"></td>
                  <td class="fnumTd"></td>
                  <td><p class="totalPrice price{$gro.id}">￥0.00</p></td>
                  <td class="gongneng"></td>
                </tr>
              </tbody>
            </template>
          </table>

          <div class="row tablefooter">
            <a href="" class="removeMuch">继续购物 <i>|</i></a>
            <span class="servicenum"
              >已选择<span class="goodsNum">{{ count }}</span
              >件商品</span
            >
            <span class="totalclassCutting"
              >总价：(不含运费)<span class="totalMoneyClass">￥{{ total }}</span></span
            >

            <span @click="ToCheck" class="SettlementBtn">去结算</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adaptiveList, createAdaptive, deleteByAdaptive, deleteById, deleteByIds, updateCheck, updateNum } from '@/api/cart/cartProofApi';
import store from '@/store';
import { debounce } from '@/utils/utils';
export default {
  data() {
    return {
      cartProofList: [],
      adaptiveMap: [],
      allCheckedId: -1,
      count: 0,
      total: 0,
      adaptiveChecked: 'checked',
      adaptiveMapIs: []
    };
  },
  methods: {
    //选中适配商品
    adaptiveCheck(index) {
      var adaptiveMap = this.adaptiveMap;
      var list = [];
      var isCheck = true;
      this.adaptiveMapIs[index] = 'checked';
      if (adaptiveMap[index][0].ischeck == 1) {
        isCheck = false;
        this.adaptiveMapIs[index] = '';
      }
      for (let key in adaptiveMap[index]) {
        list.push(adaptiveMap[index][key].id);
      }

      var data = {
        list: list,
        isCheck: isCheck,
        isCheckAll: false,
        language: 'zh-cn'
      };

      updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCartProof();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //进入页面默认选中已适配的数据
    async defaultSelected() {
      var adaptiveMap = this.adaptiveMap;
      var list = [];
      for (let key in adaptiveMap) {
        for (var i = 0; i < adaptiveMap[key].length; i++) {
          list.push(adaptiveMap[key][i].id);
        }
      }

      var data = {
        list: list,
        isCheck: true,
        isCheckAll: true,
        language: 'zh-cn'
      };
      updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCartProof();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    async listCartProof() {
      await adaptiveList()
        .then(res => {
          if (res.success) {
            this.$set(this, 'cartProofList', res.data.list);
            this.$set(this, 'adaptiveMap', res.data.adaptiveMap);
            var adaptiveMap = res.data.adaptiveMap;
            for (let key in adaptiveMap) {
              if (adaptiveMap[key][0].ischeck == 1) {
                this.adaptiveMapIs[key] = 'checked';
              } else {
                this.adaptiveMapIs[key] = '';
              }
            }
            this.count = res.data.count;
            this.total = res.data.total;
            //获取购物车数量
            store.dispatch('CartCount').then(() => {});
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取数据失败!'
          });
          console.log(err);
        });
    },
    //全选
    allChecked(index) {
      var data = {};
      if (index < 0) {
        var isCheck = true;
        var ischeck = 1;
        var checked = 'checked';
        if (this.allCheckedId == -1) {
          this.allCheckedId = -2;
          this.adaptiveChecked = 'checked';
        } else {
          this.allCheckedId = -1;
          isCheck = false;
          this.adaptiveChecked = '';
          ischeck = 0;
          checked = '';
        }
        var adaptiveMap = this.adaptiveMap;
        if (this.cartProofList.length <= 0 && Object.keys(this.adaptiveMap).length <= 0) {
          return false;
        }
        for (let key in adaptiveMap) {
          this.adaptiveMapIs[key] = checked;
        }
        for (let key in this.cartProofList) {
          this.cartProofList[key].ischeck = ischeck;
        }
        data = {
          list: [0],
          isCheck: isCheck,
          isCheckAll: true,
          language: 'zh-cn'
        };
      } else {
        data = {
          list: [this.cartProofList[index].id],
          isCheck: this.cartProofList[index].ischeck == 0 ? true : false,
          isCheckAll: false,
          language: 'zh-cn'
        };
      }
      // return false;
      updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCartProof();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除
    deleteProof(index) {
      this.$confirm('确定要删除吗??', '商品删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          id: index,
          language: 'zh-cn'
        };
        deleteById(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.listCartProof();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //批量删除
    deleteAll() {
      var list = [];
      var cartProofList = this.cartProofList;
      for (var i = 0; i < cartProofList.length; i++) {
        if (cartProofList[i].ischeck > 0) {
          list.push(cartProofList[i].id);
        }
      }
      if (list.length == 0) {
        this.$message({
          type: 'error',
          message: '请勾选商品，再操作!'
        });
        return false;
      }
      this.$confirm('确定要删除已选中的这' + list.length + '商品吗?', '商品批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          list: list,
          language: 'zh-cn'
        };
        deleteByIds(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.listCartProof();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //修改数量 款数
    updateNums: debounce(function(index) {
      let _this = this;
      let num = _this.$refs['cartNumInput' + index][0].displayValue;
      let minNum = _this.$refs['cartNumInput' + index][0].min;
      this.cartProofList[index].num = Number(num) >= Number(minNum) ? num : minNum;
      // this.cartProofList[index].num = _this.$refs['cartNumInput' + index][0].displayValue;
      let num2 = _this.$refs['cartfnumTdInput' + index][0].displayValue;
      let minNum2 = _this.$refs['cartfnumTdInput' + index][0].min;
      this.cartProofList[index].fnumber = Number(num2) >= Number(minNum2) ? num2 : minNum2;
      // this.cartProofList[index].fnumber = _this.$refs['cartfnumTdInput' + index][0].displayValue
      var data = {
        fnumber: this.cartProofList[index].fnumber,
        id: this.cartProofList[index].id,
        language: 'zh-cn',
        num: this.cartProofList[index].num
      };
      updateNum(data)
        .then(res => {
          if (res.success) {
            this.cartProofList[index].goodsTotal = res.data;
            var total = 0;
            for (let key in this.cartProofList) {
              if (this.cartProofList[key].ischeck == 1) {
                total += this.cartProofList[key].goodsTotal;
              }
            }
            var adaptiveMap = this.adaptiveMap;
            for (let key in adaptiveMap) {
              for (let keys in adaptiveMap[key]) {
                if (adaptiveMap[key][keys].ischeck == 1) {
                  total += adaptiveMap[key][keys].goodsTotal;
                }
              }
            }
            this.total = total;
            // this.listCartProof();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }, 500),
    //修改 已适配数量 款数
    updateAdaptiveNums: debounce(function(index, indexs) {
      let _this = this;
      let num = _this.$refs['cartAdaptiveInput' + index + '_' + indexs][0].displayValue;
      let minNum = _this.$refs['cartAdaptiveInput' + index + '_' + indexs][0].min;
      this.adaptiveMap[index][indexs].num = Number(num) >= Number(minNum) ? num : minNum;
      let num2 = _this.$refs['cartfnumTdAdaptiveInput' + index + '_' + indexs][0].displayValue;
      let minNum2 = _this.$refs['cartfnumTdAdaptiveInput' + index + '_' + indexs][0].min;
      this.adaptiveMap[index][indexs].fnumber = Number(num2) >= Number(minNum2) ? num2 : minNum2;
      var data = {
        fnumber: this.adaptiveMap[index][indexs].fnumber,
        id: this.adaptiveMap[index][indexs].id,
        language: 'zh-cn',
        num: this.adaptiveMap[index][indexs].num
      };
      updateNum(data)
        .then(res => {
          if (res.success) {
            this.adaptiveMap[index][indexs].goodsTotal = res.data;
            var total = 0;
            for (let key in this.cartProofList) {
              if (this.cartProofList[key].ischeck == 1) {
                total += this.cartProofList[key].goodsTotal;
              }
            }
            var adaptiveMap = this.adaptiveMap;
            for (let key in adaptiveMap) {
              for (let keys in adaptiveMap[key]) {
                if (adaptiveMap[key][keys].ischeck == 1) {
                  total += adaptiveMap[key][keys].goodsTotal;
                }
              }
            }
            this.total = total;
            // this.listCartProof();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }, 500),
    //点击适配
    StartAdaptation() {
      var list = [];
      var cartProofList = this.cartProofList;
      for (var i = 0; i < cartProofList.length; i++) {
        if (cartProofList[i].ischeck > 0) {
          list.push(cartProofList[i].id);
        }
      }
      if (list.length == 0) {
        this.$message({
          type: 'error',
          message: '请勾选商品，再操作!'
        });
        return false;
      }
      if (list.length == 1) {
        this.$message({
          type: 'error',
          message: '适配不能小于两款商品!'
        });
        return false;
      }
      var data = {
        list: list,
        language: 'zh-cn'
      };
      createAdaptive(data)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '适配成功!'
            });
            this.listCartProof();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除适配
    deleteByAdaptive(index) {
      var data = {
        data: index,
        language: 'zh-cn'
      };
      this.$confirm('确定要删除此适配吗?', '删除适配', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByAdaptive(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.listCartProof();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //去结算
    ToCheck() {
      //判断是否选中
      var list = [];
      var cartProofList = this.cartProofList;
      for (var i = 0; i < cartProofList.length; i++) {
        if (cartProofList[i].ischeck > 0) {
          list.push(cartProofList[i].id);
        }
      }
      var adaptiveMap = this.adaptiveMap;
      for (let key in adaptiveMap) {
        for (let keys in adaptiveMap[key]) {
          if (adaptiveMap[key][keys].ischeck > 0) {
            list.push(adaptiveMap[key][keys].id);
          }
        }
      }
      if (list.length == 0) {
        this.$message({
          type: 'error',
          message: '请勾选商品，再操作!'
        });
        return false;
      }
      this.$router.push({ path: '/cart/checkproof' });
    }
  },
  // 初始化组件事件,具体请看vue的生命周期
  async created() {
    await this.listCartProof();
    // await this.defaultSelected();
  }
};
</script>

<style scoped src="../../static/index/css/base.css" />
<style scoped src="../../static/index/css/common.css" />
<style scoped src="../../static/assets/layui/css/layui.css" />
<style scoped src="../../static/index/css/shopping_adaptive.css" />
