<template>
     <div class="insure-tb">
                <div class="insure-tbxx insureOrder">
                    <div class="tbxx-top clearfix">
                        <div class="tbxx-name">个人订单</div>
                    </div>
                    <div class="tbxx-submit order-submit clearfix">
                        <div class="tbxx-model clearfix">
                            
                            <el-select v-model="dateType">
                                <el-option
                                v-for="item in dateTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="orderInput">
                                <el-date-picker
                                    v-model="tbDate"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="起始日期"
                                    end-placeholder="终止日期" 
                                    value-format="yyyy-MM-dd"
                                    unlink-panels>
                                </el-date-picker>
                            </div>
                        </div>

                        <div class="tbxx-model clearfix">
                            <el-select v-model="nameType">
                                <el-option
                                v-for="item in nameTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="orderInput"><el-input v-model="name"></el-input></div>
                        </div>

                        <div class="tbxx-model clearfix">
                            <el-select v-model="bdType">
                                <el-option
                                v-for="item in bdTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="orderInput"><el-input v-model="bdNumber"></el-input></div>
                        </div>

                        <div class="tbxx-model clearfix">
                            <span class="tbxx-label order-label">订单状态：</span>
                            <div class="orderSelect">
                                <el-select v-model="orderSta">
                                    <el-option
                                    v-for="item in orderStas"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <div class="tbxx-model clearfix">
                            <span class="tbxx-label order-label">出单账号：</span>
                            <div class="orderInput"><el-input v-model="cdUser"></el-input></div>
                        </div>

                        <!-- <div class="tbxx-model clearfix">
                            <span class="tbxx-label order-label">订单来源：</span>
                            <div class="orderSelect">
                                <el-select v-model="lyType">
                                    <el-option
                                    v-for="item in lyTypes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div> -->
                        <div class="orderBtn" @click="orderSearch">查询</div>
                    </div>
                </div>

                <div class="insure-tbxx">
                    <div class="tbxx-top clearfix">
                        <span class="orderMenu">
                            <a href="javascript:;" :class="{'current':curAccount === '1'}" @click="orderAct('1')">所有订单({{allTotal}})</a>
                            <a href="javascript:;" :class="{'current':curAccount === '2'}" @click="orderAct('2')">我的订单({{myTotal}})</a>
                        </span>
                        <span class="yj-sum">说明退保单将生成一正一负两种记录</span>
                        <div class="tbxx-action">
                            <span><a :href="downloadUrl">导出</a></span>
                        </div>
                    </div>

                    <div class="yj-table">
                        <table>
                            <thead>
                                <tr>
                                    <td width="35%">产品</td>
                                    <td width="10%">被保人</td>
                                    <td width="10%">实付价格</td>
                                    <td width="10%">收入</td>
                                    <td width="10%">全部状态</td>
                                    <td>操作</td>
                                </tr>
                            </thead>
                            <tbody  v-for="(orderItem,index) in orderRows" :key="orderItem.billId">
                                <tr>
                                    <td colspan="6" class="order-tdTip">
                                        {{orderItem.createTime}}创建<span>投保单号：{{orderItem.billCode}}</span><span>保障期限：自{{orderItem.enabledate}}零时起 至 {{orderItem.disenabledate}}二十四时止(北京时间)</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{orderItem.proName}}-{{orderItem.comboName}}</td>
                                    <td>{{orderItem.assureInfo}}</td>
                                    <td>{{orderItem.premium}}</td>
                                    <td>{{orderItem.commission}}</td>
                                    <td>{{orderStatus[index]}}</td>
                                    <td class="order-action">
                                        <template v-if="orderItem.billState === 2">
                                            <a href="javascript:;" class="orderDetail" @click="orderDetail(orderItem.billId)">订单详情</a>
                                            <a href="javascript:;" class="orderPay" @click="orderPay(orderItem.billId)">支付</a>
                                            <a href="javascript:;" class="orderMore" @mouseenter="enterShow(index)" @mouseleave="leaveHide(index)">更多</a>
                                            <div class="orderMore-act" style="display: none;" :ref="'action'+index" @mouseenter="enterShow(index)" @mouseleave="leaveHide(index)">
                                                <a href="javascript:;" @click="orderUpdate(orderItem.billId)">修改</a>
                                                <a href="javascript:;" @click="orderDelete(orderItem.billId)">删除</a>
                                            </div>
                                        </template>
                                        <template v-if="orderItem.billState === 9">
                                            <a href="javascript:;" class="orderDetail" @click="orderDetail(orderItem.billId)">订单详情</a>
                                            <a href="javascript:;" class="orderDetele" @click="orderDelete(orderItem.billId)">删除</a>
                                        </template>
                                        <template v-if="orderItem.billState !== 2 && orderItem.billState !== 9">
                                            <a href="javascript:;" class="orderDetail" @click="orderDetail(orderItem.billId)">订单详情</a>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="orderClo"><span>已支付保费（含已退保）：{{statistic.paidAmount}}</span><span>未支付保费：{{statistic.unPaidAmount}}</span><span>已退保保费：{{statistic.quitAmount}}</span>服务费：{{statistic.totalCommission}}</div>
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
</template>

<script>
export default {
  name: 'AllOrder',
  inject:['reload'],
  data () {
    return {
        totalCount:0,
        currentPage:1,
        size:10,
        dateType:'1',
        dateTypes: [{
            value: '1',
            label: '创建时间'
        },
        {
            value: '2',
            label: '支付时间'
        },
        {
            value: '3',
            label: '生效时间'
        },
        {
            value: '4',
            label: '到期时间'
        }
        ],
        date:'',//时间
        tbDate:[],//日期
        nameType: '1',//被保人、投保人搜索
        nameTypes: [{
            value: '1',
            label: '被保人姓名'
        },
        {
            value: '2',
            label: '被保人证件号'
        },
        {
            value: '3',
            label: '投保人姓名'
        },
        {
            value: '4',
            label: '投保人证件号'
        }],
        name: '',//投保人被保人
        bdType: '1',
        bdTypes: [{
            value: '1',
            label: '投保单号'
        },
        {
            value: '2',
            label: '保单号'
        }],
        bdNumber: '',//投保单号
        orderSta: '',//订单状态
        orderStas: [{
            value: '',
            label: '全部状态'
        },
        {
            value: '2',
            label: '待支付'
        },
        {
            value: '3',
            label: '已支付'
        },
        {
            value: '4',
            label: '已承保'
        },
        {
            value: '5',
            label: '已退保'
        },
        {
            value: '9',
            label: '已失效'
        }
        ],
        cdUser: '',//出单账号
        lyType: '01',//订单来源
        lyTypes: [{
            value: '01',
            label: '全部'
        },
        {
            value: '02',
            label: '投保订单'
        },
        {
            value: '03',
            label: '门店订单'
        },
        {
            value: '04',
            label: 'API订单'
        }],
        curAccount:'1',
        orderRows:[],
        allTotal:'',
        myTotal:'',
        statistic:{},
        orderStatus:[],
        downloadUrl:''
    }
  },
  methods: {
      orderUpdate(id) {
          localStorage.setItem('orderId', id);
          this.$router.push('/insure');
      },
      orderDelete(id) {
          this.$confirm('您确定要删除订单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/order/delBill/'+ id
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
          }).catch(() => {
          });
      },
      enterShow(index) {
          this.$refs['action'+index][0].style.display = 'block';
      },
      leaveHide(index) {
          this.$refs['action'+index][0].style.display = 'none';
      },
      orderAct(index) {
          this.curAccount = index;
          this.currentPage = 1;
          this.orderFun(0);
      },
      orderPay(id) {
          let routeData = this.$router.resolve({
                name: 'pay',
                query:{
                    id:id
                }
            })
        window.open(routeData.href, '_blank');
      },
      orderDetail(id) {
          let routeData = this.$router.resolve({
                name: 'orderDetail',
                params:{
                    id:id
                }
            })
        window.open(routeData.href, '_blank');
      },
      orderSearch() {
          this.currentPage = 1;
          this.orderFun(0);
      },
      orderFun(index) {
          let loadingInstance = this.$loading();
          if(!this.tbDate){
              this.tbDate = [];
          }
          this.$ajax({
                method:'post',
                url:'/insurance/api/order/queryUserBillListByKeys',
                data:{
                    limit:10,
                    page:index,
                    qureyTimeType:this.dateType,
                    startTime:this.tbDate[0],
                    endTime:this.tbDate[1],
                    infoQueryType:this.nameType,
                    info:this.name,
                    policyQueryType:this.bdType,
                    policy:this.bdNumber,
                    billState:this.orderSta,
                    account:this.cdUser,
                    queryType:this.curAccount
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.allTotal = res.data.outData.allTotal;
                    this.myTotal = res.data.outData.myTotal;
                    this.statistic = res.data.outData.statistic;
                    this.orderRows = res.data.outData.rows;
                    if(this.curAccount === '1'){
                        this.totalCount = res.data.outData.allTotal;
                    }else{
                        this.totalCount = res.data.outData.myTotal;
                    }
                    this.orderStatus = [];
                    this.orderRows.map((data,i) => {
                        let orderInfo = '';
                        switch(data.billState) {
                            case 1:
                               orderInfo = '待核保';
                               break;
                            case 2:
                               orderInfo = '待支付';
                               break;
                            case 3:
                               orderInfo = '已支付';
                               break;
                            case 4:
                               orderInfo = '已承保';
                               break;
                            case 5:
                               orderInfo = '已退保';
                               break;
                            case 9:
                               orderInfo = '已失效';
                               break;
                        }
                        this.orderStatus.push(orderInfo);
                    })
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
      handleSizeChange(val) {
          this.orderFun(val-1)
      },
      handleCurrentChange(val) {
          this.orderFun(val-1)
      }
  },
  mounted() {
      this.orderFun(0);
      if(!this.tbDate){
            this.tbDate = [];
       }
      if(window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1){
            this.downloadUrl = 'http://127.0.0.1:9900/insurance/api/order/queryUserBillListByKeysExport?qureyTimeType=' + this.dateType + '&startTime=' + this.tbDate[0] + '&endTime=' + this.tbDate[1] + '&infoQueryType=' + this.nameType + '&info=' + this.name + '&policyQueryType=' + this.bdType + '&policy=' + this.bdNumber + '&billState=' + this.orderSta + '&account=' + this.cdUser + '&queryType=' + this.curAccount;
        }else{
            this.downloadUrl = '/insurance/api/order/queryUserBillListByKeysExport?qureyTimeType=' + this.dateType + '&startTime=' + this.tbDate[0] + '&endTime=' + this.tbDate[1] + '&infoQueryType=' + this.nameType + '&info=' + this.name + '&policyQueryType=' + this.bdType + '&policy=' + this.bdNumber + '&billState=' + this.orderSta + '&account=' + this.cdUser + '&queryType=' + this.curAccount;
        }
  }
}
</script>
<style>
   
</style>

