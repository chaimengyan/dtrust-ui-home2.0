import request from '@/router/axios'

// 获取最近的工作流
// export function getInformFlowList() {
//     return request({
//         url: `/workflow/informFlow/getInformFlowList`,
//         method: 'get',
//     })
// }

// 查询政策条款列表（工作流专用）
export function getSimpleListForFlow(query) {
    return request({
        url: `/workflow/policyClause/simpleListForFlow`,
        method: 'get',
        params: query
    })
}

// 克隆告知流
export function cloneInformFlow(query) {
    return request({
        url: `/workflow/informFlow/cloneInformFlow`,
        method: 'post',
        params: query
    })
}

// 修改告知流
export function editInformFlow(query) {
    return request({
        url: `/workflow/policyClause/simple`,
        method: 'put',
        data: query
    })
}

// 克隆隐私政策
export function clonePolicyClause(query) {
    return request({
        url: `/workflow/policyClause/clonePolicyClause`,
        method: 'post',
        params: query
    })
}