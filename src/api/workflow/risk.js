import request from '@/router/axios'

// 获取全部答案
export function getResult(infoId) {
    return request({
        url: `/assessment/result/getResult?infoId=${infoId}`,
        method: 'get',
    })
}

// 风险等级
export function getAllAssessScore(tenantId) {
    return request({
        url: `/assessment/level/getAllAssessScore?tenantId=${tenantId}`,
        method: 'get',
    })
}


// 根据id查询评估记录信息
export function getAssessInfoById (id) {
    return request({
      url: `/assessment/info/getAssessInfoById?id=${id}`,
      method: 'get',
    })
  }