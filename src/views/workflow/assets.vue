<template>
  <div class="scene">
    <div class="scene-head">
      <span class="title">{{$t('assets.资产管理')}}</span>
    </div>
    <div class="scene-body" :class="activeClass">
      <div class="scene-left common-box">
        <div class="scene-left-content" :class=" disabled ? 'disabled' : ''">
          <draggable
            v-model="leftList"
            @end="leftEnd"
            :clone="cloneComponent"
            :options="{ group: { name: 'assetsMainArea', pull: 'clone' }, sort: true }"
            animation="300"
            :move="onMove"
            :disabled="disabled"
          >
            <transition-group class="left-list">
              <div v-for="(item, index) in leftList" :data-id="item.id" :key="index">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    {{ item.projectName }}
                  </div>
                  <div
                    class="left-block common-block"
                    :style="{ 'background-color': item.projectColor }"
                  >
                    <i :class="item.projectIcon"></i>
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
            group="assetsMainArea"
            animation="300"
            :move="onMove"
            class="main-drag"
            :disabled="disabled"
          >
            <div v-for="(item, index) in mainList" :key="index">
              <div class="mark-tips" v-if="item.projectId === -2">
                {{item.projectName}}
              </div>
              <div v-else class="mark-checked">
                <el-tooltip
                  placement="bottom"
                  effect="light"
                >
                  <div slot="content">
                    {{ item.projectName }}
                  </div>
                  <div
                    class="main-block common-block"
                    :style="{ 'background-color': item.projectColor }"
                  >
                    <i :class="item.projectIcon" style="font-size: 32px"></i>
                  </div>
                </el-tooltip>
                <div class="operation">
                  <el-tooltip :content="$t('crudCommon.编辑')" placement="bottom" effect="light">
                    <el-link icon="el-icon-edit" :underline="false" :disabled="disabled" @click="editBtn(item)" />
                  </el-tooltip>
                  <div style="padding-bottom: 2px;color: #999;">|</div>
                  <el-tooltip :content="$t('crudCommon.查看')" placement="bottom" effect="light">
                    <el-link class="el-icon-view" :underline="false" @click="viewBtn(item)" />
                  </el-tooltip>
                  <div style="padding-bottom: 2px;color: #999;">|</div>
                  <el-tooltip :content="$t('crudCommon.删除')" placement="bottom" effect="light">
                    <el-link class="el-icon-delete" :underline="false" :disabled="disabled" @click="delBtn(item)" />
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
                  <span class="dialog-header-title">{{$t('assets.资产')}}</span>
                  <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                      <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
                  </div>
              </div>
              <avue-form :option="option" v-model="projectForm">
                <!-- 经纬度 -->
                <template slot="hostingLocation">
                  <avue-input v-model="projectForm.hostingLocation" @focus="openMap" :placeholder="`${$t('crudCommon.请选择')}${$t('assets.托管位置')}`"  />
                </template>
              </avue-form>
              <div v-if="!option.detail" slot="footer" class="dialog-footer">
                  <el-button type="primary" icon="el-icon-circle-check" @click="submit">{{$t('assets.修改')}}</el-button>
                  <el-button icon="el-icon-circle-close" @click="cancel">{{$t('assets.取消')}}</el-button>
              </div>
            </el-dialog>
          </div>
          <el-dialog
            :title="$t('assets.地图')"
            width="70%"
            :visible.sync="showMap"
            append-to-body
            :fullscreen="isFullscreen"
          >
            <div class="dialog-header" slot="title">
              <span class="dialog-header-title">{{$t('assets.地图')}}</span>
              <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
              </div>
            </div>
            <div>{{$t('assets.当前位置')}} {{ projectForm.hostingLocation }} <br/>
                {{$t('assets.当前经纬度')}} {{ projectForm.lng }}, {{ projectForm.lat }} 
            </div>
            <div id="baiduMap" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-circle-check" @click="saveLatlng">{{$t('assets.保存')}}</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <div class="scene-right common-box">
        <div class="scene-right-title">自动化检测、数据发现</div>
        <div class="scene-right-content" :class=" disabled ? 'disabled' : ''">
          <draggable
            v-model="rightList"
            @end="rightEnd"
            :clone="rightCloneComponent"
            :options="{ group: { name: 'assetsMainArea', pull: 'clone' }, sort: true }"
            animation="300"
            :move="onMove"
            :disabled="disabled"
          >
            <transition-group class="right-list">
              <div v-for="(item, index) in rightList" :data-id="item.value" :key="index">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    {{ $t(`assets.${item.label}`) }}
                  </div>
                  <div
                    class="right-block common-block"
                  >
                    <img style="width:100%" :src="item.src"></img>
                  </div>
                </el-tooltip>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
    <div class="scene-arrow">
      <svg-icon :icon-class="disabled ?'icon-arrow-down':'icon-arrow-down-active'" class="scene-icon"></svg-icon>
    </div>
    <el-dialog 
      :visible.sync="importAssetsDialog"
      width="70%" 
      :close-on-click-modal='false' 
      @close="cancel" 
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
          <span class="dialog-header-title">{{$t(`assets.导入`)}}{{$t(`assets.${rightCloneData.label}`)}}</span>
          <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
              <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
          </div>
      </div>
      <template v-if="rightCloneData.value === '1'">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          :placeholder="`${$t('crudCommon.请输入')}SDK`"
          v-model="SDK">
        </el-input>
      </template>
      <template v-else>
        <template v-if="rightCloneData.value === '0'">
          <el-form ref="appform" :model="appform" :rules="appformRules" label-width="80px">
            <el-form-item :label="`app${$t('graphical.名称')}`" prop="appName">
              <el-input
                :autosize="{ minRows: 2, maxRows: 4}"
                :placeholder="`${$t('crudCommon.请输入')}app${$t('graphical.名称')}`"
                v-model="appform.appName">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('assets.apk文件')" prop="appFileList">
              <el-upload
                class="upload-demo"
                action=""
                :before-upload="appBeforeUpload"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :accept="'.apk'"
                :limit="1"
                v-loading.fullscreen.lock="fullscreenLoading"
                :on-exceed="handleExceed"
                :file-list="appform.appFileList"
                drag>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">{{$t(`assets.将文件拖到此处或`)}}<em>{{$t('crudCommon.点击上传')}}</em></div>
                  <div slot="tip" class="el-upload__tip">{{`${$t('assets.请上传')}${'.apk'}${$t('assets.类型的文件')}`}}</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="`${$t('assets.隐私文本')}${$t('graphical.名称')}`" prop="privacyTextName">
              <el-input
                :autosize="{ minRows: 2, maxRows: 4}"
                :placeholder="`${$t('crudCommon.请输入')}${$t('assets.隐私文本')}${$t('graphical.名称')}`"
                v-model="appform.privacyTextName">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('assets.隐私文本')" prop="txtFileList">
              <el-upload
                class="upload-demo"
                action=""
                :before-upload="txtBeforeUpload"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                accept=".txt"
                :limit="1"
                v-loading.fullscreen.lock="fullscreenLoading"
                :on-exceed="handleExceed"
                :file-list="appform.txtFileList"
                drag>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">{{$t(`assets.将文件拖到此处或`)}}<em>{{$t('crudCommon.点击上传')}}</em></div>
                  <div slot="tip" class="el-upload__tip">{{`${$t('assets.请上传')}${'.txt'}${$t('assets.类型的文件')}`}}</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </template>
        <template v-else>
          <el-upload
              class="upload-demo"
              action=""
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :accept="'*.sql'"
              :limit="1"
              v-loading.fullscreen.lock="fullscreenLoading"
              :on-exceed="handleExceed"
              :file-list="fileList"
              drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{$t(`assets.将文件拖到此处或`)}}<em>{{$t('crudCommon.点击上传')}}</em></div>
              <div slot="tip" class="el-upload__tip">{{`${$t('assets.请上传')}${'*.sql'}${$t('assets.类型的文件')}`}}</div>
          </el-upload>
        </template>
      </template>
        
      <div slot="footer" class="dialog-footer">
          <el-button icon="el-icon-circle-plus-outline" type="primary" @click="submitImport">{{$t('assets.保存')}}</el-button>
          <el-button icon="el-icon-circle-close" @click="cancelImport">{{$t('assets.取消')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { deepClone } from "@/util/util";
import { previousStep } from "@/util/workflow";
import { stepsListKind } from "@/util/enum"
import { 
  getProjectAttributesBySceneId,
  updateAsset,
  getAllAssetsProject,
  appUpload,
  getTableByName,
  getAssetsFieldByTableName
  } from "@/api/workflow/assets";
import {tableOption} from "@/const/crud/workflow/assets"
import { mapGetters } from "vuex";

const defaultDrag = { projectName: i18n.t('assessment.将图标拖拽至此处'), projectId: -2 }

export default {
  name: "Assets",
  components: {
    draggable,
  },
  props: {
    sceneId: {
      type: Number,
      default: -2
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
      appform: {
        txtFileList: [],
        appFileList: []
      },
      appformRules: {
        appName: [
            { required: true, message: `${this.$t('crudCommon.请输入')}app${this.$t('graphical.名称')}`, trigger: 'blur' },
          ],
          appFileList: [
            { required: true, message: `${this.$t('assets.请上传')}${'.apk'}${this.$t('assets.类型的文件')}`, trigger: 'change' }
          ],
          privacyTextName: [
            { required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('assets.隐私文本')}${this.$t('graphical.名称')}`, trigger: 'blur' }
          ],
          txtFileList: [
            { required: true, message: `${this.$t('assets.请上传')}${'.txt'}${this.$t('assets.类型的文件')}`, trigger: 'change' }
          ],
      },
      rightList: [
        {
          label: 'app',
          color: 'rgba(193, 106, 106, 1)',
          src: '/img/apk.png',
          value: '0'
        }, {
          label: '小程序',
          color: 'rgba(193, 106, 106, 1)',
          src: '/img/xiaochengxv.png',
          value: '1'
        }, {
          label: '数据库',
          color: 'rgba(193, 106, 106, 1)',
          src: '/img/shujvk.png',
          value: '2'
        },
      ],
      rightCloneData: {},
      SDK: '',
      // 文件列表
      fileList: [],
      fullscreenLoading: false,
      importAssetsDialog: false,
      mainList: [defaultDrag],
      moveId: -1,
      isIcon: true,
      option: {},
      projectForm: {},
      stepsListKind,
      flowType: 0,
      isFullscreen: false,
      showMap:false,
      map: null,
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
  watch: {
    'sceneId': {
      handler() {
        console.log(this.sceneId , 'this.sceneId this.sceneId ');
        // if(this.sceneId !== -2 && this.sceneId !== null && this.sceneId !== undefined) {
          this.getProjectAttributesBySceneId(this.sceneId);
        // } else {
        //   this.leftList = []
        // }
      },
      immediate: true
    }
  },
  created() {
    // this.option = tableOption(this, this.userInfo.tenantId)
    this.getTable()
  },
  methods: {
    //查询table/业务场景表格/表单配置
    getTable() {
      getTableByName('asset').then(tableRes => {
        getAssetsFieldByTableName('asset').then(res => {
          this.option = {
            ...tableRes.data.data,
            column: res.data.data
          };
          tableOption(this, this.userInfo.tenantId, this.option)
        })
      })
    },
    // 上传文件
    beforeUpload(file) {
        this.fullscreenLoading = true
        const param = new FormData()
        param.append('file', file)
        this.axios.post('/assets/assetsProject/exportProjectAndAttributes', param).then(res=>{
          this.$message.success(res.data.message);
          this.importAssetsDialog = false
          this.fullscreenLoading = false
        }).catch(() => {
          this.importAssetsDialog = false
          this.fullscreenLoading = false
        })
        return false
    },
    appBeforeUpload(file) {
      this.fullscreenLoading = true
      this.appform.appFileList.push(file)
      this.fullscreenLoading = false
      return false
    },
    txtBeforeUpload(file) {
      this.fullscreenLoading = true
      this.appform.txtFileList.push(file)
      this.fullscreenLoading = false
      return false
    },
    // 删除文件
    handleRemove() {},
    // 删除文件之前
    beforeRemove() {},
    // 超出数量大小提示
    handleExceed() {},
    submitImport() {
      if(this.rightCloneData.value === '0') {
        this.fullscreenLoading = true
        this.$refs.appform.validate((valid) => {
          if (valid) {
            const param = new FormData()
            param.append('appFile', this.appform.appFileList[0])
            param.append('txtFile', this.appform.txtFileList[0])
            param.append('appName', this.appform.appName)
            param.append('privacyTextName', this.appform.privacyTextName)
            console.log(param, 'appformappformappform');
            appUpload(param).then(res => {
              this.$message.success(res.data.message)
              this.importAssetsDialog = false
              this.fullscreenLoading = false
              
            })
          } else {
            return false;
          }
        });
      } else {
        this.importAssetsDialog = false

      }
      
    },
    cancelImport() {
      this.importAssetsDialog = false
    },
    openMap() {
      this.showMap = true
      // if (this.map) return;
      this.$nextTick(() => {
        this.map = new BMapGL.Map("baiduMap");

        const scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
        this.map.addControl(scaleCtrl);
        const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        this.map.addControl(zoomCtrl);
        const cityCtrl = new BMapGL.CityListControl();  // 添加城市列表控件
        this.map.addControl(cityCtrl);
        this.map.enableScrollWheelZoom(true) // 滚轮放大缩小地图
        const point = new BMapGL.Point(this.projectForm.lng||116.404, this.projectForm.lat||39.915);
        
        this.map.centerAndZoom(point, 15); 
        const marker = new BMapGL.Marker(point);  // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
        const geoc = new BMapGL.Geocoder();
        this.map.addEventListener('click', (e) => {
          this.projectForm.lng = e.latlng.lng
          this.projectForm.lat = e.latlng.lat
          //创建标注位置
          const pt = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
          const marker = new BMapGL.Marker(pt);  // 创建标注
          this.map.clearOverlays()
          this.map.addOverlay(marker); // 将标注添加到地图中
          geoc.getLocation(e.latlng, (rs) => {
              const addComp = rs.addressComponents;
              this.projectForm.hostingLocation = `${addComp.province},${addComp.city}`
              // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          })
        })
      })
    },

    saveLatlng() {
      this.showMap = false
    },
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
      this.$emit('changeDisabled', false, -2, previousStep(this.stepsListKind, this.flowType, 2))
    },
    submit() {
      if(Array.isArray(this.projectForm.organizationalSecurityMeasures) || typeof this.projectForm.organizationalSecurityMeasures === 'object') {
        this.projectForm.organizationalSecurityMeasures = this.projectForm.organizationalSecurityMeasures.join()
      }
      this.projectForm.sceneIds = []
      let formReduce = {}
      for(let key in this.projectForm) {
        if(Array.isArray(this.projectForm[key])) {
          this.projectForm[key] = this.projectForm[key].join()
        }
        if(key.substr(0, 1) !== '$') {
          formReduce[key] = this.projectForm[key]
        }
      }
      updateAsset(formReduce).then(res => {
        this.isIcon = true
        // this.mainList = [defaultDrag, form]
        this.mainList = [this.projectForm]
        this.getProjectAttributesBySceneId(this.sceneId);
        this.$message.success(res.data.message)
      })
    },
    cancel() {
      this.isIcon = true
    },
    addBtn() {
      const assUrl = `http://116.205.172.167:38082/#/assets/assetsManagement`;
      window.open(assUrl, "_blank");
    },
    // 获取业务场景下的资产
    getProjectAttributesBySceneId(sceneId) {
      return getProjectAttributesBySceneId(sceneId).then((res) => {
        this.leftList = res.data.data;
        
      });
    },

    // 查询所有资产
    getAllAssetsProject() {
      return getAllAssetsProject().then(res => {
        this.leftList = res.data.data;
      })
    },

    

    // 回显内容区
    async echoContent(workflowRow) {

      const {assetsId, businessScenarioId, flowType} = workflowRow
        console.log(assetsId,this.leftList, 'assetsIdassetsIdassetsId');
      this.flowType = flowType
      if (flowType == 1) {
        await this.getAllAssetsProject()
      } else {
        if (businessScenarioId === null || businessScenarioId === undefined) { 
          this.mainList = [defaultDrag]
          this.leftList = []
        } else {
          await this.getProjectAttributesBySceneId(businessScenarioId)
        }
      }
      const item = this.leftList.find((m) => m.projectId == assetsId);
      if (item) {
        // this.mainList = [defaultDrag, item]
        this.mainList = [item]
        this.projectForm = item
      } else {
        this.mainList = [defaultDrag]
      }
    },

    leftEnd(e) {
      if (!e.to.className.includes('main-drag')) return;
      const item = this.leftList.find((m) => m.projectId == e.item._underlying_vm_.projectId);
      if (item) {
        // this.mainList = [defaultDrag, item]
        this.mainList = [item]
        this.projectForm = item
        this.$emit('changeDisabled', true, item.projectId, 2)
      }
    },
    rightEnd(e) {
      if (!e.to.className.includes('main-drag')) return;
      this.importAssetsDialog = true
      this.appform = {
        txtFileList: [],
        appFileList: []
      }
    },
    onMove(e, originalEvent) {
      this.moveId = e.draggedContext.element.projectId;
      //不允许拖拽
      if (e.draggedContext.element.project == -2) return false;
      return true;
    },

    mainEnd(e) {
      console.log(this.moveId, 'mainend')
      const items = this.leftList.filter((m) => m.projectId == this.moveId);
      //如果左边
      if (items.length < 2) return;
      this.delBtn()
      this.leftList.splice(e.newDraggableIndex, 1);
    },
    cloneComponent(origin) {
      const clone = deepClone(origin);
      return clone;
    },
    rightCloneComponent(origin) {
      this.rightCloneData = origin
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "../../styles/mixins";
#baiduMap {
  height: 350px;
}
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
      // background: #dedede;
      .scene-right-title {
        color: #454646;
        font-size: 16px;
        margin-top: 10px;
      }
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
        .right-list {
          margin-top: 20px;
          @include flexbox;
          @include flex-wrap(nowrap);
          align-items: center;
          justify-content: space-around;
        }
        .right-block {
          // @include square(50px);
          color: #fff;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
          margin: 10px;

          &.common-block {
            // background: #67C23A;
            color: #fff;
            display: flex;
            justify-content: space-around;
            align-items: center;
            cursor: move;
            transition: all 0.3s;
            box-shadow: 4px 4px 4px 2px rgba(0, 0, 0, 0.2);
            // border: 2px solid #87898a;
            &:hover {
              transform: scale(1.1);
            }
          }
        }
        // i {
        //   position: absolute;
        //   left: 50%;
        //   top: 50%;
        //   @include transform(translate(-50%, -50%));
        //   font-size: 24px;
        //   color: #838a92;
        // }

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
