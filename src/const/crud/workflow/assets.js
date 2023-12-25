
import iconList from "@/const/iconList";
export const tableOption = (_this, tenantId) => {

const APIurl = '/assets/assetsDict/findByDictType?dictType='

  return {
    detail: true,
    labelWidth: 120,
    emptyBtn: false,
    submitBtn: false,
    column: [{
      fixed: true,
      label: '资产id',
      prop: 'projectId',
      span: 24,
      hide: true,
      noView: true,
      editDisplay: false,
      addDisplay: false,
      display: false,
    },  {
      label: _this.$t('assets.资产名称'),
      prop: 'projectName',
      search: true,
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('assets.资产名称')}`,
        trigger: 'blur'
      }],
      
    },
    {
      label: _this.$t('crudCommon.图标'),
      prop: 'projectIcon',
      type: 'icon',
      span: 24,
      iconList: iconList,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.图标')}`,
        trigger: 'change'
      }]
    }, {
      label: _this.$t('crudCommon.颜色'),
      prop: 'projectColor',
      type: 'color',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
        trigger: 'change'
      }],
    },
     {
      label: _this.$t('assets.所属机构'),
      prop: 'managingOrganization',
      span: 24,
      props:{
        label:'name',
        value:'id'
      },
      type:'tree',
      dicUrl: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('assets.所属机构')}`,
        trigger: 'change'
      }],
      
    },
    // {
    //   label: '经纬度',
    //   prop: 'LongitudeAndLatitude',
    //   span: 24,
    //   formslot: true,
    //   hide: true,
    // },
    {
      label: _this.$t('assets.托管位置'),
      prop: 'hostingLocation',
      span: 24,
      formslot: true,
      // disabled: true,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('assets.托管位置')}`,
        trigger: 'change'
      }],
      
    },{
      label: _this.$t('assets.经度'),
      prop: 'lng',
      span: 24,
      disabled: true,
      display: false,
      hide: true,

      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('assets.经度')}`,
        trigger: 'change'
      }]
    },{
      label: _this.$t('assets.纬度'),
      prop: 'lat',
      span: 24,
      disabled: true,
      display: false,
      hide: true,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('assets.纬度')}`,
        trigger: 'change'
      }]
    },{
      label: _this.$t('assets.类型'),
      prop: 'type',
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}asset_type`,
      
    },{
      label: _this.$t('assets.内部或第三方'),
      prop: 'internalOr3rdParty',
      width: 100,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}internal_or3rd_party`,
      
    }, 
    // {
    //   label: _this.$t('assets.储存格式'),
    //   prop: 'storageFormat',
    //   span: 24,
    //   props:{
    //     label:'dictLabel',
    //     value:'dictValue',
    //   },
    //   type: 'select',
    //   filterable: true,
    //   dicUrl: `${APIurl}storage_format`,
      
    // }, {
    //   label: _this.$t('assets.托管类型'),
    //   prop: 'hostingType',
    //   span: 24,
    //   props:{
    //     label:'dictLabel',
    //     value:'dictValue',
    //   },
    //   type: 'select',
    //   filterable: true,
    //   dicUrl: `${APIurl}hosting_type`,
      
    // }, 
    {
      label: _this.$t('assets.托管方'),
      prop: 'hostingProvider',
      span: 24,
    }, {
      label: _this.$t('assets.技术安全措施'),
      prop: 'technicalSecurityMeasures',
      width: 100,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}technical_security_measures`,
      
    }, {
      label: _this.$t('assets.组织安全措施'),
      prop: 'organizationalSecurityMeasures',
      width: 100,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      multiple:true,
      filterable: true,
      dicUrl: `${APIurl}organizational_security_measures`,
      
    }, {
      label: _this.$t('assets.数据主体数量'),
      prop: 'volumeOfDataSubjects',
      width: 100,
      type: 'number',
      span: 24,
      editDisplay: false,
      addDisplay: false
    }, {
      label: _this.$t('assets.数据丢弃方式'),
      prop: 'dataDisposal',
      width: 100,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}data_disposal`,
      
    }, {
      label: _this.$t('assets.设置为主资产'),
      prop: 'etUpAsMaster',
      width: 100,
      span: 24,
    }, {
      label: _this.$t('crudCommon.创建人'),
      prop: 'createBy',
      span: 24,
      editDisplay: false,
      addDisplay: false,
      display: false,
    },
    {
      width: 120,
      label: _this.$t('crudCommon.创建时间'),
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      editDisabled: false,
      editDisplay: false,
      addDisplay: false,
      display: false,
      span: 24
    }, {
      label: _this.$t('crudCommon.修改人'),
      prop: 'updateBy',
      span: 24,
      editDisplay: false,
      addDisplay: false,
      display: false,
    },
    {
      width: 120,
      label: _this.$t('crudCommon.修改时间'),
      prop: 'updateTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      editDisabled: false,
      editDisplay: false,
      addDisplay: false,
      display: false,
      span: 24
    }]
  }
}

