
import request from '@/router/axios'

// 获取最近的工作流
export function getLastWorkFlow() {
    return request({
        url: `/workflow/workflow/getLastWorkFlow`,
        method: 'get',
    })
}

// 查询所有工作流
export function getWorkFlowList(query) {//?businessScenarioId&assetsId&keyword
    return request({
        url: `/workflow/workflow/getWorkFlowList`,
        method: 'get',
        params: query
    })
}

// 根据id查询工作流信息
export function getWorkFlowById(flowId) {
    return request({
        url: `/workflow/workflow/getWorkFlowById?flowId=${flowId}`,
        method: 'get',
    })
}

// 进行工作流
export function checkWorkFlowSteps (obj) {
    return request({
        url: '/workflow/workflow/checkWorkFlowSteps',
        method: 'put',
        data: obj
    })
}