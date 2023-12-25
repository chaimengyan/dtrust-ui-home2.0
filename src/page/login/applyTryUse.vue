<template>
  <el-form
    ref="form"
    :model="form"
    class="login-form"
    status-icon
    label-width="20px"
    size="medium"
    :rules="formRules"
  >
    <el-form-item label=" " prop="mobile">
      <el-input
        clearable
        v-model="form.mobile"
        auto-complete="off"
        :placeholder="`${$t('crudCommon.请输入')}${$t('userinfo.手机号')}`"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="el-icon-mobile-phone" />
      </el-input>
    </el-form-item>
    <el-form-item label=" " prop="code">
      <el-input
        clearable
        v-model="form.code"
        auto-complete="off"
        :placeholder="`${$t('crudCommon.请输入')}${$t('login.验证码')}`"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="el-icon-s-promotion" style="margin-top:10px;font-size: 18px;"/>
        <template slot="append">
          <span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ msgText }}</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="name">
      <el-input
        clearable
        v-model="form.name"
        auto-complete="off"
        :placeholder="`${$t('crudCommon.请输入')}${$t('login.姓名')}`"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="icon-zd-dengluzhanghao" />
      </el-input>
    </el-form-item>
    <el-form-item prop="mail">
      <el-input
        clearable
        v-model="form.mail"
        auto-complete="off"
        :placeholder="`${$t('crudCommon.请输入')}${$t('userinfo.邮箱')}`"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="el-icon-message" />
      </el-input>
    </el-form-item>
    <el-form-item prop="company">
      <el-input
        clearable
        v-model="form.company"
        auto-complete="off"
        :placeholder="`${$t('crudCommon.请输入')}${$t('login.企业名称')}`"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="el-icon-office-building" />
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox style="color: #c0c4cc;font-size: 12px;" v-model="isAgree">{{$t('login.勾选并同意')}}
        <a class="privacyPolicy" :href="privacyPolicy" target="_blank">{{$t('login.隐私政策')}}</a>
      </el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button
        class="login-submit"
        style="width: 100%"
        @click.native.prevent="handleLogin"
      >{{$t('login.登录')}}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const MSGINIT = i18n.t('login.发送验证码'),
  MSGSCUCCESS = '${time}'+`s ${i18n.t('login.后重发')}`,
  MSGTIME = 120;

  const isEmail = (rule, value, callback) => {
    const myreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (myreg.test(value)||!value) {
      callback()
    } else {
      return callback(new Error(i18n.t('login.请输入正确的邮箱')))
    }
  }
  import {sendSmsCode} from '@/api/login'
  import {isPhone} from '@/util/validate'
  import {mapGetters} from "vuex";
  import {encrypt,decrypt} from "@/util/AES.js";

  export default {
    name: "applyTryUse",
    props: {
      bindData: {
        type: Object,
        default:() => {}
      }
    },
    data() {
      return {
        msgText: MSGINIT,
        msgTime: MSGTIME,
        msgKey: false,
        form: {
          mobile: "",
          code: "",
        },
        isAgree: false,
        privacyPolicy: '',
        formRules: {
          mobile: [
            {required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('userinfo.手机号')}`, trigger: 'blur'}
          ],
          code: [
            {required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('login.验证码')}`, trigger: 'blur'}
          ],
          mail: [
            { validator: isEmail, trigger: 'blur'}
          ],
        },
      };
    },
    created() {
      this.privacyPolicy =  `${window.location.href}/privacyPolicy`
    },
    computed: {
      ...mapGetters(["tagWel"]),
    },
    methods: {
      handleSend() {
        // 判断是否可以发送（时间限制）
        if (this.msgKey) return;
        // 发送验证码
        if(isPhone(this.form.mobile)) {
          sendSmsCode(this.form.mobile).then(res => {
            if(res.data.status == 200) {
              this.$message.success(res.data.message)
              this.timeCacl();
            }
          })
        }else {
          this.$message.error(this.$t('login.请输入正确的手机号'))
        }
      },
      handleLogin() {
        if(!this.isAgree) return this.$message.error(this.$t('login.请勾选并同意隐私条款'))
        if(isPhone(this.form.mobile)&&this.form.code.length === 6) {
          this.$store.dispatch("LoginByPhone", this.form).then(() => {
            // this.$router.push({ path: this.tagWel.value });
            window.location.href = window.name
          });
        }else {
          this.$message.error(this.$t('login.请输入正确的手机号和验证码'))
        }
      },
      timeCacl() {
        // 计时避免重复发送
        this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
        this.msgKey = true;
        const time = setInterval(() => {
          this.msgTime--;
          this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
          if (this.msgTime === 0) {
            this.msgTime = MSGTIME;
            this.msgText = MSGINIT;
            this.msgKey = false;
            clearInterval(time);
          }
        }, 1000);
      },
    }
  };
</script>

<style lang="scss" scoped>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
.privacyPolicy {
  color: #5359be;
  &:hover {
    text-decoration: underline;
  }
}
</style>
