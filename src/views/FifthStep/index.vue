<template>
    <div>
        <common-header :stepNum="4"></common-header>
        <el-form>
            <el-form-item style="text-align: center">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary" :loading="loading" @click="generateDefineXML">生成define.xml</el-button>
                <el-button :loading="loading" @click="generateSDTM">生成SDTM</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader.vue'
import { postForm, generageSDTM } from '@/api/data'
export default {
    name: 'FifthStep',
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
        }
    },
    mounted() {
        this.projectId = this.$route.query.projectId;
        this.SDTMIG = this.$route.query.SDTMIG;
        this.termVersion = this.$route.query.termVersion;
    },
    methods: {
        lastStep() {
            this.$router.push({
                path: "/FourthStep",
                query: {
                    projectId: this.projectId,
                    SDTMIG: this.SDTMIG,
                    termVersion: this.termVersion,
                },
            });
        },

        // 生成Define.xml
        generateDefineXML() {
            let _this = this;
            this.loading = true;
            let postFormData = {
                sdtmVersion: this.SDTMIG,
                CTVersion: this.termVersion,
                projectId: this.projectId,
            }
            postForm("/define/downloadDefine", postFormData, this, function(res){
                console.log("define.xml", res);
                window.open(res)
                _this.loading = false
            })
        },

        // 生成SDTM
        generateSDTM() {
            let _this = this;
            this.loading = true;

            this.$store.commit('getRuleForm')
            let ruleForm = this.$store.state.first.ruleForm
            
            // if(ruleForm === null || ruleForm === undefined) {
            //     this.$message({
            //         message: '请重新上传第一步的原始数据集',
            //         type: 'warning'
            //     });
            //     this.loading = false
            //     return
            // }

            let postFormData = {
                projectId: this.projectId,
                path: ruleForm.dataset,
            }
            generageSDTM("/sdtm/downloadSdtm", postFormData, this, function(res){
                console.log("sdtm", res);
                window.open(res)
                _this.loading = false
            })
        },
    }
}
</script>

<style scoped>
</style>