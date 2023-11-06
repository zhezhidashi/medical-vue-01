<template>
    <div>
        <common-header :stepNum="2"></common-header>
        <el-form>
            <el-form-item style="text-align: center">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary" :loading="loading" @click="nextStep">保存并继续</el-button>
            </el-form-item>
        </el-form>

        <el-container style="height: 80vh; border: 1px solid #eee">
            <el-aside width="auto" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-active="activeMenu" class="menu" @select="handleMenuSelect">
                    <el-menu-item v-for="(item, index) in menuItems" :key="index" :index="String(index)">{{ item
                    }}</el-menu-item>
                </el-menu>
            </el-aside>

            <el-container>
                <el-header style="text-align: center; font-size: 12px">
                    <el-button type="primary" style="margin: 10px;">添加标准变量</el-button>
                    <el-button type="primary" style="margin: 10px;">添加自定义变量</el-button>
                </el-header>

                <el-main>
                    <el-table :data="tableData">
                        <!-- 折叠行 -->
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">

                                    <!-- 已有数据 -->
                                    <el-form-item label="变量缩写">
                                        <span>{{ props.row.abbreviation }}</span>
                                    </el-form-item>
                                    <el-form-item label="核心程度">
                                        <span>{{ props.row.coreLevel }}</span>
                                    </el-form-item>

                                    <!-- 选择或填写数据 -->
                                    <el-form-item label="变量名称">
                                        <el-input v-model="props.name" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="原始数据表名">
                                        <el-select v-model="props.row.originalTableName" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in originalTableNameOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="表头字段">
                                        <el-select v-model="props.row.tableHeader" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in tableHeaderOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="数据类型">
                                        <el-select v-model="props.row.dataType" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in dataTypeOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="受控术语">
                                        <el-select v-model="props.row.controlledTerm" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in controlledTermOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="长度或展示格式">
                                        <el-input v-model="props.lengthFormat" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="数据">
                                        <el-select v-model="props.row.data" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in dataOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="来源">
                                        <el-select v-model="props.row.source" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in sourceOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="域关键变量">
                                        <el-input v-model="props.row.domainKeyVariable" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="填充方式">
                                        <span>{{ props.row.fillWay }}</span>
                                    </el-form-item>

                                    <el-form-item label="填充方法">
                                        <el-input v-model="props.row.fillMethod" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="aCRF 页码">
                                        <el-input v-model="props.row.aCRFPage" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="变量注释">
                                        <el-input v-model="props.row.variableComment" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="有无数据">
                                        <el-select v-model="props.row.dataExist" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in dataExistOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>

                        <!-- 非折叠数据 -->
                        <el-table-column prop="abbreviation" label="变量缩写">
                        </el-table-column>
                        <el-table-column prop="coreLevel" label="核心程度">
                        </el-table-column>
                        <el-table-column prop="name" label="变量名称">
                        </el-table-column>
                        

                        <!-- 操作 -->
                        <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
                                    size="small">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader.vue'
import { postForm } from '@/api/data';
export default {
    name: 'ThirdStep',
    components: {
        CommonHeader,
    },
    data() {
        const item = {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
        };
        return {
            projectId: "",
            SDTMIG: "",
            termVersion: "",

            // 加载状态
            loading: false,

            // 当前选中的菜单项
            activeMenu: '0',

            // 其他菜单项
            menuItems: [
                "不良事件/AE",
                "临床事件/CE",
                "既往及合并用药/CM",
                "药物责任/DA",
                "死亡详情/DD",
                "人口学资料/DM",
                "试验安排/DS",
                "暴露收集/EC",
                "心电图检查/EG",
                "暴露/EX",
                "关于事件或干预措施的发现/FA",
                "入排标准/IE",
                "实验室检查/LB",
                "既往病史/MH",
                "诊疗操作/PR",
                "问卷/量表/QS",
                "疾病反应与临床分型/RS",
                "受试者特征/SC",
                "受试者状态/SS",
                "物质使用/SU",
                "受试者访视/SV",
                "生命体征/VS"
            ],

            // table数据
            tableData: [
                {
                    // 变量缩写
                    abbreviation: "AE",
                    // 核心程度
                    coreLevel: "",
                    // 变量名称
                    name: "不良事件",
                    // 原始数据表名
                    originalTableName: "",
                    // 表头字段
                    tableHeader: "",
                    // VLM
                    VLM: "",
                    // 数据类型
                    dataType: "",
                    // 受控术语
                    controlledTerm: "",
                    // 长度或展示格式
                    lengthFormat: "",
                    // 数据
                    data: "",
                    // 来源
                    source: "",
                    // 域关键变量
                    domainKeyVariable: "",
                    // 填充方式
                    fillWay: "",
                    // 填充方法
                    fillMethod: "",
                    // aCRF 页码
                    aCRFPage: "",
                    // 变量注释
                    variableComment: "",
                    // 有无数据
                    dataExist: "",
                },
            ],

            // 选项数据
            originalTableNameOptions: [],
            tableHeaderOptions: [],
            dataTypeOptions: [],
            controlledTermOptions: [],
            dataOptions: [],
            sourceOptions: [],
            dataExistOptions: [
                { value: 0, label: "无" },
                { value: 1, label: "有" },
            ],
        }
    },
    mounted() {
        this.projectId = this.$route.query.projectId;
        this.SDTMIG = this.$route.query.SDTMIG;
        this.termVersion = this.$route.query.termVersion;

        // 获取菜单项
        // this.getMenuItems();
    },
    methods: {
        // 上一步
        lastStep() {
            this.$router.push({
                path: "/SecondStep",
                query: {
                    projectId: this.projectId,
                    SDTMIG: this.SDTMIG,
                    termVersion: this.termVersion,
                },
            });
        },

        // 保存并继续
        nextStep() {
            let _this = this;
            _this.$router.push({
                path: "/FourthStep",
                query: {
                    projectId: _this.projectId,
                    SDTMIG: _this.SDTMIG,
                    termVersion: _this.termVersion,
                },
            });
        },

        // 获取菜单项
        getMenuItems() {
            let _this = this;

            let postDataForm = {
                projectId: this.projectId,
                version: this.SDTMIG,
            }

            postForm("/varSetting/queryAllDomain", postDataForm, this, function (res) {
                if (res.state === 200) {
                    let data = res.data;
                    for (let item of data) {
                        _this.menuItems.push(item);
                    }
                }
                else {
                    _this.$message({
                        message: "网络错误，请稍后重试",
                        type: "error",
                    });
                }
            });
        },

        // 处理菜单项选中事件
        handleMenuSelect(index) {
            this.activeMenu = index;
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
    }
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 120px;
    color: #9ca2ac;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 5px;
    width: 50%;
}
</style>
