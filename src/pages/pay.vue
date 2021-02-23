<template>
    <section class="insure-content">
        <Header @balance="balanceFun"></Header>
        <div class="insure-subMain">
            <div class="subMain">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">订单列表</div>
                </div>
                <div class="yj-table">
                    <table>
                        <thead>
                            <tr>
                                <td width="20%">投保单号</td>
                                <td width="30%">产品名称</td>
                                <td width="20%">投保人</td>
                                <td width="20%">被保人</td>
                                <td>价格</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="billItem in billList" :key="billItem.billId">
                                <td>{{billItem.code}}</td>
                                <td>{{billItem.proName}}</td>
                                <td>{{billItem.insName}}</td>
                                <td>{{billItem.assured}}【共{{billItem.assuredCount}}人】</td>
                                <td>{{billItem.premium}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="subMain">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">付款方式</div>
                </div>
                <div class="payList">
                    <ul>
                        <li :class="{'disable':noMoney}">
                            <el-radio v-model="payType" label="1" :disabled="noMoney"><span class="payIcon ye-icon"></span></el-radio>
                            <span class="payTxt">余额支付（余额：{{balance}}元）<span v-if="noMoney">余额不足</span></span>
                        </li>
                        <li>
                            <el-radio v-model="payType" label="2"><span class="payIcon weixin-icon"></span></el-radio>
                            <span class="payTxt">微信</span>
                        </li>
                    </ul>
                </div>
                <div class="payAct clearfix">
                    <div class="pay-money">订单金额：<span class="pay-count">¥<span class="payMoney">{{totalPermium}}</span></span></div>
                    <div class="paySubmit" @click="orderPay">立即支付</div>
                </div>
            </div>
        </div>
        <!-- 微信支付 -->
        <el-dialog
            title="微信支付"
            :visible.sync="wxPay"
            width="50%"
            @close="closePay"
            top="20vh">
            <div class="wxPay-box">
                <div class="wxPay-money">支付金额：<span class="price-money">{{totalPermium}}</span><span class="yuan-money">元</span></div>
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
    </section>
</template>

<script>
import QRCode from 'qrcodejs2'  // url生成二维码
import Header from '../components/header'
export default {
  name: 'Pay',
  components:{
        Header
   },
  data () {
    return {
        payType: '2',
        wxPay:false,
        billList:[],
        balance:'',
        noMoney:false,
        payUrl:'',
        timer:null,
        totalPermium:'',
        timeExpire:''
    }
  },
  methods: {
      closePay() {
          //关闭充值弹层清除支付回调
          clearInterval(this.timer);
      },
      orderPay() {
          if(this.payType === '1'){//余额支付
          this.$confirm('选择余额支付，会直接从账户中扣除保费', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/pay/accountPay',
                params:{
                    billId:this.$route.query.id
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    let userIntro = JSON.parse(localStorage.getItem('user'));
                    if(userIntro.userType === 1 || userIntro.userType === 2){//普通账户\plus账户
                        this.$router.push('/user');
                     }else{
                         this.$router.push('/order');
                     }
                }else{
                        this.$message({
                        message: res.data.message,
                        duration: 1000,
                        type: 'error'
                        });
                      return;
                    }
            })
            }).catch(() => {
            });
          }
          if(this.payType === '2'){//微信支付
             let loadingInstance = this.$loading();
             this.$ajax({
                    method:'post',
                    url:'/insurance/api/pay/wechatNativePay/',
                    params:{
                       billId:this.$route.query.id 
                    }
                })
                .then((res)=>{
                    loadingInstance.close();
                    if(res.data.code === 1){
                        this.wxPay = true;
                        this.payUrl = res.data.outData.codeurl;
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
          }
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
          let id = this.$route.query.id.split(',')[0];
          this.$ajax({
             method:'post',
             url:'/insurance/api/order/loadInsBillStateInfo/' + id
           })
           .then((res)=>{
              if(res.data &&  res.data.code == 1){
                  let currentCode =  res.data.outData.billState;
                  if(currentCode === 3 || currentCode === 4){//已支付或已承保
                      //如果状态发生变化
                      clearInterval(this.timer);
                      let userIntro = JSON.parse(localStorage.getItem('user'));
                        if(userIntro.userType === 1 || userIntro.userType === 2){//普通账户\plus账户
                            this.$router.push('/user');
                        }else{
                            this.$router.push('/order');
                        }
                  }
              }
           })
           .catch((error)=>{

           })
      },
      payFun() {
          let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/order/payBillPageInfo',
                params:{
                    billIds:this.$route.query.id
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.billList = res.data.outData.billList;
                    this.totalPermium = res.data.outData.totalPermium;
                }
            })
      },
      balanceFun(data) {
          this.balance = data;
      }
  },
  mounted() {
      this.payFun();
      if(this.balance < this.totalPermium){
          this.noMoney = true;
      }else{
          this.payType = '1';
      }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>

