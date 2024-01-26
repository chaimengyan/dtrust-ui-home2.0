<template>
  <div class="scene">
    <div class="scene-head">
      <span class="title">{{$t('risk.风险分析处理')}}</span>
    </div>
    <div class="scene-body" :class="activeClass">
      <!-- <div class="scene-left">
        
      </div> -->
      <div class="scene-main common-box">
        <div class="scene-main-content" :class=" disabled ? 'disabled' : ''">
          <div v-if="isShowRisk" class="content">
            <div class="assessInfo">
              <div class="ai-item">
                <span class="label">{{$t('assessment.评估名称')}}：</span>
                <span class="value">{{assessInfo.name}}</span>
              </div>
              <div class="ai-item">
                <span class="label">{{$t('assessment.被评估人')}}：</span>
                <span class="value">{{assessInfo.evaluators.map(e => e.nickName).join('，')}}</span>
              </div>
              <div class="ai-item">
                <span class="label">{{$t('risk.评估状态')}}：</span>
                <span class="value">{{ assessStatusList[assessInfo.status].label}}</span>
              </div>
            </div>
            <div class="level-box">
              <div class="level-item" :class="'level-item-'+(index+1)" v-for="(item,index) in levelList" :key="index"
                   @click="toAssessment(item)">
                <div class="lv-text">
                  <div class="lv-t">
                  <el-tooltip
                    placement="bottom"
                    effect="light"
                    :key="item.id"
                  >
                    <div slot="content">
                      {{$t('risk.评估状态')}}：{{item.label}}
                    </div>
                    <span>{{item.percentage}}%</span>
                  </el-tooltip>
                  </div>
                </div>
                <div class="lv-bg">
                  <div class="lv-active" :style="{width:item.percentage+'%'}">
                    <el-tooltip
                      v-if="item.percentage>0"
                      placement="top"
                      effect="light"
                      :key="item.id">
                      <div slot="content">
                        {{$t('risk.风险点数量')}}：{{item.riskPoints && item.riskPoints.length}}
                      </div>
                      <img class="risk-mark" src="@/images/risk-lv-mark.png" alt="mark">
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="tips">
            {{$t('risk.完成评估后生成相应的风险等级')}}
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

    <div class="scene-arrow">
      <svg-icon :icon-class="disabled ?'icon-arrow-down':'icon-arrow-down-active'" class="scene-icon"></svg-icon>
    </div>
  </div>
</template>

<script>
import { 
  getResultsByEvaluationId,
  getLevelAndPoint,
  getEvaluationById
  } from "@/api/workflow/risk";
import { mapGetters } from "vuex";
import { assessStatusList } from "@/util/enum"
 
export default {
  name: "Risk",
  components: {
  },
  props: {
    evaluationId: {
      type: String,
      default: ''
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
      disabled: false,
      riskPointList: [],
      levelList: [],
      isShowRisk: false,
      isPass: true,
      infoId: -1,
      // 评估信息
      assessInfo: {},
      assessStatusList,
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
    // this.calculateRiskLevel()
  },
  methods: {

    toAssessment(val) {
      const assUrl = `http://116.205.172.167:38080/#/assessment/questionnaireStart/index?infoId=${this.evaluationId}&level=${val.level}`;
      window.open(assUrl, "_blank");
    },
   
    // 获取问卷填写结果
    getResultsByEvaluationId(evaluationId) {
      return getResultsByEvaluationId(evaluationId).then((res) => {
        const {result} = res.data.data
        console.log(result, '????result');
        if(result.length === 0) return this.riskPointList = []
        const replies = result.map(x => (x.replies)).flat()
        this.riskPointList = replies.length !== 0 ? replies : []
        console.log(this.riskPointList,'riskPointList');

      });
    },

    // 获取风险等级
    getLevelAndPoint() {
      return getLevelAndPoint().then(res => {
        this.levelList = res.data.data.levels
      })
    },

    // 根据评估id查询评估信息
    getEvaluationById(evaluationId) {
      return getEvaluationById(evaluationId).then(res => {
        this.assessInfo = res.data.data
      })
    },

    // 计算百分比
    percentage(riskPoints) {
        // const r = riskPoints.filter(r => (r.isAppoint&&r.isAppoint === 3))
        // const num = 100 - (r.length*100 / riskPoints.length)
        const num = riskPoints.length*100 / this.riskPointList.length
        if(isNaN(num)) return 0
        return Math.round(num)
      },

    // 计算风险等级
    async calculateRiskLevel(workflowRow) {
      console.log(workflowRow,'workflowRow');
      if(workflowRow && workflowRow.steps < 3) return this.isShowRisk = false
      const {evaluationId, steps, status, flowType } = workflowRow
      await Promise.all([
                          this.getResultsByEvaluationId(evaluationId),
                          this.getLevelAndPoint(), 
                          this.getEvaluationById(evaluationId)
                        ])
      this.isPass = true
      this.levelList.forEach((level, index) => {
        const riskPoints = this.riskPointList.filter(r => {
          if(!('score') in r) {
            r.score = 0
          }
          return r.score < level.maxScore && r.score >= level.minScore
        })
        const percentage = this.percentage(riskPoints)
        this.$set(this.levelList[index], 'riskPoints', riskPoints)
        this.$set(this.levelList[index], 'percentage', percentage)

         console.log(level.level, level.riskPoints.length,level.percentage, '是否满足通过')
        // 如果有中风险及以上的风险点、存在指派状态风险点、以及评估结果为拒绝的，不予通过
        if(level.level > 1 && level.riskPoints.length !== 0 && level.percentage !== 0) {
          this.isPass = false
        }

      })

      console.log(steps, this.isPass,this.assessInfo.assessStatus, '是否通过')

      // 如果是审核中，工作流步骤由3切换为4
      if(steps === 3 && this.assessInfo.assessStatus === 2) {
        this.$emit('passRisk', 4)
      }

      // 如果审核状态是通过，且工作流类型为全评估，工作流步骤由4切换为5，非全评估类型工作流步骤为4，工作流状态为1完成
      // 加当前工作流步骤和状态判断是为了防止进入死循环
      if(steps === 4 && status == 0 && this.assessInfo.assessStatus === 3 && this.isPass ) {
        if(flowType == 0) {
          this.$emit('passRisk', 5)
        }else {
          this.$emit('passRisk', 4, 1)
        }
      }

      // 如果审核状态为拒绝，则以状态2结束此工作流
      if(steps === 4 && status == 0 && this.assessInfo.assessStatus == 4) {
        this.$emit('passRisk', 4, 2)
      }

      this.isShowRisk = true
      console.log(this.levelList, 'this.levelLIst')
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

    /*.disabled {*/
    /*  background: rgba(0, 0, 0, .5) !important;*/
    /*  cursor: not-allowed;*/
    /*}*/

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
      box-sizing: border-box;
      padding: 10px;
      position: relative;

      &.disabled {
        &:after {
          position: absolute;
          content: '请完成上一步';
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
    }

    .common-box {
      border: 1px solid #DCDFE6;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      background: aliceblue;
      box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
    }
    .scene-main {
      width: calc(60% - 100px);
      margin: 0 auto;
      position: relative;
      min-height: 180px;
      border-style: solid;

      .content {
        @include box-sizing(border-box);
        padding: 10px;
        font-size: 12px;
        color: #333;

        .assessInfo {
          text-align: left;
        }

        .ai-item {
          margin-bottom: 5px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .label {
          color: #999;
        }
      }

      .level-box {
        margin: 20px 0 10px;

        .level-item {
          cursor: pointer;
          margin-bottom: 10px;
          @include flexbox;
          @include align-items(center);

          &:last-child {
            margin-bottom: 0;
          }

          .lv-text {
            @include square(44px);
            line-height: 44px;
            text-align: center;
            white-space: nowrap;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            -webkit-background-size: cover;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            // color: #fff;
            font-size: 12px;
            position: relative;
            z-index: 2;
          }

          .lv-bg {
            background: #ebeef5;
            @include size(100%, 20px);
            -webkit-border-radius: 0 10px 10px 0;
            -moz-border-radius: 0 10px 10px 0;
            border-radius: 0 10px 10px 0;
            position: relative;
            z-index: 1;
            margin-left: -3px;

            .lv-active {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              height: 20px;
              -webkit-border-radius: 0 10px 10px 0;
              -moz-border-radius: 0 10px 10px 0;
              border-radius: 0 10px 10px 0;

              .risk-mark {
                position: absolute;
                right: 0;
                margin-top: -15px;
              }
            }
          }

          &.level-item-1 {
            .lv-text {
              // background-image: url(../../images/risk-lv-1.png);
              width: 44px;
              height: 44px;
              background-color: #2affff;
              display: flex;
              align-items: center;
              justify-content: center;
              .lv-t {
                width: 34px;
                height: 34px;
                line-height: 34px;
                border-radius: 50%;
                border: 2px solid #3ae1e8;
                background-color: #2affff;
              }
            }

            .lv-active {
              background-color: #2affff;
            }
          }

          &.level-item-2 {
            .lv-text {
              // background-image: url(../../images/risk-lv-2.png);
              width: 44px;
              height: 44px;
              background-color: #ffff7f;
              display: flex;
              align-items: center;
              justify-content: center;
              .lv-t {
                width: 34px;
                height: 34px;
                line-height: 34px;
                border-radius: 50%;
                border: 2px solid #ffcc00;
                background-color: #ffff7f;
              }
            }

            .lv-active {
              background-color: #ffff7f;
            }
          }

          &.level-item-3 {
            .lv-text {
              // background-image: url(../../images/risk-lv-3.png);
              width: 44px;
              height: 44px;
              background-color: #ffaa55;
              display: flex;
              align-items: center;
              justify-content: center;
              .lv-t {
                width: 34px;
                height: 34px;
                line-height: 34px;
                border-radius: 50%;
                border: 2px solid #ff8900;
                background-color: #ffaa55;
              }
            }

            .lv-active {
              background-color: #ffaa55;
            }
          }

          &.level-item-4 {
            .lv-text {
              // background-image: url(../../images/risk-lv-4.png);
              width: 44px;
              height: 44px;
              background-color: #ff2a00;
              display: flex;
              align-items: center;
              justify-content: center;
              .lv-t {
                width: 34px;
                height: 34px;
                line-height: 34px;
                border-radius: 50%;
                border: 2px solid #ffaaaa;
                background-color: #ff2a00;
              }
            }

            .lv-active {
              background-color: #ff2a00;
            }
          }
        }
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
