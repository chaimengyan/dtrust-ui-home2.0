import {getStore, setStore} from '@/util/store'
import {isURL, validatenull} from '@/util/validate'
import {getUserInfo, getUserLogo, loginByUsername, logout, refreshToken, LoginByPhone} from '@/api/login'
import {deepClone, encryption, getFileFromUrl} from '@/util/util'
import webiste from '@/const/website'
import {getMenu} from '@/api/admin/menu'
import CookieUtil from '@/util/cookie'
import {loginByDingDing} from '@/api/login'

function addPath(ele, first) {
    const menu = webiste.menu
    const propsConfig = menu.props
    const propsDefault = {
        label: propsConfig.label || 'name',
        enName: propsConfig.enName || 'enName',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    }
    const icon = ele[propsDefault.icon]
    ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
    if (!isChild) ele[propsDefault.children] = []
    if (!isChild && first && !isURL(ele[propsDefault.path])) {
        ele[propsDefault.path] = ele[propsDefault.path] + '/index'
    } else {
        ele[propsDefault.children].forEach(child => {
            addPath(child)
        })
    }
}

const user = {
    state: {
        userInfo: {},
        permissions: {},
        infoRest: {},
        roles: [],
        menu: getStore({
            name: 'menu'
        }) || [],
        menuAll: [],
        access_token: CookieUtil.get('access_token') || '',
        refresh_token: CookieUtil.get('refresh_token') || '',
    },

    actions: {
        // 根据用户名登录
        LoginByUsername({ commit }, userInfo) {
            const user = encryption({
                data: userInfo,
                key: 'thanks,datatrust',
                param: ['password']
            })
            return new Promise((resolve, reject) => {
                loginByUsername(user.username, user.password, user.code, user.randomStr).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 手机号验证码登录
        LoginByPhone({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                LoginByPhone(userInfo).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 钉钉扫码登录
        loginByDingDing(authCode) {
            return new Promise((resolve, reject) => {
                loginByDingDing(authCode).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data)
                    // commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        GetUserInfo({commit}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    const data = res.data.data || {}
                    const {sysUser, roles, permissions, ...rest} = data
                    commit('SET_USER_INFO', data.sysUser)
                    commit('SET_ROLES', roles || [])
                    commit('SET_PERMISSIONS', permissions || [])
                    commit('SET_INFO_REST', rest)
                    resolve(data)
                }).catch((err) => {
                    reject()
                })
            })
        },

        GetUserLogo({commit, state}) {
            getUserLogo().then((res) => {
                const {data} = res.data
                if (!data) return commit('SET_USER_INFO', {...state.userInfo, logo: null})
                getFileFromUrl(data, 'logo').then((response)=>{
                    commit('SET_USER_INFO', {...state.userInfo, logo: URL.createObjectURL(response)})
                    })
                    .catch((e)=>{
                        console.error(e)
                    });
            })
        },

        // 刷新token
        RefreshToken({commit, state}) {
            return new Promise((resolve, reject) => {
                refreshToken(state.refresh_token).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_MENU', [])
                    commit('SET_PERMISSIONS', [])
                    commit('SET_INFO_REST', {})
                    commit('SET_USER_INFO', {})
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_REFRESH_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG')
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 注销session
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_MENU', [])
                commit('SET_PERMISSIONS', [])
                commit('SET_INFO_REST', {})
                commit('SET_USER_INFO', {})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                resolve()
            })
        },
        // 获取系统菜单
        GetMenu({commit}, obj) {
            return new Promise(resolve => {
                getMenu(obj.id).then((res) => {
                    const data = res.data.data || []
                    let menu = deepClone(data)
                    menu.forEach(ele => {
                        addPath(ele)
                    })
                    let type = obj.type
                    commit('SET_MENU', {type, menu})
                    resolve(menu)
                })
            })
        }

    },
    mutations: {
        SET_ACCESS_TOKEN: (state, access_token) => {
            state.access_token = access_token
            CookieUtil.set('access_token', state.access_token)
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            CookieUtil.set('refresh_token', state.access_token)
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
        },
        SET_MENU: (state, params = {}) => {
            let {menu, type} = params;
            if (type !== false) state.menu = menu
            setStore({
                name: 'menu',
                content: menu,
                type: 'session'
            })
        },
        SET_MENU_ALL: (state, menuAll) => {
            state.menuAll = menuAll
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i]] = true
            }
            state.permissions = list
        },
        SET_INFO_REST: (state, infoRest) => {
            state.infoRest = infoRest
        }
    }



}
export default user
