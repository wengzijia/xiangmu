import { ref,onMounted } from "vue";

/**
 * 动态变更表格高度
 * @param {*} id 
 * @returns 
 */
export function useTableHeight(id,height = 140,minHeight = 300){
    let setHeight = function(){
        let dom =  document.getElementById(id)
        if (dom) {
            let h = dom.clientHeight - height
            tableHeight.value = h > minHeight ? h : minHeight;
        }
    }
    var tableHeight = ref();
    onMounted(() => {
        // 设置表格高度
        setHeight()
        //写在mounted中,onresize事件会在页面大小被调整时触发,   注意！！！！！一个页面只能有一个onresize事件
        window.onresize = () => {
            return (() => {
                setHeight()
            })();
        };
    });
    return {tableHeight,setHeight};
}
