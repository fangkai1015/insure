<template>
    <div>
        <header class="insure-header">
            <div class="header-con clearfix">
                <div class="logo" v-if="common"><router-link :to="{name:'user'}"><img src="../../static/images/logo.png" alt="logo"  class="logo-img"></router-link></div>
                <div class="logo" v-else-if="plus"><router-link :to="{name:'user'}"><img src="../../static/images/logo.png" alt="logo"  class="logo-img"></router-link></div>
                <div class="logo" v-else><router-link :to="{name:'insure'}"><img src="../../static/images/logo.png" alt="logo"  class="logo-img"></router-link></div>
                <!-- 渠道客户 -->
                <div class="header-menu" v-if="senior">
                    <ul>
                        <!-- <li><router-link :to="{name:'total'}" active-class="active">首页</router-link></li> -->
                        <li><router-link to="/insure" active-class="active">投保</router-link></li>
                        <li><router-link :to="{name:'order'}" active-class="active">订单</router-link></li>
                        <li><router-link :to="{name:'finance'}" active-class="active" v-if="childAccount">财务</router-link></li>
                        <li v-if="childAccount">
                            <a href="javascript:;" class="navMore" @mouseenter="subShow = true" @mouseleave="subShow = false">更多</a>
                            <div class="subnav-box" v-show="subShow" @mouseenter="subShow = true" @mouseleave="subShow = false">
                                <i class="more-arrow"></i>
                                <span v-if="channel"><router-link :to="{name:'channel'}">Pro用户管理</router-link></span>
                                <span><router-link :to="{name:'childAccount'}">子账户</router-link></span>
                                <span><router-link :to="{name:'invoice'}" target="_blank">发票管理</router-link></span>
                                <span><router-link :to="{name:'goods'}">商品管理</router-link></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 普通级plus客户 -->
                <div class="header-menu" v-if="common">
                    <ul>
<!--                        <li><router-link to="/user" active-class="active">个人中心</router-link></li>-->
                        <li><router-link to="/generalProList" active-class="active">产品列表</router-link></li>
<!--                        <li><router-link :to="{name:'index'}">返回首页</router-link></li>-->
                    </ul>
                </div>
                <div class="header-menu" v-if="plus">
                    <ul>
                        <li><router-link to="/user" active-class="active">个人中心</router-link></li>
                        <li><router-link to="/generalProList" active-class="active">产品列表</router-link></li>
                        <li><router-link :to="{name:'index'}">返回首页</router-link></li>
                    </ul>
                </div>
                <div class="header-other">
                    <div class="zhye">账号余额：<span class="account-money">{{balance}}元</span><span class="rechange-btn" @click="incomeFun">充值</span></div>
                    <div class="kefu-box">
                        <div class="kefu-txt" @mouseenter="ewmShow = true" @mouseleave="ewmShow = false">客服</div>
                        <div class="kefu-ewm" v-show="ewmShow">
                            <img :src="serviceQR" alt="">
                            <div class="kefu-only">我的专属客服</div>
                        </div>
                    </div>
                    <div class="header-notice" @click="enterNotice"><span class="hNotice-count" v-if="noticeShow">{{noticeNumber}}</span></div>
                    <div class="headerUser-intro" @mouseenter="subEnter" @mouseleave="subLeave">
                        <img src="../../static/images/grzx_touxiang.png" alt="头像" class="toux-img">
                        <span class="headerUser-name">{{name}}</span>
                    </div>
                    <div class="headerUser-nav" v-show="subNav" @mouseenter="subEnter" @mouseleave="subLeave">
                        <ul>
                            <li v-if="senior"><router-link to="/account/accountInfo" class="zhuti">主体信息</router-link></li>
                            <li><router-link to="/account/accountSafe" class="zhanghao">账号设置</router-link></li>
                            <li><router-link to="/account/contact" class="quanxian">常用联系人</router-link></li>
                            <li><a href="javascript:;" class="tuichu" @click="loginOut">退出登录</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </header>
        <!--  账户充值 -->
        <el-dialog
            title="账户充值"
            :visible.sync="investShow"
            width="55%"
            top="20vh"
            center>
            <div class="invest-box">
                <div class="invest-wrap">
                    <span class="invest-label">账户余额：</span>
                    <span class="account-yu">{{balance}}元</span>
                </div>
                <div class="invest-intro">
                    <span class="invest-label">充值金额</span>
                    <span class="invest-money" v-for="(inMoney,index) in incomeMoney" :key="index" :class="{'invest-sel':moneyCur == index}" @click="moneyFun(index)">{{inMoney}}元</span>
                    <span class="shuru-money">
                        <input type="text" class="shuru-input" placeholder="自定义金额" v-model.trim="investMoney" @blur="checkMoney" @keyup="defaultMoney">元
                    </span>
                </div>
                <div class="invest-intro">
                    <span class="invest-label">充值方式：微信支付</span>
                </div>
                <div class="invest-intro">
                    <p class="invest-tips">网上充值由于依赖多方的系统及网络，某些情况下会产生延迟，如有问题，请等待或者联系客户经理！</p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="investFun">确认充值</el-button>
            </span>
        </el-dialog>
        <!-- 微信支付 -->
        <el-dialog
            title="微信支付"
            :visible.sync="wxPay"
            width="50%"
            @close="closePay"
            top="20vh">
            <div class="wxPay-box">
                <div class="wxPay-money">支付金额：<span class="price-money">{{payAmount}}</span><span class="yuan-money">元</span></div>
                <div class="wxPay-act clearfix">
                    <div class="wxPay-ewm">
                        <div id="qrcode"></div>
                        <div class="wxPay-txt">微信扫码支付</div>
                        <div class="wx-time">支付码有效时间：{{timeExpire}}</div>
                    </div>
                    <div class="wxPay-layer"></div>
                </div>
            </div>
        </el-dialog>

        <!-- 微信支付 -->
        <el-dialog
            title=""
            :visible.sync="incomeSuc"
            width="30%"
            center
            top="20vh">
            <div class="incomeSuccess">
                <h3 class="incomeTitle">充值成功</h3>
                资金已转入您余额中<br>
                当前账户余额为{{balance}}元
            </div>
             <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="incomeSuc = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2'  // url生成二维码
export default {
  name: 'Header',
  data () {
    return {
        childAccount:true,
        channel:true,
        incomeSuc:false,
        moneyCur:2,
        subNav:false,
        subShow:false,
        ewmShow:false,
        senior:false,
        common: false,
        plus: false,
        investShow: false,
        wxPay: false,
        name: '',//用户名
        balance: '',//账户余额
        noticeNumber: '',//通知数量
        noticeShow: false,
        incomeMoney:[100,500,1000,2000,5000],
        curMoney:1000,
        investMoney:'',
        payAmount:'',
        payUrl:'',
        orderId:'',
        stateCode:'0',//未支付
        timer:null,
        timeExpire:'',
        serviceQR:''//客户二维码
    }
  },
  methods: {
      closePay() {
          //关闭充值弹层清除支付回调
          clearInterval(this.timer);
      },
      incomeFun() {
          this.investShow = true;
          this.moneyCur = 2;
          this.investMoney = '';
      },
      checkMoney() {
          let moneyReg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
          if(this.investMoney === '' || !moneyReg.test(this.investMoney)){
              this.$message({
                message: '请输入正确的金额',
                duration: 1000,
                type: 'error'
                });
              return;
          }
      },
      defaultMoney() {
          if(this.investMoney !== ''){
              this.moneyCur = -1;
          }
      },
      moneyFun(index) {
          this.moneyCur = index;
          this.curMoney = this.incomeMoney[index];
      },
      subEnter() {
          this.subNav = true;
      },
      subLeave() {
          this.subNav = false;
      },
      enterNotice() {
          this.$router.push('/notice');
      },
      investFun() {
          let moneyCount = '';
          let userIntro = JSON.parse(localStorage.getItem('user'));
          if(this.moneyCur === -1){//自定义金额
              let moneyReg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
                if(this.investMoney === '' || !moneyReg.test(this.investMoney)){
                    this.$message({
                        message: '请输入正确的金额',
                        duration: 1000,
                        type: 'error'
                        });
                    return;
                }
            moneyCount = this.investMoney;
          }else{
              moneyCount = this.curMoney;
          }
          let loadingInstance = this.$loading();
            this.$ajax({
                    method:'post',
                    url:'/insurance/api/pay/rechargeMoney',
                    params:{
                      amount:moneyCount,
                      userId:userIntro.id
                    }
                })
                .then((res)=>{
                    if(res.data.code === 1){
                         loadingInstance.close();
                         this.payAmount = res.data.outData.payAmount;
                         this.investShow = false;
                        this.wxPay = true;
                        this.payUrl = res.data.outData.codeurl;
                        this.orderId = res.data.outData.orderId;
                        this.timeExpire = res.data.outData.timeExpire;
                        this.qrcode();
                        this.timer = setInterval(this.loadOrderState,3000);
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
      qrcode() {
          setTimeout(() => {
            document.getElementById('qrcode').innerHTML = '';
            let qrcode = new QRCode("qrcode", {
            text: this.payUrl,
            width: 235, //图像宽度
            height: 235, //图像高度
            });
            qrcode.clear(); //清除二维码
            qrcode.makeCode(this.payUrl); //生成另一个新的二维码
        }, 500);
      },
      loadOrderState() {
          this.$ajax({
             method:'post',
             url:'/insurance/api/pay/getRechargeStatus',
             params:{
                 orderId:this.orderId
             }
           })
           .then((res)=>{
              if(res.data &&  res.data.code == 1){
                  let currentCode =  res.data.outData.status;
                  this.balance = res.data.outData.balance;
                  if( this.stateCode != currentCode){
                      //如果状态发生变化
                      clearInterval(this.timer);
                      //提示充值成功
                      this.wxPay = false;
                     this.incomeSuc = true;
                  }
              }
           })
           .catch((error)=>{

           })
      },
      loginOut() {
        let loadingInstance = this.$loading();
        this.$ajax({
                method:'post',
                url:'/insurance/api/user/logout'
            })
            .then((res)=>{
                 loadingInstance.close();
                if(res.data.code === 1){
                    localStorage.removeItem('user');
                this.$router.push('/login');
                }
            })
      },
      accountFun() {
          this.$ajax({
                method:'get',
                url:'/insurance/api/fn/accountInfo'
            })
            .then((res)=>{
                if(res.data.code === 1){
                    let accountInfo = res.data.outData.fnAccount
                    this.balance = accountInfo.balance;
                    this.serviceQR = res.data.outData.serviceQR;
                    //子级传余额到父级
                    this.$emit('balance',accountInfo.balance);
                }
            })
      },
      numberFun() {
          this.$ajax({
                method:'post',
                url:'/insurance/api/notice/grepUnReadNoticeNum'
            })
            .then((res)=>{
                if(res.data.code === 1){
                    if(res.data.outData.unReadNum > 0){
                        this.noticeShow = true;
                        this.noticeNumber = res.data.outData.unReadNum;
                    }
                }
            })
      }
  },
  mounted() {
      let userIntro = JSON.parse(localStorage.getItem('user'));
      this.name = userIntro.name || userIntro.mobile;
      if(userIntro.userType === 3 || userIntro.userType === 4 || userIntro.userType === 5){//pro账户
          this.senior = true
      }
      if(userIntro.userType === 1 ){//普通账户
          this.common = true
      }
      if(userIntro.userType === 2){//plus账户
          this.plus = true
      }
      if(userIntro.userType === 5){//部门账户
          this.channel = false;
      }
      if(userIntro.isChildAccount){//子账户
          this.childAccount = false;
      }
      this.accountFun();
      this.numberFun();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>

