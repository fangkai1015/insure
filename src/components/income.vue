<template>
  <div class="insure-tb">
    <div class="finance-main">
      <div class="insure-tbxx insureOrder" v-if="channel">
        <div class="finance-top clearfix">
          <div class="sr-icon"></div>
          <div class="sr-middle">
            <div class="ruzhang-con" @click="incomeWeebox">
              <span class="ruzhang-name">{{incomeName}}</span>
              <i class="xiala-icon"></i>
            </div>
            <div class="ruzhuang-money">{{showMoney}}</div>
            <div class="ruzhuang-type" v-show="incomeType">
              <ul>
                <li v-for="(item, index) in incomeTxt" :key="index" :class="{'on':inCur == index}"
                    @click="incomeClick(index)">{{item}}
                </li>
              </ul>
            </div>
          </div>
          <div class="sr-jie">
            <div class="jie-btn" v-if="incomeMoney >= 100" @click="jieAction">结算</div>
            <div class="jie-btn jie-no" v-else>结算</div>
            <div class="jie-tips"><span>满100元可结算</span> <span class="invoice-config" @click="invoiceConfig('查看开票信息')"> 查看开票信息</span></div>

          </div>
        </div>
        <div class="jie-rules">
          <div class="jie-title">结算规则：</div>
          1、可申请推广费的最低金额为100元（含），如果累计未结算的可申请金额没有达到100元，您将无法提交结算申请。<br>
          2、保单生效后推广费生效， 保单生效日即为推广费生效日，次月初为您生成上月账单，每月只能结算一次。<br>
          3、提交结算申请后，会统一在每月10号和25号进行推广费支付（节假日顺延）。<br>
          4、因银行转账时间的差异，若结算申请状态显示“已结算”，说明已向银行安排付款，银行正在处理，一般1-3个工作日内到账，请耐心等待。如果还未收到，请联系您的客户经理，协助处理。<br>
          5、个人账户结算<br>
          <div class="jie-small">a、若您是个人账户，初次申请推广费结算，需先完善收款信息及税务信息，并完成实名认证；</div>
          <div class="jie-small">b、个人账户目前为第三方支付方式，结算金额超过800元部分扣除5%后剩下的部分为实际完税推广服务费，支付到签约客户本人银行账户。</div>
          6、企业账户结算：<br>
          <div class="jie-small">a、企业账户请根据申请的发票条目，分别开发票。并将发票号填入至对应的发票详情中，以配合我司付款工作。</div>
          <div class="jie-small">b、请确保发票抬头、发票项目及金额准确无误。否则我司将不予付款。<span class="invoice-config" @click="invoiceConfig('查看开票信息')"> 查看开票信息</span></div>
          <div class="jie-small">c、企业付款流程为：申请结算-开具发票-寄送发票。我司将在收到发票以后进行结算，如已过当月结算期，将自动顺延至下月结算。</div>
        </div>
      </div>
      <div class="insure-tbxx" :class="{'insureOrder':!channel}">
        <div class="tbxx-top clearfix">
                    <span class="orderMenu">
                        <a href="javascript:;" @click="tabFun(0)" :class="{'current':tabNo == 0}">收益明细</a>
                        <a href="javascript:;" @click="tabFun(1)" :class="{'current':tabNo == 1}"
                           v-if="channel">结算记录</a>
                    </span>
          <span class="yj-sum">服务费我们每月初自动生成一次，包含分销账号，子账号的投保服务费部分</span>
          <div class="tbxx-year" v-show="yearSel">
            <el-select v-model="year" @change="yearChange">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 收益明细 -->
        <div class="symx" v-show="tabNo == 0">
          <div class="yj-table">
            <table>
              <thead>
              <tr>
                <td>周期(按月结算)</td>
                <td class="symx-td">
                  可结算保费<span class="info-icon" @mouseenter="showTips1 = true" @mouseleave="showTips1 = false"></span>
                  <div class="info-con" v-show="showTips1">
                    即已生效保单（若有犹豫期，则犹豫期后视为生效）对应的保费。
                  </div>
                </td>
                <td class="symx-td">
                  生效服务费<span class="info-icon" @mouseenter="showTips2 = true" @mouseleave="showTips2 = false"></span>
                  <div class="info-con" v-show="showTips2">
                    即可结算保费对应的服务费。
                  </div>
                </td>
                <td>结算状态</td>
                <td>操作</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(billItem,index) in billList" :key="billItem.id">
                <td>{{billItem.month}}</td>
                <td>{{billItem.effectiveAmount}}</td>
                <td>{{billItem.totalCommission}}</td>
                <td>{{billStatus[index]}}</td>
                <td><a :href="upload1+'/'+billItem.id" class="orderCus-btn">清单下载</a></td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="finance-total">总保费：{{totalPermiun}}元<span class="m-all">总收入：{{totalCommission}}元</span></div>
        </div>
        <!-- 结算记录 -->
        <div class="js-record" v-show="tabNo == 1">
          <div class="yj-table">
            <table>
              <thead>
              <tr>
                <td>序号</td>
                <td>申请日期</td>
                <td>结算状态</td>
                <td>申请金额</td>
                <td>代扣税款</td>
                <td>结算金额</td>
                <td>操作</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(applyItem,index) in applyList" :key="applyItem.applyId">
                <td>{{index+1}}</td>
                <td>{{applyItem.createTimeStr}}</td>
                <td>{{settleStatus[index]}}</td>
                <td>{{applyItem.totalAmount}}</td>
                <td>{{applyItem.deductionAmount}}</td>
                <td>{{applyItem.realAmount}}</td>
                <td><a :href="upload2+'/'+applyItem.applyId" class="orderCus-btn">清单下载</a></td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="finance-total">已结算：{{totalSettleAmount}}元</div>
        </div>
      </div>
    </div>

    <!--查看开票信息-->
    <el-dialog :title="weeboxName" :visible.sync="weeboxVisible" width="40%" top="20vh" center>
      <div class="weebox-content" v-html="weeboxContent"></div>
    </el-dialog>
  </div>


</template>

<script>
  export default {
    name: 'Income',
    inject: ['reload'],
    data() {
      return {
        channel: false,
        showTips1: false,
        showTips2: false,
        incomeType: false,
        incomeName: '未结算收入',
        showMoney: '',
        incomeMoney: '',
        settleMoney: '',
        incomeTxt: ['未结算收入', '待结算收入'],
        inCur: 0,
        tabNo: 0,
        yearSel: true,
        year: new Date().getFullYear(),
        years: [{
          value: new Date().getFullYear(),
          label: new Date().getFullYear() + '年'
        },
          {
            value: new Date().getFullYear() - 1,
            label: new Date().getFullYear() - 1 + '年'
          }],
        billList: [],
        totalCommission: '',
        totalPermiun: '',
        billStatus: [],
        applyList: [],
        totalSettleAmount: '',
        settleStatus: [],
        upload1: '',
        upload2: '',
        weeboxName: '',
        weeboxContent: '',
        weeboxVisible: false
      }
    },
    methods: {
      jieAction() {
        this.$confirm('是否继续结算操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          let loadingInstance = this.$loading();
          this.$ajax({
            method: 'post',
            url: '/insurance/api/fn/settleApply'
          })
            .then((res) => {
              loadingInstance.close();
              if (res.data.code === 1) {
                this.reload();
              } else {
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
      },
      incomeClick(index) {
        this.inCur = index;
        this.incomeName = this.incomeTxt[index];
        if (index == 0) {
          this.showMoney = this.incomeMoney;
        } else {
          this.showMoney = this.settleMoney;
        }
      },
      incomeWeebox() {
        this.incomeType = true;
      },
      tabFun(index) {
        this.tabNo = index;
        if (index == 0) {
          this.yearSel = true;
        } else {
          this.yearSel = false;
        }
      },
      infoFun() {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/fn/unSettleInfo'
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              this.showMoney = res.data.outData.unApply || '0';
              this.incomeMoney = res.data.outData.unApply || '0';
              this.settleMoney = res.data.outData.unSettle || '0';
            } else {
              this.$message({
                message: res.data.message,
                duration: 1000,
                type: 'error'
              });
              return;
            }
          })
      },
      billFun() {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/fn/userSettleBillList',
          params: {
            year: this.year
          }
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              this.billList = res.data.outData.userSettleBillList;
              this.totalPermiun = res.data.outData.totalPermiun;
              this.totalCommission = res.data.outData.totalCommission;
              this.billStatus = [];
              this.billList.map((data, i) => {
                let billInfo = '';
                switch (data.settleState) {
                  case 0:
                    billInfo = '未结算';
                    break;
                  case 1:
                    billInfo = '待结算';
                    break;
                  case 2:
                    billInfo = '已结算';
                    break;
                }
                this.billStatus.push(billInfo);
              })
            } else {
              this.$message({
                message: res.data.message,
                duration: 1000,
                type: 'error'
              });
              return;
            }
          })
      },
      yearChange(val) {
        this.year = val;
        this.billFun();
      },
      settleFun() {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/fn/userSettleApplyList'
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              this.applyList = res.data.outData.userSettleApplyList;
              this.totalSettleAmount = res.data.outData.totalSettleAmount;
              this.settleStatus = [];
              this.applyList.map((data, i) => {
                let billInfo = '';
                switch (data.settleState) {
                  case 1:
                    billInfo = '待结算';
                    break;
                  case 2:
                    billInfo = '已结算';
                    break;
                }
                this.settleStatus.push(billInfo);
              })
            } else {
              this.$message({
                message: res.data.message,
                duration: 1000,
                type: 'error'
              });
              return;
            }
          })
      },

      invoiceConfig(content) {
        this.$ajax({
          method: 'get',
          url: '/insurance/api/common/findFixedInfoByType?type=invoiceConfig'
        })
          .then((res) => {
            if (res.data.code === 1) {
              console.log("content = " + content);
              this.weeboxName = content;
              this.weeboxContent = res.data.outData.fixedInfo;

              this.weeboxVisible = true;
            } else {
              this.$message({
                message: res.data.message,
                duration: 1500,
                type: 'error'
              });
              return;
            }
          })
      },
    },
    mounted() {
      this.infoFun();
      this.billFun();
      this.settleFun();
      let that = this;
      document.addEventListener('click', function (e) {
        if (e.target.className !== 'ruzhang-name' && e.target.className !== 'xiala-icon' && e.target.className !== 'ruzhang-con') {
          that.incomeType = false;
        }
      })
      if (window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1) {
        this.upload1 = 'http://127.0.0.1:9900/insurance/api/fn/userSettleBillListExport';
        this.upload2 = 'http://127.0.0.1:9900/insurance/api/fn/userSettleApplyListExport';
      } else {
        this.upload1 = '/insurance/api/fn/userSettleBillListExport';
        this.upload2 = '/insurance/api/fn/userSettleApplyListExport';
      }
      let userIntro = JSON.parse(localStorage.getItem('user'));
      if (userIntro.userType !== 5) {//不是部门账户
        this.channel = true;
      }
    }
  }
</script>

