<template>
  <div style="padding:20px;">
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="模块入口" name="moduleEntry">
        <ModuleEntry
        />
      </el-tab-pane>
      <el-tab-pane label="工作流列表" name="reportForm">
        <WorkflowCrud
          ref="workflowCrud"
          @makeWorkflow="makeWorkflow"
        />
      </el-tab-pane>
      <el-tab-pane label="工作流" name="workflow">
        <Workflow
          ref="workflow"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- <Workflow
          ref="workflow"
        /> -->
  </div>
</template>

<script>
  import ModuleEntry from '@/views/moduleEntry'
  import Workflow from '@/views/workflow'
  import WorkflowCrud from '@/views/workflowCrud'

  export default {
    name: 'wel',
    components: {
      ModuleEntry,
      Workflow,
      WorkflowCrud
    },
    data() {
      return {
        activeName: 'moduleEntry',
      }
    },
    created() {
      

    },
    methods: {
      handleClick() {
        if(this.activeName === 'reportForm') {
          this.$refs.workflowCrud.handleRefreshChange()
        }else if(this.activeName === 'workflow') {
          this.$refs.workflow.$refs.graphical.getWorkFlowList()
          this.$refs.workflow.workflowInit()
        }
      },
      

      // 进行工作流
      makeWorkflow(val) {
        this.activeName = 'workflow'
        this.$refs.workflow.getWorkFlowById(val.id)
        
      },
    }
  }
</script>

<style scoped="scoped" lang="scss">
  
</style>
