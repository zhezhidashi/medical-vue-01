<template>
    <div>
        <el-steps :active="stepNum" finish-status="success" align-center>
            <el-step title="配置应用标准" description="说明基本信息，选择应用标准"></el-step>
            <el-step title="确认应用的域" description="确认数据集标准化之后的域"></el-step>
            <el-step title="设计数据集变量" description="设计每个域内的相关数据集和变量属性"></el-step>
            <el-step title="说明变量衍生方法" description="说明衍生变量的计算方法、代码片段"></el-step>
            <el-step title="生成Define.xml" description="生成Define.xml"></el-step>
        </el-steps>
    </div>
</template>

<script>
export default {
    name: 'CommonHeader',
    props: {
        stepNum: Number,
    },
    components: {
        // ...
    },
    data() {
        return {
            // ...
        }
    },
    methods: {
        // ...
    }
}
</script>

<style scoped></style>