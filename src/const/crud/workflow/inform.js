import iconList from "@/const/iconList";
export const tableOption = (_this) => {
  return {
    detail: true,
    labelWidth: 130,
    emptyBtn: false,
    submitBtn: false,
    column: [
      {
        label:  _this.$t('menu.数据主体类型'),
        prop: 'mainBodyId',
        type: 'select',
        filterable:true,
        dicUrl: `/assets/assetsAttributesMainBody/getMainBodList`,
        props: {
          label: 'mainBodyName',
          value: 'mainBodyId',
        },
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('menu.数据主体类型')}`,
          trigger: 'change'
        }],
      },
  ]
}
}


export const tableEditOption = (_this) => {
  return {
    detail: true,
    labelWidth: 130,
    emptyBtn: false,
    submitBtn: false,
    column: [
    {
      label: _this.$t('graphical.名称'),
      prop: 'simpleName',
      slot: true,
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('graphical.名称')}`,
        trigger: 'blur'
      }],
    }, {
      width: 140,
      label: _this.$t('crudCommon.描述'),
      prop: 'simpleDescribe',
      span: 24,
    },
    {
      label: _this.$t('crudCommon.颜色'),
      prop: 'color',
      type: 'color',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
        trigger: 'change'
      }],
    },
    {
      label: _this.$t('inform.应用类型'),
      prop: 'type',
      type: 'select',
      filterable:true,
      dicUrl: `/workflow/access/getAccessPointType`,
      span: 24,
      props: {
        label: 'value',
        value: 'value',
      },
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('inform.应用类型')}`,
        trigger: 'change'
      }],
      search: true,
    }, {
      width: 140,
      label: _this.$t('inform.告知类型'),
      prop: "flowType",
      span: 24,
      type: "radio",
      dicData: [
        {
          label: _this.$t('inform.一般'),
          value: 0
      }, {
          label: _this.$t('inform.单独'),
          value: 1
      }],
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('inform.告知类型')}`,
        trigger: 'change'
      }]
    },
    
  ]
  }
}