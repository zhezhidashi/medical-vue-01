<template>
    <div>
        <common-header :stepNum="2"></common-header>
        <el-form>
            <el-form-item style="text-align: center">
                <el-button @click="lastStep">上一步</el-button>
                <el-button type="primary" :loading="loading" @click="nextStep">保存并继续</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader.vue'
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
                path: "/SecondStep",
                query: {
                    projectId: this.projectId,
                    SDTMIG: this.SDTMIG,
                    termVersion: this.termVersion,
                },
            });
        },
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
    }
}
</script>

<style scoped>

</style>