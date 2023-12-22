<template>
    <div>
        <common-header :stepNum="3"></common-header>
        <el-form>
            <el-form-item style="text-align: center">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary" @click="nextStep">保存并继续</el-button>
                <el-button :loading="loading" @click="saveDerivedVariables">保存衍生变量</el-button>
            </el-form-item>
        </el-form>

        <el-container style="height: 80vh; border: 1px solid #eee">
            <el-aside width="180px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-active="String(activeMenu) + '-' + String(activeSubMenu)" class="menu" @select="handleMenuSelect">
                    <el-submenu v-for="(domainItem, domainIndex) in menuItems" :key="domainItem.domain"
                        :index="String(domainIndex)" >
                        <template slot="title">
                            <span>{{ domainItem.domain }}</span>
                        </template>
                        <el-menu-item v-for="(varItem, varIndex) in domainItem.variables" :key="varItem"
                            :index="String(domainIndex) + '-' + String(varIndex)" >
                            {{ varItem }}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-container>
                <el-main>
                    <el-form :model="calculateForm" :rules="calculateRules" ref="calculateForm" class="demo-ruleForm" label-width="auto">
                        <span style="line-height: 300%;">系统计算配置</span>

                        <el-form-item label="衍生方式" prop="derivedType">
                            <el-select v-model="calculateForm.derivedType" placeholder="请选择衍生方式">
                                <el-option v-for="item in derivedTypeOptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="衍生类型" prop="derivedClass">
                            <el-select v-model="calculateForm.derivedClass" placeholder="请选择衍生类型">
                                <el-option v-for="item in derivedClassOptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="衍生内容" prop="derivedMethod">
                            <el-input v-if="calculateForm.derivedClass != 3" v-model="calculateForm.derivedMethod" placeholder="请输入衍生内容"></el-input>
                            <el-button v-else type="primary" @click="editFormula">编辑公式</el-button>
                        </el-form-item>

                        <el-divider></el-divider>
                        <span style="line-height: 300%;">衍生方法说明</span>
                        
                        <el-form-item label="衍生方法说明" prop="derivedMethodDescription">
                            <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="calculateForm.derivedMethodDescription" placeholder="请输入衍生方法说明"></el-input>
                        </el-form-item>
                    </el-form>

                    
                </el-main>
                
            </el-container>

            <el-dialog title="编辑公式" :visible.sync="editFormulaVisible" width="90%" :before-close="handleDialogClose">
                <el-container>
                    <!-- 变量 -->
                    <el-aside style="width: 35%; display: flex; flex-direction: column; align-items: center;" >
                        <div v-for="(item, index) in variablesList" :key="index" :index="index">
                            <div 
                            style="display: flex; align-items: center; justify-content: space-around; margin-bottom: 10px;">
                                <div style="width: 20%; font-size: 16px; text-align: center;">{{ item.variable }} = </div>
                                <el-input style="width: 50%;" v-model="item.value" placeholder="请输入变量值"></el-input>
                                <el-button style="width: 25%;" size="small" type="primary" @click="deleteVariable(index)">删除</el-button>
                            </div>
                        </div>
                        <el-button size="small" type="primary" @click="addVariable">添加</el-button>
                    </el-aside>

                    <!-- case -->
                    <el-main style="width: 65%">
                        <el-button size="small" type="primary" @click="addTab" style="margin-bottom: 10px;">添加</el-button>
                        <el-tabs v-model="selectTabName" type="card" 
                            @tab-click="changeTab" 
                            closable 
                            @tab-remove="deleteTab">
                            <el-tab-pane v-for="(item, index) in TabsList" 
                            :index="index" 
                            :key="index"
                            :name="'case' + String(index + 1)"
                            :label="'case' + String(index + 1)"
                            ></el-tab-pane>
                        </el-tabs>
                        <div v-for="(item, index) in TabsList[selectTabIndex]" :key="index" :index="index">
                            <div 
                            style="display: flex; align-items: center; justify-content: space-around; margin-bottom: 5px;">
                                <el-select style="width: 20%;" v-model="item.variable" placeholder="请选择变量">
                                    <el-option v-for="item in variablesList" :key="item.variable" :label="item.variable"
                                        :value="item.variable">
                                    </el-option>
                                </el-select>
                                <el-select style="width: 20%;" v-model="item.comparator" placeholder="请选择比较符">
                                    <el-option v-for="item in comparators" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-input style="width: 45%;" v-model="item.value" placeholder="选择IN或NOTIN时请用英文逗号隔开"></el-input>
                                <el-button style="width: 12%;" size="small" type="primary" @click="deleteCondition(index)">删除</el-button>
                            </div>
                        </div>
                        <el-button size="small" type="primary" @click="addCondition()">添加</el-button>
                        <el-divider></el-divider>
                        <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="customFormulaList[selectTabIndex]" placeholder="请输入自定义公式"></el-input>
                    </el-main>
                </el-container>
                <el-footer>
                    <div style="display: flex; justify-content: center;">
                        <el-button @click="handleDialogClose">取消</el-button>
                        <el-button type="primary" @click="confirmEditFormula">确定</el-button>
                    </div>
                </el-footer>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader.vue'
import { postForm } from '@/api/data'
export default {
    name: 'FourthStep',
    components: {
        CommonHeader,
    },
    data() {
        return {
            projectId: "",
            SDTMIG: "",
            termVersion: "",
            variable: "",

            // 加载状态
            loading: false,

            // 菜单栏
            menuItems: [
                // {
                //     "domain": "DD",
                //     "variables": [
                //         "DDTESTCD"
                //     ]
                // },
            ],

            activeMenu: 0,
            activeSubMenu: 0,
            
            // 系统计算配置
            calculateForm: {
                // 衍生方式
                derivedType: "",
                
                // 衍生类型
                derivedClass: "",

                // 衍生内容
                derivedMethod: "",

                // 衍生方法说明
                derivedMethodDescription: "",
            },

            calculateRules: {
                derivedType: [
                    { required: true, message: "请选择衍生方式", trigger: "change" },
                ],
                derivedClass: [
                    { required: true, message: "请选择衍生类型", trigger: "change" },
                ],
                derivedMethod: [
                    { required: true, message: "请输入衍生内容", trigger: "blur" },
                ],
            },
            // 选项
            derivedTypeOptions: [
                {
                    value: 1,
                    label: "有衍生结果时覆盖原始数据，没有时保留原始数据",
                },
                {
                    value: 2,
                    label: "仅在没有原始数据时填充衍生结果",
                },
                {
                    value: 3,
                    label: "使用衍生结果替换全部原始数据，无论原始数据是否有值",
                },
            ],
            derivedClassOptions: [
                {
                    value: 1,
                    label: "常量",
                },
                {
                    value: 2,
                    label: "变量",
                },
                {
                    value: 3,
                    label: "自定义",
                }
            ],

            // 编辑公式
            // 可见性
            editFormulaVisible: false,
            
            // 变量列表
            variablesList: [
                {
                    variable: "X1",
                    value: ""
                },
            ],
            
            // 条件列表
            TabsList: [
                [
                    {
                        variable: "",
                        comparator: ""
                    },
                ],
            ],

            // 自定义公式列表
            customFormulaList: [
                ""
            ],

            // 比较符列表
            comparators : [
                {
                    label: "LT",
                    value: "<",
                },
                {
                    label: "LE",
                    value: "<=",
                },
                {
                    label: "GT",
                    value: ">",
                },
                {
                    label: "GE",
                    value: ">=",
                },
                {
                    label: "EQ",
                    value: "==",
                },
                {
                    label: "NE",
                    value: "!=",
                },
                {
                    label: "IN",
                    value: "in",
                },
                {
                    label: "NOTIN",
                    value: "not in",
                },
            ],

            // 选项卡状态
            selectTabName: "case1",
            selectTabIndex: 0,

            // 加载状态
            loading: false,
        }
    },
    mounted() {
        this.projectId = this.$route.query.projectId;
        this.SDTMIG = this.$route.query.SDTMIG;
        this.termVersion = this.$route.query.termVersion;
        this.getMenuData();
    },
    methods: {
        lastStep() {
            this.$router.push({
                path: "/ThirdStep",
                query: {
                    projectId: this.projectId,
                    SDTMIG: this.SDTMIG,
                    termVersion: this.termVersion,
                },
            });
        },

        // 保存并继续
        nextStep() {
            this.$router.push({
                path: "/FifthStep",
                query: {
                    projectId: this.projectId,
                    SDTMIG: this.SDTMIG,
                    termVersion: this.termVersion,
                },
            });
        },

        // 保存衍生变量
        saveDerivedVariables() {
            let _this = this;
            this.loading = true;

            if (this.calculateForm.derivedClass === 1) {
                this.calculateForm.derivedMethod = "return \""  + this.calculateForm.derivedMethod + "\"";
            }
            else if (this.calculateForm.derivedClass === 2) {
                this.calculateForm.derivedMethod = "x = " + this.calculateForm.derivedMethod + "\n###\nreturn x";
            }
            else if (this.calculateForm.derivedClass === 3) {
                let method = "";
                for (let item of this.variablesList) {
                    method += item.variable + " = " + item.value + "\n";
                }
                method += "###\n";

                for (let i = 0; i < this.TabsList.length; i++) {
                    let tab = this.TabsList[i];
                    method += "if (";
                    for (let j = 0; j < tab.length; j++) {
                        let condition = tab[j];
                        method += "("

                        if (condition.comparator === "in" || condition.comparator === "not in") {
                            method += condition.variable + " " + condition.comparator + " [" + condition.value + "]";
                        }
                        else {
                            method += condition.variable + " " + condition.comparator + " " + condition.value;
                        }

                        method += ")";
                        if (j !== tab.length - 1) {
                            method += " and ";
                        }
                    }
                    method += "):\n";
                    method += "\treturn " + this.customFormulaList[i] + "\n";
                }

                this.calculateForm.derivedMethod = method;
            }

            let postDataForm = {
                "projectId": this.projectId,
                "domain": this.domain,
                "variable": this.variable,
                "derivedType": this.calculateForm.derivedType,
                "derivedMethod": this.calculateForm.derivedMethod,
                "method": this.calculateForm.derivedMethodDescription,
            }

            // 检查 derivedType, derivedClass, derivedMethod 是否为空
            // 如果为空的话，就直接返回并发出警告
            let requiredFieldList = ["derivedType", "derivedClass", "derivedMethod"];
            let requiredNameList = ["衍生方式", "衍生类型", "衍生内容"];
            for(let i = 0; i < requiredFieldList.length; i++){
                let field = requiredFieldList[i];
                let name = requiredNameList[i];
                if(this.calculateForm[field] === ""){
                    this.$message({
                        message: name + "不能为空",
                        type: "warning",
                    });
                    this.loading = false;
                    return;
                }
            }

            postForm("/varSetting/saveDerivedMethod", postDataForm, this, function (res) {
                if (res.state === 200) {
                    _this.$message({
                        message: "保存成功",
                        type: "success",
                    });
                }
                else {
                    _this.$message({
                        message: "保存失败",
                        type: "error",
                    });
                }
                _this.loading = false;
            });

            
        },

        // 获取菜单数据
        getMenuData() {
            let _this = this;
            let postDataForm = {
                projectId: _this.projectId,
            };
            postForm("/varSetting/queryDerivedVar", postDataForm, this, function(res){
                let data = res.data;
                for(let item of data){
                    let domainItem = {
                        "domain": item.domain,
                        "variables": item.variables.slice(),
                    };
                    _this.menuItems.push(domainItem);
                }

                _this.domain = data[0].domain;
                _this.variable = data[0].variables[0];
            })
        },

        // 处理切换菜单
        handleMenuSelect(index) {
            let indexArr = index.split("-");
            this.activeMenu = Number(indexArr[0]);
            this.activeSubMenu = Number(indexArr[1]);
            this.domain = this.menuItems[this.activeMenu].domain;
            this.variable = this.menuItems[this.activeMenu].variables[this.activeSubMenu];

            // 清空右侧数据
            this.calculateForm.derivedType = "";
            this.calculateForm.derivedClass = "";
            this.calculateForm.derivedMethod = "";
            this.calculateForm.derivedMethodDescription = "";

            this.variablesList = [
                {
                    variable: "X1",
                    value: ""
                },
            ];

            this.TabsList = [
                [
                    {
                        variable: "",
                        comparator: ""
                    },
                ],
            ];

            this.customFormulaList = [
                ""
            ];
            
            this.selectTabName = "case1";
            this.selectTabIndex = 0;
        },

        // 编辑公式
        // 打开弹窗
        editFormula() {
            this.editFormulaVisible = true;
        },
        
        // 关闭弹窗
        handleDialogClose() {
            this.$confirm('确认关闭', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 关闭弹窗
                this.editFormulaVisible = false;
            }).catch(() => { });
        },

        // 确定编辑公式
        confirmEditFormula() {
            this.editFormulaVisible = false;
        },

        // 左侧添加变量
        addVariable() {
            let variable = {
                variable: "",
                value: "",
            };
            this.variablesList.push(variable);

            for(let i = 0; i < this.variablesList.length; i++){
                this.variablesList[i].variable = "X" + String(i + 1);
            }
        },

        // 左侧删除变量
        deleteVariable(index) {
            this.variablesList.splice(index, 1);

            for(let i = 0; i < this.variablesList.length; i++){
                this.variablesList[i].variable = "X" + String(i + 1);
            }
        },

        // 右侧添加选项卡
        addTab() {
            let condition = [
                {
                    variable: "",
                    comparator: ""
                }
            ];
            this.TabsList.push(condition);

            // 添加自定义公式
            this.customFormulaList.push("");
        },

        // 右侧删除选项卡
        deleteTab(tab) {
            let index = Number(tab.slice(4, tab.length));
            this.TabsList.splice(index, 1);
            if(this.selectTabIndex >= this.TabsList.length){
                this.selectTabIndex = this.TabsList.length - 1;
            }
            // 删除自定义公式
            this.customFormulaList.splice(index, 1);
        },

        // 右侧切换选项卡
        changeTab(tab) {
            let index = Number(tab.index);
            this.selectTabIndex = index;
        },
        
        // 右侧添加条件
        addCondition() {
            let condition = {
                variable: "",
                comparator: ""
            };
            this.TabsList[this.selectTabIndex].push(condition);
        },

        // 右侧删除条件
        deleteCondition(index) {
            this.TabsList[this.selectTabIndex].splice(index, 1);
        },
    }
}
</script>

<style scoped></style>