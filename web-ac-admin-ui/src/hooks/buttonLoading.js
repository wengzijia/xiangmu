import { ref } from "vue";
//按钮loading，防止重复提交
export function useAutoLoading(){
    const loading = ref(false);
    function run(requestPromise){
        loading.value = true;
        return requestPromise.finally(() => {
            loading.value = false;
        });
    }
    return [loading, run];
}