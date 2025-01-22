<template>
  <div class="login-container">
    <div class="login-head">
      <img src="@/images/logo-login.png" alt="logo">
    </div>
    <div class="login-wrapper">
      <div class="login-top">
        <div class="title">{{$t(`login.${website.title}`)}}</div>
        <div class="sub-title">{{website.titleEn}}</div>
      </div>
      <div class="login-content">
        <el-tabs @tab-click="tabClick(activeName)" v-model="activeName">
          <el-tab-pane :label="$t('login.密码登录')" name="loginByUser">
            <user-login
              :bindData="bindData"
            />
            
          </el-tab-pane>
          <el-tab-pane :label="$t('login.扫码登录')" name="loginByThird">
            <third-login
              ref="thirdlogin"
              :thirdlogin="thirdloginType"
              @bindUser="bindUser"
            />
          </el-tab-pane>
        </el-tabs>
        <div class="cont-foot">
          <div class="c-f-l"  >
            <a href="#" @click="thirdlogin('weixin')">
              <img src="@/images/icon-wx.png" :alt="$t('login.微信')">
              <span>{{$t('login.微信')}}</span>
            </a>
            <span class="split-line">|</span>
            <a href="#" @click="thirdlogin('dingding')">
              <img src="@/images/icon-dingding.png" :alt="$t('login.钉钉')">
              <span>{{$t('login.钉钉')}}</span>
            </a>
          </div>
          <div class="c-f-r">
            <a href="#"  @click="alertMessage">{{$t('login.忘记密码')}}</a>
            <span class="split-line">|</span>
            <a href="#" @click="changeLgoinMode">
              <span>
                {{$t('login.游客访问')}}
              </span>
              
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="login-foot">
      <div class="copyright">
        <!-- Copyright © 2020-{{nowYear}} <a :href="websiteLink" target="_blank">{{domain}}</a> 版权所有 {{copyright}} -->
        Copyright © 2020-{{nowYear}} <a target="_blank">{{domain}}</a> {{$t('login.版权所有')}} <a href="https://beian.miit.gov.cn">{{copyright}}</a>
      </div>
      <div class="links">
        <a :href="privacyPolicy" target="_blank">{{$t('login.隐私政策')}}
          <svg-icon icon-class="icon-share"></svg-icon>
        </a>
        <span class="split-line">|</span>
        <a :href="termsOfUse" target="_blank">{{$t('login.使用条款')}}
          <svg-icon icon-class="icon-share"></svg-icon>
        </a>
      </div>
    </div>
    <el-dialog 
        :title="$t('login.游客访问')" 
        :visible.sync="tryUse" 
        append-to-body
        :close-on-click-modal="false" 
        :fullscreen="isFullscreen"
        width="30%">
        <div class="dialog-header" slot="title">
            <span class="dialog-header-title">{{$t('login.游客访问')}}</span>
            <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
        </div>
        <applyTryUse />
    </el-dialog>
  </div>
</template>

<script>
  import userLogin from './userlogin'
  import applyTryUse from './applyTryUse'
  import thirdLogin from './thirdlogin'
  import {mapGetters} from "vuex";

  export default {
    name: "login",
    components: {
      userLogin,
      applyTryUse,
      thirdLogin
    },
    computed: {
      ...mapGetters(["website"]),
      nowYear() {
        return new Date().getFullYear();
      }
    },
    data() {
      return {
        activeName: 'loginByUser',
        websiteLink: 'https://www.idatatrsut.com',
        domain: 'idatatrsut.com',
        copyright: '沪ICP备2022034651号-1',
        thirdloginType: 'dingding',
        bindData: {},
        termsOfUse: '',
        privacyPolicy: '',
        tryUse: false,
        isFullscreen: false,
      }
    },
    created() {
      this.termsOfUse = `${window.location.href}/termsOfUse`
      this.privacyPolicy =  `${window.location.href}/privacyPolicy`
    },
    methods: {
      tabClick(activeName) {
        if(activeName === 'loginByThird') {
          this.$refs.thirdlogin.ddLoginInit()
        }
      },
      alertMessage() {
        this.$message.warning(this.$t('login.请联系管理员'))
      },
      changeLgoinMode() {
        this.tryUse = true
      },
      thirdlogin(type) {
        this.thirdloginType = type
        this.activeName = 'loginByThird'
        if(type === 'dingding') {
          this.$refs.thirdlogin.ddLoginInit()
        }
      },
      bindUser(data) {
        this.activeName = 'loginByUser'
        this.bindData = data
      },
    },
  }
</script>

<style lang="scss">
  .login-content {
    .el-tabs__nav {
      width: 100%;
      padding: 15px 0;

      .el-tabs__item {
        padding: 0;
        width: 50%;
        text-align: center;
        color: #fff;
        font-size: 16px;
        font-weight: normal;

        &.is-active {
          color: #fff;
          font-weight: bold;
        }
      }

      .el-tabs__active-bar {
        background-color: #fff;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #d6d6d6;
    }

    .el-tabs__content {
      padding: 15px 30px;
    }

    .el-input__inner {
      background-color: rgba(255, 255, 255, 0);
      color: #fff;
      font-size: 14px;

      &:focus {
        border-color: #fff;
      }
    }

    .el-input__prefix {
      color: #fff;
    }
  }
</style>

<style lang="scss" scoped>
  @import "../../styles/mixins";

  .login-container {
    @include square(100%);
    background-image: url("../../images/login-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;

    .login-head {
      // top: 0.24rem;
      // left: 0;
      // right: 0;
      box-sizing: border-box;
      padding: 0.1rem;
      // position: absolute;
    }

    .login-wrapper {
      // position: relative;
      // top: 52%;
      // left: 7.8%;
      // @include transform(translateY(-50%));
      margin-left: 5%;
      color: #fff;
      width: 26%;
      min-width: 374px;
      height: auto;

      .login-top {
        text-align: center;
        margin-bottom: 0.2rem;

        .title {
          white-space: nowrap;
          font-size: 0.2rem;
          font-weight: bold;
        }

        .sub-title {
          white-space: nowrap;
          margin-top: 0.08rem;
          font-size: 0.11rem;
          // font-weight: bold;
        }
      }

      .login-content {
        width: 100%;
        border: 1px solid #fff;
        box-sizing: border-box;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, .1);

        .cont-foot {
          padding: 0.1rem 0.1rem;
          border-top: 1px solid #fff;
          color: #fff;
          font-size: 12px;
          box-sizing: border-box;
          @include flexbox;
          @include justify-content(space-between);
          @include align-items(center);

          .c-f-l {
            @include flexbox;
            @include align-items(center);

            a {
              @include flexbox;
              @include align-items(center);
            }
          }

          a {
            color: #fff;

            &:hover {
              text-decoration: underline;
            }
          }

          img {
            margin-right: 5px;
          }

          .split-line {
            margin: 0 10px;
          }
        }
      }
    }

    .login-foot {
      text-align: center;
      color: #fff;
      font-size: 12px;
      position: absolute;
      bottom: 0.16rem;
      left: 0;
      right: 0;

      a {
        color: #fff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      .links {
        margin-top: 0.08rem;
      }

      .split-line {
        margin: 0 10px;
      }

      .svg-icon {
        @include square(16px);
        vertical-align: -3px;
      }
    }
  }
</style>
