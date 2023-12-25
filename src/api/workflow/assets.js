import request from '@/router/axios'

// 根据id查询业务场景关联的资产
export function getProjectAttributesBySceneId(sceneId) {
    return request({
        url: `/assets/assetsSceneProjectAttributes/getProjectBySceneId/${sceneId}`,
        method: 'get',
    })
}

// 资产修改
export function updateAsset (obj) {
    return request({
        url: '/assets/assetsProject/update',
        method: 'put',
        data: obj
    })
}

// 查询所有的资产
export function getAllAssetsProject() {
    return request({
        url: `/assets/assetsProject/getAllAssetsProject`,
        method: 'get',
    })
}

// app检测
export function appUpload (obj) {
    return request({
        url: 'assets/assetsProject/appUpload',
        method: 'post',
        data: obj
    })
}