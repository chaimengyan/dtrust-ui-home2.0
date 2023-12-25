import request from '@/router/axios'

// 分页查询工作流列表
export function getWorkFlowByPage(query) {
    return request({
        url: '/workflow/workflow/getWorkFlowByPage',
        method: 'get',
        params: query
    })
}

// 新增工作流
export function addObj (obj) {
    return request({
        url: '/workflow/workflow/createWorkFlow',
        method: 'post',
        data: obj
    })
}

// 编辑工作流
export function putObj (obj) {
    return request({
        url: '/workflow/workflow/updateWorkFlow',
        method: 'put',
        data: obj
    })
}

// 删除工作流
export function delObj(flowIds) {
    return request({
        url: `/workflow/workflow/deleteWorkFlowByFlowIds?flowIds=${flowIds}`,
        method: 'delete',
    })
}