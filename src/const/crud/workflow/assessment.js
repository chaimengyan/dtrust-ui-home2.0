
export const tableOption = (_this, tenantId) => {
  return {
    detail: true,
    labelWidth: 100,
    emptyBtn: false,
    submitBtn: false,
    column: [ {
      label: _this.$t('assessment.评估名称'),
      prop: 'assessName',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('assessment.评估名称')}`,
        trigger: 'blur'
      }]
    },
    {
      label: _this.$t('assessment.被评估人'),
      prop: 'conductor',
      span: 24,
      type: 'select',
      allowCreate: true,
      filterable: true,
      // multiple: true,
      dicUrl: '/admin/user/getList',
      props: {
          label: 'username',
          value: 'userId',
          desc:'mail'
      },
      rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('assessment.被评估人')}`,
          trigger: 'change'
      }]
  },
    {
      label: _this.$t('assessment.审核人'),
      prop: 'auditors',
      type: 'select',
      multiple: true,
      dicUrl: '/admin/user/getList',
      props: {
          label: 'nickName',
          value: 'userId',
      },
      rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('assessment.审核人')}`,
          trigger: 'change'
      }],
      span: 24,
  },
  {
    label: _this.$t('assessment.截止时间'),
    prop: "endTime",
    type: "datetime",
    span: 24,
    format: 'yyyy-MM-dd HH:mm:ss',
    valueFormat:'yyyy-MM-dd HH:mm:ss',
    mock:{
        type:'datetime',
        format:'yyyy-MM-dd HH:mm:ss',
        now:true,
    },
    rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('assessment.截止时间')}`,
        trigger: 'blur'
    }]
},
  ]
  }
}

import iconList from "@/const/iconList";
export const qnTableOption = (_this) => {
  return {
    detail: true,
    labelWidth: 100,
    emptyBtn: false,
    column: [ {
      label: _this.$t('assessment.问卷名称'),
      prop: 'qnName',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('assessment.问卷名称')}`,
        trigger: 'blur'
      }]
    },
    {
      label: _this.$t('assessment.问卷类型'),
      prop: 'categories',
      span: 24,
      slot: true,
    },
    {
      label: _this.$t('crudCommon.图标'),
      prop: 'icon',
      type: 'icon',
      iconList: iconList,
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.图标')}`,
        trigger: 'blur'
      }]
    }, {
      label: _this.$t('crudCommon.颜色'),
      prop: 'color',
      type: 'color',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
        trigger: 'blur'
      }]
    },
  ]
}
}

  