import { flowTypeOptions, workFlowStatusList, stepsList } from "@/util/enum";

export const tableOption = (_this, isOverHidden) => {
    return {
    labelWidth: 150,
    index: true,
    indexLabel: '#',
    stripe: true,
    menuAlign: 'center',
    searchMenuSpan: 6,
    editBtn: false,
    delBtn: false,
    viewBtn: false,
    align: 'center',
    addBtn: false,
    menuWidth:120,
    column: [ {
        label: _this.$t('workflow.工作流名称'),
        prop: 'workFlowName',
        span: 24,
        slot: true,
        rules: [{
            required: true,
            message: `${_this.$t('crudCommon.请输入')}${_this.$t('workflow.工作流名称')}`,
            trigger: 'blur'
        }],
        overHidden: isOverHidden,
    },
    {
        label: _this.$t('crudCommon.描述'),
        prop: 'overview',
        span: 24,
        overHidden: isOverHidden,
    },
    {
        label: _this.$t('assets.类型'),
        prop: 'flowType',
        type: 'select',
        search: true,
        dicData: flowTypeOptions,
        rules: [{
            required: true,
            message: `${_this.$t('crudCommon.请选择')}${_this.$t('assets.类型')}`,
            trigger: 'change'
        }],
        editDisabled: true,
        span: 24,
        overHidden: isOverHidden,
    },
    {
        label: _this.$t('userinfo.状态'),
        prop: 'status',
        dicData: workFlowStatusList,
        editDisplay: false,
        addDisplay: false,
        addDisabled: true,
        editDisabled: true,
        span: 24,
        overHidden: isOverHidden,
    },
    {
        label: _this.$t('graphical.当前步骤'),
        prop: 'steps',
        dicData: stepsList,
        editDisplay: false,
        addDisplay: false,
        addDisabled: true,
        editDisabled: true,
        span: 24,
        overHidden: isOverHidden,
    },
    {
        width: 150,
        label: _this.$t('crudCommon.创建人'),
        prop: 'createBy',
        editDisplay: false,
        addDisplay: false,
        addDisabled: true,
        editDisabled: true,
        span: 24,
        overHidden: isOverHidden,
    },
    {
        width: 150,
        label: _this.$t('crudCommon.创建时间'),
        prop: 'createTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        editDisplay: false,
        addDisplay: false,
        addDisabled: true,
        editDisabled: true,
        span: 24,
        overHidden: isOverHidden,
    },
    {
        width: 150,
        label: _this.$t('crudCommon.修改人'),
        prop: 'updateBy',
        editDisplay: false,
        addDisplay: false,
        addDisabled: true,
        editDisabled: true,
        span: 24,
        overHidden: isOverHidden,
    },
    {
        width: 150,
        label: _this.$t('crudCommon.修改时间'),
        prop: 'updateTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        editDisplay: false,
        addDisplay: false,
        addDisabled: true,
        editDisabled: true,
        span: 24,
        overHidden: isOverHidden,
    },
    {
        fixed: false,
        label: _this.$t('crudCommon.关键字'),
        order: 1,
        hide: true,
        prop: 'keyword',
        search: true,
        display: false,
        disabled: true
    },]
    
  }
}