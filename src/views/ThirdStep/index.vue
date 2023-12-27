<template>
    <div>
        <common-header :stepNum="2"></common-header>
        <el-form>
            <el-form-item style="text-align: center">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary" :loading="loading" @click="nextStep">保存并继续</el-button>
                <el-button :loading="loading" @click="saveData()">保存域</el-button>
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
                    <el-button type="primary" style="margin: 10px;" @click="addStandardVariable">添加标准变量</el-button>
                    <el-button type="primary" style="margin: 10px;" @click="addCustomVariable" >添加自定义变量</el-button>
                </el-header>

                <el-main>
                    <el-table :data="tableData" stripe border>
                        <!-- 折叠行 -->
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">

                                    <!-- 已有数据 -->
                                    <el-form-item label="变量缩写">
                                        <span v-if="props.row.coreLevel !== '自定义'">{{ props.row.abbreviation }}</span>
                                        <el-input v-if="props.row.coreLevel === '自定义'" v-model="props.row.abbreviation" style="width: 200px;"></el-input>
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
                                            style="width: 200px;" @change="changeOriginalTableName(props.row)">
                                            <el-option v-for="option in originalTableNameOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="表头字段">
                                        <el-select v-model="props.row.tableHeader" placeholder="请选择" style="width: 200px;"
                                            @visible-change="loadingTableHeaderOptions(props.row)">
                                            <el-option v-for="option in props.row.tableHeaderOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="衍生变量">
                                        <el-switch v-model="props.row.derivedFlag"></el-switch>
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
                                                    style="width: 200px;"
                                                    @visible-change="loadingTermGroupNameOptions(props.row)">
                                                    <!-- 标准术语组选什么应该由变量名确定 -->
                                                    <el-option v-for="option in props.row.termGroupNameOptions"
                                                        :key="option.value" :label="option.label"
                                                        :value="option.value"></el-option>
                                                </el-select>

                                                <div>{{ props.row.termCode }}</div>

                                                <el-button type="text"
                                                    @click="modifyTermGroupTerm(props.row)">调整术语组术语</el-button>
                                            </div>
                                        </template>

                                        <!-- 自定义情况 -->
                                        <template v-else-if="props.row.controlledTerm === '自定义'">
                                            <div style="display: flex; flex-direction: column;">
                                                <div>{{ props.row.termCode }}</div>
                                                <el-button style="width: 200px;" type="text"
                                                    @click="addCustomTerm(props.row)">新增自定义术语
                                                </el-button>
                                            </div>

                                        </template>

                                        <!-- 外部情况 -->
                                        <template v-else-if="props.row.controlledTerm === '外部'">
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
                                        <el-input v-model="props.row.lengthFormat" style="width: 200px;"></el-input>
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
                        <el-table-column prop="abbreviation" label="变量缩写" min-width="175px">
                            <template slot-scope="scope">
                                <template v-if="scope.row.coreLevel === '自定义'">
                                    <el-input v-model="scope.row.abbreviation"></el-input>
                                </template>
                                <template v-else>
                                    {{ scope.row.abbreviation }}
                                </template>
                            </template>
                        </el-table-column>

                        <el-table-column prop="coreLevel" label="核心程度" min-width="100px">
                        </el-table-column>

                        <el-table-column label="变量名称" min-width="175px">
                            <template slot-scope="props">
                                <el-input v-model="props.row.name"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column label="衍生变量" width="80px">
                            <template slot-scope="props">
                                <el-switch v-model="props.row.derivedFlag"></el-switch>
                            </template>
                        </el-table-column>


                        <!-- 受控术语部分 -->
                        <el-table-column label="受控术语" min-width="200px" >
                            <template slot-scope="props" >
                                <el-select v-model="props.row.controlledTerm" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="option in controlledTermOptions" :key="option.value" :label="option.label"
                                        :value="option.value"></el-option>
                                </el-select>
                            

                                <!-- 标准情况 -->
                                
                                <template v-if="props.row.controlledTerm === '标准'">
                                    <div style="display: flex; flex-direction: column;">
                                        <el-select v-model="props.row.termGroupName" placeholder="请选择"
                                            @visible-change="loadingTermGroupNameOptions(props.row)">
                                            <!-- 标准术语组选什么应该由变量名确定 -->
                                            <el-option v-for="option in props.row.termGroupNameOptions" :key="option.value"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>

                                        <div>{{ props.row.termCode }}</div>

                                        <el-button type="text" @click="modifyTermGroupTerm(props.row)">调整术语组术语</el-button>
                                    </div>
                                </template>

                                <!-- 自定义情况 -->
                                <template v-else-if="props.row.controlledTerm === '自定义'">
                                    <div style="display: flex; flex-direction: column;">
                                        <div>{{ props.row.termCode }}</div>
                                        <el-button type="text" @click="addCustomTerm(props.row)">新增自定义术语
                                        </el-button>
                                    </div>

                                </template>

                                <!-- 外部情况 -->
                                <template v-else-if="props.row.controlledTerm === '外部'">
                                    <div style="display: flex; flex-direction: column;">
                                        <el-input v-model="props.row.termGroupName"
                                            :placeholder="'术语名称'"></el-input>
                                        <el-input v-model="props.row.termVersion"
                                            :placeholder="'版本'"></el-input>
                                        <el-input v-model="props.row.termLink"
                                            :placeholder="'链接'"></el-input>
                                    </div>
                                </template>
                            </template>
                        </el-table-column>


                        <el-table-column label="域关键变量" width="100px">
                            <template slot-scope="props">
                                <el-switch v-model="props.row.domainKeyVariable"></el-switch>
                            </template>
                        </el-table-column>

                        <!-- 操作 -->
                        <el-table-column label="操作" width="120" min-width="80px">
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

        <el-dialog title="调整术语组术语" :visible.sync="termGroupTermDialogVisible" width="90%" :before-close="handleDialogClose">
            <el-table :data="termGroupTermData">
                <el-table-column prop="termCode" label="编码" width="100px">
                </el-table-column>

                <el-table-column prop="submitValue" label="递交值" width="100px">
                </el-table-column>

                <el-table-column prop="同义词" label="synonym" width="100px">
                </el-table-column>


                <el-table-column prop="useFlag" label="是否启用">
                    <template slot-scope="props">
                        <el-switch v-model="props.row.useFlag"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="applicationName" label="应用名称">
                    <template slot-scope="props">
                        <el-input v-model="props.row.applicationName" style="max-width: 200px;"></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="numericalName" label="数值含义">
                    <template slot-scope="props">
                        <el-input v-model="props.row.numericalMeaning" style="max-width: 200px;"></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="displayOrder" label="展示顺序">
                    <template slot-scope="props">
                        <el-input v-model="props.row.displayOrder" style="max-width: 200px;"></el-input>
                    </template>
                </el-table-column>


            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveTermGroupTerm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增自定义术语" :visible.sync="addCustomTermDialogVisible" width="90%" :before-close="handleDialogClose">
            <el-form :model="addCustomTermForm" ref="addCustomTermForm" class="demo-ruleForm" label-width="auto">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addCustomTermForm.name"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="addCustomTermForm.type"></el-input>
                </el-form-item>
                <el-form-item label="语种" prop="language">
                    <el-input v-model="addCustomTermForm.language"></el-input>
                </el-form-item>
            </el-form>

            <el-table :data="addCustomTermTable">
                <el-table-column prop="description" label="描述（展示查看的内容）">
                    <template slot-scope="props">
                        <el-input v-model="props.row.description"></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="key" label="键值（实际存入的值）">
                    <template slot-scope="props">
                        <el-input v-model="props.row.key"></el-input>
                    </template>
                </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCustomTermOneRow">新增一条</el-button>
                <el-button @click="handleDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveAddCustomTerm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加标准变量" :visible.sync="addStandardVariableVisible" width="90%" :before-close="handleDialogClose">
            <el-checkbox :indeterminate="isIndeterminate" v-model="isAddStandardVariableSelectAll" @change="addStandardVariableSelectAll">全选</el-checkbox>
            <el-checkbox-group v-model="addStandardVariableValue" @change="handleAddStandardVariableChange">
                <el-checkbox v-for="option in addStandardVariableOptions" :key="option.abbreviation" :label="option" style="width: 45%; height: 25px;" >
                    {{ option.showText }}
                </el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addStandardVariableCancel">取 消</el-button>
                <el-button type="primary" @click="addStandardVariableConfirm">确 定</el-button>
            </span>
        </el-dialog>
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
        return {
            projectId: "",
            SDTMIG: "",
            termVersion: "",
            domain: "",

            // 加载状态
            loading: false,

            // 当前选中的菜单项
            activeMenu: 0,

            // 其他菜单项
            menuItems: [
                // "不良事件/AE",
                // "临床事件/CE",
                // "既往及合并用药/CM",
                // "药物责任/DA",
                // "死亡详情/DD",
                // "人口学资料/DM",
                // "试验安排/DS",
                // "暴露收集/EC",
                // "心电图检查/EG",
                // "暴露/EX",
                // "关于事件或干预措施的发现/FA",
                // "入排标准/IE",
                // "实验室检查/LB",
                // "既往病史/MH",
                // "诊疗操作/PR",
                // "问卷/量表/QS",
                // "疾病反应与临床分型/RS",
                // "受试者特征/SC",
                // "受试者状态/SS",
                // "物质使用/SU",
                // "受试者访视/SV",
                // "生命体征/VS"
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
                    // 表头字段选项
                    tableHeaderOptions: [],
                    // 是否有VLM
                    VLMFlag: "",
                    // VLM
                    VLM: "",
                    // 数据类型
                    dataType: "",
                    // 是否为衍生变量
                    derivedFlag: false,


                    // 受控术语类型
                    controlledTerm: "",
                    // 术语组名称
                    termGroupName: "",

                    // 标准受控术语时的选项
                    termGroupNameOptions: [],
                    // 术语组术语的详细术语
                    termGroupTermData: [],
                    // 新增自定义术语的 Form
                    addCustomTermForm: {},
                    // 新增自定义术语的 Table
                    addCustomTermTable: [],
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
                    domainKeyVariable: false,
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
                // { value: "AE", label: "AE" },
                // { value: "CE", label: "CE" },
            ],
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

            // 调整术语组术语
            termGroupTermDialogVisible: false,
            termGroupTermData: [
                {
                    // 编码
                    termCode: "",
                    // 递交值
                    submitValue: "",
                    // 同义词
                    synonym: "",
                    // 是否启用
                    useFlag: "",
                    // 应用名称
                    applicationName: "",
                    // 数值含义
                    numericalMeaning: "",
                    // 展示顺序
                    displayOrder: "",
                }
            ],
            // 调整术语组术语对应的row
            termGroupTermRow: {},

            // 新增自定义术语
            addCustomTermDialogVisible: false,
            // 自定义术语有两部分数据，上面是Form数据，下面是Table数据
            addCustomTermForm: {
                // 名称
                name: "",
                // 类型
                type: "",
                // 语种
                language: "",
            },
            addCustomTermTable: [
                {
                    // 描述（展示查看的内容）
                    description: "",
                    // 键值（实际存入的值）
                    key: "",
                }
            ],
            // 新增自定义术语对应的row
            addCustomTermRow: {},

            // 添加标准变量
            isIndeterminate: false,
            isAddStandardVariableSelectAll: false,
            addStandardVariableOptions: [],
            addStandardVariableValue: [],
            addStandardVariableVisible: false,
        }
    },
    mounted() {
        this.projectId = this.$route.query.projectId;
        this.SDTMIG = this.$route.query.SDTMIG;
        this.termVersion = this.$route.query.termVersion;

        // 获取菜单项
        this.getMenuItems();
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

                    // 修改当前页面domain
                    let splitResult = data[_this.activeMenu].split("/");
                    _this.domain = splitResult[splitResult.length - 1];
                    
                    // 获取域的信息
                    _this.getDomainData();

                    // 获取 原始数据表名
                    _this.getOriginalTableName();

                    // 获取添加标准变量的选项
                    _this.getAddStandardVariableOptions();
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

            // 修改当前页面domain
            let splitResult = this.menuItems[this.activeMenu].split("/");
            this.domain = splitResult[splitResult.length - 1];

            // 获取域的信息
            this.getDomainData();

            // 获取 原始数据表名
            this.getOriginalTableName()
        },

        // 删除行
        deleteRow(index, rows) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _this = this;
                let postDataForm = {
                    projectId: rows[index].projectId,
                    domain: rows[index].domain,
                    variable: rows[index].abbreviation,
                }

                postForm("/varSetting/deleteVar", postDataForm, this, function (res) { 
                    if (res.state === 200) {
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        rows.splice(index, 1);
                    }
                    else {
                        _this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        // 获取tableData中的
        getDomainData() {
            let _this = this;

            this.tableData = [];

            let postDataForm = {
                projectId: this.projectId,
                domain: this.domain,
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
                        // 表头字段选项
                        tableHeaderOptions: [],
                        // 是否为衍生变量
                        derivedFlag: item.derivedFlag === 0 ? false : true,

                        // VLM
                        VLMFlag: item.hasVLM,
                        VLM: item.vlm,
                        // 数据类型
                        dataType: item.dataType,
                        // 受控术语
                        controlledTerm: item.ctType === null ? "无" : item.ctType,


                        // 术语组名称
                        termGroupName: item.ctName,
                        // 标准受控术语时的选项
                        termGroupNameOptions: [],
                        // 术语组术语的详细术语
                        termGroupTermData: [],
                        // 新增自定义术语的 Form
                        addCustomTermForm: {},
                        // 新增自定义术语的 Table
                        addCustomTermTable: [],
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
                        domainKeyVariable: item.isKeyVar === 0 ? false : true,
                        // 填充方法
                        fillMethod: item.method,
                        // aCRF 页码
                        aCRFPage: item.acrfPage,
                        // 变量注释
                        variableComment: item.varComment,
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
            this.loading = true;
            let postDataForm = [];
            for (let item of this.tableData) {
                let postDataFormItem = {
                    projectId: item.projectId,
                    domain: item.domain,
                    vlmFlag: item.VLMFlag,
                    ctCode: item.termCode,
                    dataType: item.dataType,
                    ctLink: item.termLink,
                    fillMethod: item.fillMethod,
                    hasVLM: item.VLMFlag,
                    vlm: item.VLM,
                    data: item.data,
                    variable: item.abbreviation,
                    ctType: item.controlledTerm,
                    source: item.source,
                    ctVersion: item.termVersion,
                    ctName: item.termGroupName,
                    varComment: item.variableComment,
                    length: item.lengthFormat,
                    isKeyVar: item.domainKeyVariable === false ? 0 : 1,
                    acrfPage: item.aCRFPage,
                    varName: item.name,
                    coreDegree: item.coreLevel,
                    sheetName: item.originalTableName,
                    field: item.tableHeader,
                    derivedFlag: item.derivedFlag === false ? 0 : 1,
                    annex: null,
                }
                postDataForm.push(postDataFormItem)
            }
            postForm("/varSetting/save", postDataForm, this, function (res) {
                _this.$message({
                    message: "自动保存域",
                    type: "success",
                });
                _this.loading = false;
             })
        },

        // 获取 原始数据表名
        getOriginalTableName() {
            let _this = this;

            let postDataForm = {
                projectId: this.projectId,
                domain: this.domain,
            }
            this.originalTableNameOptions = [];
            this.tableHeaderOptions = {};

            // 获取原始数据表名
            postForm("/varSetting/querySheetName", postDataForm, this, function (res) {
                let data = res.data;
                for (let item of data) {
                    _this.originalTableNameOptions.push({
                        value: item,
                        label: item,
                    });

                    _this.tableHeaderOptions[item] = [];
                }
            });
        },

        // 原始表名发生变化，需要重新加载表头字段
        changeOriginalTableName(row) {
            row.tableHeader = "";
            row.tableHeaderOptions = [];

            let postDataForm = {
                projectId: this.projectId,
                sheetName: row.originalTableName,
            }

            // 获取表头字段
            postForm("/varSetting/queryField", postDataForm, this, function (res) {
                let data = res.data;
                for (let item of data) {
                    row.tableHeaderOptions.push({
                        value: item,
                        label: item,
                    });
                }
            });
        },

        // 判断对应的表头字段选项是否存在。如果不存在的就加载
        loadingTableHeaderOptions(row) {

            if (row.tableHeaderOptions.length == 0) {

                let postDataForm = {
                    projectId: this.projectId,
                    sheetName: row.originalTableName,
                }
                postForm("/varSetting/queryField", postDataForm, this, function (res) {
                    let data = res.data;
                    for (let item of data) {
                        row.tableHeaderOptions.push({
                            value: item,
                            label: item,
                        });
                    }
                })
            }
        },

        // 加载标准受控术语时的选项（根据变量缩写 abbreviation -- variable 查询）
        loadingTermGroupNameOptions(row) {
            if (row.termGroupNameOptions.length == 0) {
                let postDataForm = {
                    projectId: this.projectId,
                    sdtmVersion: this.SDTMIG,
                    ctVersion: this.termVersion,
                    domain: this.domain,
                    variable: row.abbreviation,
                }
                postForm("/varSetting/queryCtInfo", postDataForm, this, function (res) {
                    let data = res.data;
                    for (let item of data) {
                        row.termGroupNameOptions.push({
                            value: item,
                            label: item,
                        });
                    }
                })
            }
        },

        // 调整术语组术语
        modifyTermGroupTerm(row) {
            // 清空数据
            this.termGroupTermData = [];
            // 查询术语组所有术语
            if (row.termGroupTermData.length === 0) {
                this.queryAllTerm(row.termGroupName, row.termGroupTermData);
            }
            else {
                for (let item of row.termGroupTermData)
                    this.termGroupTermData.push(item);
            }
            // 修改对应的row
            this.termGroupTermRow = row;

            // 修改弹窗可见性
            this.termGroupTermDialogVisible = true;
        },

        // 查询术语组所有术语
        queryAllTerm(codeListName, termGroupTermDataList) {
            let _this = this;
            let postDataForm = {
                codeListName,
                ctVersion: this.termVersion,
            }
            postForm("/varSetting/queryAllCtCode", postDataForm, this, function (res) {
                let data = res.data;
                for (let item of data) {
                    let termGroupTermDataItem = {
                        // 编码
                        termCode: item.code,
                        // 递交值
                        submitValue: item.value_cn,
                        // 同义词
                        synonym: item.synonym_cn,
                        // 是否启用
                        useFlag: item.useFlag,
                        // 应用名称
                        applicationName: item.app_name,
                        // 数值含义
                        numericalMeaning: item.data_meaning,
                        // 展示顺序
                        displayOrder: item.show_order,
                    }
                    termGroupTermDataList.push(termGroupTermDataItem);
                    _this.termGroupTermData.push(termGroupTermDataItem);
                }
            })
        },

        // 处理弹出窗口的关闭（主要是右上角的叉号）
        handleDialogClose() {
            this.$confirm('不保存而直接关闭可能会丢失本次编辑的信息，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 关闭“调整术语组术语”的弹窗
                this.termGroupTermDialogVisible = false;
                // 关闭“新增自定义术语”的弹窗
                this.addCustomTermDialogVisible = false;
                // 关闭“添加标准变量”的弹窗
                this.addStandardVariableValue = [];
                this.addStandardVariableVisible = false;
                this.isIndeterminate = false;
                this.isAddStandardVariableSelectAll = false;
            }).catch(() => { });
        },

        // 保存术语组术语
        saveTermGroupTerm() {
            let termCode = "";
            for (let item of this.termGroupTermData) {
                if (item.useFlag === false) {
                    console.log("未启用");
                    continue;
                }
                let codeItem = "";

                // 编码
                if (item.termCode !== null) {
                    codeItem += item.termCode + "-";
                }
                else {
                    codeItem += "null-";
                }

                // 递交值
                if (item.submitValue !== null) {
                    codeItem += item.submitValue + "-";
                }
                else {
                    codeItem += "null-";
                }

                // 数值含义
                if (item.numericalMeaning !== null) {
                    codeItem += item.numericalMeaning;
                }
                else {
                    codeItem += "null";
                }

                // 如果不为空就先加一个";"
                if (termCode !== "") {
                    termCode += ";";
                }
                termCode += codeItem;
            }

            // 修改对应的row
            this.termGroupTermRow.termCode = termCode;
            this.termGroupTermRow.termGroupTermData = [];
            for (let item of this.termGroupTermData) {
                this.termGroupTermRow.termGroupTermData.push(item);
            }

            // 关闭弹窗
            this.termGroupTermDialogVisible = false;
        },

        // 新增自定义术语
        addCustomTerm(row) {
            // 清空数据
            this.addCustomTermForm = {};
            this.addCustomTermTable = [];

            // 加载已编辑过的数据
            for (let item in row.addCustomTermForm) {
                this.addCustomTermForm[item] = row.addCustomTermForm[item];
            }
            for (let item of row.addCustomTermTable) {
                this.addCustomTermTable.push(item);
            }

            // 修改对应的row
            this.addCustomTermRow = row;

            // 修改弹窗可见性
            this.addCustomTermDialogVisible = true;
        },

        // 添加 新增自定义术语的 一行
        addCustomTermOneRow() {
            this.addCustomTermTable.push({
                description: "",
                key: "",
            })
        },

        // 保存 新增自定义术语
        saveAddCustomTerm() {

            let termCode = "";
            for (let item of this.addCustomTermTable) {
                let codeItem = "";

                // 名称
                if (this.addCustomTermForm.name !== null) {
                    codeItem += this.addCustomTermForm.name + "-";
                }
                else {
                    codeItem += "null-";
                }

                // 描述
                if (item.description !== null) {
                    codeItem += item.description + "-";
                }
                else {
                    codeItem += "null-";
                }

                // 键值
                if (item.key !== null) {
                    codeItem += item.key;
                }
                else {
                    codeItem += "null";
                }

                // 如果不为空就先加一个";"
                if (termCode !== "") {
                    termCode += ";";
                }
                termCode += codeItem;
            }

            // 修改对应的row
            this.addCustomTermRow.termCode = termCode;
            this.addCustomTermRow.addCustomTermForm = {};
            for (let item in this.addCustomTermForm) {
                this.addCustomTermRow.addCustomTermForm[item] = this.addCustomTermForm[item];
            }
            this.addCustomTermRow.addCustomTermTable = [];
            for (let item of this.addCustomTermTable) {
                this.addCustomTermRow.addCustomTermTable.push(item);
            }

            // 向服务器发送数据
            let postDataForm = [];
            for (let index = 1; index <= this.addCustomTermTable.length; index++) {
                let item = this.addCustomTermTable[index - 1];
                postDataForm.push({
                    dictName: this.addCustomTermForm.name,
                    type: this.addCustomTermForm.type,
                    language: this.addCustomTermForm.language,
                    description: item.description,
                    ctKey: item.key,
                    number: index,
                })
            }

            postForm("/varSetting/saveCustomCT", postDataForm, this, function (res) { })

            // 关闭弹窗
            this.addCustomTermDialogVisible = false;

        },

        // 查询标准变量，放到 addStandardVariableOptions 中
        getAddStandardVariableOptions() {
            this.addStandardVariableOptions = [];
            this.addStandardVariableValue = [];
            let _this = this;
            let postDataForm = {
                projectId: this.projectId,
                sdtmVersion: this.SDTMIG,
                domain: this.domain,
            }
            postForm("/varSetting/queryStandardVar", postDataForm, this, function (res) {
                let data = res.data;
                for (let item of data) {
                    let newItem = {
                        abbreviation: item.variable,
                        name: item.name,
                        coreLevel: item.coreDegree,
                        showText: item.coreDegree + " " + item.name + "/" + item.variable,
                    }
                    _this.addStandardVariableOptions.push(newItem);
                }
            })
        },

        // 新增标准变量打开窗口
        addStandardVariable() {
            this.addStandardVariableValue = [];
            this.isIndeterminate = false;
            this.isAddStandardVariableSelectAll = false;
            this.addStandardVariableVisible = true;
        },

        // 新增标准变量 全选
        addStandardVariableSelectAll(val) {
            this.addStandardVariableValue = val ? this.addStandardVariableOptions.slice() : [];
            this.isIndeterminate = false;
        },

        // 新增标准变量 选择
        handleAddStandardVariableChange(value) {
            let checkedCount = value.length;
            this.isAddStandardVariableSelectAll = checkedCount === this.addStandardVariableOptions.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.addStandardVariableOptions.length;
        },

        // 新增标准变量 取消全选
        addStandardVariableCancelAll() {
            this.addStandardVariableValue = [];
            this.addStandardVariableVisible = false;
        },

        // 新增标准变量 确定
        addStandardVariableConfirm() {
            this.addStandardVariableVisible = false;
            
            let _this = this;

            for(let index = 0; index < this.addStandardVariableValue.length; index++) {
                let item = this.addStandardVariableValue[index];
                let postDataForm = {
                    projectId: this.projectId,
                    ctVersion: this.termVersion,
                    sdtmVersion: this.SDTMIG,
                    domain: this.domain,
                    variable: item.abbreviation,
                }

                postForm("/varSetting/queryVarInfo", postDataForm, this, function (res) {
                    let item = res.data;
                    
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
                        // 表头字段选项
                        tableHeaderOptions: [],
                        // 是否为衍生变量
                        derivedFlag: item.derivedFlag === 0 ? false : true,

                        // VLM
                        VLMFlag: item.hasVLM,
                        VLM: item.vlm,
                        // 数据类型
                        dataType: item.dataType,
                        // 受控术语
                        controlledTerm: item.ctType === null ? "无" : item.ctType,


                        // 术语组名称
                        termGroupName: item.ctName,
                        // 标准受控术语时的选项
                        termGroupNameOptions: [],
                        // 术语组术语的详细术语
                        termGroupTermData: [],
                        // 新增自定义术语的 Form
                        addCustomTermForm: {},
                        // 新增自定义术语的 Table
                        addCustomTermTable: [],
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
                        domainKeyVariable: item.isKeyVar === 0 ? false : true,
                        // 填充方法
                        fillMethod: item.method,
                        // aCRF 页码
                        aCRFPage: item.acrfPage,
                        // 变量注释
                        variableComment: item.varComment,
                        // 有无数据
                        dataExist: item.hasData,
                        // projectId
                        projectId: item.projectId,
                        // domain
                        domain: item.domain,
                    }
                    _this.tableData.push(tableItem);

                    if(index === _this.addStandardVariableValue.length - 1) {
                        _this.$message({
                            type: 'success',
                            message: '已添加至表格最下方!'
                        });
                    }
                })
            }
        },

        // 新增标准变量 取消
        addStandardVariableCancel() {
            this.$confirm('不保存而直接关闭可能会丢失本次编辑的信息，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 取消全选
                this.addStandardVariableValue = [];
                this.addStandardVariableVisible = false;
                this.isIndeterminate = false;
                this.isAddStandardVariableSelectAll = false;
            }).catch(() => { });
        },

        // 新增自定义变量
        addCustomVariable() {
            let tableItem = {
                // 变量缩写
                abbreviation: "",
                // 核心程度
                coreLevel: "自定义",
                // 变量名称
                name: "",
                // 原始数据表名
                originalTableName: "",
                // 表头字段
                tableHeader: "",
                // 表头字段选项
                tableHeaderOptions: [],
                // 是否为衍生变量
                derivedFlag: true,

                // VLM
                VLMFlag: 0,
                VLM: "",
                // 数据类型
                dataType: "",
                // 受控术语
                controlledTerm: "无",


                // 术语组名称
                termGroupName: "",
                // 标准受控术语时的选项
                termGroupNameOptions: [],
                // 术语组术语的详细术语
                termGroupTermData: [],
                // 新增自定义术语的 Form
                addCustomTermForm: {},
                // 新增自定义术语的 Table
                addCustomTermTable: [],
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
                domainKeyVariable: false,
                // 填充方法
                fillMethod: "",
                // aCRF 页码
                aCRFPage: "",
                // 变量注释
                variableComment: "",
                // 有无数据
                dataExist: "",
                // projectId
                projectId: "",
                // domain
                domain: this.domain,
            }
            this.tableData.push(tableItem);
            this.$message({
                message: "已添加至表格最下方",
                type: "success",
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
