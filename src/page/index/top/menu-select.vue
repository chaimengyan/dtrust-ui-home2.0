<template>
    <div id="sys-menu-select">
        <component v-for="item in menus" :key="item.id" :is="componentName(item.children)" :index="`${item.id}`">
            <template slot="title">
                <el-link
                    target="_blank"
                    v-if="componentName(item.children) == 'el-menu-item'"
                    :underline="false"
                    :href="getPath(item)">
                    <div style="font-size: 12px; min-width: 200px">
                        {{labelKey(item)}}
                    </div>
                </el-link>
                <el-link
                    target="_blank"
                    v-else-if="!('parentId' in item)"
                    :underline="false"
                    :href="item.moduleHost">
                    <div style="font-size: 14px; min-width: 200px">
                        {{labelKey(item)}}
                    </div>
                </el-link>
                <template v-else>
                    {{labelKey(item)}}
                </template>
            </template>
            
            <menu-select v-if="item.children && item.children.length" :menus="item.children" />
        </component>
    </div>
</template>

<script>
import { getStore } from '@/util/store'
export default {
    name: 'menu-select',

    props: {
        menus: {
            type: Array,
            default: () => []
        },
    },

    methods: {
        labelKey(item) {
            const menuName = getStore({ name: 'language' }) == 'zh-cn' ? item.label : item.enName
            return menuName
        },
        getPath(item) {
            return `${item.moduleHost}/#${item.path}`
        },
        componentName(children) {
            return children && children.length ? 'el-submenu' : 'el-menu-item'
        }
    }
}
</script>
<style lang="scss">
#sys-menu-select {
    margin: -5px 0;
    background-color: #fff !important;
    .el-submenu__title {
        background-color: #fff;
        font-size: 12px !important;
        font-weight: 500;
        color: #303133;
        height: 48px;
        line-height: 48px;
        .el-link .el-link--inner {
            > div {
                font-size: 12px !important
            }
        }

        &:hover {
            .el-link, .el-link--inner {
                color: #fff !important;
                > div {
                    font-size: 12px !important
                }
            }
            color: #fff !important;
            background-color: #409EFF !important;
        }

    }

    .el-menu-item {
        background-color: #fff;
        font-weight: 500;
        height: 48px;
        line-height: 48px;
        &:hover {
            color: #fff !important;
            background-color: #409EFF !important;
        }
    }
}
</style>