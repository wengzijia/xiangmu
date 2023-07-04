<template>
    <div class="exportFileBox">
        <h3>电子看板订单数据导出：</h3>
        <div class="block">
            <span class="demonstration">开始时间：</span>
            <el-date-picker
                v-model="onfinishTimeBegin"
                type="date"
                :clearable="false"
                 value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsBegin"
                placeholder="选择开始日期">
            </el-date-picker>
        </div>
        <div class="block">
            <span class="demonstration">结束时间：</span>
            <el-date-picker
                v-model="onfinishTimeEnd"
                type="date"
                :clearable="false"
                 value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsEnd"
                placeholder="选择结束日期">
            </el-date-picker>
        </div>
       <el-button type="primary" @click="getXxportFile()" >导出</el-button>

        
    </div>
</template>

<script>

 import {getDownloadFile} from '@/api/login.js'
 import {getToken} from '@/utils/auth'
 import {Dialog} from 'vant'
  export default {
    data() {
      return {
        onfinishTimeBegin:new Date(),
        pickerOptionsBegin:{//只允许选择今天及之前的日期
            disabledDate:(time)=> {
                return time.getTime() > Date.now() - 8.64e6
            }
        },
        onfinishTimeEnd: new Date(),
        pickerOptionsEnd: {//只允许选择今天及之前的日期
            disabledDate:(time)=> {
                return time.getTime() > Date.now() - 8.64e6
            }
        }
        
      };
    },
    created(){
        if(!getToken())  return     Dialog.alert({
                                        title: '提示',
                                        message: '检测到未登录，请登录后进入。'
                                    }).then(() => {
                                        this.$router.replace('/login')
                                    }) 
        this.pickerOptionsBegin={//只允许选择今天及之前的日期
            disabledDate:(time)=> {
                if (this.onfinishTimeEnd ) {
                    return time.getTime() > Date.now() || time.getTime() > (new Date(this.onfinishTimeEnd)).getTime()
                }else{
                    return time.getTime() > Date.now();
                } 
            }
        }
        this.pickerOptionsEnd= {//只允许选择今天及之前的日期
            disabledDate:(time)=> {
                if (this.onfinishTimeBegin) {
                    //time.getTime() > Date.now() 当前时间是否超过当天日期，如果是就返回true
                    //time.getTime() < this.onfinishTimeBegin 当前时间是否小于开始时间，如果是就返回true
                     return  time.getTime() > Date.now() || time.getTime()  < (new Date(this.onfinishTimeBegin)).getTime() -  24 * 3600 * 1000;
                }else{
                    return time.getTime() > Date.now() 
                }
                
            }
        }
    },
    
    methods: {
        /**
         * 点击导出按钮
         */
        getXxportFile(){
            const begin = this.dateFormatter(this.onfinishTimeBegin)
            const end = this.dateFormatter(this.onfinishTimeEnd)
            const dayNum = this.getDaysBetween(begin,end)
            if(dayNum>90) return this.$toast( '请选择90天之内的数据。')
            const params = {
                attId: '',
                onfinishTimeBegin:begin +" 00:00:00",
                onfinishTimeEnd:end + " 23:59:59"
            }
            this.$toast.loading('加载中')
            getDownloadFile(params).then(res=>{
                this.$toast.clear()
                //将文件流转成blob形式
                let fileName = "电子看板数据.xls";
                const blob = new Blob([res],{type: "application/vnd.ms-excel"});
                //创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
                const eLink = document.createElement("a");
                eLink.download = fileName;
                eLink.style.display = "none";
                eLink.href = URL.createObjectURL(blob);
                document.body.appendChild(eLink);
                eLink.click();
                URL.revokeObjectURL(eLink.href); // 释放URL 对象
                document.body.removeChild(eLink);
            },err=>{
                this.$toast.clear()
                this.$toast(err.message || '导出失败。')
            })
        },
        
        /**
         * 将时间戳转换成年月日
         * @param {时间戳} str 
         */
        dateFormatter(str){//默认返回yyyy-MM-dd HH-mm-ss
            var d = new Date(str);
            var year = d.getFullYear();
            var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
            var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
            return [year, month, day].join('-');
        },
        /**
         * 判断两个日期相隔天数
         */
        getDaysBetween(dateString1, dateString2) {
            var startDate = Date.parse(dateString1)
            var endDate = Date.parse(dateString2)
            var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
            return days
        }



    }
   
  };
</script>
<style lang="scss" scoped>
.exportFileBox{
    width: 100%;
    height: 100%;
    padding:40px 100px;
    .block{
        display: inline-block;
    }
    .block:nth-of-type(2){
        margin-left: 20px;
    }
    button{
        margin-left: 20px;
    }
}
</style>