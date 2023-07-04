import { ref,computed, } from "vue";
import useUserStore from "@/store/modules/user"

const user = useUserStore()
const roles = computed(()=>user.roles)
const userInfo = computed(()=>user.userInfo)
/**
 * 判断当前用户是否为包含某个角色身份(key)
 * @returns  [boolen , 用户id / '']
*/

export function useIsCrmSaleman(key){
    const disabled = ref(false);
    const userId = ref('')
    disabled.value = roles.value.some((item) => item == key)
    if (disabled.value) {
        userId.value = userInfo.value.userId
    }
    return [disabled, userId.value];
}

