<template>
  <div class="scene">
    <div class="scene-head">
      <span class="title">{{$t('inform.政策条款')}}</span>
    </div>
    <div class="scene-body" :data-text="$t('crudCommon.请完成上一步')" :class="activeClass">
      <div class="scene-left common-box">
        <div class="scene-left-content" :class=" disabled ? 'disabled' : ''">
          <draggable
            v-model="leftList"
            @end="leftEnd"
            :clone="cloneComponent"
            :options="{ group: { name: 'mainArea', pull: 'clone' }, sort: true }"
            animation="300"
            :move="onMove"
            :disabled="disabled"
          >
            <transition-group class="left-list">
              <div v-for="(item, index) in leftList" :data-id="item.id" :key="index">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    {{ item.informFlowName }}
                  </div>
                  <div
                    class="left-block common-block"
                    :style="{ 'background-color': item.color }"
                  >
                    <i :class="item.icon"></i>
                  </div>
                </el-tooltip>
              </div>
            </transition-group>
          </draggable>
          <div class="left-block common-block plusBtn" @click="addBtn">
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </div>

      <div class="scene-main common-box">
        <div class="scene-main-content" :class=" disabled ? 'disabled' : ''">
          <draggable
            v-if="isIcon"
            v-model="mainList"
            @end="mainEnd"
            group="mainArea"
            animation="300"
            :move="onMove"
            class="main-drag"
            :disabled="disabled"
          >
            <div v-for="(item, index) in mainList" :key="index">
              <div v-if="item.id === -2" class="mark-tips">
                {{item.informFlowName}}
              </div>
              <div v-else class="mark-checked">
                <el-tooltip
                  placement="bottom"
                  effect="light"
                >
                  <div slot="content">
                    {{ item.informFlowName }}
                  </div>
                  <div
                    class="main-block common-block"
                    :style="{ 'background-color': item.color }"
                  >
                    <i :class="item.icon" style="font-size: 32px"></i>
                  </div>
                </el-tooltip>
                <div class="operation">
                  <el-tooltip :content="$t('crudCommon.编辑')" placement="bottom" effect="light">
                    <el-link icon="el-icon-edit" :underline="false" :disabled="disabled" @click="editBtn(item)" />
                  </el-tooltip>
                  <div style="padding-bottom: 2px;color: #999;">|</div>
                  <el-tooltip :content="$t('crudCommon.查看')" placement="bottom" effect="light">
                    <el-link icon="el-icon-view" :underline="false" @click="viewBtn(item)" />
                  </el-tooltip>
                  <div style="padding-bottom: 2px;color: #999;">|</div>
                  <el-tooltip :content="$t('crudCommon.删除')" placement="bottom" effect="light">
                    <el-link :style="disabled?'': 'color: red;'" icon="el-icon-delete" :underline="false" :disabled="disabled" @click="delBtn(item)" />
                  </el-tooltip>
                </div>
              </div>
            </div>
          </draggable>
          <div class="sceneForm" v-else>
            <el-dialog 
              :visible="true" 
              width="35%" 
              :close-on-click-modal='false' 
              @close="cancel"
              :fullscreen="isFullscreen">
              <div class="dialog-header" slot="title">
                  <span class="dialog-header-title">{{$t('inform.政策条款')}}</span>
                  <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                      <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
                  </div>
              </div>
              <avue-form :option="option" v-model="sceneForm">
              </avue-form>
              <div v-if="!option.detail" slot="footer" class="dialog-footer">
                  <el-button icon="el-icon-circle-check" type="primary" @click="submit">{{$t('assets.修改')}}</el-button>
                  <el-button icon="el-icon-circle-close" @click="cancel">{{$t('assets.取消')}}</el-button>
              </div>
            </el-dialog>
          </div>
            
        </div>
      </div>

      <div style="opacity: 0;" class="scene-right common-box">
        <div class="scene-right-content">
          <i class="el-icon-cpu"></i>
          <span class="text">{{$t('assessment.功能待开发')}}</span>
        </div>
      </div>
    </div>
    <div class="scene-arrow">
      <svg-icon :icon-class="disabled ?'icon-arrow-down':'icon-arrow-down-active'" class="scene-icon"></svg-icon>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { deepClone } from "@/util/util";
import { previousStep } from "@/util/workflow";
import { stepsListKind } from "@/util/enum"
import { 
  getSimpleListForFlow,
  cloneInformFlow,
  editInformFlow
  } from "@/api/workflow/inform";
import {tableOption} from "@/const/crud/workflow/inform"
import { mapGetters } from "vuex";
import { isDev, isTest } from '@/util/env'
 
const defaultDrag = { informFlowName: i18n.t('assessment.将图标拖拽至此处'), id: -2 }

export default {
  name: "Inform",
  components: {
    draggable,
  },
  props: {
    businessScenarioId: {
      type: Number,
      default: -1
    },
    assetsId: {
      type: Number,
      default: -1
    },
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
      leftList: [],
      mainList: [defaultDrag],
      moveId: -1,
      isIcon: true,
      option: {},
      sceneForm: {},
      // 业务场景信息字段
      sceneList: [],
      stepsListKind,
      flowType: 0,
      isFullscreen: false,
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
    this.getSimpleListForFlow();
    this.option = tableOption(this)
  },
  methods: {
    editBtn() {
      this.isIcon = false
      this.option.detail = false
    },
    viewBtn() {
      this.isIcon = false
      this.option.detail = true
    },
    delBtn() {
      this.mainList = [defaultDrag]
      this.$emit('getInformFlowId', {id: -2, flowKey: ''}, previousStep(this.stepsListKind, this.flowType, 5))
    },
    submit(form,done) {
      editInformFlow(this.sceneForm).then(res => {
        this.isIcon = true
        // this.mainList = [defaultDrag, form]

        this.mainList = [this.sceneForm]
        this.getSimpleListForFlow();
        done()
      }).catch(() => {
        done()
      })
    },
    cancel() {
      this.isIcon = true
    },
    addBtn() {
      const powerUrl = !isDev() ? !isTest() ? `https://power.idatatrust.com` : 'http://116.205.172.167:38083' : `http://${window.location.hostname}:38083` 
      const assUrl = `${powerUrl}/#/inform/workflow`;
      window.open(assUrl, "_blank");
    },
    // 获取全部告知流
    getSimpleListForFlow() {
      return getSimpleListForFlow().then((res) => {
        this.leftList = res.data.data;
      });
    },

    // 回显
    async echoContent(workflowRow) {
      const { informFlowId, flowType } = workflowRow
      this.flowType = flowType
      if (informFlowId === null) {
        this.mainList = [defaultDrag]
        this.$emit('getFlowKey', '')
        return
      } 

      await this.getSimpleListForFlow()
      
      const item = this.leftList.find((m) => m.id == informFlowId);
      if (item) {
        // this.mainList = [defaultDrag, item]
        this.mainList = [item]
        this.sceneForm = item
        this.$emit('getFlowKey', item)
      }
    },

    // 克隆告知流
    cloneInformFlow(query) {
      cloneInformFlow(query).then(res => {
        // this.mainList = [defaultDrag, res.data.data]
        this.mainList = [res.data.data]
        this.sceneForm = res.data.data
        this.$emit('getInformFlowId', res.data.data, 6)
      })
    },

    leftEnd(e) {
      if (!e.to.className.includes('main-drag')) return;
      const item = this.leftList.find((m) => m.id == e.item._underlying_vm_.id);
      if (item) {
        this.cloneInformFlow(
          {
            flowId: item.id,
            businessSceneId: this.businessScenarioId,
            assetsId: this.assetsId,
          })
      }
    },

    onMove(e, originalEvent) {
      this.moveId = e.draggedContext.element.id;
      //不允许拖拽
      if (e.draggedContext.element.id == -2) return false;
      return true;
    },

    mainEnd(e) {
      console.log(e.to, 'mainend')
      if(e.to.className.includes('left-list')) {
        this.delBtn()
      }
      const items = this.leftList.filter((m) => m.id == this.moveId);
      //如果左边
      if (items.length < 2) return;
      this.leftList.splice(e.newDraggableIndex, 1);
    },
    cloneComponent(origin) {
      const clone = deepClone(origin);
      return clone;
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
      }

      .main-drag {
        width: 80px;
        height: 100px;
        margin: 0 auto;
        margin-top: 30px;
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
        margin-bottom: 10px;
        transition: all 0.3s;
        box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
        // border: 2px solid #87898a;
        &:hover {
            transform: scale(1.1);
          }
      }

      .mark-tips {
        position: absolute;
        top: 50%;
        left: 50%;
        @include transform(translate(-50%, -50%));
        font-size: 12px;
        color: #999;
      }

      .mark-checked {
        position: absolute;
        top: 50%;
        left: 50%;
        @include transform(translate(-50%, -50%));
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
