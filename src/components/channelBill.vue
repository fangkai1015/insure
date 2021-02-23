<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top">部门账单</div>
                <div class="channel-sea channelBill-sea">
                    <div class="channelBill-year">
                        <span class="channel-label">年月份</span>
                        <el-date-picker
                            v-model="month"
                            type="month"
                             value-format="yyyy-MM"
                            placeholder="选择年月">
                        </el-date-picker>
                    </div>
                    <div class="channel-xiaji">
                        <span class="channel-label">下级部门</span>
                        <div class="channel-input"><el-input v-model="searchName" placeholder="请输入下级部门"></el-input></div>
                        <el-button type="primary" @click="billSearch">查询</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="channelBill-all">保费合计：{{allStatis.permium}}<span>结算收入合计：{{allStatis.totalCommission}}</span><span>我的剩余收入：{{allStatis.myCommission}}</span><span>部门收入 ：{{allStatis.devCommission}}</span></div>
            <el-button class="daochu" plain><a :href="downloadUrl">导出</a></el-button>
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>年月</td>
                            <td>下级</td>
                            <td>生效保费</td>
                            <td>结算收入</td>
                            <td>我的剩余收入</td>
                            <td>部门收入</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="billItem in billRow" :key="billItem.id">
                            <td>{{billItem.month}}</td>
                            <td>{{billItem.name}}</td>
                            <td>{{billItem.effectiveAmount}}</td>
                            <td>{{billItem.allCommission}}</td>
                            <td>{{billItem.subCommission}}</td>
                            <td>{{billItem.totalCommission}}</td>
                            <td class="channel-action">
                                <a href="javascript:;" v-if="billItem.settleState === 1" @click="jiesuan(billItem.id,billItem.month)">结算</a>
                                <span v-else>已结算</span>
                            </td>
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
</template>

<script>
export default {
  name: 'ChannelBill',
  inject:['reload'],
  data () {
    return {
        totalCount:0,
        currentPage:1,
        size:10,
        month: '',
        searchName: '',
        billRow:[],
        allStatis:{},
        downloadUrl:''
    }
  },
  methods:{
      billSearch() {
          this.currentPage = 1;
          this.billFun(0);
      },
      billFun(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/order/depSettleBillList',
                data:{
                    limit:10,
                    page:index,
                    month:this.month,
                    name:this.searchName
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.billRow = res.data.outData.rows;
                    this.allStatis = res.data.outData.statistics;
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
      jiesuan(id,month) {
          this.$confirm('您确定要结算'+month.split('-')[0]+'年'+month.split('-')[1]+'月部门账单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/order/devUserSettleBillSettle/'+ id
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
      }
  },
  mounted() {
      this.billFun(0);
      if(window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1){
            this.downloadUrl = 'http://127.0.0.1:9900/insurance/api/order/depSettleBillListExport?month=' + this.month + '&name=' + this.searchName;
        }else{
            this.downloadUrl = '/insurance/api/order/depSettleBillListExport?month=' + this.month + '&name=' + this.searchName;
        }
  }
}
</script>

