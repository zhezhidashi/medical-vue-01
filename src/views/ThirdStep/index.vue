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
                <el-menu :default-active="String(activeMenu)" class="menu" @select="handleMenuSelect">
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
                    <el-table :data="tableData" stripe>
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
                                        <el-input v-model="props.row.name" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="原始数据表名">
                                        <el-select v-model="props.row.originalTableName" placeholder="请选择"
                                            style="width: 200px;">
                                            <el-option v-for="option in originalTableNameOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="表头字段">
                                        <el-select v-model="props.row.tableHeader" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in tableHeaderOptions[props.row.originalTableName]"
                                                :key="option.value" :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="VLM">
                                        <el-input v-model="props.row.VLM" style="width: 200px;"></el-input>
                                    </el-form-item>

                                    <el-form-item label="数据类型">
                                        <el-select v-model="props.row.dataType" placeholder="请选择" style="width: 200px;">
                                            <el-option v-for="option in dataTypeOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>






                                    <!-- 受控术语部分 -->
                                    <el-form-item label="受控术语">
                                        <el-select v-model="props.row.controlledTerm" placeholder="请选择"
                                            style="width: 200px;">
                                            <el-option v-for="option in controlledTermOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>

                                        <!-- 标准情况 -->
                                        <template v-if="props.row.controlledTerm === '标准'">
                                            <div style="display: flex; flex-direction: column;">
                                                <el-select v-model="props.row.termGroupName" placeholder="请选择"
                                                    style="width: 200px;">
                                                    <!-- 标准术语组选什么应该由变量名确定 -->
                                                    <el-option v-for="option in termGroupNameOptions[props.row.abbreviation]" :key="option.value"
                                                        :label="option.label" :value="option.value"></el-option>
                                                </el-select>
                                                <el-button type="text" @click="modifyDictionary(props.row)">修改字典</el-button>
                                            </div>
                                        </template>

                                        <!-- 自定义情况 -->
                                        <template v-else-if="props.row.controlledTerm === '自定义'">
                                            <div style="display: flex; flex-direction: column;">
                                                <el-button style="width: 200px;" type="text" @click="addCustomDictionary(props.row)">新增自定义字典</el-button>
                                            </div>
                                            
                                        </template>

                                        <!-- 外部情况 -->
                                        <template v-else-if="props.row.controlledTerm === '外部'" >
                                            <div style="display: flex; flex-direction: column;">
                                                <el-input style="width: 200px;" v-model="props.row.termGroupName"
                                                    :placeholder="'术语名称'"></el-input>
                                                <el-input style="width: 200px;" v-model="props.row.termVersion"
                                                    :placeholder="'版本'"></el-input>
                                                <el-input style="width: 200px;" v-model="props.row.termLink"
                                                    :placeholder="'链接'"></el-input>
                                            </div>
                                        </template>
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
                                        <el-switch v-model="props.row.domainKeyVariable"></el-switch>
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
                            <template slot-scope="props">
                                <el-input v-model="props.row.name" style="width: 200px;"></el-input>
                            </template>
                        </el-table-column>


                        <!-- 操作 -->
                        <el-table-column label="操作" width="120">
                            <template slot-scope="props">
                                <el-button @click.native.prevent="deleteRow(props.$index, tableData)" type="text"
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
            activeMenu: 0,

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
                    abbreviation: "AAA",
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


                    // 受控术语类型
                    controlledTerm: "",
                    // 术语组名称
                    termGroupName: "",
                    // 术语编码
                    termCode: "",
                    // 术语版本
                    termVersion: "",
                    // 术语链接
                    termLink: "",


                    // 长度或展示格式
                    lengthFormat: "",
                    // 数据
                    data: "",
                    // 来源
                    source: "",
                    // 域关键变量
                    domainKeyVariable: 0,
                    // 填充方法
                    fillMethod: "",
                    // aCRF 页码
                    aCRFPage: "",
                    // 变量注释
                    variableComment: "",
                    // 有无数据
                    dataExist: "",
                },
                {
                    // 变量缩写
                    abbreviation: "BBB",
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


                    // 受控术语类型
                    controlledTerm: "",
                    // 术语组名称
                    termGroupName: "",
                    // 术语编码
                    termCode: "",
                    // 术语版本
                    termVersion: "",
                    // 术语链接
                    termLink: "",


                    // 长度或展示格式
                    lengthFormat: "",
                    // 数据
                    data: "",
                    // 来源
                    source: "",
                    // 域关键变量
                    domainKeyVariable: 0,
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
            // 原始数据表名
            originalTableNameOptions: [
                { value: "AE", label: "AE" },
                { value: "CE", label: "CE" },
            ],
            // 表头字段
            tableHeaderOptions: {
                "AE": [
                    { value: "AEEEE", label: "AEEEE" },
                    { value: "CSDFE", label: "CSDFE" },
                ],
                "CE": [
                    { value: "BEEEE", label: "BEEEE" },
                    { value: "CSDFE", label: "CSDFE" },
                ]
            },
            // 数据类型
            dataTypeOptions: [
                { value: "Text", label: "Text" },
                { value: "Integer", label: "Integer" },
                { value: "Float", label: "Float" },
                { value: "Date", label: "Date" },
                { value: "Datetime", label: "Datetime" }
            ],
            // 受控术语
            controlledTermOptions: [
                { value: "无", label: "无" },
                { value: "标准", label: "标准" },
                { value: "自定义", label: "自定义" },
                { value: "外部", label: "外部" },

            ],
            // 标准受控术语时的选项
            termGroupNameOptions: {
                "AAA": [
                    { value: "AAAAA", label: "AAAAA" },
                    { value: "AAAAAAAAA", label: "AAAAAAAAAA" },
                ],
                "BBB": [
                    { value: "BBBBB", label: "BBBBB" },
                    { value: "BBBBBBBBB", label: "BBBBBBBBBB" },
                ]
            },
            // 数据
            dataOptions: [
                { value: "Assigned", label: "Assigned" },
                { value: "Collected", label: "Collected" },
                { value: "Derived", label: "Derived" },
                { value: "Not Available", label: "Not Available" },
                { value: "Predecessor", label: "Predecessor" },
                { value: "Protocol", label: "Protocol" },
            ],
            // 来源
            sourceOptions: [
                { value: "申办方", label: "申办方" },
                { value: "研究者", label: "研究者" },
                { value: "供应者", label: "供应者" },
                { value: "受试者", label: "受试者" },
            ],
            // 有无数据
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

        // 获取域的信息
        // this.getDomainData();
        // 获取菜单项
        // this.getMenuItems();
        // 获取选项
        // this.getOptions();

        // 获取 原始数据表名 和 表头字段
        // getOriginalTableNameAndTableHeader()
        // 获取标准受控术语时的选项
        // getTermGroupNameOptions()
        
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
            this.saveData();
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
        
            // 保存
            // this.saveData();

            // 获取域的信息
            // this.getDomainData();
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

        // 获取域的数据
        getDomainData() {
            let _this = this;

            this.tableData = [];

            let splitResult = this.menuItems[this.activeMenu].split("/");
            let postDataForm = {
                projectId: this.projectId,
                domain: splitResult[splitResult.length - 1],
            }

            postForm("/varSetting/queryAllVarInfo", postDataForm, this, function (res) {
                let data = res.data;
                for (let dataItem of data) {
                    let item = dataItem.varSettingVo;
                    let tableItem = {
                        // 变量缩写
                        abbreviation: item.variable,
                        // 核心程度
                        coreLevel: item.coreDegree,
                        // 变量名称
                        name: item.varName,
                        // 原始数据表名
                        originalTableName: item.sheetName,
                        // 表头字段
                        tableHeader: item.field,
                        // VLM
                        VLMFlag: item.hasvlm,
                        VLM: item.vlm,
                        // 数据类型
                        dataType: item.dataType,
                        // 受控术语
                        controlledTerm: item.ctCode === null ? "无" : item.ctCode,


                        // 术语组名称
                        termGroupName: item.ctName,
                        // 术语编码
                        termCode: item.ctCode,
                        // 术语版本
                        termVersion: item.ctVersion,
                        // 术语链接
                        termLink: item.ctLink,


                        // 长度或展示格式
                        lengthFormat: item.length,
                        // 数据
                        data: item.data,
                        // 来源
                        source: item.source,
                        // 域关键变量
                        domainKeyVariable: item.isKeyVar,
                        // 填充方法
                        fillMethod: item.method,
                        // aCRF 页码
                        aCRFPage: item.acrfPage,
                        // 变量注释
                        variableComment: item.catComment,
                        // 有无数据
                        dataExist: item.hasData,
                        // projectId
                        projectId: item.projectId,
                        // domain
                        domain: item.domain,
                    }
                    _this.tableData.push(tableItem);
                }
            });
        },

        // 保存数据
        saveData() {
            let _this = this;
            let postDataForm = [];
            for(let item of this.tableData){
                let postDataFormItem = {
                    projectId: item.projectId,
                    domain: item.domain,
                    vlmFlag: item.VLMFlag,
                    ctCode: item.termCode,
                    dataType: item.dataType,
                    ctLink: item.termLink,
                    fillMethod: item.fillMethod,
                    vlm: item.VLM,
                    data: item.data,
                    variable: item.abbreviation,
                    ctType: item.termType,
                    source: item.source,
                    ctVersion: item.termVersion,
                    ctName: item.termGroupName,
                    varComment: item.variableComment,
                    length: item.lengthFormat,
                    isKeyVar: item.domainKeyVariable,
                    acrfPage: item.aCRFPage,
                    varName: item.name,
                    coreDegree: item.coreLevel
                }
                postDataForm.push(postDataFormItem)
            }
            postForm("/varSetting/save", postDataForm, this, function(res){})
        },

        // 获取 原始数据表名 和 表头字段
        getOriginalTableNameAndTableHeader() {},

        // 获取标准受控术语时的选项
        getTermGroupNameOptions() {},

        // 修改字典
        modifyDictionary(row) {

        },

        // 添加自定义字典
        addCustomDictionary(row) {

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
}</style>
