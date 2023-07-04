<template>
  <div class="shopping">
    <div class="catbj">
      <!--content start-->
      <div class="container clear">
        <!--主要内容-->

        <div class="catBox">
          <div class="ShopCarTile">打样购物车</div>

          <table class="ShopCartTable">
            <thead>
              <tr>
                <th width="34%" class="selectLeft">
                  <label class="el-checkbox curr">
                    <span class="el-checkbox__input"> <input type="checkbox" id="selectAll" value="" @click="allChecked(allCheckedId)" :checked="allCheckedId == -2 ? 'checked' : ''" />&nbsp; </span>
                    <span class="el-checkbox__label">全选</span>
                  </label>
                  <span class="batch-delete" @click="deleteAll" style="margin-left: 28px;color: red;cursor: pointer;">批量删除</span>
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
                <td width="34%" class="selectLeft">
                  <label class="el-checkbox">
                    <span class="el-checkbox__input">
                      <input type="checkbox" name="cart_id" @click="allChecked(index)" :checked="vo.ischeck == 0 ? '' : 'checked'" />
                    </span>
                  </label>
                  <span class="inline"><img class="goodImg" src="/uploads/picture/20181208/f34163b2254efbc498a3938a07ae587f.jpg"/></span>
                  <span class="inline goodsName">
                    <h2 class="inline">{{ vo.cateStr }}</h2>
                    <span v-if="vo.adaptive != '' && vo.adaptive != null" class="layui-badge layui-bg-cyan">已适配</span>
                  </span>
                </td>
                <td width="24%" class="danPrice gattr{$vo.id}">{{ vo.goodsAttr }}</td>
                <td class="numberTd" @click="updateNums(index)">
                  <el-input-number v-model="vo.num" :min="1" size="mini"></el-input-number>
                </td>
                <td class="fnumTd" @click="updateNums(index)">
                  <el-input-number v-model="vo.fnumber" :min="1" size="mini"></el-input-number>
                </td>
                <td>
                  <p class="totalPrice price{$vo.id}">￥{{ vo.goodsTotal }}</p>
                </td>
                <td class="gongneng">
                  <p class="deletegoods" @click="deleteProof(vo.id)">删除</p>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row tablefooter">
            <router-link to="/" class="removeMuch">继续购物 <i>|</i></router-link>
            <span class="servicenum"
              >已选择<span class="goodsNum">{{ count }}</span
              >件商品</span
            >
            <span class="totalclassCutting"
              >总价：(不含运费)<span class="totalMoneyClass">￥{{ total }}</span></span
            >

            <span @click="ToCheck" class="SettlementBtn">去结算</span>
          </div>
          <div class="row tablefooter">
            <a href="javascript:;" class="removeMuch"><span class="totalPrice">温馨提示：</span>适配盒型大于两款</a>
            <router-link to="/cart/proofAdaptive"><span class="lementBtn">去适配盒型</span></router-link>
          </div>
        </div>
      </div>
      <!--content-->
    </div>
  </div>
</template>
<script>
import { getByUid, updateNum, deleteById, deleteByIds, updateCheck } from '@/api/cart/cartProofApi';
import store from '@/store';
export default {
  data() {
    return {
      cartProofList: [],
      count: 0,
      total: 0,
      allCheckedId: -1
    };
  },
  // 方法
  methods: {
    listCartProof() {
      getByUid()
        .then(res => {
          if (res.success) {
            this.$set(this, 'cartProofList', res.data.list);
            this.count = res.data.checkedCount;
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
        if (this.allCheckedId == -1) {
          this.allCheckedId = -2;
        } else {
          this.allCheckedId = -1;
          isCheck = false;
          ischeck = 0;
        }
        if (this.cartProofList.length <= 0) {
          return false;
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
        var list = [];
        if (this.cartProofList[index].adaptive) {
          var cartProofList = this.cartProofList;
          for (let key in cartProofList) {
            if (cartProofList[key].adaptive == this.cartProofList[index].adaptive) {
              list.push(cartProofList[key].id);
            }
          }
        } else {
          list = [this.cartProofList[index].id];
        }

        data = {
          list: list,
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
    updateNums(index) {
      var data = {
        fnumber: this.cartProofList[index].fnumber,
        id: this.cartProofList[index].id,
        language: 'zh-cn',
        num: this.cartProofList[index].num
      };
      updateNum(data)
        .then(res => {
          if (res.success) {
            console.log('res', res);
            this.cartProofList[index].goodsTotal = res.data;
            var total = 0;
            for (let key in this.cartProofList) {
              if (this.cartProofList[key].ischeck == 1) {
                total += this.cartProofList[key].goodsTotal;
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
  created() {
    this.listCartProof();
  }
};
</script>
<style scoped src="../../static/index/css/base.css" />
<style scoped src="../../static/index/css/common.css" />
<style scoped src="../../static/assets/layui/css/layui.css" />
<style scoped src="../../static/index/css/shopping.css" />
