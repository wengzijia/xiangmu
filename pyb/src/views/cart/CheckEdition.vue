<template>
  <div class="catbj">
    <!--content start-->
    <div class="container clear">
      <!--主要内容-->
      <div class="ordokBox">
        <ul>
          <li>
            <h3 class="ordok_h3">订单信息</h3>

            <div class="godsBox">
              <!--配送方式-->
              <div class="modeLf">
                <h4>物流方式</h4>
                <p class="modesign curr" data-id="0" data-sid="0">自提</p>
                <ul>
                  <li>
                    <span class="C9">提货地址：</span>
                    <span>拼一版佛山办公室</span>
                  </li>
                </ul>
                <ul>
                  <!--                  {if condition="$tax_rate neq 0"}-->
                  <!--                  <li>-->
                  <!--                    <span class="C9">税点：</span>-->
                  <!--                    <span class="red">￥{$data.taxSingle|default='0.00'}</span>-->
                  <!--                    &lt;!&ndash; <span class="red">￥{$data.suptotal*$tax_rate|number_format=###,2}</span> &ndash;&gt;-->
                  <!--                  </li>-->
                  <!--                  {/if}-->
                </ul>
              </div>
              <!--商家-->
              <div class="shopRgt">
                <h4>商家：拼一版供应商</h4>
                <table class="ShopCartTable">
                  <tbody>
                    <tr v-for="(vo, index) in lists" :key="index">
                      <td width="56%" class="selectLeft">
                        <span class="inline"></span>
                        <span class="inline goodsName">
                          {{ vo.goodsAttr }}
                        </span>
                      </td>
                      <td>x {{ vo.num }}</td>
                      <td>
                        <p class="totalPrice">￥{{ vo.goodsTotal }}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--商家-->
            </div>
          </li>

          <li class="billLi">
            <h3 class="ordok_h3">备注信息</h3>
            <div class="adresBox">
              <div style="overflow: hidden;padding-bottom:20px;font-size:14px;">
                <div style="float: left;">
                  <span>联系人:</span>
                  <input type="text" name="customer" v-model="customer" placeholder="请输入提货人姓名" style="border:1px solid #eee;font-size:12px;padding-left:6px;line-height:32px;" />
                </div>
                <div style="float: left;padding-left:40px;">
                  <span>联系电话:</span>
                  <input type="text" name="mobile" v-model="mobile" placeholder="请输入提货人电话" style="border:1px solid #eee;font-size:12px;padding-left:6px;line-height:32px;" />
                </div>
              </div>
              <div class="layui-col-md12">
                <div class="layui-card">
                  <div class="layui-form-item">
                    <input name="postscript" v-model="memo" lay-verify="postscript" autocomplete="off" placeholder="订单备注" class="layui-input" type="text" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="orfootDv">
        <ul>
          <ol>
            <li>
              <label>商品金额：</label>
              <span class="val"
                ><span class="cartMoney">{{totalAmount}}</span
                >元</span
              >
            </li>
            <!--            {if condition="$tax_rate neq 0"}-->
            <!--            <li>-->
            <!--              <label>税金：</label>-->
            <!--              <span class="val"> <font>{$taxMoney|default='0.00'}</font>元 </span>-->
            <!--            </li>-->
            <!--            {/if}-->
          </ol>
          <!-- <li class="bjrow">
                <div class="totalDv">
                    <label>预付金额：</label>
                    <b class="val">
                        <font class="chktotalmoney">
                            {$premoney}
                        </font>
                        元
                    </b>
                </div>
            </li> -->
        </ul>
        <div class="fr">
          <button class="layui-btn layui-btn-custom submitForm" @click="addEditionOrder">提交订单</button>
        </div>
      </div>
    </div>
    <!--content-->
  </div>
</template>

<script>
import { checkEdition, addEditionOrder, addEdition } from '../../api/cart/cartCheckOrderApi';
export default {
  data() {
    return {
      lists: {},
      totalAmount: 0,
      customer: '',
      mobile: '',
      memo: ''
    };
  },
  methods: {
    checkEdition() {
      var data = {
        isFrom: 1
      };

      checkEdition(data)
        .then(res => {
          this.lists = res.data.cartEditions;
          this.totalAmount = res.data.cartTotal;
        })
        .catch(res => {});
    },
    addEditionOrder() {
      if (/^1[34578]\d{9}$/.test(this.mobile) == false) {
        this.$message({
          type:'error',
          message:'手机号格式错误'
        })
        return;
      }
      var data = {
        isFrom: 1,
        customer: this.customer,
        mobile: this.mobile,
        memo: this.memo
      };
      addEditionOrder(data)
        .then(res => {
          //订单提交成功 跳转到支付页
          if (res.code == '000000') {
            this.$router.push({ path: '/service/editionPay', query: { orderNo: res.data[0].data, paytype: 'normal' } });
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(res => {});
    }
  },
  created() {
    this.checkEdition();
  }
};
</script>
<style scoped src="../../static/index/css/shopping.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css" media="all"></style>
<style scoped src="../../static/index/css/base.css" />
<style scoped src="../../static/index/css/common.css" />
<style scoped src="../../static/index/css/magic-check.css" />
<style scoped src="../../static/index/css/shopping.css" />
