<template>
  <div class="avue-top">
    <!-- <div class="top-bar__left">
      <div class="avue-breadcrumb"
           :class="[{ 'avue-breadcrumb--active': isCollapse }]"
           v-if="showCollapse">
        <i class="icon-navicon"
           @click="setCollapse"></i>
      </div>
    </div> -->
    <div class="top-bar__left">
      <!-- logo -->
      <a href="/" class="logo">
        <img v-if="userInfo.logo" :src="userInfo.logo" alt="logo">
        <img v-else src="@/images/logo.png" alt="logo">
      </a>

      <!-- 公司名 -->
      <!-- <div style="font-size: 24px;margin: 0 10px;">
          <template v-if="userInfo.logo">
              <img style="width: 110px; height: 50px;" :src="userInfo.logo" alt="">
          </template>
          <template v-else>
              数之信
          </template>
      </div> -->

    </div>
    
    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show"
           v-if="showMenu">
        <top-menu></top-menu>
      </div>
    </div>
    <div class="top-bar__right">

      <!-- 快捷应用 -->
      <div class="quick-list" v-for="item,index in quickList" :key="index">
        <template v-if="permissions[item.permissions]||item.permissions==='true'">
          <el-tooltip effect="dark" :content="item.label">
            <el-link style="font-size: 12px" target="_blank" :underline="false" :href="item.href">
              <el-button circle v-if="item.value === 3">
                <div class="PIPL">
                  PIPL
                </div>
              </el-button>
              <el-button circle v-else>
                <svg-icon :icon-class="item.icon" class="quick-list-icon"></svg-icon>
              </el-button>
            </el-link>
          </el-tooltip>
        </template>

      </div>

      <!-- <el-tooltip effect="dark" :content="$t('crudCommon.添加')">
        <el-button circle style="margin-right: 10px;">
          <svg-icon icon-class="icon-plus-bold" class="quick-list-icon"></svg-icon>
        </el-button>
      </el-tooltip> -->

      <el-divider direction="vertical"></el-divider>
      
      <MessageReminder />

      <el-divider direction="vertical"></el-divider>

      <el-tooltip effect="dark" :content="$t('exportTemplate.导出报告')">
        <el-button icon="el-icon-download" size="small" circle @click="openExportPDF" />
      </el-tooltip>

      <el-divider direction="vertical"></el-divider>

      <el-tooltip effect="dark" :content="$t('crudCommon.导出使用手册')">
        <el-button v-loading.fullscreen.lock="fullscreenLoading" icon="el-icon-document" size="small" circle @click="openUserManual" />
      </el-tooltip>

      <el-divider direction="vertical"></el-divider>

      <el-tooltip 
        effect="dark"
        :content="$t('navbar.中英文')"
        placement="bottom">
        <top-lang></top-lang>
      </el-tooltip>

      <el-divider direction="vertical"></el-divider>

      <el-menu class="el-menu-demo" menu-trigger="hover" mode="horizontal">
        <el-submenu index="-1">
          <template slot="title">
            <i class="icon-ty-xitongguanli" style="font-size: 16px"/>
          </template>
          <MenuSelect :menus="moduleList"/>
        </el-submenu>
      </el-menu>

      <el-divider direction="vertical"></el-divider>

      <!-- <el-tooltip v-if="showLock"
                  effect="dark"
                  content="锁屏"
                  placement="bottom">
      </el-tooltip> -->

      <!-- <el-tooltip v-if="showFullScren"
                  effect="dark"
                  :content="isFullScreen?'退出全屏':'全屏'"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScreen?'icon-zuixiaohua':'icon-quanpingzuidahua'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip> -->

      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.nickName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <template v-if="!(roles.includes(3)&&userInfo.tenantId===2)">
            <el-dropdown-item>
              <router-link to="/"><i class="el-icon-s-home"></i>{{$t('navbar.首页')}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/info/index"><i class="el-icon-user-solid"></i>{{$t('navbar.个人信息')}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="isShowAdimn">
              <el-link style="font-size: 12px" target="_blank" :underline="false" :href="adminUrl">
              <i class="el-icon-s-tools"></i>{{$t('navbar.访问控制')}}</el-link>
            </el-dropdown-item>
          </template>

          <el-dropdown-item 
            @click.native="logout"
            divided>
            <i class="el-icon-switch-button"></i>{{$t('navbar.退出系统')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-divider direction="vertical"></el-divider> -->
      <template v-if="isDeptsEmpty()">
        <el-divider direction="vertical"></el-divider>
        <el-menu 
          class="el-menu-demo"
          active-text-color="#409EFF" 
          background-color="#ffffff" 
          menu-trigger="hover" 
          mode="horizontal">
            <el-submenu index="-1">
                <template slot="title">
                    {{ deptName }}
                </template>
                <DeptsSelect  @selectDepts="selectDepts" :depts="infoRest.dataPermissionDepts"/>
            </el-submenu>
        </el-menu>
      </template>
      <el-drawer
        size="80%"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        :title="$t('exportTemplate.导出报告')"
        append-to-body
        :close-on-click-modal="true" 
        >
			  <ExportTemplate />
      </el-drawer>
    </div>
  </div>
</template>
<script>
  import {checkAuthority, exportUserManual} from "@/api/admin/menu"
  import {mapGetters, mapState} from "vuex";
  import {fullscreenToggel, listenfullscreen} from "@/util/util";
  import topMenu from "./top-menu";
  import MenuSelect from './menu-select.vue'
  import DeptsSelect from './depts-select.vue'
  import MessageReminder from './message-reminder.vue'
  import topLang from "./top-lang.vue";
  import { isEmpty } from 'lodash'
  import ExportTemplate from '@/views/exportTemplate/index'
  import { workFlowUrl, adminUrl, assetsUrl, estimateUrl, powerUrl } from '@/util/env'

  const locationUrl = `${window.location.protocol}//${window.location.hostname}:`
  
  export default {
    components: {
      topMenu,
      MenuSelect,
      DeptsSelect,
      MessageReminder,
      topLang,
      ExportTemplate

    },
    name: "top",
    data() {
      return {
        adminUrl,
        fullscreenLoading: false,
        deptName: '组织架构',
        moduleList: [],
        isShowAdimn: false,
        quickList: [],
        exportTemplateDialog: false,
        
      };
    },
    
    filters: {},
    created() {
      console.log(this.userInfo,this.roles, 'userInfouserInfo');
      this.$store.dispatch("GetMenu", { type: true, id: -1 }).then(data => {
        if (data.length === 0) return;
        if(data.find(x => x.path.slice(0, 6) === '/admin') !== undefined) {
          this.isShowAdimn = true
        }
        this.addModules(data)
      });
      this.quickList = [{
                label: 'DPIA',
                value: 0,
                permissions: 'assess_evaluation_start',
                icon: 'icon-dpia',
                href: `${estimateUrl}/#/assessment/questionnaireStart/index?typeIds=${25}`,
                // href: `http://116.205.172.167:38080/#/assessment/questionnaireStart/index?typeIds=${29}`,
            },
            {
                label: this.$t('navbar.出境风险评估'),
                value: 1,
                permissions: 'assess_evaluation_start',
                icon: 'icon-cjfxpg',
                href: `${estimateUrl}/#/assessment/questionnaireStart/index?typeIds=${26}`,
                // href: `http://116.205.172.167:38080/#/assessment/questionnaireStart/index?typeIds=${30}`,
            },
            {
                label: this.$t('navbar.PIPL'),
                value: 3,
                permissions: 'assess_evaluation_start',
                icon: '',
                href: `${estimateUrl}/#/assessment/questionnaireStart/index?typeIds=${7}`,
                // href: `http://116.205.172.167:38080/#/assessment/questionnaireStart/index?typeIds=${26}`,
            },
            {
                label: this.$t('navbar.数据跨境地图'),
                value: 2,
                permissions: 'true',
                icon: 'icon-map',
                href: `${assetsUrl}/#/assetsCharts/earth/index`,
                // href: `http://116.205.172.167:38082/#/assetsCharts/earth/index`,
            },
            
            {
                label: this.$t('navbar.网站APP小程序SDK合规评估'),
                value: 4,
                permissions: 'workflow-page',
                icon: 'icon-code',
                href: `${workFlowUrl}/#/workflow/index`,
                // href: 'http://116.205.172.167:38888/#/wel/index',
            },
            {
                label: this.$t('navbar.自动化数据发现'),
                value: 5,
                permissions: 'true',
                icon: 'icon-compass',
                href: `${workFlowUrl}/#/wel/index`,
                // href: 'http://116.205.172.167:38888/#/wel/index',
            },
            {
                label: this.$t('navbar.数据处理活动流图'),
                value: 6,
                permissions: 'true',
                icon: 'icon-category',
                href: `${assetsUrl}/#/assetsCharts/assetbusin/index`,
                // href: `http://116.205.172.167:38082/#/assetsCharts/assetbusin/index`,
            }]
    },
    mounted() {
      this.isDeptsEmpty()&&(this.deptName = this.recursionDeptName(this.infoRest.dataPermissionDepts, this.userInfo.currentDept).name)
      listenfullscreen(this.setScreen);
    },
    computed: {
      ...mapState({
        showLock: state => state.common.showLock,
        showFullScren: state => state.common.showFullScren,
        showCollapse: state => state.common.showCollapse,
        showMenu: state => state.common.showMenu,
      }),
      ...mapGetters([
        "userInfo",
        'roles',
        "infoRest",
        "isFullScreen",
        "tagWel",
        "tagList",
        "isCollapse",
        "tag",
        "logsLen",
        "logsFlag",
        "permissions"
      ])
    },
    methods: {
      // 导出使用手册
      openUserManual() {
        this.$confirm(this.$t('crudCommon.是否导出本条数据'), this.$t('crudCommon.提示'), {
            confirmButtonText: this.$t('crudCommon.是'),
            cancelButtonText: this.$t('crudCommon.否'),
            type: "warning",
          })
          .then(() => {
            // this.fullscreenLoading = true
            this.$notify({
              title: '温馨提示',
              type: 'info',
              message: '如果数据庞大会导致下载缓慢哦，请您耐心等待！',
              duration: 3000
            });
            this.downBlobFile('/admin/instructionManual/export', {}, '使用手册').then(() => {
              // this.fullscreenLoading = false

            })
          })
      },

      // 打开导出pdf弹窗
      openExportPDF() {
        this.exportTemplateDialog = true
      },
      recursionDeptName(depts, currentDept) {
        for(let dept of depts || []) {
          if(dept.id === currentDept) return dept
          const dept_ = this.recursionDeptName(dept.children, currentDept)
          if(dept_) return dept_
        }
      },
      isDeptsEmpty() {
        return !isEmpty(this.infoRest.dataPermissionDepts)
      },
      selectDepts(item) {
        checkAuthority({userId: this.userInfo.userId, deptId: item.id}).then(res => {
            window.location.reload();
        })
      },
      // 添加其他系统模块
      addModules(menus) {
        // 根据外层path转 对象
        this.moduleList = [
          {
              id: 1,
              label: '评估及风险治理',
              enName: 'Assessment & RM',
              path: '/assessment',
              moduleHost: estimateUrl
              // moduleHost: 'http://116.205.172.167:38080'
          },
          {
              id: 2,
              label: '数据发现及映射',
              enName: 'Data Discovery and Mapping',
              path: '/assets',
              moduleHost: assetsUrl
              // moduleHost: 'http://116.205.172.167:38082'
          },
          {
              id: 3,
              label: '告知同意及主体权利',
              enName: 'Notice Consent & DSR',
              path: '/inform',
              moduleHost: powerUrl
              // moduleHost: 'http://116.205.172.167:38083'
          },
        ]
        .map(item => {
            item.children = menus.filter(menu => menu.path.slice(0, item.path.length) === item.path)
            this.makeHost(item)

            return item
        })
        .filter(x => x.children.length !== 0)

        console.log(this.moduleList, 'm');
      },
      makeHost(data) {
        data.children.forEach(d => {
          d.moduleHost = data.moduleHost
          if(d.children&&d.children.length !== 0) {
            this.makeHost(d)
          }
        })
      },
      
      handleScreen() {
        fullscreenToggel();
      },
      setCollapse() {
        this.$store.commit("SET_COLLAPSE");
      },
      setScreen() {
        this.$store.commit("SET_FULLSCREN");
      },
      logout() {
        this.$confirm(this.$t('navbar.是否退出系统是否继续'), this.$t('crudCommon.提示'), {
                    confirmButtonText: this.$t('crudCommon.确定'),
                    cancelButtonText: this.$t('crudCommon.取消'),
          type: "warning"
        }).then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({path: "/login"});
          });
        });
      }
    }
  };
</script>
<style lang="scss">
  .avue-top {
    .el-button--small {
      padding: 6px;
    }

    .el-submenu__title {
      padding: 0 0 0 10px;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../../styles/mixins";

  a.logo {
    display: block;
    height: 100%;

    img {
      width: auto;
      height: 30px;
      position: relative;
      display: block;
      top: 50%;
      @include transform(translateY(-50%));
    }
  }

.quick-list {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 10px;
  .PIPL {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}

.top-bar__right {
    .quick-list-icon {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
  }
</style>
