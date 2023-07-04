<template>
  <div>
    <el-main>
      <div class="right_List">
        <div class="UP_right_List">我的模版订单</div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="mt_HdList">
              <ul class="extra_Left">
                <li><router-link class="trrOne" to="user/templatelist">全部订单</router-link></li>
              </ul>
            </div>
            <div class="md_MainList">
              <table class="td-void order-tb">
                <colgroup>
                  <col class="number-col" />
                  <col class="consignee-col" />
                  <col class="consignee-col amount-col" />
                  <col class="consignee-col status-col" />
                </colgroup>
                <thead>
                  <tr>
                    <th colspan="2">
                      <div class="order_detail_txt">订单详情</div>
                    </th>
                    <th>金额</th>
                    <th>
                      <div class="ordertime_cont deal-state-cont">
                        <div class="time_txt state-txt">
                          全部状态
                          <span class="blank"></span>
                        </div>
                      </div>
                    </th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody v-for="(vo, index) in templateList" :key="index">
                  <tr class="sep-row">
                    <td colspan="5"></td>
                  </tr>
                  <tr class="tr-th">
                    <td colspan="5">
                      <span class="dealtime">{{ formatSecond(vo.createtime) }}</span>
                      <span class="numberTatle">
                        订单号：
                        <a :href="'/solution/detail?id=' + vo.tid" class="orderIdLinks" target="_blank">{{ vo.orderNo }}</a>
                      </span>
                    </td>
                  </tr>
                  <tr class="track57442710364">
                    <td colspan="2">
                      <div class="p_911672">
                        <div class="goodsImg">
                          <a :href="'/solution/detail?id=' + vo.tid" target="_blank"><img :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + vo.images" alt="" width="60" height="60"/></a>
                        </div>
                        <div class="goodsFont">
                          <p class="goodsFont_One">
                            <a :href="'/solution/detail?id=' + vo.tid" class="OrderDetail" target="_blank">
                              {{ vo.name }}
                            </a>
                          </p>
                          <p>{{ vo.description }}</p>
                        </div>
                      </div>
                    </td>
                    <td rowspan="1">
                      <div class="amount amount01">
                        <span class="orangeFont"></span>
                        <br /><br />
                        <span>总额￥{{ vo.price }}</span>
                      </div>
                    </td>
                    <td rowspan="1">
                      <div class="amount amount01">
                        <span class="orangeFont"></span>
                        <br /><br />
                        <span v-if="vo.payStatus == 1">
                          已支付
                        </span>
                        <span v-else>
                          未支付
                        </span>
                      </div>
                    </td>
                    <td rowspan="1">
                      <div class="amount amount01">
                        <span class="orangeFont"></span>
                        <br />
                        <a :href="'/solution/detail?id=' + vo.tid" class="OrderDetail temBtn" target="_blank">点击下载</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="w_page_0528" style="margin:30px 0;">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="value" :total="totalCount" :page-size="pageSize" :current-page="pageNumber" @current-change="handleCurrentChange"></el-pagination>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import { getUserTemplateOrder } from '@/api/users/userTemplateOrderApi';
import { formatSecond } from '@/utils/timeUtil';

export default {
  data() {
    return {
      templateList: [],
      pageNumber: 1,
      pageSize: 6,
      emptyQueryData: {
        pageNumber: 1,
        pageSize: 6
      },
      totalCount: 0,
      value: true
    };
  },
  methods: {
    ...{ formatSecond },
    listTemplateList(parameter) {
      if (!parameter) {
        parameter = this.emptyQueryData;
      }
      getUserTemplateOrder(parameter)
        .then(res => {
          this.$set(this, 'templateList', res.data);
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.listTemplateList({ pageNumber: pageNumber, pageSize: this.pageSize });
    }
  },
  created() {
    this.listTemplateList();
  }
};
</script>

<style scope src="../../static/index/user/css/reset.css" />
<style scope src="../../static/index/user/css/all.css" />
<style scope src="../../static/index/user/css/foot.css" />
<style scope src="../../static/index/user/css/main.css" />
<style scope src="../../static/index/css/new/public.css" />
