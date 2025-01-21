import i18n from "@/lang"

// 工作流类型
export const flowTypeOptions = [
    {
        label: i18n.t('enum.合规驱动全工作流'),
        value: 0
    },
    {
        label: i18n.t('enum.IT资产评估'),
        value: 1
    },
    {
        label: i18n.t('enum.管理类综合评估'),
        value: 2
    },
    {
        label: i18n.t('enum.告知及权利响应工作流'),
        value: 3
    },
    {
        label: i18n.t('enum.业务活动评估'),
        value: 4
    },
]

// 工作流状态
export const workFlowStatusList = [
    {
        label: i18n.t('enum.进行中'),
        value: 0,
        color: 'rgb(32, 160, 255)'
    },
    {
        label: i18n.t('enum.已完成'),
        value: 1,
        color: 'rgb(19, 206, 102)'
    },
    {
        label: i18n.t('enum.未通过'),
        value: 2,
        color: 'rgb(255, 73, 73)'
    },
]

// 工作流步骤
export const stepsList = [
    {
        label: i18n.t('enum.启动工作流'),
        value: 0
    },
    {
        label: i18n.t('enum.指定业务活动'),
        value: 1
    },
    {
        label: i18n.t('enum.指定资产'),
        value: 2
    },
    {
        label: i18n.t('enum.启动评估'),
        value: 3
    },
    {
        label: i18n.t('enum.风险治理'),
        value: 4
    },
    {
        label: i18n.t('inform.告知管理'),
        value: 5
    },
    {
        label: i18n.t('enum.同意及主体权利接入'),
        value: 6    
    },
]

// 评估记录问卷状态
export const assessStatusList = {
    
  0: {
      type: '',
      label: i18n.t('enum.填写中'),
      value: 0
    },
  1: {
        type: 'info',
        label: i18n.t('enum.待审核'),
        value: 1
      },
  2: {
      type: 'warning',
      label: i18n.t('enum.审核中'),
      value: 2
      },
  3: {
      type: 'success',
      label: i18n.t('enum.通过'),
      value: 3
      },
  4: {
      type: 'danger',
      label: i18n.t('enum.拒绝'),
      value: 4
      },
  5: {
      type: '',
      label: i18n.t('enum.驳回中'),
      value: 5
      },
  6: {
      type: 'info',
      label: i18n.t('enum.已截止'),
      value: 6
  },
  7: {
      type: 'warning',
      label: i18n.t('enum.已填写'),
      value: 7
  },
}

export const stepsListKind = { 
        0: [{
              label: i18n.t('enum.启动工作流'),
              value: 0
            }, {
              label: i18n.t('enum.指定业务活动'),
              value: 1
            }, {
              label: i18n.t('enum.指定资产'),
              value: 2
            }, {
              label: i18n.t('enum.启动评估'),
              value: 3
            }, {
              label: i18n.t('enum.风险治理'),
              value: 4
            }, {
              label: i18n.t('inform.告知管理'),
              value: 5
            }, {
              label: i18n.t('enum.同意及主体权利接入'),
              value: 6    
          }],
        1: [{
              label: i18n.t('enum.启动工作流'),
              value: 0
            }, {
              label: i18n.t('enum.指定资产'),
              value: 2
            }, {
              label: i18n.t('enum.启动评估'),
              value: 3
            }, {
              label: i18n.t('enum.风险治理'),
              value: 4
          }],
        2: [{
              label: i18n.t('enum.启动工作流'),
              value: 0
            }, {
              label: i18n.t('enum.启动评估'),
              value: 3
            }, {
              label: i18n.t('enum.风险治理'),
              value: 4
          }],
        3: [{
              label: i18n.t('enum.启动工作流'),
              value: 0
            }, {
              label: i18n.t('enum.指定业务活动'),
              value: 1
            }, {
              label: i18n.t('enum.指定资产'),
              value: 2
            }, {
              label: i18n.t('inform.告知管理'),
              value: 5
            }, {
              label: i18n.t('enum.同意及主体权利接入'),
              value: 6    
          }],
        4: [{
              label: i18n.t('enum.启动工作流'),
              value: 0
            }, {
              label: i18n.t('enum.指定业务活动'),
              value: 1
            }, {
              label: i18n.t('enum.启动评估'),
              value: 3
            }, {
              label: i18n.t('enum.风险治理'),
              value: 4
          }],
      }

//工作流步骤配置
export const workFlowStepsOption = {
  0: [i18n.t('scene.业务活动'), i18n.t('assets.资产管理'), i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理'), i18n.t('inform.告知管理'), i18n.t('agree.同意管理和个人主体权利')],
  1: [i18n.t('assets.资产管理'), i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理')],
  2: [i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理')],
  3: [i18n.t('scene.业务活动'), i18n.t('assets.资产管理'), i18n.t('inform.告知管理'), i18n.t('agree.同意管理和个人主体权利')],
  4: [i18n.t('scene.业务活动'), i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理')]
};