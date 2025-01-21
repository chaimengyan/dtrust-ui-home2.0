import request from '@/router/axios'

export function getMenu(id) {
  return request({
    url: '/admin/menu',
    params: {
      parentId: -1,
      },
    method: 'get'
  })
}

export function getTenantById(id) {
  return request({
    url: '/admin/tenant',
    method: 'get',
    params: id
  })
}


export function checkAuthority(params) {
  return request({
    url: `/admin/user/checkAuthority?userId=${params.userId}&deptId=${params.deptId}`,
    method: 'get',
  })
}

// 分页查询通知
export function getNoticePage(params) {
  return request({
    url: `/admin/notice/page`,
    method: 'get',
    params
  })
}
// 批量已读
export function readNotice(ids) {
  return request({
    url: `/admin/notice/read?ids=${ids}`,
    method: 'put',
  })
}
// 根据id删除通知
export function delNotice(id) {
  return request({
    url: `/admin/notice/${id}`,
    method: 'delete',
  })
}

// 导出使用手册
export function exportUserManual(params) {
  return request({
      url: `/admin/instructionManual/export`,
      method: 'get',
      params,
      responseType: 'blob'
  });
}

// 修改系统语言AR,EN,ES,FR,JA,KO,PT,RU,ZH_CN,ZH_TW
export function changeLanguage(language) {
  return request({
    url: `/admin/user/language/${language}`,
    method: 'put',
  })
}