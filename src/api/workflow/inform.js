import request from '@/router/axios'

// 获取最近的工作流
export function getInformFlowList() {
    return request({
        url: `/workflow/informFlow/getInformFlowList`,
        method: 'get',
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
        url: `/workflow/informFlow`,
        method: 'put',
        data: query
    })
}