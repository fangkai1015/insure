<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="insureNav">
                    <div class="insureNav-title orderCus">订单管理</div>
                    <div class="insureNav-list">
                        <ul>
                            <li><a href="javascript:;" :class="{'current':cur == 2}" @click="orderTab(2)">待支付</a></li>
                            <li><a href="javascript:;" :class="{'current':cur == 3}" @click="orderTab(3)">已支付</a></li>
                            <li><a href="javascript:;" :class="{'current':cur == 4}" @click="orderTab(4)">已承保</a></li>
                            <li><a href="javascript:;" :class="{'current':cur == 5}" @click="orderTab(5)">已退保</a></li>
                            <li><a href="javascript:;" :class="{'current':cur == 9}" @click="orderTab(9)">已失效</a></li>
                        </ul>
                    </div>
                </div>

                <div class="insureNav">
                    <div class="insureNav-title customSer">客户服务</div>
                    <div class="insureNav-list">
                        <ul>
                            <li><a href="javascript:;" :class="{'current':cur == 1}" @click="buyFun(1)">常购产品</a></li>
                            <li><router-link :to="{name:'invoice'}" target="_blank">发票管理</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="insure-tb">
                <!-- 订单管理 -->
                <div class="userBox" v-show="orderShow">
                    <div class="yj-table">
                        <table>
                            <thead>
                                <tr>
                                    <td>基本信息</td>
                                    <td>投保人</td>
                                    <td>保障期限</td>
                                    <td>份数</td>
                                    <td>保费金额</td>
                                    <td>操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="orderItem in orderRows" :key="orderItem.billId">
                                    <td>{{orderItem.proName}}-{{orderItem.comboName}}</td>
                                    <td>{{orderItem.insName}}</td>
                                    <td>{{orderItem.enabledate}}零时起 至 {{orderItem.disenabledate}}二十四时止</td>
                                    <td>{{orderItem.num}}</td>
                                    <td>{{orderItem.premium}}</td>
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
                </div>
                <!-- 常购产品 -->
                <div class="userBox" v-show="afterBuy">
                    <div class="tbxx-top clearfix">
                        <span class="orderMenu">
                            <a href="javascript:;" :class="{'current':buyNum == 1}" @click="productFun(1)">购买最多产品</a>
                            <a href="javascript:;" :class="{'current':buyNum == 2}" @click="productFun(2)">最近购买产品</a>
                        </span>
                    </div>

                    <div class="yj-table">
                        <table>
                            <thead>
                                <tr>
                                    <td>基本信息</td>
                                    <td>一级分类</td>
                                    <td>二级分类</td>
                                    <td>保险公司</td>
                                    <td>份数</td>
                                    <td>投保单价</td>
                                    <td>操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(buyItem,index) in buyMore" :key="index">
                                    <td>{{buyItem.pro_name}}-{{buyItem.combo_name}}</td>
                                    <td>{{buyItem.level1_name}}</td>
                                    <td>{{buyItem.level2_name}}</td>
                                    <td>{{buyItem.insurer_name}}</td>
                                    <td>{{buyItem.buy_num}}</td>
                                    <td>{{buyItem.view_price}}</td>
                                    <td><a href="javascript:;" class="orderCus-btn" @click="insureEnter(buyItem.pro_id,buyItem.combo_id)">投保</a></td>
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
        </div>
        <Footer></Footer>
    </section>
</template>

<script>
import Footer from '../components/footer'
import Header from '../components/header'
export default {
  name: 'User',
  components:{
        Footer,
        Header
   },
  data () {
    return {
        buyNum:1,
        totalCount:0,
        currentPage:1,
        size:10,
        cur:2,
        orderRows:[],
        allTotal:0,
        afterBuy:false,
        orderShow:true,
        buyMore:[]
    }
  },
  methods: {
      insureEnter(proId,comboId) {
          let pruId = {
              proId:proId,
              comboId:comboId
          }
          localStorage.setItem('pruId', JSON.stringify(pruId));
          this.$router.push('/insure');
      },
      productFun(index) {
          this.buyNum = index;
          this.buyIntro(0);
      },
      buyIntro(index) {
          let loadingInstance = this.$loading();
          let buyUrl = '';
          if(this.buyNum === 1){ //常购
            buyUrl = '/insurance/api/product/queryRegularlyBuyProduct';
          }else{//最近购买
            buyUrl = '/insurance/api/product/queryLatelyBuyProduct';
          }
          this.$ajax({
                method:'post',
                url:buyUrl,
                data:{
                    limit:10,
                    page:index           
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.buyMore = res.data.outData.rows;
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
      buyFun(index) {
          this.cur = index;
          this.orderShow = false;
          this.afterBuy = true;
          this. buyIntro(0);
      },
      orderTab(index) {
          this.cur = index;
          this.currentPage = 1;
          this.orderShow = true;
          this.afterBuy = false;
          this.orderFun(0);
      },
      orderUpdate(id) {
          localStorage.setItem('orderId', id);
          //标志plus用户
          localStorage.setItem('plusType', 1);
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
      orderFun(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/order/queryUserBillListByKeys',
                data:{
                    limit:10,
                    page:index,                   
                    billState:this.cur,   
                    queryType:1               
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.totalCount = res.data.outData.allTotal;
                    this.orderRows = res.data.outData.rows;
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
  }
}
</script>

