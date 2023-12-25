import iconList from "@/const/iconList";
import city from "@/const/json/city"
export const tableOption = (_this, tenantId) => {

const APIurl = '/assets/assetsDict/findByDictType?dictType='

  return {
    detail:true,
    labelWidth:200,
    emptyBtn: false,
    submitBtn: false,
    column: [ {
      label: _this.$t('scene.业务场景名称'),
      prop: 'sceneName',
      search: true,
      searchLabelWidth:100,
      width: 100,
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('scene.业务场景名称')}`,
        trigger: 'blur'
      }],
    }, {
      label: _this.$t('crudCommon.图标'),
      prop: 'sceneIcon',
      type: 'icon',
      iconList: iconList,
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.图标')}`,
        trigger: 'change'
      }]
    }, {
      label: _this.$t('crudCommon.描述'),
      prop: 'description',
      span: 24,
      
    }, {
      label: _this.$t('crudCommon.颜色'),
      prop: 'sceneColor',
      type: 'color',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
        trigger: 'change'
      }]
    },{
      label: _this.$t('assets.所属机构'),
      prop: 'managingOrganization',
      span: 24,
      props:{
        label:'name',
        value:'id'
      },
      type:'tree',
      filterable: true,
      dicUrl: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('assets.所属机构')}`,
        trigger: 'change'
      }],
      
    },
    // {
    //   label: '业务场景所有者',
    //   prop: 'businessProcessOwner',
    //   type: 'select',
    //   filterable: true,
    //   dicUrl: `/admin/user/getList`,
    //   width: 120,
    //   span: 12,
    //   props: {
    //     label:'nickName',
    //     value:'userId'
    //   },
    //   rules: [{
    //     required: true,
    //     message: '请选择业务场景所有者',
    //     trigger: 'blur'
    //   }],
    //   
    // },
    {
      label: _this.$t('assets.类型'),
      prop: 'type',
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}business_scenario_type`,
      
    },{
      label: _this.$t('scene.数据主体区域'),
      prop: 'dataSubjectsRegion',
      width: 100,
      span: 24,
      props:{
        label: 'name_cn',
        value: 'code',
        children: 'cities',
      },
      type: 'cascader',
      filterable: true,
      dicData: city,
      
    },
    // {
    //   label: '数据主体数量',
    //   prop: 'dataSubjectsVolume',
    //   width: 100,
    //   span: 24,
    //   editDisplay: false,
    //   addDisplay: false,
    // },
    {
      label: _this.$t('scene.数据处理目的'),
      prop: 'purposeOfProcessing',
      width: 100,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      allowCreate:true,
      multiple:true,
      filterable: true,
      dicUrl: `${APIurl}purpose_of_processing`,
      
    },
    // {
    //   label: '数据来源',
    //   prop: 'dataSource',
    //   span: 24,
    //   props:{
    //     label:'dictLabel',
    //     value:'dictValue',
    //   },
    //   type: 'select',
    //   filterable: true,
    //   dicUrl: `${APIurl}data_source`,
      
    // },
    {
      label: _this.$t('scene.传输方式'),
      prop: 'transferMethodFromSources',
      width: 150,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}transfer_method_from_sources`,
      
    },
    // {
    //   label: '目的地',
    //   prop: 'destinations',
    //   span: 24,
    //   props:{
    //     label:'dictLabel',
    //     value:'dictValue',
    //   },
    //   type: 'select',
    //   filterable: true,
    //   dicUrl: `${APIurl}business_destinations`,
      
    // },{
    //   label: '传输方式（至目的地）',
    //   prop: 'transferMethodToDestinations',
    //   width: 150,
    //   span: 24,
    //   props:{
    //     label:'dictLabel',
    //     value:'dictValue',
    //   },
    //   type: 'select',
    //   filterable: true,
    //   dicUrl: `${APIurl}transfer_method_to_destinations`,
      
    // },
     {
      label: _this.$t('scene.数据访问或使用方'),
      prop: 'partiesWhoAccessUseData',
      width: 150,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}parties_who_access_use_data`,
      
    },{
      label: _this.$t('scene.访问或使用方地址'),
      prop: 'locationsOfPartiesAccessUse',
      width: 150,
      span: 24,
      props:{
        label: 'name_cn',
        value: 'code',
        children: 'cities',
      },
      type: 'cascader',
      filterable: true,
      dicData: city,
      
    },{
      label: _this.$t('scene.数据保留'),
      prop: 'dataRetention',
      span: 24,
      
    },{
      label: _this.$t('scene.处理活动的法律基础'),
      prop: 'legalBasisForProcessing',
      width: 150,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}legal_asis_for_processing`,
      
    },{
      label: _this.$t('scene.跨境传输机制'),
      label: '跨境传输机制',
      prop: 'crossBorderTransferMechanism',
      width: 120,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}cross_border_transfer_mechanism`,
      
    },{
      label: _this.$t('scene.境外接收方'),
      prop: 'externalId',
      span: 24,
      
    }, {
      label: _this.$t('scene.涉及的国家或地区'),
      prop: 'countriesUtilizingProcess',
      width: 100,
      span: 24,
      props:{
        label: 'name_cn',
        value: 'code',
      },
      type: 'select',
      dicData: city,
      filterable: true,
      
    },
    //  {
    //   label: _this.$t('scene.是否出售居民的个人信息'),
    //   prop: 'saleOfPersonalInformationOfCaliforniaResidents',
    //   width: 180,
    //   span: 24,
      
    // }, {
    //   label: _this.$t('scene.是否出售未成年居民的个人信息'),
    //   prop: 'saleOfPersonalInformationOfMinorCaliforniaResidents',
    //   width: 220,
    //   span: 24,
      
    // }, {
    //   label: _this.$t('scene.居民个人信息销售接收人类别'),
    //   prop: 'categoriesOfRecipientsOfSaleOfPersonal',
    //   width: 250,
    //   span: 24,
      
    // },
     {
      label: _this.$t('scene.业务部门'),
      prop: 'businessFunction',
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}business_function`,
      
    },{
      label: _this.$t('scene.合法利益'),
      prop: 'legitimateInterest',
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}legitimate_interest`,
      
    }, {
      label: _this.$t('scene.数据处理的其他条件'),
      prop: 'scheduleConditionForProcessing',
      width: 150,
      span: 24,
      props:{
        label:'dictLabel',
        value:'dictValue',
      },
      type: 'select',
      filterable: true,
      dicUrl: `${APIurl}schedule_condition_for_processing`,
      
    }, {
      label: _this.$t('scene.设置为主业务场景'),
      prop: 'setUpAsMaster',
      width: 120,
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
      addDisplay: false,
      editDisplay: false,
      span: 12,
      display: false,
    }, {
      label: _this.$t('crudCommon.修改人'),
      prop: 'updateBy',
      span: 12,
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
      addDisplay: false,
      editDisplay: false,
      span: 12,
      display: false,
    }]
  }
}