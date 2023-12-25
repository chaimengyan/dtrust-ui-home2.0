import iconList from "@/const/iconList";
export const tableOption = (_this) => {
  return {
    detail: true,
    labelWidth: 100,
    emptyBtn: false,
    submitBtn: false,
    column: [ {
      label: _this.$t('inform.告知流名称'),
      prop: 'informFlowName',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('inform.告知流名称')}`,
        trigger: 'blur'
      }]
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