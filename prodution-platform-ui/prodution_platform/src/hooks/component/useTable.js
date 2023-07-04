/**
 * 表格hook
 * 
 * 1. 自动调节表格高度

  // 使用方法 

   import {useTable} from '@/hooks/component/useTable'
   let { tableAutoHeight } = useTable({fixHeader:true})

  // 参数解释：
   useTable(options)
   options：{
    fixHeader：//是否是固定表头模式
    tableWrapperSelector：//table外框的选择器表达式
   }

 */

import { ref, onMounted, onUnmounted } from 'vue'
export function useTable(options) {
    let {
        fixHeader, //是否是固定表头模式
        tableWrapperSelector = '#tableWrap', //table外框的选择器表达式
    } = options || {}

    //自动调节表格高度
    let tableAutoHeight = ref(100)
    let heightAutoAdjust = () => {
        let el = document.querySelector(tableWrapperSelector)
        if (el) {
            tableAutoHeight.value = el.clientHeight
        } else {
            console.error("useTable windowResize，未找到选择器：" + tableWrapperSelector)
        }
    }

    onMounted(() => {
        if (fixHeader) {
            heightAutoAdjust()
            window.addEventListener("resize", heightAutoAdjust)
        }
    })

    onUnmounted(() => {
        if (fixHeader) window.removeEventListener("resize", heightAutoAdjust)
    })
    
    const heightAutoAdjustDelay = ({delay=300})=>{
        setTimeout(heightAutoAdjust,delay)
    }
    return { tableAutoHeight,heightAutoAdjustDelay }
}

/**
 * 自动处理排序条件
 * @param {*} sort  点击排序字段后 列表组件给出的事件数据
 * @param {*} searchData 界面搜索数据
 * @param {*} convertMap :某些排序字段并不是和显示字段名一致的，这里提供一个转换的对应的字段名字的map来修改
 */
export  function useTableSort({ order, prop },searchData,convertMap={}){
    if (order) {
        if(convertMap[prop]) prop = convertMap[prop]
        const params = {
            sortAsc: order? (order == 'ascending'):'',
            sortColumn: order ? prop.replace(/([A-Z])/g, "_$1").toLowerCase() : '' //驼峰转换下划线
        }
        searchData.value.sortAsc = params.sortAsc
        searchData.value.sortColumn = params.sortColumn
    } else {
        delete searchData.value.sortAsc
        delete searchData.value.sortColumn
    }
}