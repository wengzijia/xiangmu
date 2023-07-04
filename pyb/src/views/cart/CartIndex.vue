<template>
  <div>
    <div class="catbj">
      <div class="container clear">
        <!--主要内容-->

        <div class="catBox">
          <table class="ShopCartTable">
            <thead>
              <tr>
                <th width="34%" class="selectLeft">
                  <label class="el-checkbox curr">
                    <span class="el-checkbox__input">
                      <input type="checkbox" id="selectAll" @click="allChecked(allCheckedId)" :checked="allCheckedId == -2 ? 'checked' : ''" value="" />
                    </span>
                    <span class="el-checkbox__label">全选</span>
                  </label>
                  <span class="batch-delete" @click="deleteAll(-1)" style="margin-left: 30px; color: red; cursor: pointer">批量删除</span>
                  <span class="selectLeftGoods">商品名称</span>
                </th>
                <th width="24%" class="leftxt"></th>
                <th>数量</th>
                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vo, index) in cartList" :key="index">
                <td width="34%" class="selectLeft">
                  <label class="el-checkbox">
                    <span class="el-checkbox__input">
                      <input type="checkbox" name="cart_id" @click="allChecked(index)" :checked="vo.ischeck == 0 ? '' : 'checked'" />
                    </span>
                  </label>
                  <span class="inline"><img class="goodImg" :src="vo.goodsCoverPath"/></span>
                  <span class="inline goodsName">
                    <h2 class="inline">{{ vo.goodsName }}</h2>
                    <br />
                    <span v-if="vo.adaptive" class="layui-badge layui-bg-cyan" style="background-color: #ffb800 !important">已适配</span>
                  </span>
                </td>
                <td width="24%" class="danPrice gattr{$vo.cart_id}">{{ vo.goodsAttr }}</td>
                <td @click="updateNums(index)">
                  <!-- 精装盒-->
                  <el-input-number v-if="vo.goodsId == 951" v-model="vo.num" :min="1000" :step="1000" :step-strictly="true" size="mini"></el-input-number>
                  <el-input-number v-else-if="vo.num > 1000" v-model="vo.num" :min="1000" :step="1000" :step-strictly="true" size="mini"></el-input-number>
                  <el-input-number v-else v-model="vo.num" :min="1000" :step="1000" :step-strictly="true" size="mini"></el-input-number>
                </td>
                <td>
                  <p class="totalPrice price{$vo.cart_id}">￥{{ vo.goodsTotal }}</p>
                </td>
                <td class="gongneng">
                  <p class="deletegoods" @click="deleteAll(vo.id)">删除</p>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row tablefooter">
            <router-link to="/" class="removeMuch">继续购物 <i>|</i></router-link>
            <span class="servicenum"
              >已选择<span class="goodsNum">{{ checkedCount }}</span
              >件商品</span
            >
            <span class="totalclassCutting"
              >总价：(不含运费)<span class="totalMoneyClass">￥{{ total }}</span></span
            >

            <span @click="ToCheck" class="SettlementBtn">去结算</span>
          </div>
        </div>
      </div>
      <!--content-->
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { getCartByUid, updateCheck, update, del, addByCartIds, addCartByIds, deleteByIds, listCollect } from '@/api/cart/cartApi';
import store from '@/store';
export default {
  data() {
    return {
      cartList: [],
      checkedCount: 0,
      collectCount: 0,
      total: 0,
      allCheckedId: -1,
      makeupCount: -1,
      pinCount: 0,
      dialogTableVisible: false,
      collectList: [],
      multipleSelection: [],
      sdrdialog: false
    };
  },
  methods: {
    renderHeader(h) {
      return (
        <div>
          <span>商品名称</span>
          <span style="padding:3px;margin-left:5px;color: hsl(34, 83%, 49%);" onClick={() => this.addCart(-1)}>
            一键加入购物车
          </span>
          <span style="padding:3px;margin-left:5px;color: hsl(34, 83%, 49%);" onClick={() => this.delCollect(-1)}>
            一键清空
          </span>
        </div>
      );
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      console.log('this.multipleSelection', this.multipleSelection);
    },
    //将收藏加入购物车
    addCart(index) {
      var list = [];
      var data = {
        list: [index],
        language: 'zh-cn'
      };
      var message = '确定要将此商品加入购物车吗?';
      var title = '商品收藏加入购物车';
      if (index == -1) {
        var cartList = this.multipleSelection;
        if (cartList.length == 0) {
          this.$message({
            type: 'error',
            message: '请勾选商品，再操作!'
          });
          return false;
        }
        for (let key in cartList) {
          list.push(cartList[key].id);
        }
        data = {
          list: list,
          language: 'zh-cn'
        };
        message = '确定要将已选中的这' + list.length + '商品加入购物车吗?';
        title = '商品收藏批量加入购物车';
      }
      this.$confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addCartByIds(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '加入成功!'
              });
              this.listCart();
              this.dialogTableVisible = false;
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //删除收藏
    delCollect(index) {
      var list = [];
      var data = {
        list: [index],
        language: 'zh-cn'
      };
      var message = '确定要移除此收藏商品吗?';
      var title = '商品收藏移除';
      if (index == -1) {
        var cartList = this.multipleSelection;
        if (cartList.length == 0) {
          this.$message({
            type: 'error',
            message: '请勾选商品，再操作!'
          });
          return false;
        }
        for (let key in cartList) {
          list.push(cartList[key].id);
        }
        data = {
          list: list,
          language: 'zh-cn'
        };
        message = '确定要将已选中的这' + list.length + '商品移除收藏吗?';
        title = '商品收藏批量移除';
      }
      this.$confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByIds(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '移除成功!'
              });
              this.listCollect();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    async listCart() {
      await getCartByUid()
        .then(res => {
          if (res.success) {
            console.log('res', res);
            let list = res.data.list.map(item => {
              item.goodsAttr = item.goodsAttr.replace( new RegExp('cross3','g'), '跨三面贴窗');
              item.goodsAttr = item.goodsAttr.replace( new RegExp('cross2','g'), '跨二面贴窗');
              item.goodsAttr = item.goodsAttr.replace( new RegExp('cross','g'), '单面贴窗');
              return item;
            });

            this.$set(this, 'cartList', list);
            this.checkedCount = res.data.checkedCount;
            this.total = res.data.total;
            this.collectCount = res.data.collectCount;
            this.makeupCount = res.data.makeupCount;
            //获取购物车数量
            store.dispatch('CartCount').then(() => {});
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取数据失败!'
          });
          console.log(err);
        });
    },
    //进入页面默认选中所有商品
    async defaultSelected() {
      if (this.cartList.length == 0) {
        return false;
      }
      var data = {
        list: [0],
        isCheck: true,
        isCheckAll: true,
        language: 'zh-cn'
      };
      await updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCart();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改数量 款数
    updateNums(index) {
      var data = {
        id: this.cartList[index].id,
        num: this.cartList[index].num
      };
      update(data)
        .then(res => {
          if (res.success) {
            this.cartList[index].goodsTotal = res.data;
            var total = 0;
            for (let key in this.cartList) {
              if (this.cartList[key].ischeck == 1) {
                total += this.cartList[key].goodsTotal;
              }
            }
            this.total = total;
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
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
        if (this.cartList.length <= 0) {
          return false;
        }
        for (let key in this.cartList) {
          this.cartList[key].ischeck = ischeck;
        }
        data = {
          list: [0],
          isCheck: isCheck,
          isCheckAll: true,
          language: 'zh-cn'
        };
      } else {
        var list = [];
        var isCeck = this.cartList[index].ischeck == 0 ? true : false;
        if (this.cartList[index].adaptive) {
          var cartList = this.cartList;
          for (let key in cartList) {
            if (cartList[key].adaptive == this.cartList[index].adaptive) {
              list.push(cartList[key].id);
              this.cartList[key].ischeck = cartList;
            }
          }
        } else {
          list = [this.cartList[index].id];
        }
        data = {
          list: list,
          isCheck: isCeck,
          isCheckAll: false,
          language: 'zh-cn'
        };
      }
      console.log(data);
      // return false;
      updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCart();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除
    deleteAll(index) {
      var list = [];
      var data = {
        list: [index],
        language: 'zh-cn'
      };
      var message = '确定要删除此商品吗?';
      var title = '商品删除';
      if (index == -1) {
        var cartList = this.cartList;
        for (var i = 0; i < cartList.length; i++) {
          if (cartList[i].ischeck > 0) {
            list.push(cartList[i].id);
          }
        }
        if (list.length == 0) {
          this.$message({
            type: 'error',
            message: '请勾选商品，再操作!'
          });
          return false;
        }
        data = {
          list: list,
          language: 'zh-cn'
        };
        message = '确定要删除已选中的这' + list.length + '商品吗?';
        title = '商品批量删除';
      }
      this.$confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.listCart();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //收藏
    addByCartIds() {
      var cartList = this.cartList;
      var list = [];
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].ischeck > 0) {
          list.push(cartList[i].id);
        }
      }
      if (list.length == 0) {
        this.$message({
          type: 'error',
          message: '请勾选商品，再操作!'
        });
        return false;
      }
      this.$confirm('确定要收藏已选中的这' + list.length + '商品吗?', '商品收藏', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          list: list,
          language: 'zh-cn'
        };
        addByCartIds(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '收藏成功!'
              });
              this.listCart();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //收藏列表
    listCollect() {
      this.dialogTableVisible = true;
      listCollect()
        .then(res => {
          if (res.success) {
            this.collectList = res.data;
            this.collectCount = res.data.length;
            console.log(res);
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //去结算
    ToCheck() {
      //判断是否选中
      var cartList = this.cartList;
      var list = [];
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].ischeck > 0) {
          list.push(cartList[i].id);
        }
      }
      if (list.length == 0) {
        this.$message({
          type: 'error',
          message: '请勾选商品，再操作!'
        });
        return false;
      }
      this.$router.push({ path: '/cart/checkorder' });
    },
    //跳转拼版列表
    cartPlan() {
      //判断是否选中
      var cartList = this.cartList;
      var list = [];
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].ischeck > 0) {
          list.push(cartList[i].id);
        }
      }
      if (list.length == 0) {
        this.$message({
          type: 'error',
          message: '请勾选商品，再操作!'
        });
        return false;
      }
      this.$router.push({ path: '/cart/indexPanel' });
    }
  },

  async created() {
    await this.listCart();
    // await this.defaultSelected();
  }
};
</script>

<style scoped src="../../static/index/css/base.css" />
<style scoped src="../../static/index/css/common.css" />
<style scoped src="../../static/assets/layui/css/layui.css" />
<style scoped src="../../static/index/css/shopping.css" />
