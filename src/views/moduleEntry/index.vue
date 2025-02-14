<template>
    <div style="height:80vh;width: 70%;margin: 0 auto;">
      <!-- <div style="text-align:center;padding: 30px;font-size: 22px;">欢迎来到数之信</div> -->

      <div class="moduleList" >
          <div class="moduleList-item" v-for="(item,index) in moduleList" :key="index">
            <el-link class="module" :underline="false" target="_blank"  onfocus="this.blur();" :href="item.link">

              <div class="m-icon">
                <i :class="item.icon" style="font-size: 32px;color: #01aea9;"></i>
              </div>
              <div class="m-title">
                {{item.title}}
              </div>
              <div class="m-button">
                    {{item.describe}}
              </div>
            </el-link>

          </div>
      </div>
    </div>
</template>


<script>
import { isDev, isTest } from '@/util/env'
import { mapGetters } from "vuex";

    export default {
        name: 'ModuleEntry',
        data() {
            return {
              workFlowUrl: !isDev() ? !isTest() ? `https://console.idatatrust.com/#/workflow/index` : 'http://116.205.172.167:38888/#/workflow/index' : `http://${window.location.hostname}:38888/#/workflow/index`, 
              adminUrl: !isDev() ? !isTest() ? `https://admin.idatatrust.com` : 'http://116.205.172.167:38081' : `http://${window.location.hostname}:38081` ,
              assetsUrl: !isDev() ? !isTest() ? `https://assets.idatatrust.com` : 'http://116.205.172.167:38082' : `http://${window.location.hostname}:38082` ,
              estimateUrl: !isDev() ? !isTest() ? `https://assess.idatatrust.com` : 'http://116.205.172.167:38080' : `http://${window.location.hostname}:38080` ,
              powerUrl: !isDev() ? !isTest() ? `https://power.idatatrust.com` : 'http://116.205.172.167:38083' : `http://${window.location.hostname}:38083` ,
              moduleList: [],
            }
        },
        computed: {
          ...mapGetters([ "menu"]),
        },
        created() {
          
          this.moduleList = [
            {
              icon: 'iconfont icon-ty-fenzu',
              title: this.$t('navbar.工作流'),
              link: this.workFlowUrl,
              describe: this.$t('homePage.跨模块工作流管理平台第三方工具API接入')
            },
             {
              icon: 'iconfont icon-zd-shoushugongzuoliang',
              title: this.$t('menu.评估及风险治理'),
              link: this.estimateUrl,
              describe: this.$t('homePage.问卷管理PIA及多用途合规评估风险治理')
            }, {
              icon: 'iconfont icon-zd-shujuchuli2',
              title: this.$t('menu.数据发现及映射'),
              link: this.assetsUrl,
              describe: this.$t('homePage.个人信息分类分级数据清单发现处理活动记录及数据流图')
            }, {
              icon: 'iconfont icon-zd-yingyongchengxu',
              title: this.$t('menu.告知同意及主体权利'),
              link: this.powerUrl,
              describe: this.$t('homePage.隐私政策管理告知及同意记录数据主体权利响应')
            }, 
            {
              icon: 'el-icon-s-tools',
              title: this.$t('navbar.访问控制'),
              link: this.adminUrl,
              describe: this.$t('homePage.用于账号角色菜单组织架构等的管理')
            },
          ]
          this.$store.dispatch("GetMenu", { type: true, id: -1 }).then(data => {
            if(this.menu.find(x => x.path.slice(0, 6) === '/admin') === undefined) {
              this.moduleList = this.moduleList.filter(y => y.icon !== 'el-icon-s-tools')
            }
          });
          
        },
       
        methods: {
        
        }
    }
</script>
<style>
.moduleList {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 50px;
  .moduleList-item {
    
  }
}
    .module {
      text-align: center;
      border: solid 1px darkgray;
      border-radius: 4px;
      box-shadow: 0px 0px 4px 0px darkgray;
      padding: 20px;
      margin: 20px;
      width: 240px;
      height: 160px;
      background-color: #fff;
      .m-title {
        font-weight: bold;
        margin: 20px;
        font-size: 16px;
      }
      .m-button {
        color: darkgray;
      }
    }
</style>
