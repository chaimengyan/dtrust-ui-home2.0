<template>
    <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" target="_blank" :href="adminUrl">{{$t('navbar.访问控制')}}</el-link>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" target="_blank" :href="estimateUrl">{{$t('menu.评估及风险治理')}}</el-link>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" target="_blank" :href="assetsUrl">{{$t('menu.数据发现及映射')}}</el-link>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="text" shadow="hover">
              <el-link :underline="false" target="_blank" :href="powerUrl">{{$t('menu.告知同意及主体权利')}}</el-link>
            </el-card>
          </el-col>
        </el-row>
    </div>
</template>


<script>
import { isDev, isTest } from '@/util/env'
    export default {
        name: 'ModuleEntry',
        data() {
            return {
              workFlowUrl: !isDev() ? !isTest() ? `https://console.idatatrust.com` : 'http://116.205.172.167:38888' : `http://${window.location.hostname}:38888`, 
              adminUrl: !isDev() ? !isTest() ? `https://admin.idatatrust.com` : 'http://116.205.172.167:38081' : `http://${window.location.hostname}:38081` ,
              assetsUrl: !isDev() ? !isTest() ? `https://assets.idatatrust.com` : 'http://116.205.172.167:38082' : `http://${window.location.hostname}:38082` ,
              estimateUrl: !isDev() ? !isTest() ? `https://assess.idatatrust.com` : 'http://116.205.172.167:38080' : `http://${window.location.hostname}:38080` ,
              powerUrl: !isDev() ? !isTest() ? `https://power.idatatrust.com` : 'http://116.205.172.167:38083' : `http://${window.location.hostname}:38083` ,

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
