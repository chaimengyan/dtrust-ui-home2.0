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
import { workFlowUrl, adminUrl, assetsUrl, estimateUrl, powerUrl } from '@/util/env'
import { mapGetters } from "vuex";

    export default {
        name: 'ModuleEntry',
        data() {
            return {
              moduleList: [],
            }
        },
        computed: {
          ...mapGetters([ "menu"]),
        },
        created() {
          
          this.moduleList = [
            {
              id: 10272,
              path: '/workflow',
              icon: 'iconfont icon-ty-fenzu',
              title: this.$t('navbar.工作流'),
              link: workFlowUrl,
              describe: this.$t('homePage.跨模块工作流管理平台第三方工具API接入')
            },
             {
              id: 10007,
              path: '/assessment',
              icon: 'iconfont icon-zd-shoushugongzuoliang',
              title: this.$t('menu.评估及风险治理'),
              link: estimateUrl,
              describe: this.$t('homePage.问卷管理PIA及多用途合规评估风险治理')
            }, {
              id: 10118,
              path: '/assets',
              icon: 'iconfont icon-zd-shujuchuli2',
              title: this.$t('menu.数据发现及映射'),
              link: assetsUrl,
              describe: this.$t('homePage.个人信息分类分级数据清单发现处理活动记录及数据流图')
            }, {
              id: 10101,
              path: '/inform',
              icon: 'iconfont icon-zd-yingyongchengxu',
              title: this.$t('menu.告知同意及主体权利'),
              link: powerUrl,
              describe: this.$t('homePage.隐私政策管理告知及同意记录数据主体权利响应')
            }, 
            {
              id: 1000,
              path: '/admin',
              icon: 'el-icon-s-tools',
              title: this.$t('navbar.访问控制'),
              link: adminUrl,
              describe: this.$t('homePage.用于账号角色菜单组织架构等的管理')
            },
          ]
          this.$store.dispatch("GetMenu", { type: true, id: -1 }).then(data => {
            console.log(data, 'data');
            this.moduleList = this.moduleList.filter(x => this.menu.find(y => y.id === x.id))
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
