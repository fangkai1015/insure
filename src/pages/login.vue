<template>
    <section class="insure-content">
        <SubHeader></SubHeader>   
        <div class="login-main clearfix">
            <div class="login-bg"></div>
            <div class="login-con">
                <div class="login-title">登录耀保网</div>
                <div class="login-type">{{loginTxt}}：</div>
                <div class="loginRes-list">
                    <div class="loginRes-con">
                        <span class="login-icon login-tel"></span>
                        <input type="text" class="loginRes-input" placeholder="请输入手机号码" maxlength="11" v-model="phone">
                    </div>
                    <div class="loginRes-con" v-if="mima">
                        <span class="login-icon login-password"></span>
                        <input type="password" id="password" class="loginRes-input" placeholder="请输入6-20位密码" minlength="6" maxlength="20" v-model="password">
                        <span class="eye-icon eye-close" :class="{'eye-open':eye}" @click="eyeFuc"></span>
                    </div>
                    <div class="loginRes-con loginRes-yzm" v-if="yzm">
                        <span class="login-icon login-yzm"></span>
                        <input type="text" class="loginRes-input" placeholder="请输入图形验证码" v-model="txm">
                        <img :src="txmImg" class="txmm">
                        <div class="txmm-change" @click="changeImg"></div>
                    </div>
                    <div class="loginRes-con" v-if="yzm">
                        <span class="login-icon login-msg"></span>
                        <input type="text" class="loginRes-input" placeholder="短请输入短信验证码" v-model="msg">
                        <div class="loginMsg-btn" v-if="hqBtn" @click="yzmFun">{{text}}</div>
                        <div class="loginMsg-second" v-if="secondGo"><span>{{second}}</span>s</div>
                    </div>
                </div>
                <div class="login-btn" @click="loginFun">登录</div>
                <div class="login-action clearfix">
                    <a href="javascript:;" class="login-other" v-if="mima" @click="yzmLogin">短信验证码登录</a>
                    <a href="javascript:;" class="login-other" v-if="yzm" @click="mimaLogin">密码登录</a>
                    <span class="login-res">没有账号？<router-link :to="{name:'register'}">注册</router-link></span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import SubHeader from '../components/subHeader'
export default {
  name: 'Login',
  components:{
        SubHeader
   },
  data () {
    return {
        yzm:false,
        mima:true,
        eye:false,
        phone: '',//手机号码
        password: '',//密码
        txm: '',//图形码
        msg: '',// 短信验证码
        txmImg: '',
        key: '',
        hqBtn: true,
        secondGo: false,
        second:60,
        text: '获取验证码',
        timer:null,
        loginTxt: '密码登录'
    }
  },
  methods: {
      yzmLogin() {
          this.yzm = true;
          this.mima = false;
          this.loginTxt = '验证码登录';
      },
      mimaLogin() {
          this.yzm = false;
          this.mima = true;
          this.loginTxt = '密码登录';
      },
      eyeFuc() {
          if(this.eye){
              this.eye = false;
              document.getElementById('password').setAttribute('type','password');
          }else{
              this.eye = true;
              document.getElementById('password').setAttribute('type','text');
          }
      },
      //发送短信
      yzmFun() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
          if(this.phone === ''){
                this.$message({
                    message: '请输入手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(!phoneReg.test(this.phone)){
                this.$message({
                    message: '请输入正确格式的手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(this.txm === ''){
                this.$message({
                    message: '请输入图形验证码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            this.$ajax({
                method:'post',
                url:'/insurance/api/common/smsCode',
                data:{
                    code:this.txm,
                    key:this.key,
                    mobile:this.phone,
                    type: 'LOGIN'
                }
            })
            .then((res)=>{
                if(res.data.code === 1){
                    this.secondGo = true;
                    this.hqBtn = false;
                    this.second = 60;
                    clearInterval(this.timer);
                    this.timer = setInterval(() => {
                        if(this.second > 0){
                        this.second--;
                        }else{
                        this.hqBtn = true;
                        this.secondGo = false;
                        this.text = '重新发送';
                        clearInterval(this.timer);
                        }
                    }, 1000);
                }else{
                   this.$message({
                    message: res.data.message,
                    duration: 1000,
                    type: 'error'
                    });
                    return; 
                }
            })
      },
      //登录信息
      loginFun() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
          if(this.phone === ''){
                this.$message({
                    message: '请输入手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(!phoneReg.test(this.phone)){
                this.$message({
                    message: '请输入正确格式的手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
          if(this.mima){//密码登录
            if(this.password === ''){
                this.$message({
                    message: '请输入登录密码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(this.password.length < 6 || this.password.length > 20){
                this.$message({
                    message: '请输入6-20位登录密码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/user/login',
                data:{
                    loginType:'password',
                    mobile:this.phone,
                    password:this.password
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    let userInfo = res.data.outData.userInfo,
                    userCon = JSON.stringify(userInfo);
                    localStorage.setItem('user', userCon);
                    if(userInfo.userType === 3 || userInfo.userType === 4 || userInfo.userType === 5){//PRO用户
                        this.$router.push('/insure');
                    }
                    if( userInfo.userType === 2){//plus用户
                        this.$router.push('/generalProList');
                    }
                    if(userInfo.userType === 1 ){//普通用户
                        this.$router.push('/generalProList');
                    }
                }else{
                    this.$message({
                        message: res.data.message,
                        duration: 1000,
                        type: 'error'
                    });
                }
            })
          }
          if(this.yzm){//短信登录
            if(this.txm === ''){
                this.$message({
                    message: '请输入图形验证码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(this.msg === ''){
                this.$message({
                    message: '请输入短信验证码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/user/login',
                data:{
                    loginType:'mobile',
                    mobile:this.phone,
                    password:this.msg
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    let userInfo = res.data.outData.userInfo,
                    userCon = JSON.stringify(userInfo);
                    localStorage.setItem('user', userCon);
                    if(userInfo.userType === 3 || userInfo.userType === 4 || userInfo.userType === 5){//PRO用户
                        this.$router.push('/insure');
                    }
                    if( userInfo.userType === 2){//plus用户
                        this.$router.push('/generalProList');
                    }
                    if(userInfo.userType === 1 ){//普通用户
                        this.$router.push('/generalProList');
                    }
                }else{
                    this.$message({
                        message: res.data.message,
                        duration: 1000,
                        type: 'error'
                    });
                }
            })
          }
      },
      //改变图片验证码
      changeImg() {
           let time = new Date().getTime();
           this.key = time;
           if(window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1){
            this.txmImg = 'http://115.159.64.84:9001/insurance/api/common/verifyCode/'+ time;
            }else{
                this.txmImg = '/insurance/api/common/verifyCode/'+ time;
            }
      }
  },
  mounted() {
      this.changeImg();
  },
  destroyed () {
    clearInterval(this.timer);
  }
}
</script>

