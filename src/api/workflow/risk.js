import request from '@/router/axios'

// 获取全部答案
export function getResultsByEvaluationId(eId) {
    return request({
        url: `/assessment/result/getResultsByEvaluationId?eId=${eId}`,
        method: 'get',
    })
}

// 风险等级
export function getLevelAndPoint() {
    return request({
        url: `/assessment/level/getLevelAndPoint`,
        method: 'get',
    })
}


// 根据id查询评估记录信息
export function getEvaluationById (id) {
    return request({
      url: `/assessment/evaluation/${id}`,
      method: 'get',
    })
  }