export default {
  year: "2022", // 首页显示的时间
  version: "v1.0.0", // 控制首页显示的版本号
  logo: "iDataTrust",   // 侧边栏搜索的时候顶部展示的文案
  key: "iDataTrust", //配置主键,目前用于存储
  title: "全生命周期数据合规管理系统",
  titleEn: "iDataTrust Data Compliance Management System",
  whiteList: ["/login", "/404", "/401", "/lock"], // 配置无权限可以访问的页面
  whiteTagList: ["/login", "/404", "/401", "/lock"], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  lockPage: "/lock",
  tokenTime: 6000,
  statusWhiteList: [428],
  // 配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    props: {
      label: "label",
      enName: "enName",
      path: "path",
      icon: "icon",
      children: "children"
    }
  }
};