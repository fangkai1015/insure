<template>    
    <div class="insure-tb">
        <!-- 账号设置 -->
        <div class="zhsz-box">
            <div class="userSet-box clearfix">
                <div class="userSet-intro">
                    <i class="ok-icon"></i>
                    <span class="userSet-name">登录密码</span>
                    <span class="userSet-status">已验证</span>
                </div>
                <a href="javascript:;" class="userSet-action" @click="updateFun">修改密码</a>
            </div>

            <div class="userSet-box clearfix">
                <div class="userSet-intro">
                    <i class="ok-icon"></i>
                    <span class="userSet-name">手机验证</span>
                    <span class="userSet-status">已验证：{{phone}}</span>
                </div>
                <!-- <a href="javascript:;" class="userSet-action" @click="jiebang = true">重新绑定</a> -->
            </div>
        </div>
        <!-- 修改密码 -->
        <el-dialog
            title="修改密码"
            :visible.sync="datePassword"
            width="50%"
            top="20vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="passwordIntro" label-width="80px">
                    <el-form-item label="旧密码">
                        <el-input v-model="passwordIntro.old" placeholder="请输入6-20位旧密码" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="passwordIntro.new1" placeholder="请输入6-20位新密码" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="passwordIntro.new2" placeholder="请输入6-20位确认密码" show-password></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updatePassword">确认修改</el-button>
            </span>
        </el-dialog>
        <!-- 解绑原手机 -->
        <el-dialog
            title="解绑原手机"
            :visible.sync="jiebang"
            width="50%"
            top="20vh"
            center>
            <div class="oldIntro" v-if="oldCon">
                <div class="jiebangSubmit">
                    <el-form ref="form" :model="jiebangIntro" label-width="80px">
                        <el-form-item label="原手机号">
                            15892783456
                        </el-form-item>
                        <el-form-item label="验证码">
                            <el-input v-model="jiebangIntro.yzm1" placeholder="请输入验证码"></el-input>
                            <div class="yzm-act" v-if="yzmGet1">
                                <el-button type="primary">获取验证码</el-button>                          
                            </div>
                            <div class="yzm-sec" v-if="secShow1">
                                <el-button disabled>60s</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary">下一步</el-button>
                </span>
                <div class="jiebang-tips">原手机不能接受短信？请联系客服修改</div>
            </div>

            <div class="newIntro" v-if="newCon">
                <div class="jiebangSubmit">
                    <el-form ref="form" :model="jiebangIntro" label-width="80px">
                        <el-form-item label="现手机号">
                            <el-input v-model="jiebangIntro.phone" placeholder="现手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码">
                            <el-input v-model="jiebangIntro.yzm2" placeholder="请输入验证码"></el-input>
                            <div class="yzm-act" v-if="yzmGet2">
                                <el-button type="primary">获取验证码</el-button>                          
                            </div>
                            <div class="yzm-sec" v-if="secShow2">
                                <el-button disabled>60s</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary">下一步</el-button>
                </span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'AccountSafe',
  inject:['reload'],
  data () {
    return {
        datePassword: false,
        jiebang:false,
        yzmGet1:true,
        secShow1: false,
        yzmGet2:true,
        secShow2: false,
        passwordIntro: {
            old: '',
            new1: '',
            new2: ''
        },
        jiebangIntro: {
            yzm1: '',
            phone: '',
            yzm2: ''
        },
        oldCon: true,
        newCon: false,
        phone: ''
    }
  },
  methods: {
      updateFun() {
          this.datePassword = true;
      },
      updatePassword() {
          if(this.passwordIntro.old === ''){
              this.$message({
                    message: '请输入旧密码',
                    duration: 1000,
                    type: 'error'
             });
             return;
          }
          if(this.passwordIntro.new1 === ''){
              this.$message({
                    message: '请输入新密码',
                    duration: 1000,
                    type: 'error'
             });
             return;
          }
          if(this.passwordIntro.new2 === ''){
              this.$message({
                    message: '请输入确认密码',
                    duration: 1000,
                    type: 'error'
             });
             return;
          }
          if(this.passwordIntro.new2 !== this.passwordIntro.new1){
              this.$message({
                    message: '新密码与确认密码不一致',
                    duration: 1000,
                    type: 'error'
             });
             return;
          }
        if(this.passwordIntro.old.length < 6 || this.passwordIntro.old.length > 20 || this.passwordIntro.new1.length < 6 || this.passwordIntro.new1.length > 20 || this.passwordIntro.new2.length < 6 || this.passwordIntro.new2.length > 20){
            this.$message({
                    message: '请输入6-20位密码',
                    duration: 1000,
                    type: 'error'
             });
             return;
        }
        let loadingInstance = this.$loading();
        this.$ajax({
            method:'post',
            url:'/insurance/api/user/changPwd',
            data: {
                rePwd:this.passwordIntro.old,
                newPwd:this.passwordIntro.new1           
            }
        })
        .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
                this.$message({
                    message: '修改完成',
                    duration: 1000,
                    type: 'success',
                    onClose:()=>{
                        this.reload();
                    }
             });
            }else{
                this.$message({
                    message: res.data.message,
                    duration: 1000,
                    type: 'error'
                });
                return; 
            }
        })
      }
  },
  mounted() {
      let userIntro = JSON.parse(localStorage.getItem('user')),
      mobile = userIntro.mobile,
      reg = /^(\d{3})\d{4}(\d{4})$/;
      this.phone = mobile.replace(reg, "$1****$2");
  }
}
</script>

