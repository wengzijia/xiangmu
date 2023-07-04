const device = {

    state: {
            currentDeviceId:null,//设备id
            currentDeviceName:null,//设备名称
            deviceOperatorId:null,//员工id
            deviceOperatorName:'',//打卡上班的机长名称
            deviceProducingStatus:0,//标注当前是否是上班状态：0--表示下班，1--表示上班
            supplierId:null,//加工商id
            currentOrder:{
                mainId:null,
                deviceId:null,//机器id
            },
            attributeId:null,//当前工序id
            productStatusFlag:false,//是否有订单正在生产中
            searchValue:null,//存放搜索框的值
    },

    mutations: {
        SET_CURRENT_DEVICE_INFO: (state, params) => {
            state.currentDeviceId = params;
        },
        SET_CURRENT_DEVICE_NAME_INFO: (state, params) => {
            state.currentDeviceName = params;
        },
        SET_DEVICE_OPERATOR_INFO: (state, params) => {
            state.deviceOperatorId = params;
        },
        SET_DEVICE_OPERATOR_NAME_INFO: (state, params) => {
            state.deviceOperatorName = params;
        },
        SET_DEVICE_MAIN_ID_INFO: (state, params) => {
            state.currentOrder.mainId = params;
        },
        SET_DEVICE_MAIN_ID_CURRENT_DEVICE_INFO: (state, params) => {
            state.currentOrder.deviceId = params;
        },
        SET_PRODUCING_STATUS: (state, params) => {
            state.deviceProducingStatus = params;
        },
        SET_CURRENT_SUPPLIERID_INFO: (state, params) => {
            state.supplierId = params;
        },
        set_attributeId_info: (state, id) => {//更改当前工序
            state.attributeId = id;
        },
        set_productStatusFlag_info: (state, flag) => {
            state.productStatusFlag = flag;
        },
        set_search_value: (state, val) => {
            state.searchValue = val;
        },
        
        

    },
    actions: {
        STORE_CURRENT_DEVICE_INFO({commit}, params) {
            commit('SET_CURRENT_DEVICE_INFO', params)
        },
        STORE_CURRENT_DEVICE_NAME_INFO({commit}, params) {
            commit('SET_CURRENT_DEVICE_NAME_INFO', params)
        },
        STORE_DEVICE_OPERATOR_INFO({commit}, params) {
            commit('SET_DEVICE_OPERATOR_INFO', params)
        },
        STORE_DEVICE_OPERATOR_NAME_INFO({commit}, params) {
            commit('SET_DEVICE_OPERATOR_NAME_INFO', params)
        },
        STORE_DEVICE_MAIN_ID_INFO({commit}, params) {
            commit('SET_DEVICE_MAIN_ID_INFO', params)
        },
        STORE_DEVICE_MAIN_ID_CURRENT_DEVICE_INFO({commit}, params) {
            commit('SET_DEVICE_MAIN_ID_CURRENT_DEVICE_INFO', params)
        },
        STORE_PRODUCING_STATUS({commit}, params) {
            commit('SET_PRODUCING_STATUS', params)
        },
        STORE_CURRENT_SUPPLIERID_INFO({commit}, params) {
            commit('SET_CURRENT_SUPPLIERID_INFO', params)
        },
        store_attributeId_info({commit},id){
            commit('set_attributeId_info', id)
        },
        store_productStatusFlag_info({commit},id){
            commit('set_productStatusFlag_info', id)
        },
        store_search_value({commit},val){
            commit('set_search_value', val)
        }
    }
};

export default device;
