<template>
    <section class="insure-content">
        <Header></Header>
        <div class="insure-subMain">
            <div class="subMain">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">{{billInfo.insProductName}}</div>
                    <span class="orderDetail-tbdh fr">投保单号：{{billInfo.billCode}}</span>
                </div>
                <div class="orderDetail-list">
                    <div class="orderTips" v-if="billInfo.undwrtMessage !== ''">{{billInfo.undwrtMessage}}</div>
                    <ul class="clearfix">
                        <li>订单状态：<span class="col1">{{billStatus}}</span></li>
                        <li>生效时间：{{billInfo.enableDate}}</li>
                        <li>终止时间：{{billInfo.disEnableDate}}</li>
                        <li>保险公司：{{billInfo.insurerFullName}}</li>
                        <li>实收保费：{{billInfo.premium}}元</li>
                        <li v-if="billInfo.insureType === 2 && (billInfo.billState === 4 || billInfo.billState === 5)">保单号：<a :href="billLink" target="_blank" v-if="billInfo.billState === 4" style="color:#2594ef">{{billInfo.pfileCode}}</a><span v-if="billInfo.billState === 5">{{billInfo.pfileCode}}</span></li>
                    </ul>
                </div>
            </div>

            <div class="subMain">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">投保人信息</div>
                </div>
                <div class="yj-table">
                    <table>
                        <thead>
                            <tr>
                                <td>姓名</td>
                                <td>证件类型</td>
                                <td>证件号码</td>
                                <td>出生日期</td>
                                <td>性别</td>
                                <td>手机号码</td>
                                <td>电子邮箱</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{billInsure.insName}}</td>
                                <td>{{creType}}</td>
                                <td>{{billInsure.insCredentials}}</td>
                                <td>{{billInsure.insBirthday}}</td>
                                <td>{{billInsure.insSex}}</td>
                                <td>{{billInsure.insPhone || ''}}</td>
                                <td>{{billInsure.insEmail || ''}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="subMain">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">被投保人信息</div>
                </div>
                <div class="yj-table" v-if="billInfo.insureType === 2">
                    <table>
                        <thead>
                            <tr>
                                <td>姓名</td>
                                <td>证件类型</td>
                                <td>证件号码</td>
                                <td>出生日期</td>
                                <td>性别</td>
                                <td>手机号码</td>
                                <td>价格</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(billItem,index) in billAssuredList" :key="billItem.id">
                                <td>{{billItem.name}}</td>
                                <td>{{increType[index]}}</td>
                                <td>{{billItem.certificateContent}}</td>
                                <td>{{billItem.birthday}}</td>
                                <td>{{billItem.sex}}</td>
                                <td>{{billItem.mobile || ''}}</td>
                                <td>{{billInfo.price}}元</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="yj-table" v-if="billInfo.insureType === 1">
                    <table>
                        <thead>
                            <tr>
                                <td>姓名</td>
                                <td>证件类型</td>
                                <td>证件号码</td>
                                <td>出生日期</td>
                                <td>性别</td>
                                <td>手机号码</td>
                                <td>投保状态</td>
                                <td>保单号</td>
                                <td>价格</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(billItem,index) in billAssuredList" :key="billItem.id">
                                <td>{{billItem.name}}</td>
                                <td>{{increType[index]}}</td>
                                <td>{{billItem.certificateContent}}</td>
                                <td>{{billItem.birthday}}</td>
                                <td>{{billItem.sex}}</td>
                                <td>{{billItem.mobile || ''}}</td>
                                <td>{{insureStatus[index]}}</td>
                                <td>
                                    <a :href="billItem.policyPath" v-if="billItem.insureState === 3" style="color:#2594ef" target="_blank">{{billItem.policyCode}}</a>
                                    <span v-else>暂无</span>
                                </td>
                                <td>
                                    <span v-if="billItem.insureState === 2">0元</span>
                                    <span v-else>{{billInfo.price}}元</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="subMain">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">保障项目</div>
                </div>
                <div class="bzxm">
                    <ul>
                        <li v-for="pruductItem in productContentList" :key="pruductItem.id">
                            {{pruductItem.contentName}}
                            <span class="bzxmMoney fr">{{pruductItem.price}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="orderDetail-bottom" v-if="billInfo.billState === 2">
            <div class="orderDetail-footer">
                <div class="payBtn fr" @click="payEnter">立即支付</div>
            </div>
        </div>
    </section>
</template>

<script>
import { Switch } from 'element-ui';
import Header from '../components/header'
export default {
  name: 'orderDetail',
  inject:['reload'],
  components:{
        Header
   },
  data () {
    return {
        billInfo:{},
        billStatus:'',
        creType:'',
        billInsure:{},
        billAssuredList:[],
        increType:[],
        productContentList:[],
        timer:null,
        stateCode:'',
        billLink:'',
        insureStatus:[]
    }
  },
  methods: {
      payEnter() {
          this.$router.push({path: '/pay',query:{ id:this.$route.params.id}});
      },
      orderFun() {
           let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/order/queryUserBillInfoById/' + this.$route.params.id
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.billInfo = res.data.outData.billInfo;
                    this.billInsure = res.data.outData.billInsure;
                    this.billAssuredList = res.data.outData.billAssuredList;
                    this.productContentList = res.data.outData.productContentList;
                    this.stateCode = res.data.outData.billInfo.billState;
                    if(this.stateCode === 1){//待核保状态刷新
                        this.timer = setInterval(this.loadOrderState,3000);
                    }
                    switch(this.billInfo.billState){
                        case 1:
                            this.billStatus = '待核保';
                            break;
                        case 2:
                            this.billStatus = '待支付';
                            break;
                        case 3:
                            this.billStatus = '已支付';
                            break;
                        case 4:
                            this.billStatus = '已承保';
                            break;
                        case 5:
                            this.billStatus = '已退保';
                            break;
                        case 9:
                            this.billStatus = '已失效';
                            break;
                    }
                    switch(this.billInsure.insCredentialsType){
                        case '01':
                            this.creType = '身份证';
                            break;
                        case '02':
                            this.creType = '护照';
                            break;
                        case '99':
                            this.creType = '其他';
                            break;
                        case '1':
                            this.creType = '营业执照';
                            break;
                        case '2':
                            this.creType = '组织机构代码证';
                            break;
                    }
                    this.billAssuredList.map((data,i) => {
                        let typeName = '',statusName = '';
                        if(data.certificateType === '01'){
                            typeName = '身份证'
                        }
                        if(data.certificateType === '02'){
                            typeName = '护照'
                        }
                        if(data.certificateType === '99'){
                            typeName = '其他'
                        }
                        switch(data.insureState){
                            case 1:
                               statusName = '核保通过';
                               break;
                            case 2:
                               statusName = '核保失败';
                               break;
                            case 3:
                               statusName = '已承保';
                               break;
                        }
                        this.insureStatus.push(statusName);
                        this.increType.push(typeName);
                    })
                    if(res.data.outData.insBillPFile){
                        let insBillPFile = res.data.outData.insBillPFile;
                        this.billLink = insBillPFile.urlPath;
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
      },
      loadOrderState() {
          this.$ajax({
             method:'post',
             url:'/insurance/api/order/loadInsBillStateInfo/' + this.$route.params.id
           })
           .then((res)=>{
              if(res.data &&  res.data.code == 1){
                  let currentCode =  res.data.outData.billState;
                  if( this.stateCode != currentCode){
                      //如果状态发生变化
                      clearInterval(this.timer);
                      this.reload();
                  }
              }
           })
           .catch((error)=>{

           })
      }
  },
  mounted() {
      this.orderFun();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}
</script>

