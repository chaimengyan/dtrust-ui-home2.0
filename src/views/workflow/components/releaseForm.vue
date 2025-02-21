<template>
   <div>
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="releaseForm"
      style="text-align: left;"
    >
      <el-form-item :label="$t('assessment.评估名称')" prop="name">
        <el-input v-model="releaseForm.name" :placeholder="`${$t('crudCommon.请输入')}${$t('assessment.评估名称')}`" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="问卷" prop="qnId">
        <el-select  @change="qnChange" v-model="releaseForm.qnId" placeholder="请选择问卷" clearable>
          <el-option v-for="item in qnOptions" :key="item.id" :label="item.qnName" :value="item.id" />
        </el-select>
      </el-form-item> -->
      <el-form-item :label="$t('assessment.评估指派方式')">
        <el-switch
          v-model="releaseForm.mode"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          :active-text="$t('assessment.按章节')"
          :inactive-text="$t('assessment.按问卷')"
          :active-value="2"
          :inactive-value="1"
          @change="changeMode('mode')"
        />
      </el-form-item>
      <el-form-item v-if="releaseForm.mode === 2" :label="$t('assessment.被评估人')" prop="evaluators">
        <el-cascader
          :placeholder="`${$t('crudCommon.请选择')}${$t('assessment.被评估人')}`"
          v-model="releaseForm.evaluators"
          @visible-change="getChapterByQnId"
          :options="options"
          :props="{ multiple: true }"
          clearable />
      </el-form-item>
      <el-form-item v-else :label="$t('assessment.被评估人')" prop="userIds">
        <el-select v-model="releaseForm.userIds" :placeholder="`${$t('crudCommon.请选择')}${$t('assessment.被评估人')}`" clearable multiple>
          <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('assessment.审核指派方式')">
        <el-switch
          v-model="releaseForm.auditType"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          :active-text="$t('assessment.按章节')"
          :inactive-text="$t('assessment.按问卷')"
          :active-value="1"
          :inactive-value="0"
          @change="changeMode('auditType')"
        />
      </el-form-item>
      <el-form-item v-if="releaseForm.auditType === 1" :label="$t('assessment.章节审核人')" prop="chapterAuditors">
        <el-cascader 
        :placeholder="`${$t('crudCommon.请选择')}${$t('assessment.章节审核人')}`"
          v-model="releaseForm.chapterAuditors"
          @visible-change="getChapterByQnId" 
          :options="options" 
          :props="{ multiple: true }" 
          clearable />
      </el-form-item>

      <el-form-item :label="$t('assessment.最终审核人')" prop="superAuditorIds">
        <el-select v-model="releaseForm.superAuditorIds" :placeholder="`${$t('crudCommon.请选择')}${$t('assessment.最终审核人')}`" clearable multiple>
          <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('assessment.最终审核方式')">
        <el-switch
          v-model="releaseForm.sign"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          :active-text="$t('assessment.或签')"
          :inactive-text="$t('assessment.并签')"
          :active-value="0"
          :inactive-value="1"
        />
      </el-form-item>
      <el-form-item :label="$t('assessment.有效时间')" prop="time">
          <el-date-picker
              v-model="releaseForm.time"
              type="datetimerange"
              :range-separator="$t('assessment.至')"
              :start-placeholder="$t('assessment.开始日期')"
              :end-placeholder="$t('assessment.结束日期')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
          />
      </el-form-item>

     <!-- <el-button v-if="evaluationList.length !== 0" @click="logicBtn">
      配置下一级评估
     </el-button> -->
    </el-form>
    <LogicEvaluation ref="logicEvaluationRef" :qnList="qnOptions" :qn-id="releaseForm.qnId" :evaluation-list="evaluationList" @success="onSuccess" />
   </div>
</template>
<script>
import {
    getQnListApi,
    getChapterByQnIdApi,
    getByQuestionnaireApi,
    startEvaluationApi,
    getUserList,
    getProphetByQnIdApi
} from "@/api/workflow/assessment";
import LogicEvaluation from "@/views/workflow/components/logicEvaluation";
import {mapGetters} from "vuex";
import {dateFormat} from "@/util/date"

export default {
    name: "ReleaseForm",
    components: {
        LogicEvaluation
    },
    props: {
      evaluationItem: {
        type: Object,
        default: () => {}
      },
    },
    data() {
        return {
            // 启动表单
            releaseForm: {},
            // 下拉选择问卷
            qnOptions: [],
            // 被评估人列表
            userList: [],
            chapterOptions: [],
            evaluationList: [],
            options: [],
            rules: {
                name: [{ required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('assessment.评估名称')}` }],
                qnId: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('assessment.问卷')}` }],
                userIds: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('assessment.被评估人')}` }],
                superAuditorIds: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('assessment.最终审核人')}` }],
                time: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('assessment.有效时间')}` }],
                evaluators: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('assessment.被评估人')}`}],
                chapterAuditors: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('assessment.章节审核人')}` }],
            },
            pickerOptions: {
            // 禁用选择今日及其之后的日期
              disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7; // 8.64e7 毫秒数代表一天
              },
            },
        };
    },
    watch: {
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    created() {
        console.log(this.evaluationItem ,'evaluationItem');
        this.evaluationItem.hasPrefabricate && this.getProphetByQnId(this.evaluationItem.qnId)
        this.initReleaseForm()
        
        // this.getQnList()
        this.getUserList()
    },
    methods: {
        initReleaseForm() {
            this.releaseForm = {
                // 评估名称
                name: '',
                // 所选问卷
                qnId: '',
                // 被评估人
                userIds: [],
                // 最终审核人
                superAuditorIds: [],
                // 问卷截止时间
                time: [],
                // 被评估人
                evaluators: [],
                prefabricates: [],
                chapterAuditors: [],
            }
        },
        getProphetByQnId(qnId) {
            getProphetByQnIdApi(qnId).then(res => {
                const {mode, evaluators, validTime, ...other} = res.data.data
                this.releaseForm = {...this.releaseForm, ...res.data.data}

                const now = new Date();
                this.releaseForm.time = [dateFormat(new Date()), dateFormat(new Date(now.getTime() + validTime * 60 * 60 * 1000))]
               
                if(mode === 1){
                    this.releaseForm.userIds = evaluators.map(x => x.userId)
                }else {
                    this.releaseForm.evaluators = evaluators.map(x => [x.chapterId, x.userId])

                    
                } 
                console.log(this.releaseForm, 'this.releaseForm');
            })
        },
        // 获取全部用户
        getUserList() {
            getUserList().then(res => {
                this.userList = res.data.data
                this.getChapterByQnId()
            })
        },
        // 下拉获取问卷名称列表
        getQnList(typeIds) {
            getQnListApi({categoryIds:typeIds}).then(res => {
                this.qnOptions = res.data.data.map(item => {
                    const {id, qnName} = item
                    const obj = {id, qnName}
                    return obj
                });
            });
        },
        qnChange(qnId) {
            getByQuestionnaireApi(qnId).then(res => {
                this.evaluationList = res.data.data.filter(x => x.nextQnId)
            })
        },
        changeMode(type) {
            if(type === 'mode') {
                this.releaseForm.evaluators = []
                this.releaseForm.userIds = []
            }else {
                this.releaseForm.chapterAuditors = []
            }
            
        },
        getChapterByQnId() {
            console.log(this.evaluationItem,'this.evaluationItem');
            getChapterByQnIdApi(this.evaluationItem.qnId|| '').then(res => {
                this.chapterOptions = res.data.data
                const map = this.userList.map(item => ({ label: item.nickName, value: item.userId }))
                this.options = this.chapterOptions.map((item) =>{
                    return {
                        label: item.title,
                        value: item.id,
                        children: map,
                    }
                });
                console.log(this.options,this.releaseForm.evaluators, "???????");
            })
        },
        logicBtn() {
            this.$refs.logicEvaluationRef.setVisible(true)
        },
        onSuccess(result) {
            this.prefabricates = result
        },

        // 确定启动评估
         releaseSave () {
            
            this.$refs.ruleFormRef.validate((valid, done,msg) => {
                if (valid) {
                    const { evaluators, time, chapterAuditors, ...other } = this.releaseForm
                    const [startTime, endTime] = time;

                    const data =  {
                        endTime,
                        startTime,
                        ...other,
                        ...this.evaluationItem,
                        prefabricates: this.prefabricates,
                        evaluators: this.releaseForm.mode === 2 ? evaluators.map((item) => {
                            const [chapterId, userId] = item;
                            return { userId, chapterId  };
                        }) : evaluators,
                        chapterAuditors: this.releaseForm.auditType === 1 ? chapterAuditors.map((item) => {
                            const [chapterId, userId] = item;
                            return { userId, chapterId, sign: 1  };
                        }) : chapterAuditors,
                    }
                     startEvaluationApi(data).then(res => {
                        if(res.data.status == 200) {
                            this.initReleaseForm()
                            this.$message.success(res.data.message)
                            this.$emit('closeAssessmentDialog', res.data.data)
                        }else {
                            this.$message.error(res.data.message)
                        }
                    }).catch(() => {
                        this.$emit('closeAssessmentDialog', 'error')

                    })
                }else {
                    this.$emit('closeAssessmentDialog', 'error')
                    return false
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>

</style>