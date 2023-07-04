
import { 
  getDesignProc,
  getBulkContractOrderProc,
  getBulkDesignOrderProc,
  getBulkProductionOrderProc,
  getProofingOrderProc,
  getBulkQuoteOrderProc,
  getDesignContractRecord,
  getSubmitDesignProposal,
  getPaymentProc,
  getSubmitGeneralAccountStatement,
  getAccountCustomerConfirmsRecord,
  getAccountPaymentRecord
} from "@/api/crm/order/detail"

const crmProcStore = defineStore("crm-proc", {
  state: () => ({
    conceptualDesign:{},
    contract:{},
    design:[],
    production:[],
    proof:[],
    valuation:[],
    payment:{},
    id:''
  }),
  actions: {
    clear(){
      this.conceptualDesign = {}
      this.contract = {}
      this.design = []
      this.production = []
      this.proof = []
      this.valuation = []
      this.payment = {}
    },
    //方案设计
    getConceptualDesign(id,params){
      return new Promise((resolve,reject)=>{
        if (this.conceptualDesign?.id&&this.id==id) {
          resolve()
          return
        }
        this.clear()
        this.id = id
        getDesignProc(id,params).then(res=>{
          if (res.code==200) {
            this.conceptualDesign = res.data
            if (res.data.taskList.length) {
              getDesignContractRecord(res.data.taskList[0].id).then(resp => {
                  if (resp.code == 200) {
                    this.conceptualDesign.taskList[0].rejectRecord = resp.data
                  }
                  resolve()
              })
              if (res.data.taskList.length > 3) {
                  getSubmitDesignProposal(res.data.taskList[3].id).then(resp => {
                      if (resp.code == 200) {
                        this.conceptualDesign.taskList[3].rejectRecord = resp.data
                      }
                  })
              }
            }else{
              resolve()
            }
          }else{
            reject(res)
          }
        }).catch(err=>{
          reject(err)
        })
      })
    },
    //大货合同
    getContract(id,params){
      return new Promise((resolve,reject)=>{
        if (this.contract?.id&&this.id==id) {
          resolve()
          return
        }
        this.clear()
        this.id = id
        getBulkContractOrderProc(id,params).then(res=>{
          if (res.code==200) {
            this.contract = res.data
            resolve()
          }else{
            reject(res)
          }
        }).catch(err=>{
          reject(err)
        })
      })
    },
    //大货设计
    getDesign(id,params){
      return new Promise((resolve,reject)=>{
        if (this.design?.length&&this.id==id) {
          resolve()
          return
        }
        this.clear()
        this.id = id
        getBulkDesignOrderProc(id,params).then(res=>{
          if (res.code==200) {
            this.design = res.data.map(item=>{
              let index = item.taskList.findIndex(item=>{return item.taskDefKey=='bulk_file_design'})
              if (index>-1&&item.taskList[index].taskCategoryList?.length) {
                item.taskList[index].goodsName = item.taskList[index].taskCategoryList.map(e=>{return e.goodsName}).filter(a=>a).join('/')
                item.taskList[index].bulkProdQuantity = item.taskList[index].taskCategoryList.map(e=>{return e.bulkProdQuantity}).filter(a=>a).join('/')
              }
              // if (item.taskList.length>2&&item.taskList[2].taskCategoryList?.length) {
              //   item.taskList[2].goodsName = item.taskList[2].taskCategoryList.map(e=>{return e.goodsName}).filter(a=>a).join('/')
              //   item.taskList[2].bulkProdQuantity = item.taskList[2].taskCategoryList.map(e=>{return e.bulkProdQuantity}).filter(a=>a).join('/')
              // }
              return item
            })
            resolve()
          }else{
            reject(res)
          }
        }).catch(err=>{
          reject(err)
        })
      })
    },
    //大货生产
    getProduction(id,params){
      return new Promise((resolve,reject)=>{
        if (this.production?.length&&this.id==id) {
          resolve()
          return
        }
        this.clear()
        this.id = id
        getBulkProductionOrderProc(id,params).then(res=>{
          if (res.code==200) {
            this.production = res.data
            resolve()
          }else{
            reject(res)
          }
        }).catch(err=>{
          reject(err)
        })
      })
    },
    //打样
    getProof(id,params){
      return new Promise((resolve,reject)=>{
        if (this.proof?.length&&this.id==id) {
          resolve()
          return
        }
        this.clear()
        this.id = id
        getProofingOrderProc(id,params).then(res=>{
          if (res.code==200) {
            let obj = res.data
            if (obj.length) {
              obj.map(item=>{
                if (item.categoryList.length) {
                    item.goodsName = item.categoryList.map(e=>{return e.goodsName}).filter(a=>a).join('/')
                    item.proofingQuantity = item.categoryList.map(e=>{return e.proofingQuantity}).filter(a=>a).join('/')
                }else{
                    item.categoryList = []
                }
                return item
              })
            }
            this.proof = obj
            resolve()
          }else{
            reject(res)
          }
        }).catch(err=>{
          reject(err)
        })
      })
    },
    //大货报价
    getValuation(id,params){
      return new Promise((resolve,reject)=>{
        if (this.valuation?.length&&this.id==id) {
          resolve()
          return
        }
        this.clear()
        this.id = id
        getBulkQuoteOrderProc(id,params).then(res=>{
          if (res.code==200) {
            let obj = res.data
            if (obj&&obj.length) {
              obj.map(item=>{
                  if (item.categoryList.length) {
                      item.goodsName = item.categoryList.map(e=>{return e.goodsName}).filter(a=>a).join('/')
                      item.bulkProdQuantity = item.categoryList.map(e=>{return e.bulkProdQuantity}).filter(a=>a).join('/')
                  }else{
                      item.categoryList = []
                  }
                  return item
              })
            }
            this.valuation = obj
            resolve()
          }else{
            reject(res)
          }
        }).catch(err=>{
          reject(err)
        })
      })
    },
    //付款对账
    getPayment(id,params){
      return new Promise((resolve,reject)=>{
        if (this.payment?.id&&this.id==id) {
          resolve()
          return
        }
        this.clear()
        this.id = id
        getPaymentProc(id,params).then(res=>{
          if (res.code==200) {
            this.payment = res.data
            getSubmitGeneralAccountStatement(res.data.taskList[0].id).then(resp=>{
              if (resp.code==200) {
                this.payment.taskList[0].rejectRecord = resp.data
              }
            })
            if (res.data.taskList?.length>2) {
              getAccountCustomerConfirmsRecord(res.data.taskList[2].id).then(resp=>{
                if (resp.code==200) {
                  this.payment.taskList[2].rejectRecord = resp.data
                }
              })
            }
            if (res.data.taskList?.length>3) {
              getAccountPaymentRecord(res.data.taskList[3].id).then(resp=>{
                if (resp.code==200) {
                  this.payment.taskList[3].rejectRecord = resp.data
                }
              })
            }
            resolve()
          }else{
            reject(res)
          }
        }).catch(err=>{
          reject(err)
        })
      })
    },
  },
});
export default crmProcStore
