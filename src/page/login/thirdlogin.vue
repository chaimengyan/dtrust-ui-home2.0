<template>
  <div class="qrcode-box">
    <!-- <img src="@/images/qrcode.png" alt=""> -->
    <div  id="self_defined_element" class="self-defined-classname"></div>
  </div>
</template>

<script>
  import {loginByDingDing} from '@/api/login'
  import { isDev, isTest } from '@/util/env'

  export default {
    name: "thirdlogin",
    props: {
      thirdlogin: {
        type: String,
        default: 'dingding'
      }
    },
    data() {
      return {
      }
    },
    mounted() {
      
    },
    watch: {
    
    },
    methods: {
      ddLoginInit(){
//         loginByDingDing('36a4a597006d3804af3e7d5624be2265').then(res => {
// console.log(res,'ressssss......');
//                 })
        // const locationUrl = `${window.location.protocol}//${window.location.hostname}:/#/`
        const locationUrl = !isDev() ? !isTest() ? `https://console.idatatrust.com/#/` : 'http://116.205.172.167:38888/#/' : `http://${window.location.hostname}:38888/#/`

        // STEP3：在需要的时候，调用 window.DTFrameLogin 方法构造登录二维码，并处理登录成功或失败的回调。
        window.DTFrameLogin(
            {
                id: 'self_defined_element',
                width: 300,
                height: 300,
            },
            {
                redirect_uri: encodeURIComponent(locationUrl),
                client_id: 'dingkanvbxxsxce73alr',
                scope: 'openid',
                response_type: 'code',
                state: 'xxxxxxxxx',
                prompt: 'consent',
            },
            (loginResult) => {
                console.log(loginResult,'loginResult');

                const {redirectUrl, authCode, state} = loginResult;
                loginByDingDing(authCode).then(res => {
                    this.$store.commit('SET_ACCESS_TOKEN', res.data.data)
                    this.$store.commit('CLEAR_LOCK')
                    window.location.href = window.name
                 
                })
                .catch(res => {
                    this.$emit('bindUser', res.data.data)
                })
                
                // 这里可以直接进行重定向
                // window.location.href = redirectUrl;
                // 也可以在不跳转页面的情况下，使用code进行授权
            },
            (errorMsg) => {
                // 这里一般需要展示登录失败的具体原因
                alert(`Login Error: ${errorMsg}`);
            },
        );
      },
      makeSure() {},
    }
  }
</script>

<style lang="scss" scoped>
  .qrcode-box {
    text-align: center;

    img {
      width: 1.98rem;
      height: auto;
    }
    /* STEP2：指定这个包裹容器元素的CSS样式，尤其注意宽高的设置 */
    .self-defined-classname {
        // width: 300px;
        // height: 300px;
    }
  }
</style>
