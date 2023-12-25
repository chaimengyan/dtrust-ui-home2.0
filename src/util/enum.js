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
        label: i18n.t('enum.业务场景评估'),
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
        label: i18n.t('enum.指定业务场景'),
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
    1: {
        color: '#d9ecff',
        label: i18n.t('enum.填写中'),
        },
    2: {
        color: '#faecd8',
        label: i18n.t('enum.审核中'),
        },
    3: {
        color: '#e1f3d8',
        label: i18n.t('enum.通过'),
        },
    4: {
        color: '#fde2e2',
        label: i18n.t('enum.拒绝'),
        },
    5: {
        color: '#fde2e2',
        label: i18n.t('enum.已驳回'),
        },
    }

export const stepsListKind = { 
        0: [{
              label: i18n.t('enum.启动工作流'),
              value: 0
            }, {
              label: i18n.t('enum.指定业务场景'),
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
              label: i18n.t('enum.指定业务场景'),
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
              label: i18n.t('enum.指定业务场景'),
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
  0: [i18n.t('scene.业务场景'), i18n.t('assets.资产管理'), i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理'), i18n.t('inform.告知管理'), i18n.t('agree.同意管理和个人主体权利')],
  1: [i18n.t('assets.资产管理'), i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理')],
  2: [i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理')],
  3: [i18n.t('scene.业务场景'), i18n.t('assets.资产管理'), i18n.t('inform.告知管理'), i18n.t('agree.同意管理和个人主体权利')],
  4: [i18n.t('scene.业务场景'), i18n.t('assessment.评估模板'), i18n.t('risk.风险分析处理')]
};