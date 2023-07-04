
/**
 * 消息广播
 * @param {*} options 
 * @returns 
 */
export function useBroadcast(options) {
    /* ============= 待办列表 ============= */
    const CHANNEL_PENDINGLIST = 'channel-pendingList'
    /**
     * 监听待办列表消息
     * @param {*} callback 
     */
    const listenPendingListChannel =function(callback){
        let channel = new BroadcastChannel(CHANNEL_PENDINGLIST);
        channel.addEventListener("message", function (e) {
            callback && callback(e.data)
        });
        return channel
    }

    /**
     * 发送刷新待办列表的消息
     * @param {*} data 
     */
    const postRefreshPendingListMessage = function(data={}){
        Object.assign(data,{ refreshData: true })
        let channel = new BroadcastChannel(CHANNEL_PENDINGLIST);
        channel.postMessage(data)
        setTimeout(() => {
            channel.close()
        }, 50)
    }

    /* ============= 结款单列表 ============= */
    const CHANNEL_ACCOUNTCHECKING_SETTLEMENTLIST = 'channel-accountChecking-settlementList'

    /**
     * 监听结款单列表消息
     * @param {*} callback 
     */
    const listenSettlementListChannel =function(callback){
        let channel = new BroadcastChannel(CHANNEL_ACCOUNTCHECKING_SETTLEMENTLIST);
        channel.addEventListener("message", function (e) {
            callback && callback(e.data)
        });
        return channel
    }

    /**
     * 发送刷新结款单列表的消息
     * @param {*} data 
     */
    const postRefreshSettlementListMessage = function(data={}){
        Object.assign(data,{ refreshData: true })
        let channel = new BroadcastChannel(CHANNEL_ACCOUNTCHECKING_SETTLEMENTLIST);
        channel.postMessage(data)
        setTimeout(() => {
            channel.close()
        }, 50)
    }

    /* ============= 月结账单列表 ============= */
    const CHANNEL_ACCOUNTCHECKING_MONTHLYSTATEMENTLIST = 'channel-accountChecking-monthlystatementlist'

    /**
     * 监听结款单列表消息
     * @param {*} callback 
     */
    const listenMonthlyStatementListChannel =function(callback){
        let channel = new BroadcastChannel(CHANNEL_ACCOUNTCHECKING_MONTHLYSTATEMENTLIST);
        channel.addEventListener("message", function (e) {
            callback && callback(e.data)
        });
        return channel
    }

    /**
     * 发送刷新结款单列表的消息
     * @param {*} data 
     */
    const postRefreshMonthlyStatementListMessage = function(data={}){
        Object.assign(data,{ refreshData: true })
        let channel = new BroadcastChannel(CHANNEL_ACCOUNTCHECKING_MONTHLYSTATEMENTLIST);
        channel.postMessage(data)
        setTimeout(() => {
            channel.close()
        }, 50)
    }

    return {
        //待办列表
        CHANNEL_PENDINGLIST,
        listenPendingListChannel,
        postRefreshPendingListMessage,
        //结款单列表
        CHANNEL_ACCOUNTCHECKING_SETTLEMENTLIST,
        listenSettlementListChannel,
        postRefreshSettlementListMessage,
        //月结账单列表
        CHANNEL_ACCOUNTCHECKING_MONTHLYSTATEMENTLIST,
        listenMonthlyStatementListChannel,
        postRefreshMonthlyStatementListMessage,
    }
}