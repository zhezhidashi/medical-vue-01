<template>
    <div>
        <common-header :stepNum="3"></common-header>
        <el-form>
            <el-form-item style="text-align: center">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary" :loading="loading" @click="nextStep">保存并继续</el-button>
            </el-form-item>
        </el-form>

        <el-container style="height: 80vh; border: 1px solid #eee">
            <el-aside width="180px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-active="String(activeMenu)" class="menu" @select="handleMenuSelect">
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
                    <span>系统计算配置</span>
                    <el-divider></el-divider>
                    <span>衍生方法说明</span>
                </el-main>
                
            </el-container>
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
            },
            
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
            let _this = this;
            _this.$router.push({
                path: "/FifthStep",
                query: {
                    projectId: _this.projectId,
                    SDTMIG: _this.SDTMIG,
                    termVersion: _this.termVersion,
                },
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
            })
        },

        // 处理切换菜单
        handleMenuSelect(index) {
            let indexArr = index.split("-");
            this.activeMenu = Number(indexArr[0]);
            this.activeSubMenu = Number(indexArr[1]);
        },

    }
}
</script>

<style scoped></style>