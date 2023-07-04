import { defineStore } from "pinia";
export const commonInfo = defineStore("commonInfoId", {
    state: () => {
        return {
            aocai_token:null,
        }
    },
    getters: {
        getToken:(state) =>{
           return this.aocai_token
        }
    },
    actions: {
        setToken(val) {
            console.log('存放token值：---',val)
            this.aocai_token = val
        }
    },
});
