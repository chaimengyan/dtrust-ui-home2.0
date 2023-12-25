<template>
    <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" href="http://admin.idatatrust.com/">用户管理</el-link>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" href="http://assess.idatatrust.com/">评估管理</el-link>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" href="http://assets.idatatrust.com/">资产管理</el-link>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" href="http://power.idatatrust.com/">告知同意管理</el-link>
            </el-card>
          </el-col>
        </el-row>
    </div>
</template>


<script>
    export default {
        name: 'ModuleEntry',
        data() {
            return {
            }
        },
        created() {
        
        },
        computed: {
        
        },
        methods: {
        
        }
    }
</script>
<style>
    .text {
        text-align: center;
    }
</style>
