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

// 通过tableName查询table
export function getTableByName(tableName) {
    return request({
        url: `/assets/assetsTable/getTableByName?tableName=${tableName}`,
        method: 'get',
    })
}

// 通过tableName查询资产表格/表单配置
export function getAssetsFieldByTableName(tableName) {
    return request({
        url: `/assets/assetsField/getAssetsFieldByTableName?tableName=${tableName}`,
        method: 'get',
    })
}

// 根据租户id查询部门
export function getDeptTreeByTenantId (tenantId) {
    return request({
      url: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
      method: 'get',
    })
  }
