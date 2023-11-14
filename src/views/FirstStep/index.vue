<template>
    <div>
        <common-header :stepNum="0"></common-header>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-width="auto">
            <el-form-item style="text-align: center">
                <el-button type="primary" :loading="loading" @click="nextStep">保存并继续</el-button>
            </el-form-item>

            <el-form-item label="研究名称" prop="researchName">
                <el-input v-model="ruleForm.researchName"></el-input>
            </el-form-item>

            <el-form-item label="研究描述" prop="researchDescription">
                <el-input v-model="ruleForm.researchDescription"></el-input>
            </el-form-item>

            <el-form-item label="方案名称" prop="methodName">
                <el-input v-model="ruleForm.methodName"></el-input>
            </el-form-item>

            <el-form-item label="元数据名称" prop="metadataName">
                <el-input v-model="ruleForm.metadataName"></el-input>
            </el-form-item>

            <el-form-item label="元数据描述" prop="metadataDescription">
                <el-input v-model="ruleForm.metadataDescription"></el-input>
            </el-form-item>

            <el-form-item label="SDTMIG" prop="SDTMIG">
                <el-select v-model="ruleForm.SDTMIG" placeholder="请选择SDTMIG">
                    <el-option v-for="option in SDTMIGOptions" :key="option.value" :label="option.label"
                        :value="option.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SDTMIG文件说明" prop="SDTMIGDescription">
                <el-input v-model="ruleForm.SDTMIGDescription"></el-input>
            </el-form-item>

            <el-form-item label="defineXML" prop="defineXML">
                <el-select v-model="ruleForm.defineXML" placeholder="请选择defineXML">
                    <el-option v-for="option in defineXMLOptions" :key="option.value" :label="option.label"
                        :value="option.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="DefineXML文件说明" prop="defineXMLDescription">
                <el-input v-model="ruleForm.defineXMLDescription"></el-input>
            </el-form-item>

            <el-form-item label="aCRF">
                <el-upload class="upload-demo" drag action="http://47.94.142.244:8080/config/upload" :on-success="handleUploadSuccess1">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>

            <el-form-item label="文件目的" prop="filePurpose">
                <el-radio-group v-model="ruleForm.filePurpose">
                    <el-radio label="递交"></el-radio>
                    <el-radio label="其他"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="当前文件版本" prop="nowFileVersion">
                <el-input v-model="ruleForm.nowFileVersion"></el-input>
            </el-form-item>

            <el-form-item label="文件说明" prop="fileDescription">
                <el-input v-model="ruleForm.fileDescription"></el-input>
            </el-form-item>

            <el-form-item label="上传原始数据集" prop="dataset">
                <el-upload class="upload-demo" drag action="http://47.94.142.244:8080/config/uploadDataset" :on-success="handleUploadSuccess2">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>

            <el-form-item label="受控术语版本" prop="termVersion">
                <el-select v-model="ruleForm.termVersion" placeholder="请选择受控术语版本">
                    <el-option v-for="option in termVersionOptions" :key="option.value" :label="option.label"
                        :value="option.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="受控术语文件说明" prop="termFileDescription">
                <el-input v-model="ruleForm.termFileDescription"></el-input>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
import CommonHeader from "@/components/CommonHeader.vue";
import { postForm } from "@/api/data";
export default {
    name: "FirstStep",
    components: {
        CommonHeader,
    },
    data() {
        return {
            // 表单数据
            ruleForm: {
                // 普通字段
                researchName: undefined,
                researchDescription: undefined,
                methodName: undefined,
                metadataName: undefined,
                SDTMIGDescription: undefined,
                defineXMLDescription: undefined,
                nowFileVersion: undefined,
                fileDescription: undefined,
                termFileDescription: undefined,

                // 固定选项
                filePurpose: undefined,

                // 不定选项
                SDTMIG: undefined,
                defineXML: undefined,
                termVersion: undefined,

                // 上传文件
                aCRF: undefined,
                dataset: undefined,
            },

            // 表单验证规则
            rules: {
                SDTMIG: [
                    { required: true, message: "请选择SDTMIG版本", trigger: "change" },
                ],
                SDTMIGDescription: [
                    { required: true, message: "请输入SDTMIG文件说明", trigger: "blur" },
                ],
                defineXMLDescription: [
                    { required: true, message: "请输入DefineXML文件说明", trigger: "blur" },
                ],
                dataset: [
                    { required: true, message: "请上传原始数据集", trigger: "blur" },
                ],
                termVersion: [
                    { required: true, message: "请选择受控术语版本", trigger: "change" },
                ],
                termFileDescription: [
                    { required: true, message: "请输入受控术语文件说明", trigger: "blur" },
                ],
            },

            // 选项
            SDTMIGOptions: [],
            defineXMLOptions: [],
            termVersionOptions: [],

            // 加载状态
            loading: false,
        };
    },
    mounted() {
        this.getOptions();
    },
    methods: {
        // 获得 SDTMIG选项，DEFINE-XML选项，受控术语版本选项
        getOptions() {
            let _this = this;

            // 获得 SDTMIG选项
            postForm("/config/querySdtmig", {}, this, function (res) {
                let data = res.data;

                for (let i = 0; i < data.length; i++) {
                    _this.SDTMIGOptions.push({ label: data[i], value: data[i] });
                }
            });

            // 获得 DEFINE-XML选项
            postForm("/config/queryDefineVersion", {}, this, function (res) {
                let data = res.data;

                for (let i = 0; i < data.length; i++) {
                    _this.defineXMLOptions.push({ label: data[i], value: data[i] });
                }
            });

            // 获得 受控术语版本选项
            postForm("/config/queryCtVersion", {}, this, function (res) {
                let data = res.data;

                for (let i = 0; i < data.length; i++) {
                    _this.termVersionOptions.push({ label: data[i], value: data[i] });
                }
            });
        },

        // 处理上传成功的回调 aCRF
        handleUploadSuccess1(response, file, fileList) {
            this.ruleForm.aCRF = response;
            console.log("处理上传成功的回调 aCRF", response);
            if(fileList.length > 1) {
                fileList.splice(0, 1);
            }
        },

        // 处理上传成功的回调 原始数据集
        handleUploadSuccess2(response, file, fileList) {
            this.ruleForm.dataset = response;
            console.log("处理上传成功的回调 原始数据集", response);
            if(fileList.length > 1) {
                fileList.splice(0, 1);
            }
        },

        // 保存并继续
        nextStep() {
            this.loading = true;

            let _this = this;
            
            // 检查 dataset, termVersion, termFileDescription, defineXMLDescription, SDTMIGDescription 是否为空。
            // 如果为空的话，就直接返回并发出警告
            let requiredFieldList = [
                "SDTMIG",
                "SDTMIGDescription",
                "defineXMLDescription",
                "dataset",
                "termVersion",
                "termFileDescription",
            ];

            let requiredNameList = [
                "SDTMIG",
                "SDTMIG文件说明",
                "DefineXML文件说明",
                "原始数据集",
                "受控术语版本",
                "受控术语文件说明",
            ];

            for(let i = 0; i < requiredFieldList.length; i++) {
                if(!this.ruleForm[requiredFieldList[i]]) {
                    this.loading = false;
                    this.$message({
                        message: requiredNameList[i] + "不能为空",
                        type: "warning",
                    });
                    return;
                }
            }

            let postDataForm = {
                "dataset": this.ruleForm.dataset,
                "ctVersion": this.ruleForm.termVersion,
                "ctDescription": this.ruleForm.termFileDescription,
                "defineXMLDescription": this.ruleForm.defineXMLDescription,
                "sdtmDescription": this.ruleForm.SDTMIGDescription,
            }

            if(this.ruleForm.metadataDescription) {
                postDataForm.metadataDescription = this.ruleForm.metadataDescription;
            }
            if(this.ruleForm.defineXML) {
                postDataForm.defineXML = this.ruleForm.defineXML;
            }
            if(this.ruleForm.aCRF) {
                postDataForm.aCRF = this.ruleForm.aCRF;
            }
            if(this.ruleForm.metadataName) {
                postDataForm.metadataName = this.ruleForm.metadataName;
            }
            if(this.ruleForm.nowFileVersion) {
                postDataForm.fileVersion = this.ruleForm.nowFileVersion;
            }
            if(this.ruleForm.researchDescription) {
                postDataForm.researchDescription = this.ruleForm.researchDescription;
            }
            if(this.ruleForm.fileDescription) {
                postDataForm.fileDescription = this.ruleForm.fileDescription;
            }
            if(this.ruleForm.SDTMIG) {
                postDataForm.sdtmig = this.ruleForm.SDTMIG;
            }
            if(this.ruleForm.filePurpose) {
                postDataForm.filePurpose = this.ruleForm.filePurpose;
            }
            if(this.ruleForm.researchName) {
                postDataForm.researchName = this.ruleForm.researchName;
            }
            if(this.ruleForm.methodName) {
                postDataForm.schemeName = this.ruleForm.methodName;
            }

            postForm("/config/save", postDataForm, this, function (res) {
                if(res.state === 200){
                    _this.$router.push({
                        path: "/SecondStep",
                        query: {
                            projectId: res.data,
                            SDTMIG: _this.ruleForm.SDTMIG,
                            termVersion: _this.ruleForm.termVersion,
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

<style scoped></style>
