<template>
    <section class="insure-content">
        <Header></Header>
        <div class="childAccount">
            <div class="insureTb-account">子账户可使用主账户中的余额购买主账户下所有的产品。<a href="javascript:;" class="addAccount" @click="addChildFun">新增子账户</a></div>
            <div class="insure-tbxx">
                <div class="tbxx-submit balance-submit clearfix">
                    <div class="tbxx-model clearfix">
                        <span class="tbxx-label order-label">联系人：</span>
                        <div class="accountInput"><el-input v-model="name" placeholder="请输入联系人姓名或者电话"></el-input></div>
                    </div>
                    <div class="tbxx-model clearfix">
                        <span class="tbxx-label order-label">账户状态：</span>
                        <div class="accountInput">
                            <el-select v-model="accountSta">
                                <el-option
                                v-for="item in accountStas"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="finance-cx" @click="accSearch">查询</div>
                    <div class="finance-reset" @click="resetSearch">重置</div>
                </div>
            </div>
            <div class="insure-tbxx" style="min-height:400px">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">子账户列表</div>
                </div>
                <div class="yj-table">
                    <table>
                        <thead>
                            <tr>
                                <td>序号</td>
                                <td>联系人姓名</td>
                                <td>联系人电话</td>
                                <td>创建时间</td>
                                <td>账户状态</td>
                                <td>操作</td>
                                <!-- <td>权限</td> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(accList,index) in accountItem" :key="accList.id">
                                <td>{{index+1}}</td>
                                <td>{{accList.name}}</td>
                                <td>{{accList.mobile}}</td>
                                <td>{{accList.createTime}}</td>
                                <td>{{statusArr[index]}}</td>
                                <td><a href="javascript:;" class="account-act" @click="updateIntro(accList.id)">修改信息</a><a href="javascript:;" class="account-act" @click="statusFun(accList.id,accList.status,accList.name)">{{statusAct[index]}}</a></td>
                                <!-- <td><span class="rules-icon rules-yes"></span><span class="rules-txt">服务费不可见</span></td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
                <el-pagination
                    hide-on-single-page
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="size"
                    layout="prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <!-- 新增子账户 -->
        <el-dialog
            title="新增子账户"
            :visible.sync="addChildAcc"
            width="50%"
            top="20vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="childIntro" label-width="80px">
                    <el-form-item label="手机号码">
                        <el-input v-model="childIntro.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="childIntro.name" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码">
                        <el-input v-model="childIntro.password" placeholder="请输入6-20位登录密码" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="密码确认">
                        <el-input v-model="childIntro.surePassword" placeholder="请输入6-20位密码确认" show-password></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSubAccount">{{actionTxt}}</el-button>
            </span>
        </el-dialog>
        <Footer></Footer>
    </section>
</template>

<script>
import Footer from '../components/footer'
import Header from '../components/header'
export default {
  name: 'ChildAccount',
  inject:['reload'],
   components:{
        Footer,
        Header
   },
  data () {
    return {
        childIntro:{
            phone: '',
            name: '',
            password: '',
            surePassword: ''
        },
        name: '',
        phone: '',
        accountSta: '',
        accountStas: [{
            value: '',
            label: '全部'
        },
        {
            value: '1',
            label: '已开通'
        },
        {
            value: '2',
            label: '已冻结'
        }],
        addChildAcc: false,
        accountItem:[],
        statusArr:[],
        statusAct: [],
        userId: '',
        currentPage:1,
        size:10,
        totalCount:0,
        actionTxt: ''
    }
  },
  methods: {
      addChildFun() {
          //初始化数据
          this.childIntro.phone = '';
          this.childIntro.name = '';
          this.childIntro.password = '';
          this.childIntro.surePassword = '';
          this.addChildAcc = true;
          this.userId = '';
          this.actionTxt = '新增';
      },
      addSubAccount() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/,
          realNameReg = /^([\u4e00-\u9fa5]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5]|\u3007)+$/;
          if(this.childIntro.phone === '' || !phoneReg.test(this.childIntro.phone)){
              this.$message({
                message: '请输入正确的手机号码',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.childIntro.name === '' || !realNameReg.test(this.childIntro.name)){
              this.$message({
                message: '请输入正确的真实姓名',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.childIntro.password === '' || this.childIntro.password.length < 6 || this.childIntro.password.length > 20){
              this.$message({
                message: '请输入6-20位的登录密码',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.childIntro.surePassword === '' || this.childIntro.surePassword.length < 6 || this.childIntro.surePassword.length > 20){
              this.$message({
                message: '请输入6-20位的密码确认',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.childIntro.password !== this.childIntro.surePassword){
              this.$message({
                message: '二次密码输入不一致',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          let ajaxUrl = '';
          if(this.userId){//修改账号
              ajaxUrl = '/insurance/api/user/updateChildAccount'
          }else{
              ajaxUrl = '/insurance/api/user/addSubAccount'
          }
          let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:ajaxUrl,
                data: {
                    mobile:this.childIntro.phone,
                    name:this.childIntro.name,
                    password:this.childIntro.password,
                    userId:this.userId
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.reload();
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
      getSubAccount(index) {
          let loadingInstance = this.$loading();
            this.$ajax({
            method:'post',
            url:'/insurance/api/user/queryUserChildAccountPage',
            data: {
                limit: 10,
                page: index,
                status: this.accountSta,
                contact: this.name,
                userId: this.userId
            }
        })
        .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
               let accountCon = res.data.outData.rows;
               this.accountItem = accountCon;
               this.totalCount = res.data.outData.total;
               let statusTxt = '',statusItro = '';
               this.statusArr = [];
               accountCon.map((val,i) => {
                   if(val.status === 2){
                       statusTxt = '已冻结';
                       statusItro = '开通账户';
                   }else{
                       statusTxt = '已开通';
                       statusItro = '冻结账户';
                   }
                   this.statusArr.push(statusTxt);
                   this.statusAct.push(statusItro);
               })
            }
        })
      },
      statusFun(id,status,name) {
          let type = '',typeTxt = '';
          if(status === 1){
              type = 'FROZEN';
              typeTxt = '冻结';
          }else{
             type = 'ENABLE';
             typeTxt = '开通'; 
          }
          this.$confirm('确认'+typeTxt+name+'账户的使用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
            method:'post',
            url:'/insurance/api/user/enableOrFrozenDepAccount/' + id + '/' + type
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.reload();
                }
            })
          }).catch(() => {
          });
      },
      accSearch() {
          this.currentPage = 1;
          this.getSubAccount(0);
      },
      resetSearch() {
          this.accountSta = '';
          this.name = '';
          this.getSubAccount(0);
      },
      updateIntro(id) {
          this.userId = id;
         let loadingInstance = this.$loading();
         this.$ajax({
            method:'post',
            url:'/insurance/api/user/subAccountInfo/' + id
        })
        .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
                let updateIntro = res.data.outData.userInfo;
                this.addChildAcc = true;
                this.actionTxt = '确认修改';
                this.childIntro.phone = updateIntro.mobile;
                this.childIntro.name = updateIntro.name;
            }
        })
      },
      handleSizeChange(val) {
          this.getSubAccount(val-1)
      },
      handleCurrentChange(val) {
          this.getSubAccount(val-1)
      }
  },
  mounted() {
      this.getSubAccount(0);
  }
}
</script>

