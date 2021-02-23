<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="tbxx-submit clearfix">
                <div class="tbxx-model clearfix" style="width:100%">
                    <span class="tbxx-label order-label">选择开票类型：</span>
                    <div class="accountInput">
                        <el-radio v-model="billType" label="03">电子发票</el-radio>
                    </div>
                </div>

                <div class="tbxx-model clearfix">
                    <span class="tbxx-label order-label">支付时间：</span>
                    <div class="orderInput">
                        <el-date-picker
                            v-model="payDate"
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
                    <span class="tbxx-label order-label">投保单号：</span>
                    <div class="orderInput"><el-input v-model="danNumber"></el-input></div>
                </div>

                <div class="tbxx-model clearfix">
                    <span class="tbxx-label order-label">保险公司单号：</span>
                    <div class="orderInput"><el-input v-model="companyNumber"></el-input></div>
                </div>
                <div class="tbxx-model clearfix">
                    <span class="tbxx-label order-label">保险公司：</span>
                    <div class="orderSelect">
                        <el-select v-model="company">
                            <el-option
                            v-for="item in companys"
                            :key="item.id"
                            :label="item.insurerName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="bill-search">
                <el-button type="primary" @click="billSearch">查询</el-button>
            </div>
        </div>
        <div class="insure-tbxx bill-list">
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>发票抬头</td>
                            <td>投保人</td>
                            <td>保险公司</td>
                            <td>产品名称</td>
                            <td>投保单</td>
                            <td>订单金额(元)</td>
                            <td>可开票金额(元)</td>
                            <td width="10%">操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="billItem in billData" :key="billItem.billId">
                            <td>{{billItem.insName}}</td>
                            <td>{{billItem.insName}}</td>
                            <td>{{billItem.companyName}}</td>
                            <td>{{billItem.proName}}</td>
                            <td>{{billItem.billCode}}</td>
                            <td>{{billItem.premium}}</td>
                            <td>{{billItem.premium}}</td>
                            <td v-if="billItem.invoiceState === 0"><a href="javascript:;" class="account-act" @click="applyBill(billItem.billId)">申请开票</a></td>
                            <td v-if="billItem.invoiceState === 1"><span>已申请</span></td>
                            <td v-if="billItem.invoiceState === 2"><a href="javascript:;" class="account-act" @click="linkBill(billItem.invoiceId)">已开票</a></td>
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
  name: 'Bill',
  inject:['reload'],
  data () {
    return {
        billVisible:false,
        totalCount:0,
        currentPage:1,
        size:10,
        billType: '03',//开票类型
        payDate: [],//支付时间
        nameType: '1',
        nameTypes: [{
            value: '1',
            label: '投保人姓名'
        },{
            value: '2',
            label: '被保人姓名'
        }],
        name: '',//投保被保人姓名
        danNumber: '',//投保单号
        companyNumber: '',//保险公司单号
        company: '',//保险公司
        companys: [],
        billData:[],
        loadUrl:[],
        invoiceNo:''
    }
  },
  methods: {
      insureCompany() {
          let loadingInstance = this.$loading();
        this.$ajax({
            method:'get',
            url:'/insurance/api/common/findAllInsInsurer'
        })
        .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
               this.companys = res.data.outData.insurerList;
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
      billFun(index) {
          let loadingInstance = this.$loading();
          if(!this.payDate){
              this.payDate = [];
          }
          this.$ajax({
                method:'post',
                url:'/insurance/api/order/queryUserInvoicePages',
                data:{
                    limit:10,
                    page:index,
                    billCode:this.danNumber,
                    startTime:this.payDate[0],
                    endTime:this.payDate[1],
                    insurerId:this.company,
                    nameQueryType:this.nameType,
                    name:this.name,
                    policyNo:this.companyNumber
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.billData = res.data.outData.data;
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
          this.billFun(val-1)
      },
      handleCurrentChange(val) {
          this.billFun(val-1)
      },
      billSearch() {
          this.currentPage = 1;
          this.billFun(0);
      },
      applyBill(id) {
          this.$confirm('您确定要申请开票吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/order/applyInvoice/'+ id
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
      this.insureCompany();
      this.billFun(0);
  }
}
</script>