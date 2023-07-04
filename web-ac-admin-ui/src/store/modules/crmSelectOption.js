import { computed, } from "vue";
import { roleKey, roleKey2 } from "@/api/orderManagement/subOrder";
import useUserStore from "@/store/modules/user"
import { getCrmDept,getCrmAllDept } from '@/api/crm'

const user = useUserStore()
const roles = computed(()=>user.roles)
const userInfo = computed(()=>user.userInfo)

const useCrmOption = defineStore(
  "option", 
  {
    state: () => ({
      salesmanList: [],//crm业务员列表
      designerList: [],//crm设计师列表
      financialStaffList:[],//财务人员列表
      proofSupplyList:[],//打样供应链专员
      bulkSupplyList:[],//大货供应链专员
      deptList:[],//部门列表
      acDataSepDeptId:null,//用户归属部门id
      sDeptId:null//部门id,获取业务员列表用
    }),
    actions: {
      //获取当前用户部门
      getDept(){
        return new Promise((resolve, reject) => {
        if (this.deptList.length>1) {
          resolve({data:null})
          return 
        }
          getCrmDept().then(res=>{
            if (res.code==200) {
              if (res.data) {
                this.acDataSepDeptId = res.data.id
                this.sDeptId = res.data.id
                this.deptList = [{
                  label:res.data.deptName,
                  value:res.data.id,
                  ...res.data
                }]
                this.getCrmStaffList()
                this.getCrmProjectDesignerList()
                this.getSupplyList()
                resolve(res)
              } else {
                getCrmAllDept().then(resp=>{
                  if (resp.code==200) {
                    this.deptList = resp.data.map(item=>{
                      return {
                        label:item.deptName,
                        value:item.id,
                        ...item
                      }
                    })
                    resolve()
                  }else{
                    reject()
                  }
                })
              }
            }
          }).catch(err=>{
            reject()
          })
        })
      },
      //获取业务员列表
      getCrmStaffList(){
        roleKey('crmCustomerBusinessStaff',{deptId:this.sDeptId}).then(res=>{
          if (res.code==200&&res.data?.length) {
            this.salesmanList = res.data.map(item=>{
              return {
                label:item.nickName,
                value:item.userId,
                ...item
              }
            })
          }else{
            this.salesmanList = []
          }
        })
      },
      //获取设计师列表
      getCrmProjectDesignerList(){
        roleKey('crmProjectDesigner',{deptId:this.sDeptId}).then(res=>{
          if (res.code==200&&res.data?.length) {
            this.designerList = res.data.map(item=>{
              return {
                label:item.nickName,
                value:item.userId,
                ...item
              }
            })
            //设计师只能返回自己，不显示其他人的选项
            if (roles.value.some((item) => item == 'crmProjectDesigner')) {
              this.designerList = [{
                label:userInfo.value.nickName,
                value:userInfo.value.userId,
                ...userInfo.value
              }]
            }
          }else{
            this.salesmanList = []
          }
        })
      },
      //获取业务员列表
      getSupplyList(){
        roleKey('crmProofingSupplyChainSpecialist',{deptId:this.sDeptId}).then(res=>{
          if (res.code==200&&res.data?.length) {
            this.proofSupplyList = res.data.map(item=>{
              return {
                label:item.nickName,
                value:item.userId,
                ...item
              }
            })
          }else{
            this.proofSupplyList = []
          }
        })
        roleKey('crmBulkSupplyChainSpecialist',{deptId:this.sDeptId}).then(res=>{
          if (res.code==200&&res.data?.length) {
            this.bulkSupplyList = res.data.map(item=>{
              return {
                label:item.nickName,
                value:item.userId,
                ...item
              }
            })
          }else{
            this.bulkSupplyList = []
          }
        })
      },
      // //获取财务列表
      // getCrmFinancialStaffList(){
      //   roleKey('crmFinancialStaff',{acDataSepDeptId:this.acDataSepDeptId}).then(res=>{
      //     if (res.code==200&&res.data?.length) {
      //       this.financialStaffList = res.data.map(item=>{
      //         return {
      //           label:item.nickName,
      //           value:item.userId,
      //           ...item
      //         }
      //       })
      //     }else{
      //       this.salesmanList = []
      //     }
      //   })
      // },
      //获取下拉选项列表
      getOptionList(key){
        this.getDept()
        return
        // return new Promise((resolve,reject)=>{
        //   var flag = false
        //   switch (key) {
        //     case 'crmCustomerBusinessStaff':
        //       if (this.salesmanList.length) {
        //         flag = true
        //       }
        //       break;

        //     case 'crmProjectDesigner':
        //       if (this.designerList.length) {
        //         flag = true
        //       }
        //       break;

        //     case 'crmFinancialStaff':
        //       if (this.financialStaffList.length) {
        //         flag = true
        //       }
        //       break;
          
        //     default:
        //       break;
        //   }
        //   if (flag) {
        //     resolve()
        //     return
        //   }
        //   roleKey(key).then(res=>{
        //     switch (key) {
        //       case 'crmCustomerBusinessStaff':
        //         this.salesmanList = res.data.map(item=>{
        //           return {
        //             label:item.nickName,
        //             value:item.userId,
        //             ...item
        //           }
        //         })
        //         break;
        //       case 'crmProjectDesigner':
        //         this.designerList = res.data.map(item=>{
        //           return {
        //             label:item.nickName,
        //             value:item.userId,
        //             ...item
        //           }
        //         })
        //         //设计师只能返回自己，不显示其他人的选项
        //         if (roles.value.some((item) => item == 'crmProjectDesigner')) {
        //           this.designerList = [{
        //             label:userInfo.value.nickName,
        //             value:userInfo.value.userId,
        //             ...userInfo.value
        //           }]
        //         }
        //         break
        //       case 'crmFinancialStaff':
        //         this.financialStaffList = res.data.map(item=>{
        //           return {
        //             label:item.nickName,
        //             value:item.userId,
        //             ...item
        //           }
        //         })
        //         break;
            
        //       default:
        //         break;
        //     }
        //     resolve()
        //   }).catch(err=>{
        //     reject(err)
        //   })
        // })
      },
      setDeptId(id){
        this.salesmanList = []//crm业务员列表
        this.designerList = []//crm设计师列表
        this.financialStaffList = []//财务人员列表
        this.proofSupplyList =[] //打样供应链专员
        if (!id) {
          return
        }
        this.sDeptId = id
        this.getCrmStaffList()
        this.getCrmProjectDesignerList()
        this.getSupplyList()
        // this.getCrmFinancialStaffList()
      }
    },
  }
);
export default useCrmOption
