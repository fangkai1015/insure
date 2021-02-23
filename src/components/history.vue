<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="tbxx-submit clearfix">
                <div class="tbxx-model clearfix">
                    <span class="tbxx-label order-label">创建时间：</span>
                    <div class="orderInput">
                        <el-date-picker
                            v-model="createDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            value-format="yyyy-MM-dd"
                            unlink-panels>
                        </el-date-picker>
                    </div>
                </div>

                <div class="tbxx-model clearfix">
                    <span class="tbxx-label order-label">投保单号：</span>
                    <div class="orderInput"><el-input v-model="danNumber"></el-input></div>
                </div>
            </div>
            <div class="bill-search">
                <el-button type="primary" @click="historySearch">查询</el-button>
            </div>
        </div>
        <div class="insure-tbxx bill-list">
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>发票流水号</td>
                            <td>开票时间</td>
                            <td>发票抬头</td>
                            <td>开票金额(元)</td>
                            <td>发票类型</td>
                            <td>开票状态</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="historyItem in historyList" :key="historyItem.id">
                            <td>{{historyItem.invoiceNo}}</td>
                            <td>{{historyItem.createTime}}</td>
                            <td>{{historyItem.title}}</td>
                            <td>{{historyItem.amt}}</td>
                            <td v-if="historyItem.type === 1">电子发票</td>
                            <td v-if="historyItem.state === 2">已开票</td>
                            <td><a href="javascript:;" class="account-act" @click="linkBill(historyItem.id)">下载</a></td>
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
        <!-- 发票下载 -->
        <el-dialog
        title="发票下载"
        :visible.sync="billVisible"
        width="50%"
        top="30vh">
        <div class="lxr-btn">
            <div class="lxr-title">发票流水号：{{invoiceNo}}</div>
            <el-button v-for="(urlItem,index) in loadUrl"  :key="index"><a :href="urlItem.invoiceUrl" target="_blank">地址{{index+1}}</a></el-button>
        </div>       
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'History',
  data () {
    return {
        billVisible:false,
        totalCount:0,
        currentPage:1,
        size:10,
        createDate: [],//创建时间
        danNumber: '',//投保单号
        historyList:[],
        loadUrl:[],
        invoiceNo:''//发票流水号
    }
  },
  methods: {
      historyFun(index) {
          let loadingInstance = this.$loading();
          if(!this.createDate){
              this.createDate = [];
          }
          this.$ajax({
                method:'post',
                url:'/insurance/api/order/queryUserHistoryInvoicePages',
                data:{
                    limit:10,
                    page:index,
                    billCode:this.danNumber,
                    startTime:this.createDate[0],
                    endTime:this.createDate[1]
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.historyList = res.data.outData.data;
                   this.totalCount = res.data.outData.total;
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
          this.historyFun(val-1)
      },
      handleCurrentChange(val) {
          this.historyFun(val-1)
      },
      historySearch() {
          this.currentPage = 1;
          this.historyFun(0);
      },
      linkBill(id) {
          let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/order/findInsBillInvoiceByInvoiceId/'+ id
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.billVisible = true;
                    this.invoiceNo = res.data.outData.invoice.invoiceNo;
                    this.loadUrl = JSON.parse(res.data.outData.invoice.invoiceUrl);
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
      this.historyFun(0);
  }
}
</script>