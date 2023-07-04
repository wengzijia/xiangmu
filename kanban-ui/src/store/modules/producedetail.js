const produceDetail = {

    state: {
        produceDetailInfo: {
            deviceId: 0,
            deviceOperatorId: 0,
            groupNo: "string",
            lossCount: 0,
            mainId: 0,
            onCount: 0,
            optionType: 0
        }
    },

    mutations: {
        SET_CURRENT_PRODUCE_INFO: (state, params) => {
            state.deviceInfo.currentDeviceId = params;
        }
    },
    actions: {
        STORE_PRODUCE_INFO({commit}, params) {
            commit('SET_CURRENT_DEVICE_INFO', params)
        }
    }
};

export default produceDetail;
