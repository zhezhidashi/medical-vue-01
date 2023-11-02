<template>
    <div>
        <common-header :stepNum="3"></common-header>
        <el-form>
            <el-form-item style="text-align: center">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary" :loading="loading" @click="generateDefineXML">生成define.xml</el-button>
            </el-form-item>
        </el-form>
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
                path: "/ThirdStep",
                query: {
                    projectId: this.projectId,
                    SDTMIG: this.SDTMIG,
                    termVersion: this.termVersion,
                },
            });
        },
        generateDefineXML() {
            let _this = this;
            this.loading = true;
            let postFormData = {
                sdtmVersion: this.SDTMIG,
                CTVersion: this.termVersion,
                projectId: this.projectId,
            }
            postForm("/define/downloadDefine", postFormData, this, function(res){
                window.open(res)
                _this.loading = false
            })
        },
    }
}
</script>

<style scoped>
</style>