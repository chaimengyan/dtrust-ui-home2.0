import request from '@/router/axios'

// 获取所有的问卷
export function getQuestionnaireList(query) {
    return request({
        url: `/assessment/questionnaire/getQuestionnaireList`,
        method: 'get',
        params: query
    })
}

// 启动评估
export function releaseAssessQuestionnaire (query) {
    return request({
        url: '/assessment/info/releaseAssessQuestionnaire',
        method: 'put',
        data: query
    })
}