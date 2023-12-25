<template>
  <div class="workflow">
    <div class="workFlowTitle">
      <div class="workFlowName">
        <template v-if="workFlowFormStatus === 0">
          <div class="current-work-flow">
            <span class="label">{{$t('workflow.当前工作流')}}</span><span class="name">{{workflowRow.workFlowName}}</span>
          </div>
        </template>
        <template v-else>
          <el-form :inline="true" ref="workFlowForm" :model="workFlowForm" :rules="workFlowFormRules" label-width="100px">
            <el-form-item :label="$t('workflow.工作流名称')" prop="workFlowName">
              <el-input v-model="workFlowForm.workFlowName" :placeholder="`${$t('crudCommon.请输入')}${$t('workflow.工作流名称')}`"></el-input>
            </el-form-item>
            <el-form-item :label="$t('crudCommon.描述')" prop="overview">
              <el-input v-model="workFlowForm.overview" :placeholder="`${$t('crudCommon.请输入')}${$t('crudCommon.描述')}`"></el-input>
            </el-form-item>
            <el-form-item :label="$t('assets.类型')" prop="flowType">
              <el-select v-model="workFlowForm.flowType" :placeholder="`${$t('crudCommon.请选择')}${$t('assets.类型')}`" :disabled="workFlowFormStatus === 1">
                <el-option
                  v-for="item in flowTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="btns">
        <template v-if="workFlowFormStatus != 0">
          <el-button type="primary" icon="el-icon-check" @click="submit" :title="$t('crudCommon.确定')"></el-button>
          <el-button icon="el-icon-close" @click="cancel" :title="$t('crudCommon.取消')"></el-button>
        </template>
        <template v-else>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.新增')" placement="top">
            <el-button type="primary" icon="el-icon-plus" @click="editBtn(2)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :content="isGraphicalShow ? $t('workflow.关闭工作流看板') : $t('workflow.打开工作流看板')">
            <el-button icon="el-icon-notebook-2" @click="handleGraphical"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('navbar.工作流')">
            <el-button @click="showWorkFlowCrud">
              <svg-icon icon-class="icon-trust" class="quick-list-icon"></svg-icon>
            </el-button>
          </el-tooltip>
        </template>
      </div>
    </div>

    <div class="workFlowBody" v-if="workFlowFormStatus === 0">
      <div class="workFlowSteps">
        <div class="wf-step-box">
          <template v-for="(item,index) in workFlowStepsOption[workflowRow.flowType]">
            <div class="wf-step-item" :class="currentStepClass(index)" :key="index">
              <template v-if="index < workflowObj.steps">
                <i class="el-icon-circle-check"></i>
              </template>
              <template v-else>
                <img src="@/images/icon-radio.png">
              </template>
              <span>{{item}}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="workFlowContent">
        <Scene
          v-if="[0, 3, 4].includes(workflowRow.flowType)"
          ref="scene"
          @getSceneId="getSceneId"
          :disabled="disabledObj[1]"
          :wfIndex="1"
          :wfStep="workflowObj.steps"
        />

        <Assets
          v-if="[0, 1, 3].includes(workflowRow.flowType)"
          ref="assets"
          :sceneId="sceneId"
          @changeDisabled="changeSceneDisabled"
          :disabled="disabledObj[2]"
          :wfIndex="2"
          :wfStep="workflowObj.steps"
        />

        <Assessment
          v-if="[0, 1, 2, 4].includes(workflowRow.flowType)"
          ref="assessment"
          :businessScenarioId="sceneId"
          :assetsId="assetsId"
          @changeDisabled="changeAssetsDisabled"
          :disabled="disabledObj[3]"
          :wfIndex="3"
          :wfStep="workflowObj.steps"
        />

        <Risk
          v-if="[0, 1, 2, 4].includes(workflowRow.flowType)"
          ref="risk"
          :assessInfoId="assessInfoId"
          @passRisk="passRisk"
          :wfIndex="4"
          :wfStep="workflowObj.steps"
        />

        <Inform
          v-if="[0, 3].includes(workflowRow.flowType)"
          ref="inform"
          :businessScenarioId="sceneId"
          :assetsId="assetsId"
          :disabled="disabledObj[5]"
          @getInformFlowId="getInformFlowId"
          @getFlowKey="getFlowKey"
          :wfIndex="5"
          :wfStep="workflowObj.steps"
        />

        <Agree
          v-if="[0, 3].includes(workflowRow.flowType)"
          ref="agree"
          :disabled="disabledObj[6]"
          @overWorkflow="overWorkflow"
          :wfIndex="6"
          :wfStep="workflowObj.steps"
        />

        <div class="overWorkflow">
          <el-button type="danger" size="medium" :disabled="workflowRow.status !== 0" @click="overWorkflow(2)">{{$t('workflow.结束工作流')}}
          </el-button>
          <el-button type="success" size="medium" :disabled="workflowRow.status !== 0" @click="overWorkflow(1)">{{$t('workflow.完成工作流')}}
          </el-button>
        </div>

        <div class="workFlowGraphical">
          <Graphical 
            ref="graphical"
            :flowTypeOptions="flowTypeOptions"
            :isGraphicalShow="isGraphicalShow"
            :workFlowId="workFlowId"
            @makeWorkflow="makeWorkflow"
          />
        </div>

        <el-dialog
          :title="$t('workflow.工作流列表')"
          :visible.sync="workFlowCrudDialog"
          width="70%"
          append-to-body
          :before-close="beforeClose"
          :fullscreen="isFullscreen">
          <div class="dialog-header" slot="title">
            <span class="dialog-header-title">{{$t('workflow.工作流列表')}}</span>
            <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
              <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
          </div>
          <WorkflowCrud
            ref="workflowCrud"
            @makeWorkflow="makeWorkflow"
          />
        </el-dialog>

      </div>
    </div>
  </div>
</template>

<script>
  import {
    getLastWorkFlow,
    getWorkFlowById,
    checkWorkFlowSteps,
  } from "@/api/workflow"
  import {
    addObj,
    putObj,
} from "@/api/workflowCrud";
  import Graphical from "@/views/workflow/graphical"
  import WorkflowCrud from '@/views/workflowCrud'
  import Scene from "@/views/workflow/scene"
  import Assets from "@/views/workflow/assets"
  import Assessment from "@/views/workflow/assessment"
  import Risk from "@/views/workflow/risk"
  import Inform from "@/views/workflow/inform"
  import Agree from "@/views/workflow/agree"
  import {deepClone} from "@/util/util"
  import {setStore, getStore} from "@/util/store"
  import { flowTypeOptions, workFlowStepsOption } from "@/util/enum"
  import { mapGetters } from "vuex";
  export default {
    name: 'Workflow',
    components: {
      Graphical,
      WorkflowCrud,
      Scene,
      Assets,
      Assessment,
      Risk,
      Inform,
      Agree
    },
    props: {
     
    },
    data() {
      return {
        sceneId: -2,
        assetsId: -2,
        // 评估id
        assessInfoId: -1,
        // 当前工作流参数
        workflowRow: {
          workFlowName: this.$t('crudCommon.暂无'),
          overview: this.$t('crudCommon.暂无'),
          flowType: 0,
        },
        // 进行工作流传参
        workflowObj: {},
        disabledObj: {},
        workFlowForm: {
          workFlowName: this.$t('crudCommon.暂无'),
          overview: this.$t('crudCommon.暂无'),
          flowType: 0,
        },
        workFlowFormStatus: 0, // 0查看、1编辑、2新增
        flowTypeOptions,
        workFlowStepsOption,
        workFlowFormRules: {
          workFlowName: [ { required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('workflow.工作流名称')}`, trigger: 'blur' },],
          overview: [ { required: false, message: `${this.$t('crudCommon.请输入')}${this.$t('crudCommon.描述')}`, trigger: 'blur' },],
          flowType: [ { required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('graphical.工作流类型')}`, trigger: 'change' },]
        },
        workFlowId: '',
        isGraphicalShow: false,
        workFlowCrudDialog: false,
        isFullscreen: false,
      }
    },
    created() {
      this.workflowInit()
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    mounted() {
      document.addEventListener("visibilitychange", this.handleVisiable);
      this.workflowObj.steps = this.workflowRow.steps
    },

    beforeDestroy() {
      document.removeEventListener("visibilitychange", this.handleVisiable);
    },

    methods: {
      currentStepClass(index) {
        let _stepClass = '';
        if (index < this.workflowObj.steps) {
          _stepClass = 'wf-step-item-finish'
        } else if (index == this.workflowObj.steps) {
          _stepClass = 'wf-step-item-process'
        } else if (index > this.workflowObj.steps) {
          _stepClass = 'wf-step-item-wait'
        }
        return _stepClass;
      },

      // 打开或关闭工作流看板
      handleGraphical() {
        this.isGraphicalShow = !this.isGraphicalShow;
        this.workFlowId = getStore({name: 'workflowId'})
        this.$refs.graphical.getWorkFlowList()
      },

      // 打开工作流列表
      showWorkFlowCrud() {
        this.workFlowCrudDialog = true
      },
      // 关闭工作流列表
      beforeClose(done) {
        this.workflowInit()
        this.$refs.graphical.getWorkFlowList()
        done()
      },

      // 工作流初始化
      workflowInit() {
        const workflowId = getStore({ name: 'workflowId' })
        const userId = getStore({ name: 'userId' })
        if(workflowId && userId == this.userInfo.userId) {
          this.getWorkFlowById(workflowId) 
        } else {
          this.getLastWorkFlow()
        }
      },

      // 处理监听窗口离开事件
      handleVisiable() {
        if (document.visibilityState == 'visible') {
            this.workflowInit()
        }
      },

      editBtn(status) {
        this.workFlowFormStatus = status
        this.workFlowForm = this.workFlowFormStatus === 1 ? deepClone(this.workflowRow) : {}
      },
      submit() {
         this.$refs.workFlowForm.validate((valid) => {
          if (valid) {
            const workflowApi = 'id' in this.workFlowForm ? putObj : addObj
            workflowApi(this.workFlowForm).then(res => {
              setStore({
                name: 'workflowId',
                content: res.data.data.id
              })
              this.$message.success(res.data.message)
              this.workFlowFormStatus === 1 ? this.getWorkFlowById(this.workFlowForm.id) : this.getLastWorkFlow()
              this.workFlowFormStatus = 0
              this.$nextTick(() => {
                this.$refs.graphical.getWorkFlowList()

              })  

            })
          } else {
            return false;
          }
        })
      },
      cancel() {
        this.workFlowFormStatus = 0
        this.workflowInit()
      },
       // 获取最近的工作流
      getLastWorkFlow() {
        getLastWorkFlow().then(res => {
          this.workflowRow = res.data.data || this.workflowRow
          this.echoWorkflow(res.data.data)
        })
      },

      // 根据id查询工作流信息
      getWorkFlowById(flowId) {
        getWorkFlowById(flowId).then(res => {
          this.workflowRow = res.data.data ? res.data.data : this.workflowRow
          this.echoWorkflow(res.data.data)
        })
      },

      // 从工作流看板和工作流列表点进工作流
      makeWorkflow(val) {
        console.log(val, '从工作流看板或列表点进来');
        this.workFlowCrudDialog = false
        this.getWorkFlowById(val.id)
      },
     
      // 各模块数据回显
      echoWorkflow(workflowRow) {
        this.workflowObj = {}
        if(!workflowRow) return

        // this.workFlowForm = workflowRow
        const {steps, id, assetsId, businessScenarioId, assessInfoId, flowType} = workflowRow
        setStore({
          name: 'workflowId',
          content: id
        })
        setStore({
          name: 'userId',
          content: this.userInfo.userId
        })
        this.workflowObj.steps = steps
        this.controlDisabled()

        this.assetsId = assetsId || -2
        this.sceneId = businessScenarioId || -2
        console.log(workflowRow,this.sceneId, '各模块数据workflowRow');

        this.assessInfoId = assessInfoId || -1
        this.workflowObj.id = id
        this.$nextTick(() => {
          [0, 3, 4].includes(flowType) && this.$refs.scene.echoContent(workflowRow);
          [0, 1, 3].includes(flowType) && this.$refs.assets.echoContent(workflowRow);
          [0, 1, 2, 4].includes(flowType) && this.$refs.assessment.echoContent(workflowRow);
          [0, 1, 2, 4].includes(flowType) && this.$refs.risk.calculateRiskLevel(workflowRow);
          [0, 3].includes(flowType) && this.$refs.inform.echoContent(workflowRow);
        })
      },

      // 控制禁用
      controlDisabled() {
        this.disabledObj = {
          1: true,
          2: true,
          3: true,
          4: true,
          5: true,
          6: true,
        }
        if(this.workflowRow.status !== 0) return

        switch (this.workflowRow.flowType){
          case 0://合规驱动全工作流
              for (let k in this.disabledObj) {
                if(this.workflowObj.steps == 0) {
                  this.disabledObj[1] = false
                  this.disabledObj[2] = false
                }
                console.log(k, this.workflowObj.steps,"当前步骤，状态0")
                if(k == this.workflowObj.steps) {
                  if(this.workflowObj.steps == 4) {
                  }else if(this.workflowObj.steps == 6) {
                    this.disabledObj[5] = false
                    this.disabledObj[6] = false
                  }else {
                    this.disabledObj[k] = false
                    this.disabledObj[k*1+1] = false
                  }
                }
              }
              break;
          case 1://资产评估
              for (let k in this.disabledObj) {
                if(this.workflowObj.steps == 0) {
                  this.disabledObj[2] = false
                }
                if(this.workflowObj.steps == 2) {
                  this.disabledObj[2] = false
                  this.disabledObj[3] = false
                }
                console.log(k, this.workflowObj.steps,"当前步骤，状态1")
              }
              break;
          case 2://管理类综合评估
              for (let k in this.disabledObj) {
                if(this.workflowObj.steps == 0) {
                  this.disabledObj[3] = false
                }
                console.log(k, this.workflowObj.steps,"当前步骤，状态2")
              }
              break;
          case 3://告知及权利响应工作流
              for (let k in this.disabledObj) {
                if([0, 1].includes(this.workflowObj.steps)) {
                  this.disabledObj[1] = false
                  this.disabledObj[2] = false
                }
                if(this.workflowObj.steps == 2) {
                  this.disabledObj[2] = false
                  this.disabledObj[5] = false
                }
                if([5, 6].includes(this.workflowObj.steps)) {
                  this.disabledObj[5] = false
                  this.disabledObj[6] = false
                }
                console.log(k, this.workflowObj.steps,"当前步骤，状态3")
              }
              break;
          case 4://业务场景评估
              for (let k in this.disabledObj) {
                if(this.workflowObj.steps == 0) {
                  this.disabledObj[1] = false
                }
                if(this.workflowObj.steps == 1) {
                  this.disabledObj[3] = false
                }
                console.log(k, this.workflowObj.steps,"当前步骤，状态4")
              }
              break;
        }
        
      },
      
      // 获取业务场景id
      getSceneId(sceneId, steps) {
        this.sceneId = sceneId
        this.workflowObj.steps = steps
        this.workflowObj.businessScenarioId = sceneId

        this.checkWorkFlowSteps(this.workflowObj)
      },

      // 资产控制业务场景禁用
      changeSceneDisabled(val, assetsId, steps) {
        this.assetsId = assetsId
        this.workflowObj.steps = steps
        this.workflowObj.assetsId = assetsId

        this.checkWorkFlowSteps(this.workflowObj)
      },

      // 评估控制资产禁用
      changeAssetsDisabled(val, assessInfoId, steps) {
        this.assessInfoId = assessInfoId
        this.workflowObj.steps = steps
        this.workflowObj.assessInfoId = assessInfoId

        this.checkWorkFlowSteps(this.workflowObj)
      },

      // 通过风险评估
      passRisk(steps, workflowStatus) {
        workflowStatus && (this.workflowObj.status = workflowStatus)
        this.workflowObj.steps = steps
        this.checkWorkFlowSteps(this.workflowObj)
      },

      // 获取告知工作流id
      getInformFlowId(val, steps) {
        this.workflowObj.steps = steps
        this.workflowObj.informFlowId = val.id
        this.getFlowKey(val)
        this.checkWorkFlowSteps(this.workflowObj)
      },

      // 填充同意模块
      getFlowKey(val) {
        this.$refs.agree.echoContent(val.flowKey)
      },

      // 结束工作流
      overWorkflow(type) {
        this.$confirm(this.$t('workflow.是否结束此工作流'), this.$t('crudCommon.提示'), {
          confirmButtonText: this.$t('crudCommon.确定'),
          cancelButtonText: this.$t('crudCommon.取消'),
          type: 'warning'
        }).then(() => {
          this.workflowObj.status = type
          this.checkWorkFlowSteps(this.workflowObj).then(() => {
            this.$message.success(this.$t('workflow.已结束此条工作流'))
          })
        })
        
      },

      // 保存
      checkWorkFlowSteps(params) {
        return checkWorkFlowSteps(params).then(res => {
          this.workflowInit()
          this.$refs.graphical.getWorkFlowList()
        })
      },
    }
  }
</script>

<style lang="scss">
  .workFlowName {
    .el-form--inline {
      text-align: center;
    }

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .workFlowSteps {
    .el-step__title {
      font-size: 14px;
    }
  }
</style>

<style scoped="scoped" lang="scss">
@import "../../styles/mixins";
  .workflow {
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;

    .workFlowTitle {
      width: calc(100% - 40px);
      position: fixed;
      z-index: 1026;
      border-top: 10px solid #f2f8fc;
      display: flex;
      justify-content: space-around;
      background: #fff;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      font-size: 14px;
      // padding: 10px 0;

      .workFlowName {
        width: 100%;
        padding: 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        min-width: 500px;

        .current-work-flow {
          text-align: center;
          line-height: 32px;

          .label {
            color: #666;
          }

          .name {
            color: #409EFF;
          }
        }
      }
      
      .btns {
        white-space: nowrap;
        text-align: center;
        padding: 10px;
      }
    }

    .workFlowBody {
      padding-top: 62px;
      overflow-y: auto;
      position: relative;
      text-align: center;
    }

    .workFlowSteps {
      display: inline-block;
      margin: 10px auto;
      height: 50px;
      padding: 0 50px;
      /*background: #e2e2e2;*/
      /*-webkit-border-radius: 5px;*/
      /*-moz-border-radius: 5px;*/
      /*border-radius: 5px;*/

      .wf-step-box {
        height: 100%;
        @include flexbox;
        @include align-items(center);
        @include justify-content(center);
        @include flex-wrap(nowrap);
      }


      .wf-step-item {
        position: relative;
        margin-right: 80px;
        font-size: 16px;
        font-weight: bold;
        color: #333;

        &.wf-step-item-finish {
          color: #01aea9;

          &:after {
            color: #01aea9;
          }
        }

        &.wf-step-item-process {
          color: #333;
        }

        &.wf-step-item-wait {
          @include opacity(.5)
        }

        i {
          font-size: 20px;
          margin-right: 5px;
          vertical-align: -1px;
        }

        img {
          width: 18px;
          height: auto;
          vertical-align: -3px;
          margin-right: 5px;
        }

        &:last-child {
          margin-right: 0;

          &:after {
            display: none;
          }
        }

        &:after {
          font-family: element-icons !important;
          display: block;
          content: "\e6e0";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: -50px;
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }
      }
    }

    .overWorkflow {
        width: 100%;
        text-align: center;
      }
  }


  
</style>
