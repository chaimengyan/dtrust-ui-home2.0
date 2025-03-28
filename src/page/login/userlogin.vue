<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
    size="medium"
  >
    <el-form-item prop="username">
      <el-input
        clearable
        @keyup.enter.native="handleLogin"
        v-model="loginForm.username"
        auto-complete="off"
        :placeholder="`${$t('crudCommon.请输入')}${$t('userinfo.用户名')}`"
      >
        <i slot="prefix" class="icon-zd-dengluzhanghao"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        clearable
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        :placeholder="`${$t('crudCommon.请输入')}${$t('login.密码')}`"
      >
        <i
          class="el-icon-view el-input__icon"
          slot="suffix"
          @click="showPassword"
        ></i>
        <i slot="prefix" class="icon-ty-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="14">
          <el-input
            clearable
            @keyup.enter.native="handleLogin"
            :maxlength="code.len"
            v-model="loginForm.code"
            auto-complete="off"
            :placeholder="`${$t('crudCommon.请输入')}${$t('login.验证码')}`"
          >
            <i slot="prefix" class="icon-ty-yanzhengma"></i>
          </el-input>
        </el-col>
        <el-col :span="10">
          <div class="login-code">
            <img
              :src="code.src"
              class="login-code-img"
              @click="refreshCode"
              :title="$t('login.点击切换验证码')"
            />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button
        @click.native.prevent="handleLogin"
        class="login-submit"
        style="width: 100%"
      >{{$t('login.登录')}}
      </el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
  import {bindDingDing} from '@/api/login'
  import {randomLenNum} from "@/util/util";
  import {mapGetters} from "vuex";
  import {validatenull} from "@/util/validate";
  
  export default {
    name: "userlogin",
    props: {
      bindData: {
        type: Object,
        default:() => {}
      }
    },
    data() {
      return {
        codeUrl: '/code',
        loginForm: {
          username: "",
          password: "",
          code: "",
          randomStr: "",
        },
        checked: false,
        code: {
          src: "",
          value: "",
          len: 4
        },
        loginRules: {
          username: [
            {required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('userinfo.用户名')}`, trigger: "blur"},
          ],
          password: [
            {required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('login.密码')}`, trigger: "blur"},
            {min: 6, message: this.$t('login.密码长度最少为6位'), trigger: "blur"},
          ],
          code: [{required: false, message: `${this.$t('crudCommon.请输入')}${this.$t('login.验证码')}`, trigger: "blur"}],
        },
        passwordType: "password",
      };
    },
    created() {
      this.refreshCode();
    },
    computed: {
      ...mapGetters(["tagWel"]),
    },
    methods: {
      refreshCode() {
        this.loginForm.code = "";
        this.loginForm.randomStr = randomLenNum(this.code.len, true);
        this.code.src = `${process.env.VUE_APP_BASE_URL}${this.codeUrl}?randomStr=${this.loginForm.randomStr}`;
      },
      showPassword() {
        this.passwordType == ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$store
              .dispatch("LoginByUsername", this.loginForm)
              .then(() => {
                if(JSON.stringify(this.bindData) !== '{}') {
                  this.$confirm(this.$t('login.是否绑定当前账号'), this.$t('crudCommon.提示'), {
                    confirmButtonText: this.$t('crudCommon.确定'),
                    cancelButtonText: this.$t('crudCommon.取消'),
                    type: 'warning'
                  }).then(() => {
                    bindDingDing(this.bindData).then(res => {
                      this.$message.success(this.$t('login.绑定成功'))
                      window.location.href = window.name  
                    })
                  }).catch(() => {
                    window.location.href = window.name          
                  });
                } else {
                  if(validatenull(window.name)) {
                    this.$router.push({
                      path: "/"
                    });
                  }else {
                    window.location.href = window.name
                  }
                }
                // this.$router.push({path: this.tagWel.value});
                // history.back()
              })
              .catch(() => {
                this.refreshCode();
              });
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .login-code {
    img.login-code-img {
      float: right;
      display: block;
      width: auto;
      height: 0.29rem;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
</style>
