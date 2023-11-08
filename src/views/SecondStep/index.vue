<template>
    <div>
        <common-header :stepNum="1"></common-header>

        <div style="text-align: center; margin-top:10px; margin-bottom: 10px;">
            <el-button @click="lastStep">上一步</el-button>
            <el-button type="primary" :loading="loading" @click="nextStep">保存并继续</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" stripe>
            <!-- 折叠行 -->
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">

                        <!-- 已有数据 -->
                        <el-form-item label="缩写">
                            <span>{{ props.row.abbreviation }}</span>
                        </el-form-item>
                        <el-form-item label="名称">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="观测类别">
                            <span>{{ props.row.observeType }}</span>
                        </el-form-item>
                        <el-form-item label="构造">
                            <span>{{ props.row.structure }}</span>
                        </el-form-item>
                        <el-form-item label="关键变量">
                            <span>{{ props.row.keyVariable }}</span>
                        </el-form-item>

                        <!-- 选择数据 -->
                        <el-form-item label="文件描述">
                            <el-input v-model="props.row.fileDescription" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item label="文件地址" >
                            <el-input v-model="props.row.fileAddress" style="width: 200px;"></el-input>
                        </el-form-item>

                        <!-- 操作 -->
                        <el-form-item label="有无数据">
                            <el-select v-model="props.row.dataExist" placeholder="请选择" style="width: 200px;">
                                <el-option v-for="option in dataExistOptions" :key="option.value" :label="option.label"
                                :value="option.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>

            <!-- 非折叠数据 -->
            <el-table-column prop="abbreviation" label="缩写">
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="observeType" label="观测类别">
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { postForm } from "@/api/data";
import CommonHeader from "@/components/CommonHeader.vue";
export default {
    name: "SecondStep",
    components: {
        CommonHeader,
    },
    data() {
        return {
            projectId: "",
            SDTMIG: "",
            termVersion: "",

            // 加载状态
            loading: false,

            // 搜索文本
            searchAbbreviation: "",
            searchObserveType: "",

            // table数据
            tableData: [
                // {
                //     abbreviation: "AE",
                //     name: "不良事件",
                //     observeType: "第一事件",
                //     structure: "每受试者、每不良事件记录一条",
                //     keyVariable: "STUDYID, USUBJID, AETERM, AESTDTC",
                //     fileDescription: "",
                //     fileAddress: "",
                //     dataExist: "",
                // },
            ],

            // 选项
            dataExistOptions: [
                { value: 0, label: "无" },
                { value: 1, label: "有" },
            ],
        };
    },
    mounted() {
        this.projectId = this.$route.query.projectId;
        this.SDTMIG = this.$route.query.SDTMIG;
        this.termVersion = this.$route.query.termVersion;
        this.getData();
    },
    methods: {
        // 上一步
        lastStep() {
            this.$router.push({
                path: "/FirstStep",
            });
        },

        // 获取数据
        getData() {
            let _this = this;
            let postFormData = {
                projectId: this.projectId,
                version: this.termVersion,
            }
            postForm("/confirmDomain/queryAllDomain", postFormData, this, function (res) {
                let data = res.data;
                for (let item of data.domainInfoVoList) {
                    let tableDataItem = {
                        abbreviation: item.domain,
                        name: item.name,
                        observeType: item.observationClass,
                        structure: item.structure,
                        keyVariable: item.keyVariable,
                        fileDescription: "",
                        fileAddress: "",
                        dataExist: "",
                        projectId: _this.projectId,
                    }
                    _this.tableData.push(tableDataItem);
                }
            });
        },

        // 删除行
        deleteRow(index, rows) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                rows.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        // 保存并继续
        nextStep() {
            this.loading = true;

            let _this = this;

            let postDataForm = []

            for (let item of this.tableData) {
                let tableDataItem = {
                    domain: item.abbreviation,
                    name: item.name,
                    observationClass: item.observeType,
                    structure: item.structure,
                    keyVariable: item.keyVariable,
                    fileDescription: item.fileDescription,
                    fileAddress: item.fileAddress,
                    hasData: item.dataExist,
                    projectId: item.projectId,
                }
                postDataForm.push(tableDataItem)
            }

            postForm("/confirmDomain/save", postDataForm, this, function (res) {
                if (res.state === 200) {
                    _this.$router.push({
                        path: "/ThirdStep",
                        query: {
                            projectId: _this.projectId,
                            SDTMIG: _this.SDTMIG,
                            termVersion: _this.termVersion,
                        }
                    });
                    _this.loading = false;
                    _this.$message({
                        message: "保存成功",
                        type: "success",
                    });
                }
                else {
                    _this.loading = false;
                    _this.$message({
                        message: "保存失败",
                        type: "error",
                    });
                }
            });
        },
    },
};
</script>

<style>
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #9ca2ac;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 5px;
    width: 50%;
}
</style>
