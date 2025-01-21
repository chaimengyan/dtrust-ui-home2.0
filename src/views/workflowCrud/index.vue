<template>
    <div class="user">
        <basic-container>
            <avue-crud
                :option="option"
                ref="crud"
                v-model="form"
                :page.sync="page"
                @size-change="sizeChange"
                @current-change="currentChange"
                :table-loading="listLoading"
                @search-change="handleFilter"
                @search-reset="resetChange"
                @refresh-change="handleRefreshChange"
                @row-update="update"
                @row-save="create"
                :data="list"
                @cell-click="cellClick"
            >
                <template slot="menuRight" slot-scope="{size}">
                    <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
                </template>
                <template slot="menuLeft">
                    <el-button
                        v-if="permissions.sys_user_add"
                        class="filter-item"
                        @click="$refs.crud.rowAdd()"
                        type="primary"
                        icon="el-icon-plus"
                        >{{$t('crudCommon.添加')}}
                    </el-button>
                </template>
                <!-- 工作流名称 -->
                <template slot="workFlowName" slot-scope="scope">
                    <span class="workFlowName">
                        {{scope.row.workFlowName}}
                    </span>
                </template>
                <template slot="menu" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
                        <el-button
                            v-if="permissions.sys_user_edit"
                            :disabled="!handleDataPermissions('update', scope.row)"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row, scope.index)"
                            />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
                        <el-button
                            v-if="permissions.sys_user_edit"
                            :disabled="!handleDataPermissions('delete', scope.row)"
                            type="text"
                            :style="!handleDataPermissions('delete', scope.row)?'': 'color: red;'"
                            icon="el-icon-delete"
                            @click="delBtn(scope.row, scope.index)"
                            />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('navbar.工作流')" placement="top">
                        <el-button
                            v-if="permissions.sys_user_edit"
                            :disabled="!handleDataPermissions('update', scope.row)"
                            type="text"
                            icon="el-icon-edit-outline"
                            @click="workflow(scope.row, scope.index)"
                            />
                    </el-tooltip>
                </template>
            </avue-crud>
        </basic-container>
    </div>
</template>

<script>
import {
    addObj,
    getWorkFlowByPage,
    putObj,
    delObj
} from "@/api/workflowCrud";
import { tableOption } from "@/const/crud/workflowCrud";
import { mapGetters } from "vuex";
import {getStore, removeStore} from "@/util/store"
export default {
    name: "RequestType",
    components: {
    },
    data() {
        return {
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条,
                isAsc: false, //是否倒序
            },
            query: {},
            list: [],
            listLoading: true,
            form: {},
            isOverHidden: true,
        };
    },
    computed: {
        ...mapGetters(["permissions"]),
        option() {
            return tableOption(this, this.isOverHidden)
        },
    },
    watch: {},
    created() {
        this.getList(this.page);
    },
    methods: {
        changeArray() {
            this.isOverHidden = !this.isOverHidden
            tableOption(this, this.isOverHidden)
        },
        getList(page, params) {
            this.listLoading = true;
            getWorkFlowByPage(
                Object.assign(
                {
                    current: page.currentPage,
                    size: page.pageSize,
                },
                params
                )
            ).then((response) => {
                this.list = response.data.data.records;
                this.page.total = response.data.data.total;
                this.listLoading = false;
            });
        },
        // 点击工作流名称查看详情
        cellClick(row, column) {
            if(column.label === this.$t('workflow.工作流名称')) {
                this.$refs.crud.rowView(row)
            }
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.getList(this.page, this.query);
        },
        currentChange(current) {
            this.page.currentPage = current;
            this.getList(this.page, this.query);
        },
        handleFilter(param, done) {
            this.query = param;
            this.page.currentPage = 1;
            this.getList(this.page, param);
            done();
        },
        resetChange(){
            this.query = {}
            this.getList(this.page, this.query);
        },
        handleRefreshChange() {
            this.getList(this.page);
        },
        handleUpdate(row, index) {
            this.$refs.crud.rowEdit(row, index);
        },
        create(row, done, loading) {
            addObj(this.form)
                .then(res => {
                    if(res.data.status == 200) {
                        this.$refs.crud.searchReset()
                        done();
                        this.$message.success(res.data.message);
                    } else {
                        loading();
                    }
                })
                .catch(() => {
                    loading();
                });
        },
        update(row, index, done, loading) {
            putObj(this.form)
                .then(res => {
                    if(res.data.status == 200) {
                        this.getList(this.page);
                        done();
                        this.$message.success(res.data.message);
                    } else {
                        loading();
                    }
                })
                .catch(() => {
                    loading();
                });
        },

        delBtn(row) {
            this.$confirm(this.$t('crudCommon.是否删除本条数据'), this.$t('crudCommon.提示'), {
                confirmButtonText: this.$t('crudCommon.删除'),
                cancelButtonText: this.$t('crudCommon.不删除'),
                type: "warning",
            })
            .then(() => {
                delObj(row.id).then((res) => {
                    if (res.data.status == 200) {
                        this.$message.success(res.data.message);
                        this.handleRefreshChange();
                        const workflowId = getStore({name: 'workflowId'})
                        if(workflowId == row.id) {
                            removeStore({name: 'workflowId'})
                        }
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            })
        },

        workflow(row) {
            this.$emit('makeWorkflow', row)
        },
    },
};
</script>
<style lang="scss" scoped>
.workFlowName:hover {
    cursor:pointer;
    color: rgb(52, 228, 234);
}
.workFlowName {
    color: #409EFF;
}
</style>