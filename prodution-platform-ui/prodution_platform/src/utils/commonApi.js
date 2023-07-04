
//  本文件是公共调用服务处理的api
import api from "@/api";
import { ElMessage } from "element-plus";
import router from "@/router";
import appStore from "@/stores/index.js";
const tokenName = 'yun_aocai_token'
const userInfoName = 'yun_aocai_userInfo'
const saveValue = [{ name: 'automaticValue', value: null }, { name: 'aocai_system_theme_colors', value: null }] //需要保持不允许删除的值
//1.0 登录模块和个人中心模块是必须模块
//common--登录模块
//userCenter 个人中心模块
//systemAdministrator --系统管理员
//financial--财务视图--计价标准模块
//industrialParkManage --产业园管理模块
//processor --加工商管理模块
//unitChargeRule--采购视图--计费规则配置
//accountChecking --对账大模块
const viewModuleObj = {
    gly: ['systemAdministrator', 'common', 'userCenter'],
    cg: ['accountChecking', 'processor', 'unitChargeRule', 'common', 'userCenter'],
    cw: ['accountChecking', 'financial', 'unitChargeRule', 'common', 'userCenter'],
    boss: ['industrialParkManage', 'common', 'userCenter'],
}
//gly---系统管理员视图;cg---采购视图;cw---财务视图;boss---BOSS视图
// 采购专员id:19
// 采购经理id:20
// 产业园财务isIndustrFinance：true
// 总部财务id:17
// 生产管理副总id:14
// 系统管理员:24--无菜单路由配置页面的权限
//开发者：534--属于系统管理员角色，但是拥有路由菜单页面权限
const permissionObject = {
    cg: {//采购视图--采购专员id:19；采购经理id:20
        // 19: [{ url: '单价计费规则列表', func: '查看/编辑/提交审核/新增版本' }, { url: '加工商列表', func: '查看/编辑/新增' }],
        // 20: [{ url: '单价计费规则列表', func: '查看' }, { url: '加工商列表', func: '查看/编辑/新增' }, { url: '单价计费规则审核', func: '查看/审核' }], 
        19: ['/viewWork','/pendingList', "/accountChecking/editRecordTable", "/accountChecking/abnormalProcessFee", '/user/userCenterSettings', '/unitChargeRule/unitChargeRuleListCG', '/unitChargeRule/unitChargeRuleCGDetail', '/unitChargeRule/unitChargeRuleAuditCGJLDetail', '/processor/processorList', '/unitChargeRule/historyVersionList', '/processorModule/addProcessor'],
        20: ['/viewWork','/pendingList', "/accountChecking/editRecordTable", "/accountChecking/abnormalProcessFee", '/user/userCenterSettings', '/unitChargeRule/unitChargeRuleListCW', '/processor/processorList', '/processorModule/addProcessor', '/unitChargeRule/unitChargeRuleListAuditCGJL', '/unitChargeRule/unitChargeRuleCWDetail', '/unitChargeRule/unitChargeRuleAuditCGJLDetail', '/unitChargeRule/historyVersionList'],
    },
    cw: {//财务视图-- 分为采购总部财务和产业财务 总部财务id:17，产业园财务（由于产业园是变化的，所以自定义一个数，比如说isIndustrFinance）
        // 17: [{ url: '单价计费规则列表', func: '查看' }, { url: '计价公式列表', func: '' }],
        // isIndustrFinance: [{ url: '加工商公式配置', func: '关联加工商' }, { url: '单价计费规则列表', func: '查看' }, { url: '单价计费规则审核', func: '查看/审核' }],
        17: ['/viewWork','/pendingList', "/accountChecking/editRecordTable",'/user/userCenterSettings', '/unitChargeRule/unitChargeRuleListCW', '/unitChargeRule/unitChargeRuleCWDetail', '/unitChargeRule/unitChargeRuleAuditCWDetail', '/unitChargeRule/unitChargeRuleCWDetail', '/financial/priceFormulaList', '/unitChargeRule/historyVersionList', '/accountChecking/monthlyStatementDetail','/accountChecking/settlementList','/accountChecking/settlementDetail','/accountChecking/settlement/chargingRules'],
        isIndustrFinance: ['/viewWork','/pendingList', "/accountChecking/editRecordTable", '/accountChecking/monthlyStatementList', '/user/userCenterSettings', '/financial/formulaConfiguration', '/unitChargeRule/unitChargeRuleListCW', '/unitChargeRule/unitChargeRuleListAuditCWB', '/unitChargeRule/unitChargeRuleCWDetail', '/unitChargeRule/unitChargeRuleAuditCWDetail','/unitChargeRule/historyVersionList', '/accountChecking/monthlyStatementDetail','/accountChecking/settlementList','/accountChecking/settlementDetail','/accountChecking/settlement/chargingRules'],
    },
    boss: {//boss视图，其中生产管理副总属于boss视图，id=14
        14: ['/viewWork','/pendingList', '/user/userCenterSettings', '/industrialParkManage/industrialParkList', '/industrialParkManage/industrialParkAdd', '/industrialParkManage/industrialParkEdit']
    },
    gly: {//系统管理员视图--系统管理员:24
        24: ['/viewWork','/pendingList', '/user/userCenterSettings', '/admin/userManage', '/admin/userDetail', '/admin/addNewUser'],//不允许查看菜单页面
        534: ['/viewWork','/pendingList', '/user/userCenterSettings', '/admin/userManage', '/admin/roleManage', '/admin/userDetail', '/admin/addNewUser', '/admin/menuManage'],//可以查看菜单页面
    }
}

/**
 * 获取当前登录的模块信息
 */
export const setLoginModule = () => {
    const routerListModule = ['gly', 'cg', 'cw', 'boss']
    const location_href = window.location.href.split('/')
    let routerHint = null
    routerListModule.forEach(item => {
        location_href.forEach(val => {
            if (val == item) {
                routerHint = item
            }
        })
    }) 
    return routerHint
    /* const match = window.location.href.match(/\/([a-z]+)\//);
    console.log(match)
    debugger;
    return (match && match.length > 1) ? match[1] : null; */
}
/**
 * 退出功能
 */
export const userLoginOut = (flag = true) => {
    // 退出登录
    if (!flag) {
        router.push({ path: `/workbench` })
        setTimeout(() => {
            location.reload();
        }, 300);
        return
    }
    api.loginOut().then(res => {
        if (!res || res.code != '000000') return ElMessage.error(res.message || '退出登录失败，请重试！');
        saveValue.forEach(item => {
            item.value = localStorage.getItem(item.name)
        })
        // 清除本地缓存
        localStorage.clear();
        sessionStorage.clear();
        saveValue.forEach(item => {
            localStorage.setItem(item.name, item.value)
        })
        const routerHint = setLoginModule()
        console.log('routerHint--退出登录', routerHint)
        routerHint ? router.push({ path: `/${routerHint}/Login` }) : router.push({ path: `/` })
        setTimeout(() => {
            location.reload();
        }, 300);
    })





};

/**
 * 存储token值
 */
export const setToken = (data) => {
    const flag = localStorage.getItem("automaticValue") //判断用户是否勾选自动登录按钮
    if (appStore.useUserStore && appStore.useUserStore.setUserToken) appStore.useUserStore.setUserToken(data)
    flag == 1 ? localStorage.setItem(tokenName, data) : sessionStorage.setItem(tokenName, data)
};
/**
 * 获取token值
 */
export const getToken = () => {
    const flag = localStorage.getItem("automaticValue") //判断用户是否勾选自动登录按钮
    const tokenValue = flag == 1 ? localStorage.getItem(tokenName) : sessionStorage.getItem(tokenName)
    return tokenValue || null
};

/**
 * 存储个人信息的值
 */
export const setUserInfo = (data) => {
    if (appStore.useUserStore && appStore.useUserStore.setUserInfo) appStore.useUserStore.setUserInfo(data)
    localStorage.setItem(userInfoName, JSON.stringify(data));
};
/**
 * 获取个人信息的值
 */
export const getUserInfo = () => {
    const userInfoData = localStorage.getItem(userInfoName);
    return userInfoData ? JSON.parse(userInfoData) : {}
};

/**
 * 判断当前视图下面，该用户是否有权限使用
 * @param {*} userInfoList 用户的权限数组
 * @param {*} ccycw 产业园财务权限
 * @param {*} viewNames 视图名称
 * @returns 
 */
export const setAuthorityJudgment = (userInfoList, ccycw) => {
    if (!userInfoList) {
        const { userRoleList, isIndustrFinance } = getUserInfo()
        userInfoList = userRoleList
        ccycw = isIndustrFinance
    }
    const type = setLoginModule()
    if (!type) return false
    if (!userInfoList || userInfoList.length == 0) return false
    if (!permissionObject[type]) return false
    const list = permissionObject[type]
    let routerList = [] //存放当前用户允许访问的路由集合
    let flagNum = 0
    userInfoList.forEach(item => {
        if (item.roleId == 19 || item.roleId == 20) flagNum += 1
        for (let key in list) {
            if (key == item.roleId) routerList.push(...list[key])
        }
    })
    if (type == 'cw' && ccycw) {//如果是财务视图，并且有产业园财务权限，将产业园财务路由加上去
        routerList.push(...permissionObject.cw.isIndustrFinance)
    }
    if (type == 'cg') {
        //因为采购经理的计价规则页面是和财务页面一致的，如果当前用户的采购视图既有采购专员又有采购经理功能，需要将采购经理配置的计价规则菜单去掉
        //'/unitChargeRule/unitChargeRuleListCW'
        //'/unitChargeRule/unitChargeRuleCWDetail'
        if (flagNum > 1 && routerList.length > 0) {
            const arr = routerList.filter(item => {
                if (item != '/unitChargeRule/unitChargeRuleListCW' && item != '/unitChargeRule/unitChargeRuleCWDetail') return item
            })
            return arr && arr.length > 0 ? arr : false
        }
    }
    return routerList && routerList.length > 0 ? routerList : false
}


let menuList = []
/**
 * 设置当前用户允许使用的路由菜单列表
 * flag:--是否需要返回值，默认不需要返回值
 */
export const setMenuList = (flag) => {
    const urlList = router.options.routes
    const routerHint = setLoginModule()
    console.log('routerHint----', routerHint)
    if (!routerHint) {
        menuList = urlList.filter(item => {
            if (item.meta.isMenu) return item
        })
        return menuList
    }
    let whitPathList = [...viewModuleObj[routerHint]]
    /* //fix【ID1005894】总部财务目前看不到月结账单列表，菜单这应不显示生产加工对账该模块 
    const { userRoleList, isIndustrFinance } = getUserInfo()
    let isHOOfficer = false
    if(!isIndustrFinance){
        userRoleList.forEach(item => {
            if (item.roleId == 17) isHOOfficer = true
        })
    }
    if(isHOOfficer){
        console.info("fix【ID1005894】总部财务目前看不到月结账单列表，菜单这应不显示生产加工对账该模块")
        let index = whitPathList.indexOf('accountChecking')
        if(index>-1)  whitPathList.splice(index,1)
    }
    //fix-end */

    console.log('路由白名单:', whitPathList)
    menuList = urlList.filter(item => {
        if (whitPathList.includes(item.meta.viewModule) && item.meta.isMenu) return item
    })
    const urlOptions = setAuthorityJudgment()
    if (urlOptions && urlOptions.length > 0) {
        menuList.forEach(item => {
            const { children } = item
            const newChildren = []
            if (children && children.length) {
                children.forEach(val => {
                    if (urlOptions.includes(val.path)) newChildren.push(val)
                })
            }
            item.children = newChildren
        })
    }
    if (flag) return menuList
}
/**
 * 分配当前角色可以使用的路由菜单列表
 */
export const getMenuList = () => {
    if (menuList && menuList.length > 0) return menuList
    return setMenuList(true)
}

/**
 * 判断当前角色此次访问的菜单是否有权限访问--返回true表示允许访问当前菜单，false就表示没有权限访问
 */
export const permissionsMenuFlag = (toUrl) => {
    if (!setAuthorityJudgment()) return false
    const urlList = setAuthorityJudgment() // router.options.routes
    const routerHint = setLoginModule()
    if (!routerHint) return false
    const flag = urlList.some(val => {
        return val == toUrl
    })
    return flag
}

/**
 * 设置系统主题颜色
 * @param {*} color --如果有入参进入，将主题颜色更改为入参颜色，并且保存下来，客户下次进入使用保存下来的颜色；
 *                    如果没有入参传入，判断是否有保存过主题色，有的话使用保存的主题色，没有就使用默认主题色
 */
export const setSystemColors = (color) => {
    const saveColors = localStorage.getItem('aocai_system_theme_colors')
    if (color && color != 'null') localStorage.setItem('aocai_system_theme_colors', color);
    if ((color && color != 'null') || (saveColors && saveColors != 'null')) document.documentElement.style.setProperty(
        "--default-main-color",
        color || saveColors,
        "important"
    )
    return color || saveColors
}

/**
 * 将数组中满足条件的数据进行合并
 * @param {*} data 需要合并比较的数据
 * @param {*} keyArr 合并的条件，是一个数组，里面是比较的字段，两条数据之间比较的全部条件相等，表示当前两条数据需要合并
 */
export const getMergeItem = (data, keyArr) => {
    const spanArr = [];
    var pos = 0;
    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            spanArr.push(1);
            pos = 0;
        } else {// 判断当前元素与上一个元素是否相同
            const flag = keyArr.some((e) => {
                return data[i][e] != data[i - 1][e]
            })
            flag ? pos = i : spanArr[pos] += 1
            spanArr.push(flag ? 1 : 0);
        }
    }
    return spanArr
}

/**
 * 新开一个页面
 */
export const openNewPage = (url,isHome) => {
    if (url && url.length > 0 && url[0] !== '/') {
        url = '/' + url
    }
    url = appendUrlTimeStamp(url)
    const moduleName =isHome? '': '/'+ setLoginModule()
    window.open(`${moduleName + url}`, '_blank')
}

/**
 * 为url添加时间戳参数
 * @param {*} url 
 * @returns 
 */
export function appendUrlTimeStamp(url){
    if(!url) return url;
    if(url.indexOf('?')==-1){
        url += '?'
    }
    url = url.replace(/_t=.*/,'')
    if(url.indexOf('_t=')==-1){
        url += '&_t='+(new Date().getTime())
    }
    return url
}


/**
 * 判断用户点击的模块是否有权限访问--在已经登录的情况下判断
 */
export const getViemManagement = (viewNames) => {
    if (!viewNames) return false
    const { userRoleList, isIndustrFinance } = getUserInfo()

    const ccycw = isIndustrFinance
    if (!userRoleList || userRoleList.length == 0) return false
    const list = permissionObject[viewNames]
    if (!list) return false
    let routerList = [] //存放当前用户允许访问的路由集合
    let flagNum = 0
    userRoleList.forEach(item => {
        if (item.roleId == 19 || item.roleId == 20) flagNum += 1
        for (let key in list) {
            if (key == item.roleId) routerList.push(...list[key])
        }
    })
    if (viewNames == 'cw' && ccycw) {//如果是财务视图，并且有产业园财务权限，将产业园财务路由加上去
        routerList.push(...permissionObject.cw.isIndustrFinance)
    }
    if (viewNames == 'cg') {
        //因为采购经理的计价规则页面是和财务页面一致的，如果当前用户的采购视图既有采购专员又有采购经理功能，需要将采购经理配置的计价规则菜单去掉
        //'/unitChargeRule/unitChargeRuleListCW'
        //'/unitChargeRule/unitChargeRuleCWDetail'
        if (flagNum > 1 && routerList.length > 0) {
            const arr = routerList.filter(item => {
                if (item != '/unitChargeRule/unitChargeRuleListCW' && item != '/unitChargeRule/unitChargeRuleCWDetail') return item
            })
            return arr && arr.length > 0 ? arr : false
        }
    }
    return routerList && routerList.length > 0 ? routerList : false
}







