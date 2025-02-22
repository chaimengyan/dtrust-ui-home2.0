<template>
    <div class="scene">
      <transition name="graphical">
        <div v-show="isGraphicalShow" class="scene-right">
          <div class="scene-right-content">
            <div class="scene-title">
              <span class="title">{{$t('graphical.工作流看板')}}</span>
            </div>
            <div class="scene-right-workflow">
              <template>
                <el-collapse accordion>
                  <el-collapse-item>
                    <template slot="title">
                      <i class="el-icon-search"></i>
                    </template>
                    <el-row :gutter="60">
                      <el-col :span="24"> 
                        <el-select v-model="searchForm.assetsId" :placeholder="`${$t('crudCommon.请选择')}${$t('assets.资产')}`" size="mini" clearable filterable
                          style="width: 100%;">
                          <el-option
                            v-for="item in assetsOptions"
                            :key="item.projectId"
                            :label="item.projectName"
                            :value="item.projectId"
                            >
                          </el-option>
                        </el-select>
                      </el-col>

                      <el-col :span="24">
                        <el-select v-model="searchForm.businessScenarioId" :placeholder="`${$t('crudCommon.请选择')}${$t('scene.业务活动')}`" size="mini" clearable filterable
                          style="width: 100%;" >
                          <el-option
                            v-for="item in sceneOptions"
                            :key="item.sceneId"
                            :label="item.sceneName"
                            :value="item.sceneId"
                            >
                          </el-option>
                        </el-select>
                      </el-col>

                      <el-col :span="24">
                        <el-select v-model="searchForm.flowType" :placeholder="`${$t('crudCommon.请选择')}${$t('graphical.工作流类型')}`" size="mini" clearable filterable 
                          style="width: 100%;">
                          <el-option
                            v-for="item in flowTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                          </el-option>
                        </el-select>
                      </el-col>
                    
                      <el-col :span="24">
                        <el-input
                          :placeholder="`${$t('crudCommon.请输入')}${$t('crudCommon.关键字')}`"
                          v-model="searchForm.keyword"
                          size="mini"
                          clearable>
                        </el-input>
                      </el-col>
                      <el-col :span="24" style="text-align: center;">
                        <el-button type="primary" icon="el-icon-search" @click="searchBtn" circle></el-button>
                        <el-button icon="el-icon-close" @click="clearBtn" circle></el-button>
                      </el-col>
                    </el-row>

                  </el-collapse-item>
                </el-collapse>
              </template>

              <template v-for="item in workFlowList">
                <el-tooltip
                  placement="top"
                  effect="light"
                  :key="item.id">
                  <div slot="content">
                    {{$t('graphical.名称')}}：{{item.workFlowName}}<br/>
                    {{$t('graphical.当前步骤')}}：{{workFlowStepsList(item)}}<br/>
                    {{$t('graphical.工作流类型')}}：{{flowTypeOptions.find(x => (x.value === item.flowType)).label}}
                  </div>
                  <el-progress
                    class="gra-el-progress"
                    :class="workflowId == item.id ? 'current-workflow':''"
                    :percentage="percentage(item)"
                    :color="workFlowStatus(item.status)"
                    @click.native="workflow(item)"
                  />
              </el-tooltip>
            </template>

          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getWorkFlowList
} from "@/api/workflow"
import { 
  getAllAssetsProject,
  } from "@/api/workflow/assets";
  import { 
  getAllAssetsBusinessScene,
  } from "@/api/workflow/scene";
import { mapGetters } from "vuex";
import { workFlowStatusList, stepsListKind } from "@/util/enum"
import {getStore} from "@/util/store"

export default {
  name: "Graphical",
  props: {
    flowTypeOptions: {
      type: Array,
      default: () => []
    },
    isGraphicalShow: {
      type: Boolean,
      default: false
    },
    workFlowId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
        workFlowList: [],
        workflowId: this.workFlowId,
        searchForm: {},
        assetsOptions: [],
        sceneOptions: [],
        workFlowStatusList,
        stepsListKind
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    percentage() {
      return (item) => {
        const i = this.stepsListKind[item.flowType].findIndex(x => (x.value === item.steps))
        console.log(i, this.stepsListKind[item.flowType].length,'进度');
        const num = i*100 / (this.stepsListKind[item.flowType].length-1)
        return Math.round(num)
      }
    },
    workFlowStepsList() {
      return (item) => {
        const steps = this.stepsListKind[item.flowType].find(x=> (x.value === item.steps))
        if(!steps) {
          console.log(item.flowType, item.steps,this.stepsListKind[item.flowType],'22222');

        }
        return steps ? steps.label : ''
      }
    },
    workFlowStatus() {
      return (val) => {
        const status = this.workFlowStatusList.find(x=> (x.value === val)).color
        return status
      }
    },
  },
  created() {
    this.getWorkFlowList()
    this.getAllAssetsProject()
    this.getAllAssetsBusinessScene()
    this.workflowId = getStore({ name: 'workflowId' })
  },
  methods: {
    // 搜索
    searchBtn() {
      this.getWorkFlowList(this.searchForm)
    },

    // 清空
    clearBtn() {
      this.searchForm = {}
      this.getWorkFlowList(this.searchForm)
    },

    // 获取全部工作流
    getWorkFlowList(query) {
      getWorkFlowList(query).then(res => {
        this.workFlowList = res.data.data
      })
    },

    // 查询所有的资产
    getAllAssetsProject() {
      getAllAssetsProject().then(res => {
        this.assetsOptions = res.data.data
      })
    },

    // 查询全部业务场景
    getAllAssetsBusinessScene() {
      getAllAssetsBusinessScene().then(res => {
        this.sceneOptions = res.data.data
      })
    },
    workflow(item) {
        this.$emit('makeWorkflow', item)
        this.workflowId = item.id
    },

   
  },
};
</script>

<style scoped="scoped" lang="scss">
  .scene {
    width: 21%;
    // min-height: 200px;
    display: flex;
    margin-bottom: 20px;
    position: fixed;
    top: 160px;
    right: 20px;
    z-index: 1001;

    .graphical-enter-active {
      transition: all .3s ease;
    }

    .graphical-leave-active {
      transition: all .3s ease;
    }

    .graphical-enter, .graphical-leave-to {
      transform: translateX(10px);
      opacity: 0;
    }

    .scene-title {
      position: absolute;
      left: 50%;
      width: 100%;
      top: 0;
      transform: translateX(-50%);
      z-index: 99;
    }

    .title {
      display: block;
      text-align: center;
      -webkit-border-radius: 5px 5px 0 0;
      -moz-border-radius: 5px 5px 0 0;
      border-radius: 5px 5px 0 0;
      background-color: #2091f4;
      padding: 2px 4px 4px 4px;
      /*border-radius: 5px;*/
      color: #fff;
      font-size: 14px;
      white-space: nowrap;
    }

    .scene-right {
      width: 100%;
      /*margin-right: 4px;*/
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      background-color: #fff;
      position: relative;
      box-shadow: 0 5px 15px 0 rgba(0, 0, 0, .15);
    }

    .scene-right-content {
      padding: 0px 0px 0px 10px;
    }

    .scene-right-workflow {
      margin-top: 20px;
      text-align: left;
      max-height: 500px;
      padding: 10px 10px 10px 10px;
      overflow: auto;
    }
   
    .gra-el-progress {
      transition: all 0.3s;

      &:hover {
        box-shadow: 2px 4px 8px 2px #adafb2;
        transform: scale(1.05);
      }
    }

    .current-workflow {
      box-shadow: 2px 4px 8px 2px #adafb2;
      transform: scale(1.05);
    }
  }
</style>
