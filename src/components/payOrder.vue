<template>
     <div class="insure-tb">
                <div class="insure-tbxx insureOrder">
                    <div class="tbxx-top clearfix">
                        <div class="tbxx-name">可批量支付订单</div>
                    </div>
                    <div class="tbxx-submit order-submit clearfix">
                        <div class="tbxx-model clearfix">
                           <span class="tbxx-label order-label" style="width:75px">创建时间：</span>
                            <div class="orderInput">
                                <el-date-picker
                                    v-model="createDate"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="起始日期"
                                    end-placeholder="终止日期" 
                                    style="width:280px"
                                    value-format="yyyy-MM-dd"
                                    unlink-panels>
                                </el-date-picker>
                            </div>
                        </div>

                        <div class="tbxx-model clearfix">
                            <span class="tbxx-label order-label" style="width:75px">出单账号：</span>
                            <div class="orderInput"><el-input v-model="cdNumber"></el-input></div>
                        </div>

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
                                        <el-checkbox v-model="checked[index]" @change="checked=>listOneCheck(checked,index)"></el-checkbox><span class="tdTip-mr">{{orderItem.createTime}}创建<span>投保单号：{{orderItem.billCode}}</span><span>保障期限：自{{orderItem.enabledate}}零时起 至 {{orderItem.disenabledate}}二十四时止(北京时间)</span></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{orderItem.proName}}-{{orderItem.comboName}}</td>
                                    <td>{{orderItem.assureInfo}}</td>
                                    <td>{{orderItem.premium}}</td>
                                    <td>{{orderItem.commission}}</td>
                                    <td>待支付</td>
                                    <td class="order-action">
                                        <a href="javascript:;" class="orderDetail" @click="orderDetail(orderItem.billId)">订单详情</a>
                                        <a href="javascript:;" class="orderPay" @click="orderPay(orderItem.billId)">支付</a>
                                        <a href="javascript:;" class="orderMore" @mouseenter="enterShow(index)" @mouseleave="leaveHide(index)">更多</a>
                                        <div class="orderMore-act" style="display: none;" :ref="'action'+index" @mouseenter="enterShow(index)" @mouseleave="leaveHide(index)">
                                            <a href="javascript:;" @click="orderUpdate(orderItem.billId)">修改</a>
                                            <a href="javascript:;" @click="orderDelete(orderItem.billId)">删除</a>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="orderPay-act clearfix">
                        <div class="orderPay-all"><el-checkbox v-model="allChecked" @change="listAllCheck"></el-checkbox><span class="tdTip-mr">全选</span></div>
                        <div class="orderPay-re">
                            <span class="orderPay-count">已选订单 : <span class="orderCount">{{orderCount}}</span>个</span>
                            合计：<span class="orderPay-money">￥{{orderMoney}}</span>
                            <span class="orderPay-btn" @click="allPay">批量支付</span>
                        </div>
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
</template>

<script>
export default {
  name: 'PayOrder',
  inject:['reload'],
  data () {
    return {
        totalCount:0,
        currentPage:1,
        size:10,
        allChecked:'',
        checked:[],
        createDate:[],
        dateIntro: '',
        cdNumber: '',
        curAccount:'1',
        orderRows:[],
        allTotal:'',
        myTotal:'',
        statistic:{},
        orderCount:0,
        orderMoney:0
    }
  },
  methods: {
      orderUpdate(id) {
          localStorage.setItem('orderId', id);
          this.$router.push('/insure');
      },
      allPay() {
          if(this.orderCount === 0){
              this.$message({
                message: '请选择需要批量支付的订单',
                duration: 1000,
                type: 'error'
                });
             return;  
          }
          let plArry = [];
          this.checked.map((data,i) => {
              let plIntro = '';
              if(data){
                plIntro = this.orderRows[i].billId;
                plArry.push(plIntro);
              }
          })
          let orderId = plArry.join(',');
          this.$router.push({
                name: 'pay',
                query:{
                    id:orderId
                }
          })
      },
      listAllCheck(val) {
          if(val){//全选
            this.orderRows.map((data,i) => {
                this.checked[i] = true;
                this.orderMoney += data.premium;
            })
            this.orderCount = this.orderRows.length;
          }else{
             this.orderRows.map((data,i) => {
                this.checked[i] = false;
            })
            this.orderMoney = 0;
            this.orderCount = 0;
          }
      },
      listOneCheck(checked,index) {
          if(!checked){//取消
            this.allChecked = false;
            this.orderCount--;
            this.orderMoney -= this.orderRows[index].premium;
          }else{
            this.orderCount++;
            this.orderMoney += this.orderRows[index].premium;
            if(this.orderCount == this.orderRows.length){
                this.allChecked = true;
            }
          }
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
          this.noPay(0);
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
          this.allChecked = '';
          this.checked.map((data,i) => {
              this.checked[i] = false;
          })
          this.orderCount = 0;
          this.orderMoney = 0;
          this.currentPage = 1;
          this.noPay(0);
      },
      noPay(index) {
         let loadingInstance = this.$loading();
         if(!this.createDate){
             this.createDate = [];
         }
          this.$ajax({
                method:'post',
                url:'/insurance/api/order/queryUserBillListByKeys',
                data:{
                    limit:10,
                    page:index,
                    qureyTimeType:1,
                    startTime:this.createDate[0],
                    endTime:this.createDate[1],
                    billState:2,
                    account:this.cdNumber,
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
          this.allChecked = '';
          this.checked.map((data,i) => {
              this.checked[i] = false;
          })
          this.orderCount = 0;
          this.orderMoney = 0;
          this.noPay(val-1)
      },
      handleCurrentChange(val) {
          this.allChecked = '';
          this.checked.map((data,i) => {
              this.checked[i] = false;
          })
          this.orderCount = 0;
          this.orderMoney = 0;
          this.noPay(val-1)
      }
  },
  mounted() {
      this.noPay(0);
  }
}
</script>

