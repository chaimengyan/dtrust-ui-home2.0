<template>
  <div class="scene">
    <div class="scene-head">
      <span class="title">{{$t('agree.同意管理和主体权利响应')}}</span>
    </div>
    <div class="scene-body" :data-text="$t('crudCommon.请完成上一步')" :class="activeClass">
      <!-- <div class="scene-left common-box"></div> -->

      <div class="scene-main common-box">
        <div class="scene-main-content">
          <div v-if="informKey">
          <div class="scene-content">
            <div class="scene-content-item">
              <div class="scene-content-item-title">{{$t('agree.新增同意记录')}}</div>
              <span>{{$t('agree.接口URL')}}{{agreeRecordApiUrl}} </span>
              <el-button
                style="margin-left: 10px;"
                @click="copyText(agreeRecordApiUrl)" 
                type="text">{{$t('agree.复制apiUrl')}}
              </el-button>
              <br/>
                {{$t('agree.请求方式')}} POST <br/>
                Content-Type： application/json <br/>
                {{$t('agree.body参数及说明')}}{<br/>
                  "informKey": "5f82a447-b767-49ea-9620-0d1dc1f6c24", // {{$t('agree.告知工作流informKey')}}<br/>
                  "userFlag": "13167763575", // {{$t('agree.用户信息')}}<br/>
                  <!-- "accessStatus": 1 ,// {{$t('agree.同意状态')}}<br/> -->
                }
            </div>
            <div class="scene-content-item">
              <div class="scene-content-item-title">{{$t('agree.新增主体权利请求')}}</div>
              {{$t('agree.接口URL')}}{{addPowerApiUrl}}
              <el-button
                style="margin-left: 10px;"
                @click="copyText(addPowerApiUrl)"
                type="text">{{$t('agree.复制apiUrl')}}
              </el-button>
              <br/>
                {{$t('agree.请求方式')}} POST <br/>
                Content-Type： application/json <br/>
                {{$t('agree.body参数及说明')}}{<br/>
                    "userFlag": "用户的信息", // {{$t('agree.用户信息')}}<br/>
                    "requestType": 4, // {{$t('agree.请求类型')}}<br/>
                    "status": 0, // {{$t('agree.状态')}}<br/>
                    "tenantCode": "xxxzz111" // {{$t('agree.租户编码')}}<br/>
                  }
            </div>
            <div class="scene-content-item">
              <div class="scene-content-item-title">{{$t('agree.查看所有请求分类')}}</div>
              {{$t('agree.接口URL')}}{{allrequestTypeApiUrl}}
              <el-button
                style="margin-left: 10px;"
                @click="copyText(allrequestTypeApiUrl)"
                type="text">{{$t('agree.复制apiUrl')}}
              </el-button>
              <br/>
              {{$t('agree.请求方式')}} GET <br/>
              Content-Type： application/json <br/>
            </div>
          </div>
          <div class="scene-btn">
            <div class="informKey">
              informKey: {{informKey}}
              <el-button style="margin-left: 10px;" @click="copyText(informKey)" type="text">{{$t('agree.复制informKey')}}</el-button>
            </div>
            <!-- <el-button  type="primary" :disabled="disabled" plain @click="overWorkflow">完成工作流</el-button> -->
          </div>
          </div>
          <div v-else class="tips">
            {{$t('agree.完成告知工作流步骤后生成相应的api')}}
          </div>
        </div>
      </div>

      <!-- <div class="scene-right common-box">
        <div class="scene-right-content">
          <i class="el-icon-cpu"></i>
          <span class="text">功能待开发</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import {getTenantById} from "@/api/admin/menu"
import { isDev, isTest } from '@/util/env'

export default {
  name: "Scene",
  components: {
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    wfIndex: {
      type: Number,
      default: 0
    },
    wfStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      powerUrl: !isDev() ? !isTest() ? `https://power.idatatrust.com` : 'http://116.205.172.167:38083' : `http://${window.location.hostname}:38083` ,

      // 新增同意记录
      agreeRecordApiUrl: '',
      // 新增主体权利
      addPowerApiUrl: '',
      // 查看所有请求分类
      allrequestTypeApiUrl: '',
      informKey: '',
      tenantCode: '',
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    activeClass() {
      var _class = '';
      if (this.disabled) {
        if (this.wfIndex <= this.wfStep) {
          _class = 'completed'
        } else {
          _class = 'disabled'
        }
      }
      return _class;
    }
  },
  created() {
    this.getTenantById(this.userInfo.tenantId)
  },
  methods: {
    getTenantById(tenantId) {
      getTenantById(tenantId).then(res => {
        this.tenantCode = res.data.data.tenantCode
      })
    },
    // // 结束工作流
    // overWorkflow() {
    //   this.$emit('overWorkflow')
    // },

    // 复制
    copyText(text) {
      this.$Clipboard({
          text
      }).then(() => {
          this.$message.success(this.$t('agree.复制成功'))
      }).catch(() => {
          this.$message.error(this.$t('agree.复制失败'))
      });
    },

    // 回显
    echoContent(informKey) {
      this.informKey = informKey
      console.log(informKey, 'informKey')
      // this.agreeRecordApiUrl = `http://116.205.172.167:38083/workflow/accessRecord`
      this.agreeRecordApiUrl = `${this.powerUrl}/workflow/accessRecord/processing`
      // this.addPowerApiUrl = `http://116.205.172.167:38083/workflow/accessResponse`
      this.addPowerApiUrl = `${this.powerUrl}/workflow/accessResponse`
      // this.allrequestTypeApiUrl = `http://116.205.172.167:38083/workflow/requestType/getRequestTypeListByCode?tenantCode=${this.tenantCode}`
      this.allrequestTypeApiUrl = `${this.powerUrl}/workflow/requestType/getRequestTypeListByCode?tenantCode=${this.tenantCode}`
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "../../styles/mixins";

  .scene {
    width: 100%;
    background: #fff;
    margin-bottom: 80px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    @include box-shadow(0 5px 15px 0 rgba(0, 0, 0, .15));
    position: relative;

    .disabled {
      background: rgba(225, 225, 225, 0.2) !important;
      cursor: not-allowed;
    }

    .scene-head {
      @include size(300px, 30px);
      line-height: 30px;
      background: #01aea9;
      box-shadow: 0px 1px 3px 1px #00000033;
      color: #fff;
      white-space: nowrap;
      margin: 0 auto;
      -webkit-border-radius: 0 0 5px 5px;
      -moz-border-radius: 0 0 5px 5px;
      border-radius: 0 0 5px 5px;
      text-align: center;
    }

    .scene-body {
      @include flexbox;
      @include justify-content(space-between);
      @include flex-wrap(nowrap);
      min-height: 200px;
      max-height: 400px;
      box-sizing: border-box;
      padding: 10px;
      position: relative;

      &.disabled {
        &:after {
          position: absolute;
          content: attr(data-text);
          font-size: 12px;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(100% - 10px);
          height: calc(100% - 10px);
          box-sizing: border-box;
          margin: 5px;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: #dedede;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
          cursor: not-allowed;
          z-index: 1000;
        }
      }

      &.completed {
        &:after {
          position: absolute;
          /*content: '';*/
          font-size: 12px;
          color: #67C23A;
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(100% - 70px);
          height: calc(100% - 20px);
          box-sizing: border-box;
          margin: 10px 35px;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: #dedede;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
          cursor: not-allowed;
          z-index: 1000;
        }
      }
    }

    .common-box {
      border: 1px solid #DCDFE6;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      background: aliceblue;
      box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
      margin: 0 25px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .scene-left {
      position: relative;
      width: 20%;

      &:after {
        font-family: element-icons !important;
        display: block;
        content: "\E791";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -43px;
        font-size: 36px;
        color: #c8e4fc;
      }

      .scene-left-content {
        padding: 5px;
        box-sizing: border-box;
        height: 100%;
        overflow-y: auto;
      }

      .left-list {
        @include flexbox;
        @include flex-wrap(wrap);
      }

      .left-block {
        @include square(40px);
        color: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin: 5px;

        &.common-block {
          background: #67C23A;
          color: #fff;
          display: flex;
          justify-content: space-around;
          align-items: center;
          cursor: move;
          transition: all 0.3s;
          box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
          // border: 2px solid #87898a;
          &:hover {
            transform: scale(1.2);
          }
        }

        &.plusBtn {
          cursor: pointer;
        }
      }
    }

    .scene-main {
      flex: 1;
      width: 100%;
      min-height: 100px;
      overflow-y: auto;
      position: relative;
      border-style: dashed;

      .scene-main-content {
        height: 100%;
        overflow-y: auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .main-drag {
        width: 80px;
        height: 100px;
        // margin: 0 auto;
        // margin-top: 30px;
        box-sizing: border-box;
        text-align: center;
        padding: 30px;
      }

      .operation {
        width: 80px;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

      .sceneForm {
        padding: 30px;
      }

      .main-block {
        color: #fff;
        @include square(80px);
        line-height: 80px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin: 50px auto 10px;
        transition: all 0.3s;
        box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
        // border: 2px solid #87898a;
        &:hover {
            transform: scale(1.1);
          }
      }

      .mark-tips {
        font-size: 12px;
        color: #999;
      }

      .scene-content {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
      }

      .scene-content-item {
        width: 30%;
        overflow-wrap: break-word;
        text-align: left;
        font-size: small;
        background-color: #dbecfc;
        border-radius: 2%;
        padding: 10px;
      }

      .scene-content-item-title {
        text-align: center;
        color: #9291a7;
        font-size: 14px;
      }

      .scene-btn {
        margin: 10px 0;
        text-align: center;
      }

      .informKey {
        color: rgb(40, 199, 199);
        margin-bottom: 10px;
      }

      .tips {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: #999;
        text-align: center;
      }
    }

    .scene-right {
      width: 20%;
      position: relative;
      background: #dedede;

      &:before {
        font-family: element-icons !important;
        display: block;
        content: "\E792";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -43px;
        font-size: 36px;
        color: #dfdfdf;
      }

      .scene-right-content {
        height: 100%;
        overflow: auto;
        padding: 0 10px;
        position: relative;

        i {
          position: absolute;
          left: 50%;
          top: 50%;
          @include transform(translate(-50%, -50%));
          font-size: 24px;
          color: #838a92;
        }

        .text {
          position: absolute;
          color: #999;
          display: block;
          left: 0;
          bottom: 0;
          right: 0;
          padding: 15px;
          font-size: 12px;
          box-sizing: border-box;
        }
      }
    }

    .scene-arrow {
      position: absolute;
      bottom: -70px;
      left: 50%;
      transform: translateX(-50%);

      .scene-icon {
        @include square(50px);
      }
    }
  }
</style>