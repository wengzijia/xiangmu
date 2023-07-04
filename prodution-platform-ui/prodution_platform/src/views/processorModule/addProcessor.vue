<template>
    <div class="processor_manage_addBox">
        <CommonBreadCrumb :first="'加工商管理'" :marginBottom="'16px'" />
        <!-- 新增加工商模块 -->
        <div class="processor_manage_formBox">
            <div v-if="detailsFlag">
                <processorDetails :formData="propsformData" />
                <div class="footer">
                    <el-form-item class="submitBox">
                        <el-button type="primary" class="search_button" @click="seditForm()">编辑</el-button>
                    </el-form-item>
                </div>
            </div>
            <div v-show="!manufacturerId || !detailsFlag">
                <el-form :model="formData" label-width="120px" ref="ruleFormRef" :scroll-to-error="true">
                    <div class="form-item">
                        <h3>基本信息</h3>
                        <div class="form-group-item">
                            <el-form-item label="加工商名称" prop="manufacturerName" style="width: 392px;"
                                :rules="[{ required: true, message: '请输入加工商名称' }]">
                                <el-input v-model="formData.manufacturerName" maxlength="30" placeholder="请输入加工商名称" />
                            </el-form-item>
                            <el-form-item label="法人" prop="corpName" style="width: 392px;"
                                :rules="[{ required: true, message: '请输入加工商法人' }]">
                                <el-input v-model="formData.corpName"   maxlength="10"
                                    placeholder="请输入加工商法人" />
                            </el-form-item>
                        </div>
                        <div class="form-group-item">
                            <!-- :rules="[{ required: true, message: '请选择省 市 区' }]" -->
                            <el-form-item label="联系地址" prop="provinces" style="width: 392px;">
                                <el-cascader v-model="formData.provinces" ref="elCascaderRef" @change="handleChange" popper-class="cascaderAddress"
                                    placeholder="请选择省 市 区" :props="cascaderProps" />
                            </el-form-item>
                            <el-form-item label="电话" prop="telephone" style="width: 392px;"
                                :rules="[{ required: true, message: '请输入电话号' }]">
                                <el-input v-model="formData.telephone" maxlength="15" placeholder="请输入电话号" />
                            </el-form-item>
                           
                        </div>

                        <div class="form-group-item">
                            <el-form-item label="" prop="address" style="width: 520px;" class="textareaBox">
                                <el-input v-model="formData.address" type="textarea" maxlength="100" placeholder="详细地址" />
                                <span class="numberHint">{{ (formData.address ? formData.address.length :0 )+ '/100'   }}</span>
                            </el-form-item>
                        </div>
                        <div class="form-group-item">
                            <el-form-item label="加工商老板" prop="bossName" style="width: 392px;"
                                :rules="[{ required: true, message: '请输入加工商老板' }]">
                                <el-input v-model="formData.bossName" :disabled="(propsformData.bossName && !!manufacturerId) || mobileErrorType > 2" maxlength="5"
                                    placeholder="请输入加工商老板,最多五个字" />
                            </el-form-item>
                            <el-form-item label="手机号" prop="userMobile" class="mobileBox"
                                :class="{ hintMobileBox: mobileErrorType == 2 }" id="verifyMobileBox" style="width: 392px;"
                                :rules="[
                                    { required: true, message: '请输入手机号', trigger: 'blur', },
                                    { type: 'userMobile', message: '请输入格式正确的手机号。', trigger: ['blur', 'change'], validator: validMobile }]">
                                <el-input @blur="verifyMobile" maxlength="11" :disabled="!!manufacturerId && propsformData.userMobile" 
                                    v-model="formData.userMobile" placeholder="请输入手机号" />
                                <!-- (mobileErrorType == 1 || mobileErrorType == 4) -->
                                <span>提示：{{ mobileErrorType != 2 ? (mobileError ||
                                    '此手机号会同步设置为包秘书的超级管理员') : '此手机号会同步设置为包秘书的超级管理员' }}</span>
                                <p v-if="mobileErrorType == 2" class="hint_mobile">{{ mobileError }}</p>
                            </el-form-item>
                        </div>


                        <!-- <div class="form-group-item">
                            <el-form-item label="" prop="address" style="width: 520px;" class="textareaBox">
                                <el-input v-model="formData.address" type="textarea" maxlength="100" placeholder="详细地址" />
                                <span class="numberHint">{{ (formData.address ? formData.address.length : 0) + '/100'
                                }}</span>
                            </el-form-item>
                        </div> -->

                    </div>

                    <div class="form-item">
                        <h3>账户信息 <span
                                v-if="formData.manufacturerAccountList && formData.manufacturerAccountList.length < 99"
                                class="addItem" @click="addAccount('manufacturerAccountList')">
                                <!-- <el-icon>
                                    <CirclePlus />
                                </el-icon> -->
                                <SvgIcon name="add" color="white" w="16px" h="16px" />

                                添加账户
                            </span></h3>
                        <div class="item-account">
                            <div class="item-account-group" v-for="(item, index) in formData.manufacturerAccountList">
                                <div class="accountArr_div">
                                    <el-form-item :label="`账户${index + 1}收款人`" style="width: 392px;"
                                        :prop="`manufacturerAccountList.${index}.payeeName`"
                                        :rules="[{ required: true, message: '请输入收款人' }]">
                                        <el-input v-model="item.payeeName" maxlength="30" placeholder="请输入收款人" />
                                    </el-form-item>
                                    <el-form-item :label="`账户${index + 1}账号`" style="width: 392px;"
                                        :prop="`manufacturerAccountList.${index}.paymentAccount`"
                                        :rules="[{ required: true, message: '请输入账号' }]">
                                        <el-input v-model="item.paymentAccount" @input="handlePrice(index)" maxlength="20"
                                            placeholder="请输入账号" />
                                    </el-form-item>
                                    <el-form-item :label="`账户${index + 1}开户行`" style="width: 392px;"
                                        :prop="`manufacturerAccountList.${index}.paymentBank`"
                                        :rules="[{ required: true, message: '请输入开户行' }]">
                                        <el-input v-model="item.paymentBank" maxlength="15" placeholder="请输入开户行" />
                                    </el-form-item>
                                </div>

                                <!-- <span v-if="formData.manufacturerAccountList.length > 1" class="delItem"
                                        @click="delAccount(index, 'manufacturerAccountList')"><el-icon>
                                            <DeleteFilled />
                                        </el-icon>删除</span> -->
                                <span v-if="formData.manufacturerAccountList && formData.manufacturerAccountList.length > 1"
                                    class="delItem" @click="delAccount(index, 'manufacturerAccountList')">
                                    <SvgIcon name="del" w="16px" h="16px" />删除
                                </span>


                                <span v-if="formData.manufacturerAccountList && formData.manufacturerAccountList.length > 1"
                                    class="setDefault" @click="setDefault(index)"
                                    :class="{ selActive: item.isDefault == 1 }"> <i></i>
                                    默认账户</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-item">
                        <h3>开票信息</h3>
                        <div class="form-group-item">
                            <el-form-item label="税号" prop="taxNum" style="width: 392px;" :rules="[
                                { type: 'taxNum', message: '请输入格式正确的税号。', trigger: ['blur', 'change'], validator: validDutyParagraph }
                            ]">
                                <el-input maxlength="18" v-model="formData.taxNum" placeholder="最多可输入18位数字和字母" />
                            </el-form-item>

                            <el-form-item label="收费税点" style="width: 392px;">
                                <el-input v-model="formData.taxPoint" placeholder="最多可输入两位小数" data-type='taxPoint'
                                    @input="handlePrice('taxPoint')">
                                    <template #append>%</template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="form-group-item">
                            <el-form-item label="开票税率" style="width: 392px;">
                                <el-select v-model="formData.taxRate" placeholder="请选择开票税率" >
                                    <el-option v-for="item in taxRateArr" :key="item" :label="item.label"
                                        :value="item.type" />
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>

                    <div class="form-item">
                        <!-- 新增功能暂时不开放 -->
                        <!-- <span class="addItem" @click="addAccount('manufacturerTypes')"><SvgIcon name="add" color="white" w="16px" h="16px" />添加类型</span> -->
                        <h3>加工商类型 </h3>
                        <div class="item-account">
                            <div class="item-account-group" v-for="(item, index) in formData.manufacturerTypes">
                                <div class="processorTypeArr_div">
                                    <el-form-item label="加工商类型" style="width: 392px;"
                                        :prop="`manufacturerTypes.${index}.manufacturerType`"
                                        :rules="[{ required: true, message: '请选择加工商类型' }]">

                                        <el-select v-model="item.manufacturerType" placeholder="请选择加工商类型" @change="switchingData(index)">
                                            <el-option v-for="item in processorTypeOptions" :key="item" :label="item.label"
                                                :value="item.type" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="item.manufacturerType == 1" style="width: 392px;" label="产业园名称"
                                        :prop="`manufacturerTypes.${index}.relationId`"
                                        :rules="[{ required: true, message: '请选择产业园名称' }]">
                                        <el-select v-model="item.relationId" placeholder="请选择产业园名称">
                                            <el-option v-for="item in processorAddressArr" :key="item"
                                                :label="item.parkName" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                    <!-- <el-form-item v-if="item.manufacturerType == 3" style="width: 392px;" label="外发厂名">
                                        <el-select v-model="item.relationId" placeholder="请选择外发厂名">
                                            <el-option v-for="item in processorAddressArr" :key="item"
                                                :label="item.parkName" :value="item.id" />
                                        </el-select>
                                    </el-form-item> -->
                        
                            <!-- :rules="[{ required: true, message: '请选择省 市 区' }]" -->
                                    <el-form-item label="外发厂地址" v-if="item.manufacturerType == 3 || item.manufacturerType == 4 " :prop="`manufacturerTypes.${index}.provinces`" style="width: 392px;" :rules="[{ required: true, message: '请选择省 市 区' }]">
                                        <el-cascader v-model="item.provinces" ref="factoryAddress" @change="addressChange($event,item)" popper-class="cascaderAddress"
                                            placeholder="请选择省 市 区" :props="cascaderProps" />
                                    </el-form-item>
                                    <el-form-item label="" prop="address" style="width: 520px;" class="textareaBox" v-if="item.manufacturerType == 3 || item.manufacturerType == 4 ">
                                        <el-input v-model="item.address" type="textarea" maxlength="200" placeholder="详细地址" />
                                        <span class="numberHint">{{ (item.address ? item.address.length :0 )+ '/200'   }}</span>
                                    </el-form-item>

                      
                                    <el-form-item v-if="item.manufacturerType && item.manufacturerType != 2 && item.manufacturerType != 4" label="结款方式"
                                        :prop="`manufacturerTypes.${index}.settlementType`"
                                        :rules="[{ required: true, message: '请选择结款方式' }]">
                                        <el-radio-group v-model="item.settlementType">
                                            <el-radio :label="1">月结</el-radio>
                                            <el-radio :label="3" disabled>现结</el-radio>
                                            <el-radio :label="4" disabled>预付款</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-if="item.manufacturerType == 1" label="机长看板"
                                        :prop="`manufacturerTypes.${index}.isBw`"
                                        :rules="[{ required: true, message: '请选择是否有机长看板' }]">
                                        <el-radio-group v-model="item.isBw">
                                            <el-radio :label="1">有</el-radio>
                                            <el-radio :label="2">没有</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="状态" :prop="`manufacturerTypes.${index}.enableStatus`"
                                        :rules="[{ required: true, message: '请状态', trigger: ['blur', 'change'] }]">
                                        <el-radio-group v-model="item.enableStatus">
                                            <el-radio :label="1">启用</el-radio>
                                            <el-radio :label="2">禁用</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="分配工艺" :prop="`manufacturerTypes.${index}.attributeBinds`" v-if="item.manufacturerType && item.manufacturerType != 4"
                                        :rules="[{ required: true, message: '请选择工艺', trigger: ['blur', 'change'] }]">
                                        <ul class="checkedBox">
                                            <li class="lis" v-for="(val, cur) in item.attributeBinds">
                                                {{ val.attributeName }}
                                                <span @click="delattrId(index, cur, 'attributeBinds')"><el-icon>
                                                        <CloseBold />
                                                    </el-icon></span>
                                            </li>
                                            <li>
                                                <el-button @click="selectHandle(index, 'attributeBinds')"
                                                    class="reset_button" style="background-color:transparent !important;"
                                                    size="small"><el-icon>
                                                        <Plus />
                                                    </el-icon>添加</el-button>
                                            </li>
                                        </ul>
                                    </el-form-item>
                                    <!-- <el-form-item v-if="item.manufacturerType == 2" label="外发默认工序">
                                        <ul class="checkedBox">
                                            <li class="lis" v-for="(val, cur) in item.defaultAttrIdArr">
                                                {{ val.name }}
                                                <span @click="delattrId(index, cur, 'defaultAttrIdArr')"><el-icon>
                                                        <CloseBold />
                                                    </el-icon></span>
                                            </li>
                                            <li>
                                                <el-button @click="selectHandle(index, 'defaultAttrIdArr')"
                                                    class="reset_button" style="background-color:transparent !important;"
                                                    size="small"><el-icon>
                                                        <Plus />
                                                    </el-icon>添加</el-button>
                                            </li>
                                        </ul>
                                    </el-form-item> -->
                                </div>

                                <span v-if="formData.manufacturerTypes && formData.manufacturerTypes.length > 1"
                                    class="delItem" @click="delAccount(index, 'manufacturerTypes')">
                                    <!-- <el-icon>
                                        <DeleteFilled />
                                    </el-icon>删除 -->
                                    <SvgIcon name="del" w="16px" h="16px" /> 删除
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <el-form-item class="submitBox">
                            <el-button type="primary" class="search_button" @click="submitForm(ruleFormRef)">保存</el-button>
                            <el-button class="reset_button" @click="resetForm()">返回</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>

        <attributeIdIndex v-if="centerDialogVisible" @dropDownValueChange="fruitValueChange" :defaultCheck="defaultCheck" />
    </div>
</template>
  
<script name="AddProcessor" setup>
import attributeIdIndex from "@/layout/commonLayout/attributeIdIndex.vue";
import processorDetails from "@/layout/processorLayout/processorDetails.vue";
import { ref, onMounted, getCurrentInstance } from 'vue'
import { sortByLetterMap } from "@/utils/maps/commonMap";
import { getRegionListByPid, checkAndGetByMobile, saveManufacturerInfo, getIndustrialParkList, getManufacturerDetail, updateManufacturerInfo } from "@/api/modules/processor";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance()
const formData = ref({
    manufacturerId: '',
    manufacturerName: '',//加工商名称
    corpName:'',//法人名称
    telephone:'',//电话
    bossName: '',//加工商老板名称
    userMobile: '',//手机号
    provinces: [],//联系地址--存放的是省市区id
    address: '',//详细地址
    manufacturerAccountList: [//账户 
        {
            payeeName: '',
            paymentAccount: null,
            paymentBank: '',
            isDefault: 1 //是否默认账户，1是 2否
        }
    ],
    taxNum: null,//税号
    taxPoint: null,//收费税点
    taxRate: 0,//税率
    manufacturerTypes: [//加工商
        {
            manufacturerType: 1,//加工商类型
            relationId: null,//产业园名称，或者外发厂名都用这个字段存储
            settlementType: null,//结款方式
            isBw: 2,//是否有机长看板
            enableStatus: 1,//状态
            attributeBinds: [],//分配工艺
            defaultAttrIdArr: [],//外发默认工序
        }
    ]

})

const manufacturerId = ref()
const editType = ref(0)//判断是查看还是编辑按钮进来的
const propsformData = ref({})
let detailsFlag = ref(false)//判断是否可以编辑
onMounted(() => {
    if (useRoute().query) {
        manufacturerId.value = useRoute().query.manufacturerId || ''
        editType.value = useRoute().query.type || 0
    }
    if (manufacturerId.value) getDetailData()
})
/**
 * 通过id获取加工商数据明细
 */
function getDetailData(){
    getManufacturerDetail(manufacturerId.value).then(res => {
        console.log(res)
        if (!res || res.code != '000000') return ElMessage({
            showClose: true,
            message: res.message || '服务错误',
            type: 'error',
        })

        if (res.data) {
            const { provinceId, cityId, countyId, manufacturerAccountList, manufacturerTypes } = res.data
            for (let key in formData.value) {
                formData.value[key] = res.data[key]
            }

            if (provinceId && cityId && countyId) formData.value.provinces = [provinceId, cityId, countyId]
            if(manufacturerTypes.length) {
                if(manufacturerTypes[0].provinceId && manufacturerTypes[0].cityId && manufacturerTypes[0].countyId) {
                    formData.value.manufacturerTypes[0].provinces = [manufacturerTypes[0].provinceId, manufacturerTypes[0].cityId,manufacturerTypes[0].countyId]
                }
            }
            propsformData.value = res.data
            if (!manufacturerAccountList || manufacturerAccountList.length == 0) {
                formData.value.manufacturerAccountList = [
                    {
                        payeeName: '',
                        paymentAccount: null,
                        paymentBank: '',
                        isDefault: 1
                    }
                ]
            }
            if(editType.value==0)detailsFlag.value = true
        }
    })
}
/**
* 监听输入框事件，只允许输入小数点后两位
* */
const handlePrice = (key) => {
    const value = key == 'taxPoint' ? formData.value[key] : formData.value.manufacturerAccountList[key].paymentAccount
    if (key == 'taxPoint') return formData.value[key] = clearNoNum(value, false, '')
    formData.value.manufacturerAccountList[key].paymentAccount = clearNoNum(value, true, '')
}
/**
* 默认只展示保留两位小数的值
* flag:true--表示只能输入正整数 
* */
var clearNoNum = (value, flag, key) => {
    if (flag) return value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '')
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
    // if (value != "" && value.charAt(0) == '.' && value.length > 1) {
    //     value = parseFloat(value) + ''
    // }
    if (value != "" && value.charAt(0) == '.'  ) {
        value = value.length == 1 ? '': parseFloat(value) + ''
    }
    if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        value = parseFloat(value);
    }



    return value
}

//弹出框是否开启
const centerDialogVisible = ref(false)
const defaultCheck = ref([])
let signKey = null
let signIndex = null
//选择工序，区分是外发还是分配--开启模态框
const selectHandle = (index, key) => {
    console.log(formData.value.manufacturerTypes[index][key])
    signKey = key
    signIndex = index
    defaultCheck.value = formData.value.manufacturerTypes[index][key] || []
    centerDialogVisible.value = true
}
//选择工艺子组件传过来的值
const fruitValueChange = (val) => {
    centerDialogVisible.value = false
    formData.value.manufacturerTypes[signIndex][signKey] = val
}

const ruleFormRef = ref();
//删除选中的工艺
const delattrId = (index, cur, key) => {
    formData.value.manufacturerTypes[index][key].splice(cur, 1)
}

var mobileError = ref() //定义手机号的校验提示
var mobileErrorType = ref(1)
// 手机号码自定义验证规则
const validMobile = (rule, value, callback) => {
    if (!value) {
        mobileErrorType.value = 1
        mobileError.value = ''
        callback(new Error("请输入手机号"));
    } else if (!/^1[3456789]\d{9}$/.test(value)) {
        mobileErrorType.value = 1
        mobileError.value = ''
        callback(new Error("手机号格式不正确"));
    } else {
        callback();
    }
};
/**
 * 手机号失去焦点时校验
 * 1--如果当前手机号没有关联用户，可以正常添加
 * 2--如果当前手机号关联了用户,且手机号没有被禁用，并且未创建加工商老板角色，将当前手机号的用户名称填充到加工商老板输入框中，并且不允许输入
 * 3--如果当前手机号关联了用户,手机号不管是否被禁用，只要创建了加工商老板角色，提示创建人：手机号已绑定加工商，请更换手机号。不允许点击提交
 * 4--如果当前手机号关联了用户,且手机号被禁用，提示创建人：手机号已被禁用，请联系管理人解绑。 但不影响创建人提交（场景4是在场景3通过的情况下才会出现）
 */
const verifyMobile = () => {
    const formRef = unref(ruleFormRef);
    formRef.validateField("userMobile", (valid) => {
        if (valid) {
            const { userMobile } = formData.value
            checkAndGetByMobile(userMobile).then(res => {
                console.log(res)
                const { code, data, message } = res || {}
                if (code == "O-000037") {
                    mobileErrorType.value = 2
                    return mobileError.value = '手机号已绑定加工商，请更换手机号'
                }
                if (code == 'O-000050') {//当前手机号的主体不是加工商，不允许使用当前手机号添加加工商老板
                    mobileErrorType.value = 2
                    return mobileError.value = message
                }

                if (data && data.userName) {//手机号绑定的用户暂无身份
                    //判断当前账户是否被禁用userState：1--启用；2--禁用
                    mobileErrorType.value = data.userState == 1 ? 3 : 4
                    formData.value.bossName = data.userName
                    mobileError.value = data.userState == 1 ? '手机号已注册，点击保持进行关联' : '手机号已被禁用，请联系管理人解绑'
                    return
                }

                mobileErrorType.value = 1
                mobileError.value = ''

            })
        }
    })
}
// 税号验证
const validDutyParagraph = (rule, value, callback) => {
    // 单位税号(单位税号为15位、18位、20位数字和大写英文字母)：
    // /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/
    if (!value) {
        callback();
    } else if (!/^[A-Z0-9]{15}$|^[A-Z0-9]{18}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
    } else {
        callback();
    }
}
//新增账号
const addAccount = (key) => {
    const publick = {
        manufacturerAccountList: {
            payeeName: '',
            paymentAccount: null,
            paymentBank: '',
            isDefault: 2 //是否默认账户，1是 2否
        },
        manufacturerTypes: {
            manufacturerType: 1,//加工商类型
            provinces: '',//省市县
            address: null,//地址
            factoryName: '',//外发厂名
            settlementType: null,//结款方式
            isBw: 2,//是否有机长看板
            enableStatus: 1,//状态
            attributeBinds: [],//分配工艺
            defaultAttrIdArr: [],//外发默认工序
        }
    }
    formData.value[key].push(publick[key])
}
//删除账号
const delAccount = (index, key) => {
    let flag = false
    if (key == 'manufacturerAccountList') {
        flag = formData.value.manufacturerAccountList[index].isDefault == 1
    }
    formData.value[key].splice(index, 1)
    //如果删除的是账户信息，判断当前删除项是否为默认账户，如果是，将第一个变为默认账户，就不需要改变
    if (flag) formData.value.manufacturerAccountList[0].isDefault = 1
}
//设置账户信息的默认账户
const setDefault = (index) => {
    formData.value.manufacturerAccountList.forEach((val, cur) => {
        val.isDefault = cur == index ? 1 : 2
    })
}

//省市区数据，获取选中的省市区名称数据
const elCascaderRef = ref()
const handleChange = (e) => {
    console.log(elCascaderRef._rawValue.getCheckedNodes()[0])
    const { pathValues, pathLabels } = elCascaderRef._rawValue.getCheckedNodes()[0]
    const keys = ['province', 'city', 'county']
    keys.forEach((item, index) => {
        formData.value[item + 'Id'] = pathValues[index]
        formData.value[item + 'Name'] = pathLabels[index]
    })
}
//税率
const taxRateArr = ref([
    { label: "0%", type: 0 },
    { label: "3%", type: 0.03 },
    { label: "5%", type: 0.05 },
    { label: "6%", type: 0.06 },
    { label: "9%", type: 0.09 },
    { label: "13%", type: 0.13 },
])
//加工商类型
const processorTypeOptions = ref([
    { label: "产业园", type: 1 },
    { label: "单工序外发", type: 3 },
    { label: "未入驻", type: 2 },
    { label: "整单外发", type: 4 }
])
const processorAddressArr = ref([
    { parkName: "里水产业园一厂", id: 1 },
    { parkName: "里水产业园二厂", id: 2 },
])
getIndustrialParkList().then(res => {
    console.log('获取产业园列表', res)
    if (res.code != '000000') return
    processorAddressArr.value = res.data
})

//获取省市区数据
const getRegionList = (pid = -1) => {
    return new Promise((resolve, reject) => {
        getRegionListByPid(pid).then(res => {
            if (res.code != '000000') return ElMessage({
                showClose: true,
                message: res.message || '服务错误',
                type: 'error',
            })
            resolve(res.data)
        }).catch(err => {
            reject([])
        })
    })

}

const cascaderProps = ref({
    lazy: true,
    lazyLoad(node, resolve) {
        const { level } = node
        const { value, label } = node.data
        getRegionList(value || -1).then(res => {
            if (!res || res.length == 0) return resolve(res)
            const nodes = res.map((item) => ({
                value: item.id,
                label: item.regionName,
                leaf: level >= 2,
            }))
            resolve(nodes)
        }).catch(err => {
            resolve([])
        })

    },
})



//下拉框切换选项触发
const switchingData = (index) => {
    console.log('下拉框切换选项触发',index)
    const currrentData = formData.value.manufacturerTypes[index]
    for(let key in currrentData){
        if(currrentData[key] == '-1') currrentData[key] = ''
    }
    formData.value.manufacturerTypes[index] = currrentData
    
}



//点击提交按钮
const submitForm = (formEl) => {
    // console.log(formData.value)
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            //如果电话号码验证属于第二种状态，也不允许点击保持
            if (mobileErrorType.value == 2) return document.getElementById('verifyMobileBox').scrollIntoView()
            addOrEdit()
        } else {
            console.log('error submit!', fields)
            return false
        }
    })
}

/**
 * 新增或者编辑
 */
function addOrEdit() {
    const postUrl = manufacturerId.value ? updateManufacturerInfo : saveManufacturerInfo
    let submitPamrams = JSON.parse(JSON.stringify(formData.value));
    if (submitPamrams.manufacturerTypes && submitPamrams.manufacturerTypes.length > 0) {
        submitPamrams.manufacturerTypes.forEach(item => {
            const { manufacturerType } = item
            if (manufacturerType != 1) {
                delete item.isBw;//是否有机长看板
                delete item.defaultAttrIdArr;
                delete item.relationId;//外发厂名
                delete item.relationName;
            }
            if (manufacturerType == 2) {//未入驻
                delete item.settlementType;//结款方式
            }
            if(manufacturerType == 4) {
                delete item.attributeBinds // 工艺
            }
            if(manufacturerType !== 3 && manufacturerType !== 4) {
                delete item.cityId;//城市id
                delete item.cityName;//城市名称
                delete item.countyId;//区id
                delete item.countyName;//区名称
                delete item.provinceId;//省id
                delete item.provinceName;//省名称
                delete item.address;//详细地址
            }
        })
        console.log('submitPamrams.manufacturerTypes', submitPamrams.manufacturerTypes)
    }
    postUrl(submitPamrams).then(res => {
        console.log('新增加工商接口：', res)
        if (res.code != '000000') return ElMessage({
            showClose: true,
            message: res.message || '服务错误',
            type: 'error',
        })
        proxy.$yun.showModal({
            title: '提示',
            cancel: '取消',
            confirm: '确定',
            content: manufacturerId.value ? '编辑成功！' : '创建成功！',
        }).then(res => {
            console.log(res)
            //如果是新增，不论点击确定还是取消都返回加工商列表页
            if (!manufacturerId.value) return resetForm()
            //编辑的时候，如果点击保存，保存成功提示后，点击确定按钮，就回到只读页面，点击取消就保持原样
            if (res.type == 'confirm') {
                getDetailData()
            }
        })
    })
}
//点击返回按钮
const resetForm = () => {
    // router.push({ name: "ProcessorList" });
    router.replace({ path: '/processor/processorList' })
}
//点击编辑按钮
const seditForm = () => {
    detailsFlag.value = false
}

//外发厂地址省市区数据，获取选中的省市区名称数据
const factoryAddress = ref()
const addressChange = (e,val) => {
    // console.log(e,val,'seeeeeeeeee')
    const { pathValues, pathLabels } = factoryAddress._rawValue[0].getCheckedNodes()[0]
    const keys = ['province', 'city', 'county']
    keys.forEach((item, index) => {
        val[item + 'Id'] = pathValues[index]
        val[item + 'Name'] = pathLabels[index]
    })
}









</script>
  
<style lang="scss" scoped>
.processor_manage_addBox {
    background-color: #F7F7F7;
    height: 100%;
    overflow: auto;
    width: 100%;
    padding: 16px 0 40px 24px;
    box-sizing: border-box;

    .processor_manage_formBox {
        width: 100%;
        box-sizing: border-box;
        height: calc(100% - 30px);
        overflow: auto;
        background-color: #F7F7F7;
        position: relative;

        >div {
            width: calc(100% - 18px);
            background-color: #fff;
            padding: 20px 0 150px 32px;
            box-sizing: border-box;
            min-height: 100%;

        }

        .form-item {
            margin-bottom: 14px;

            h3 {
                font-size: 16px;
                font-family: Source Han Sans CN-Medium, Source Han Sans CN;
                font-weight: 500;
                color: #333;
                margin: 0 0 20px 0;
                padding: 0;

                .addItem {
                    color: var(--vt-c-theme-colors);
                    font-size: 14px;
                    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                    font-weight: 400;
                    padding-left: 16px;
                    position: relative;
                    cursor: pointer;

                    .el-icon {
                        position: absolute;
                        left: 16px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }

            .form-group-item {
                width: 70%;
                min-width: 720px;
                display: flex;
                justify-content: space-between;

                .mobileBox {
                    position: relative;

                    span {
                        position: absolute;
                        top: 50%;
                        width: 320px;
                        left: 288px;
                        transform: translateY(-50%);
                        font-size: 14px;
                        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                        font-weight: 400;
                        color: #999;
                    }

                    .hint_mobile {
                        position: absolute;
                        bottom: -90%;
                        left: 0;
                        font-size: 12px;
                        color: var(--el-color-danger);
                    }
                }

                .hintMobileBox {
                    :deep(.el-input__wrapper) {
                        box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
                    }
                }

                .textareaBox {

                    :deep(.el-textarea__inner) {
                        height: 80px !important;
                    }

                    :deep(.el-form-item__content) {
                        display: flex;

                        .el-textarea {
                            flex: 1;
                        }

                        .numberHint {
                            width: 52px;
                            padding-left: 4px;
                            font-size: 12px;
                            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                            font-weight: 400;
                            color: #C0C0C0;
                            height: 80px;
                            padding-top: 58px;
                            box-sizing: border-box;
                        }
                    }

                }
            }

            .item-account {
                width: 70%;
                min-width: 720px;

                .item-account-group {
                    background: #F7F7F7;
                    border-radius: 4px 4px 4px 4px;
                    padding: 20px 20px 2px 0;
                    box-sizing: border-box;
                    margin-bottom: 20px;
                    position: relative;

                    >.accountArr_div {
                        width: 500px;
                    }

                    >.processorTypeArr_div {
                        min-width: 500px;

                        .textareaBox {

                            :deep(.el-textarea__inner) {
                                height: 80px !important;
                            }

                            :deep(.el-form-item__content) {
                                display: flex;

                                .el-textarea {
                                    flex: 1;
                                }

                                .numberHint {
                                    width: 52px;
                                    padding-left: 4px;
                                    font-size: 12px;
                                    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                                    font-weight: 400;
                                    color: #C0C0C0;
                                    height: 80px;
                                    padding-top: 58px;
                                    box-sizing: border-box;
                                }
                            }

                        }
                    }

                    .delItem {
                        position: absolute;
                        right: -52px;
                        bottom: 0;
                        font-size: 14px;
                        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                        font-weight: 400;
                        color: #666;
                        padding-left: 34px;
                        cursor: pointer;

                        // .el-icon {
                        //     position: absolute;
                        //     left: 16px;
                        //     top: 50%;
                        //     transform: translateY(-50%);
                        // }
                        .svg-icon-spin {
                            position: absolute;
                            left: 16px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                    }

                    .setDefault {
                        height: 20px;
                        border-left: 1px solid #E0E0E0;
                        line-height: 20px;
                        position: absolute;
                        right: -172px;
                        bottom: 0;
                        font-size: 14px;
                        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                        font-weight: 400;
                        color: #666;
                        padding-left: 42px;
                        cursor: pointer;

                        >i {
                            position: absolute;
                            width: 16px;
                            height: 16px;
                            background-color: #fff;
                            border: 1px solid #C0C0C0;
                            border-radius: 50%;
                            left: 20px;
                            top: 50%;
                            transform: translateY(-50%);
                            box-sizing: border-box;
                        }

                        >i::after {
                            content: '';
                            position: absolute;
                            width: 6px;
                            height: 6px;
                            background-color: #fff;
                            border-radius: 50%;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);

                        }

                    }

                    .selActive {
                        >i {
                            background-color: var(--vt-c-theme-colors);
                            border: 1px solid var(--vt-c-theme-colors);
                        }

                        color: var(--vt-c-theme-colors);
                    }


                }


            }

            .checkedBox {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                margin: 0;
                padding: 0;
                box-sizing: border-box;

                >.lis {
                    height: 25px;
                    line-height: 25px;
                    background: #F2F2F2;
                    border-radius: 2px 2px 2px 2px;
                    font-size: 14px;
                    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                    font-weight: 400;
                    color: #333;
                    padding: 0 36px 0 16px;
                    position: relative;
                    margin: 4px 12px 8px 0;

                    >span {
                        position: absolute;
                        height: 21px;
                        width: 32px;
                        right: 4px;
                        top: 50%;
                        transform: translateY(-50%);
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;

                        .el-icon {
                            color: #666;
                        }
                    }
                }
            }

            :deep(.el-form-item__content) {

                .el-cascader,
                .el-select {
                    width: 272px;
                }

                .el-input-group__append {
                    background-color: #fff !important;
                    padding: 0 10px;
                }

            }
        }

        .footer {
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 48px);
            // width: 100%;
            background-color: #fff;
            height: 72px;
            z-index: 99;

            .submitBox {
                position: absolute;
                left: 50%;
                bottom: 2px;
                transform: translateX(-50%);

                :deep(.el-form-item__content) {
                    margin: 0 !important;

                    button {
                        margin: 0 40px;
                    }
                }
            }

        }

    }
}
</style>
<style lang="scss">
  .cascaderAddress{
    .el-cascader-node__prefix {
      position: absolute ;
      left: 150px;
    } 
  }
</style>