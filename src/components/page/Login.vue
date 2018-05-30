<template>
    <div class="login-wrap">
        <div class="ms-title">开发测试管理平台</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <h3 class="title" >欢迎登录</h3>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.get('/sso/login', {
                          params: {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                          }
                        }).then(response => {
                            this.$router.push({path: '/home'});
                        }).catch(error => {
                          //超时之后在这里捕抓错误信息.
                          if (error.response) {
                            console.log('error.response')
                            console.log(error.response);
                          } else if (error.request) {
                            console.log(error.request)
                            console.log('error.request')
                            if(error.request.readyState == 4 && error.request.status == 0){
                              //我在这里重新请求
                            }
                          } else {
                            console.log('Error', error.message);
                          }
                          console.log(error.config);
                        });
                    } else {
                        console.log('invalid data!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:330px;
        height:250px;
        margin:-150px 0 0 -200px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    .demo-ruleForm .title {
    margin: 0px auto 10px auto;
    text-align: center;
    color: #505458;
    }
</style>