<!-- sum -->
<template>
  <div>
    <div class="comBox">
      <!--纸杯-->
      <div class="downLayBox">
        <div class="flex downLyWaper">
          <!--left-->
          <div class="downLyLt">
            <p class="downLyBig jqzoom">
              <img :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + templateInfo.photoPath1" class="detail" width="320px" height="320px" />
            </p>
            <ul class="flex downLySmall current">
              <li><img :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + templateInfo.photoPath1" class="detail_img" /></li>
              <li v-if="templateInfo.photoPath2"><img :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + templateInfo.photoPath2" class="detail_img" /></li>
              <li v-if="templateInfo.photoPath3"><img :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + templateInfo.photoPath3" class="detail_img" /></li>
            </ul>
          </div>
          <!--right-->
          <div class="downLyRt">
            <div class="templateSBox">
              <h6>{{ templateInfo.name }}</h6>
              <ul class="templateSul">
                <li>
                  <span class="tempSpn">模版ID:</span>
                  <div class="tempDv">{{ templateInfo.templateSn }}</div>
                </li>
                <li>
                  <span class="tempSpn">模版说明:</span>
                  <div class="tempDv">{{ templateInfo.description }}</div>
                </li>
                <li>
                  <span class="tempSpn">模版价格:</span>
                  <div class="tempDv en red">￥{{ templateInfo.price }}</div>
                </li>
                <li>
                  <span class="tempSpn"></span>
                  <button class="downLbtn" @click="downloadTemplate()">
                    <a class="buybtn"><i class="icon icon-down"></i>点击下载</a>
                    <!--                    {if session('index_user_auth.nickname')} {if $info.price eq 0}-->
                    <!--                    <a href="{:url('solution/download_template', array('id'=>$info.id))}" class="buybtn"><i class="icon icon-down"></i>点击下载</a>-->
                    <!--                    {else} {if $isorder eq 0}-->
                    <!--                    <a href="javascript:;" class="buybtn gobtn"><i class="icon icon-down"></i>点击下载</a>-->
                    <!--                    {else}-->
                    <!--                    <a href="{:url('solution/download_template', array('id'=>$info.id))}" class="buybtn"><i class="icon icon-down"></i>点击下载</a>-->
                    <!--                    {/if} {/if} {else}-->
                    <!--                    <a href="{:url('base/login')}" class="buybtn"><i class="icon icon-down"></i>点击下载</a>-->
                    <!--                    {/if}-->
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--详情-->
        <div class="daySbox">
          <ul class="daySboxUl">
            <li class="curr">模版详情</li>
          </ul>
          <div class="daySboxCot">
            <img v-if="templateInfo.photoPath1" style="width:80%;" :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + templateInfo.photoPath1" alt="" />
            <img v-if="templateInfo.photoPath2" style="width:80%;" :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + templateInfo.photoPath2" alt="" />
            <img v-if="templateInfo.photoPath3" style="width:80%;" :src="'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + templateInfo.photoPath3" alt="" />
          </div>
        </div>
      </div>
      <!--纸杯-->
    </div>
  </div>
</template>

<script>
import { getTemplateInfoById, downloadTemplateFile, createTemplateOrder } from '@/api/template/templateApi';
import store from '@/store';
import { ACCESS_TOKEN } from '@/store/global-constant';
import router from '@/router';
import { message as Message } from '@/utils/resetMessage';

export default {
  data() {
    return {
      templateInfo: {}
    };
  },
  methods: {
    getTemplateInfo(tid) {
      getTemplateInfoById({ id: tid })
        .then(res => {
          this.templateInfo = res.data;
        })
        .catch(err => {
          this.$router.push({ path: '/solution/index' });
        });
    },
    downloadTemplate() {
      const _this = this;
      downloadTemplateFile({ id: this.templateInfo.id }, function(res) {
        if (res.code === '970005') {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              console.log('response3', localStorage.getItem(ACCESS_TOKEN));
              // window.location.reload();
              router.push({ path: '/login' });
            }, 150);
          });
        } else if (res.code === '970006' || res.code === '970007') {
          console.log('970006');
        } else if (res.code !== '000000') {
          console.log(res.message);
        }
        if (res.code == 910009) {
          createTemplateOrder({
            id: _this.templateInfo.id
          })
            .then(res => {
              _this.$router.push({ path: '/solution/getPay', query: { orderNo: res.data } });
            })
            .catch(err => {
              console.log(err);
            });
          return false;
        }
        if (!res.success) {
          _this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    }
  },
  created() {
    this.getTemplateInfo(this.$route.query.id);
  }
};
</script>

<style scoped src="../../static/mulindex/css/fonts.css"></style>
<style scoped src="../../static/index/css/new/public.css"></style>
<style scoped src="../../static/mulindex/css/index.css"></style>
