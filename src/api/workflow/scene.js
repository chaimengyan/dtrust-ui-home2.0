import request from '@/router/axios'

// 获取全部业务场景
export function getAllAssetsBusinessScene() {
    return request({
        url: '/assets/assetsBusinessScene/getAllAssetsBusinessScene',
        method: 'get',
    })
}

// 业务场景修改
export function updateScene (obj) {
    return request({
        url: '/assets/assetsBusinessScene/update',
        method: 'put',
        data: obj
    })
}