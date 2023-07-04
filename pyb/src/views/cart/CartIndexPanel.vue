<template>
  <div>
    <div class="catbj">
      <!--content start-->
      <div class="container clear">
        <!--主要内容-->

        <div class="catBox" style="margin-top:30px;">
          <table class="ShopCartTable">
            <thead>
              <tr>
                <th width="24%" class="selectLeft">
                  <label class="el-checkbox curr">
                    <span class="el-checkbox__input"> <input type="checkbox" id="selectAll" @click="allChecked(allCheckedId)" :checked="allCheckedId == -2 ? 'checked' : ''" value="" />&nbsp; </span>
                    <span class="el-checkbox__label">全选</span>
                  </label>
                  <span class="selectLeftGoods">商品名称</span>
                </th>
                <th width="24%" class="leftxt">
                  规格<span class="collectbox" @click="addByCartIds" style="margin-left: 10px;color: hsl(34, 83%, 49%);cursor: pointer;">一键收藏</span>
                  <span class="myCollectBox" @click="listCollect" v-if="collectCount > 0" style="margin-left: 30px;color: hsl(34, 83%, 49%);cursor: pointer;">我的收藏({{ collectCount }})</span>
                </th>
                <th>数量</th>
                <th v-if="isInner">模数</th>
                <th>上传刀模</th>
                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vo, index) in cartList" :key="index">
                <td width="24%" class="selectLeft">
                  <label class="el-checkbox">
                    <span class="el-checkbox__input">
                      <input type="checkbox" name="cart_id" @click="allChecked(index)" :checked="vo.ischeck == 0 ? '' : 'checked'" />
                    </span>
                  </label>
                  <span class="inline"><img class="goodImg" :src="vo.goodsCoverPath"/></span>
                  <span class="inline goodsName" style="width:auto;">
                    <h2 class="inline" style="width:100px;">{{ vo.goodsName }}</h2>
                    <br />
                    <span v-if="vo.isMakeup" class="layui-badge layui-bg-orange" data-id="{$vo.cart_id}">可拼版</span>
                  </span>
                </td>
                <td width="24%" class="danPrice gattr{$vo.cart_id}">{{ vo.goodsAttr }}</td>
                <td @click="updateNums(index)">
                  <!-- 精装盒-->
                  <el-input-number v-if="vo.goodsId == 951" v-model="vo.num" :min="20" :step="20" :step-strictly="true" size="mini"></el-input-number>
                  <el-input-number v-else-if="vo.num > 1000" v-model="vo.num" :min="100" :step="100" :step-strictly="true" size="mini"></el-input-number>
                  <el-input-number v-else v-model="vo.num" :min="100" :step="50" :step-strictly="true" size="mini"></el-input-number>
                </td>
                <td v-if="isInner">
                  <el-input-number v-model="vo.modNum" :min="0" size="mini"></el-input-number>
                </td>
                <td>
                  <template v-if="vo.goodsTag == 1 && (vo.cuttingImages == '' || vo.cuttingImages == null)">
                    <el-upload
                      :headers="headers"
                      :show-file-list="false"
                      accept=".pdf"
                      action="/api/consumer/cart/uploadCutting"
                      :data="{ id: vo.id }"
                      :before-upload="beforeUploadImg"
                      :on-progress="uploadProgress"
                      :on-success="uploadSuccess"
                      :on-error="uploadError"
                    >
                      <el-input size="small" class="wbb1022Button" style="padding: 4px 8px;height: auto;" value="上传文件" type="button" />
                    </el-upload>
                  </template>
                  <template v-if="vo.goodsTag == 1 && vo.cuttingImages != '' && vo.cuttingImages != null">
                    <a :href="'//pb.xiaocaiyin.com/' + vo.cuttingImages" target="_black">查看刀模</a> <br />
                    <el-upload
                      :headers="headers"
                      :show-file-list="false"
                      accept=".pdf"
                      action="/api/consumer/cart/uploadCutting"
                      :data="{ id: vo.id }"
                      :before-upload="beforeUploadImg"
                      :on-progress="uploadProgress"
                      :on-success="uploadSuccess"
                      :on-error="uploadError"
                    >
                      <el-input size="mini" class="wbb1022Button" style="padding: 4px 8px;height: auto;" value="重新上传" type="button" />
                    </el-upload>
                  </template>
                  <template v-if="vo.goodsTag != 1">
                    不可拼版
                  </template>
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
          <!--自动报价-->
          <table v-if="isPanel" class="ShopCartTable PanelTable">
            <thead>
              <tr>
                <th width="34%" class="selectLeft">
                  <label class="el-checkbox curr">
                    <span class="el-checkbox__input"> </span>
                    <span class="el-checkbox__label">拼版视图 <em class="CartEm" style="color:#58b335;">(自动拼版)</em></span>
                  </label>
                </th>
                <th width="24%" class="leftxt">印张尺寸</th>
                <th>印张数量</th>
                <th>包装费用</th>
                <th>拼版价格</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vo, index) in PanelTableList" :key="index">
                <td width="34%" class="selectLeft">
                  <span class="inline"
                    ><a class="panelAimg" :href="vo.images" target="_blank"><img class="goodImg panelImg" :src="vo.images"/></a
                  ></span>
                </td>
                <td width="24%" class="danPrice panelSize">{{ vo.areasize }}</td>
                <td class="panelNum">{{ vo.number }}</td>
                <td class="boxtotal">￥{{ vo.boxtotal }}</td>
                <td>
                  <p class="totalPrice panelTotal">￥{{ vo.price }}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <!--手动报价-->
          <table class="ShopCartTable manualTable none">
            <thead>
              <tr>
                <th width="34%" class="selectLeft">
                  <label class="el-checkbox curr">
                    <span class="el-checkbox__input"> </span>
                    <span class="el-checkbox__label">拼版视图 <em class="CartEm">(手动报价)</em></span>
                  </label>
                </th>
                <th width="24%" class="leftxt">印张尺寸</th>
                <th>印张数量</th>
                <th>包装费用</th>
                <th>拼版价格</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>

          <div class="row tableprice confPriceBx">
            <ul>
              <li>
                商品总价：<span class="totalMoneyClass">￥{{ total }}</span>
              </li>
              <li>
                优惠金额：<span class="DiscountMoneyClass">- ￥{{ discountedPrice }}</span>
              </li>
              <li>
                拼版总价：<span class="totalclassPoin CuttingPrice">￥{{ PanelPrice }}</span>
              </li>
            </ul>
          </div>

          <div class="akeupBox" style="display:none;">
            <div class="row tableprice" style="display:flex;justify-content:space-between;">
              <div class="cartchkDv auto">
                <span class="cartChkBox curr"
                  ><label class="cartChkBoxLabel"><i class="icon icon-checkm"></i></label>自动拼版价</span
                >
                <ul>
                  <li>
                    商品总价：<span class="totalMoneyClass">￥{{ total }}</span>
                  </li>
                  <li>优惠金额：<span class="DiscountMoneyClass">- ￥0.00</span></li>
                  <li>拼版总价：<span class="totalclassPoin CuttingPrice">￥0.00</span></li>
                </ul>
              </div>
              <div class="cartchkDvRt manual">
                <span class="cartChkBox"
                  ><label class="cartChkBoxLabel"><i class="icon icon-checkm"></i></label>手动计价</span
                >
                <ul>
                  <li>
                    商品总价：<span class="totalMoneyClass">￥{{ total }}</span>
                  </li>
                  <li>
                    优惠金额：<span class="DiscountMoneyClass">- ￥{{ discountedPrice }}</span>
                  </li>
                  <li>
                    拼版总价：<span class="totalclassPoin CuttingPrice">￥{{ PanelPrice }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="row tablefooter">
            <router-link to="/cart/index" class="removeMuch">返回购物车 <i>|</i></router-link>
            <span class="servicenum"
              >已选择<span class="goodsNum">{{ checkedCount }}</span
              >件商品</span
            >
            <input name="totalprice" type="hidden" value="{$total}" />
            <span @click="ToCheck" v-if="isPanel" class="lementMoney"><i style="font-size: 18px;position: relative;top: 3px;" class="icon icon-checks"></i>去结算</span>
            <!--            <span v-if="isInner" class="manualBtn hidediv">手动计价</span>-->
            <span class="lementPrice" @click="priceOfMakeup">{{ PanelTitle }}</span>
          </div>
        </div>
      </div>
      <!--content-->
    </div>
    <el-dialog title="我的收藏" :visible.sync="dialogTableVisible" center="center" width="70%">
      <el-table :data="collectList" style="width: 100%;" max-height="600px" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" colspan="3"> </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="300" :render-header="renderHeader">
          <template slot-scope="scope">
            <span class="title-img">
              <img :src="scope.row.goodsCoverPath" alt="" class="table-img" style="width: 100px" />
              <span class="table-title">{{ scope.row.goodsName }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsAttr" label="规格" width="738"> </el-table-column>
        <el-table-column prop="num" label="数量" width="100"> </el-table-column>
        <el-table-column prop="id" label="操作" width="100">
          <template slot-scope="scope">
            <div style="cursor: pointer" @click="addCart(scope.row.id)">加入购物车</div>
            <div style="cursor: pointer" @click="delCollect(scope.row.id)">删除</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getCartByUid, updateCheck, update, del, addByCartIds, addCartByIds, deleteByIds, listCollect, priceOfMakeup } from '@/api/cart/cartApi';
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
      isInner: false,
      headers: {
        token: localStorage.getItem('Access-Token'),
        Authorization: localStorage.getItem('Access-Token')
      },
      isPanel: false,
      PanelTableList: [],
      discountedPrice: 0,
      PanelPrice: 0,
      PanelTitle: '拼版计价'
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
      var data = {
        data: true,
        language: 'zh-cn'
      };
      await getCartByUid(data)
        .then(res => {
          if (res.success) {
            console.log(res);
            this.$set(this, 'cartList', res.data.list);
            this.checkedCount = res.data.checkedCount;
            this.total = res.data.total;
            this.collectCount = res.data.collectCount;
            this.makeupCount = res.data.makeupCount;
            //手动拼版
            // this.isInner = res.data.isInner;

            this.isPanel = false;
            this.PanelTableList = [];
            this.discountedPrice = 0;
            this.PanelPrice = 0;
            this.PanelTitle = '拼版计价';
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
            this.isPanel = false;
            this.PanelTableList = [];
            this.discountedPrice = 0;
            this.PanelPrice = 0;
            this.PanelTitle = '拼版计价';
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
      var total = 0;
      if (index < 0) {
        var ischeck = 1;
        if (this.allCheckedId == -1) {
          this.allCheckedId = -2;
        } else {
          this.allCheckedId = -1;
          ischeck = 0;
        }
        for (let key in this.cartList) {
          this.cartList[key].ischeck = ischeck;
        }
      } else {
        this.cartList[index].ischeck = this.cartList[index].ischeck == 0 ? 1 : 0;
      }
      for (let key in this.cartList) {
        if (this.cartList[key].ischeck == 1) {
          total += this.cartList[key].goodsTotal;
        }
      }
      this.total = total;
      this.isPanel = false;
      this.PanelTableList = [];
      this.discountedPrice = 0;
      this.PanelPrice = 0;
      this.PanelTitle = '拼版计价';
      // var data = {};
      // if (index < 0) {
      //   var isCheck = true;
      //   var ischeck = 1;
      //   if (this.allCheckedId == -1) {
      //     this.allCheckedId = -2;
      //   } else {
      //     this.allCheckedId = -1;
      //     isCheck = false;
      //     ischeck = 0;
      //   }
      //   for (let key in this.cartList) {
      //     this.cartList[key].ischeck = ischeck;
      //   }
      //   data = {
      //     list: [0],
      //     isCheck: isCheck,
      //     isCheckAll: true,
      //     language: 'zh-cn'
      //   };
      // } else {
      //   data = {
      //     list: [this.cartList[index].id],
      //     isCheck: this.cartList[index].ischeck == 0 ? true : false,
      //     isCheckAll: false,
      //     language: 'zh-cn'
      //   };
      // }
      // console.log(data);
      // // return false;
      // updateCheck(data)
      //   .then(res => {
      //     if (res.success) {
      //       this.listCart();
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: '提交失败!'
      //       });
      //     }
      //     console.log(res);
      //   })
      //   .catch(err => {
      //     this.$message({
      //       type: 'error',
      //       message: '提交失败!'
      //     });
      //     console.log(err);
      //   });
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
    //上传成功的方法
    uploadSuccess(response, file, fileList) {
      const loading = this.$loading({
        lock: true
      });
      loading.close();
      if (response.success) {
        this.listCart();
        this.$message({
          type: 'success',
          message: '上传成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    //上传失败执行的方法
    uploadError(err, file, fileList) {
      const loading = this.$loading({
        lock: true
      });
      loading.close();
      console.log(err);
      this.$message({
        type: 'error',
        message: '上传失败'
      });
    },
    //上传文件的判断
    beforeUploadImg(file) {
      var fileName = file.name;
      const reg = /\.(pdf)$/;
      const extension = reg.test(fileName);
      // const fileSize = file.size / 1024 / 1024 < 1;
      if (!extension) {
        this.$message({
          message: '上传文件只能是 pdf格式!',
          type: 'warning'
        });
      }
      // if (!fileSize) {
      //   this.$message({
      //     message: '上传文件大小不能超过 1MB!',
      //     type: 'warning'
      //   });
      // }
      return extension;
    },
    //上传中
    uploadProgress(event, file, fileList) {
      console.log('event', parseInt(event.percent));
      console.log('event', event);
      console.log('file', file);
      console.log('fileList', fileList);
      const loading = this.$loading({
        lock: true,
        text: '文件上传中，请稍后～请勿刷新浏览器～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    //拼版计价
    priceOfMakeup() {
      console.log(111);
      var cartList = this.cartList;
      var list = [];
      var isPriceOfMakeup = 0;
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].ischeck > 0) {
          list.push(cartList[i].id);
          if (cartList[i].goodsTag != 1) {
            isPriceOfMakeup = 1;
          } else {
            if (cartList[i].cuttingImages == '' || cartList[i].cuttingImages == null) {
              isPriceOfMakeup = 2;
            }
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
      if (list.length == 1) {
        this.$message({
          type: 'error',
          message: '合版不能小于2个盒型!'
        });
        return false;
      }
      if (isPriceOfMakeup == 1) {
        this.$message({
          type: 'error',
          message: '请勾选可拼版商品，再操作!'
        });
        return false;
      }
      if (isPriceOfMakeup == 2) {
        this.$message({
          type: 'error',
          message: '拼版前，请先上传文件！'
        });
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: '核算中，请稍后～请勿刷新浏览器～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      var data = {
        list: list,
        language: 'zh-cn'
      };
      console.log(data);
      priceOfMakeup(data)
        .then(res => {
          loading.close();
          if (res.success) {
            console.log(111555, res);
            this.isPanel = true;
            this.PanelTableList = res.data.makeupList;
            var PanelPrice = res.data.makeupPrice;
            var discountedPrice = this.total - PanelPrice > 0 ? this.total - PanelPrice : 0;
            console.log('PanelPrice', PanelPrice);
            console.log('PanelPrice', discountedPrice);
            this.discountedPrice = discountedPrice;
            this.PanelPrice = PanelPrice;
            this.PanelTitle = '重新计价';
            this.$message({
              type: 'success',
              message: '拼版成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          loading.close();
          console.log(err);
        });
    },
    //去结算
    ToCheck() {
      this.$router.push({ path: '/cart/checkorder?type=1' });
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
<style scoped src="../../static/index/css/new/cart.css" />
