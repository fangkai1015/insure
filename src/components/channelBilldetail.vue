<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top">账单明细</div>
                <div class="channel-sea channelBill-sea">
                    <div class="channelBill-year">
                        <el-select v-model="timeType">
                            <el-option
                            v-for="item in timeTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
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
                    
                    <div class="channel-xiaji">
                        <span class="channel-label">下级部门</span>
                        <div class="channel-input"><el-input v-model="searchName" placeholder="请输入下级部门"></el-input></div>
                    </div>

                    <div class="channel-billDe">
                        <span class="channel-label">投保单号</span>
                        <div class="channel-input"><el-input v-model="tbNumber" placeholder="请输入投保单号"></el-input></div>
                    </div>

                    <div class="channel-billDe">
                        <span class="channel-label">产品名称</span>
                        <div class="channel-input"><el-input v-model="goodsName" placeholder="请输入产品名称"></el-input></div>
                    </div>
                    <el-button type="primary" @click="billdeSearch">查询</el-button>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="channelBill-all">已支付： {{allStatis.totalPermium}}<span>已退保：{{allStatis.quitPremium}}</span><span>我的收入合计：{{allStatis.myCommission}}</span><span>部门收入合计：{{allStatis.devCommission}}</span></div>
            <el-button class="daochu" plain><a :href="downloadUrl">导出</a></el-button>
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>投保单号</td>
                            <td>产品名称</td>
                            <td>下级部门</td>
                            <td>实付</td>
                            <td>剩余返点</td>
                            <td>部门返点</td>
                            <td>支付状态</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="billdeItem in billData" :key="billdeItem.billId">
                            <td>{{billdeItem.billCode}}</td>
                            <td>{{billdeItem.proName}}</td>
                            <td>{{billdeItem.userName}}</td>
                            <td>{{billdeItem.premium}}</td>
                            <td>{{billdeItem.subRate - billdeItem.rate}}%</td>
                            <td>{{billdeItem.rate}}%</td>
                            <td>已支付</td>
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
  name: 'ChannelBilldetail',
  data () {
    return {
        totalCount:0,
        currentPage:1,
        size:10,
        timeType: '1',
        timeTypes: [
            {
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
            }
        ],
        tbDate: [],
        searchName: '',
        tbNumber: '',
        goodsName: '',
        billData:[],
        allStatis:{},
        downloadUrl:''
    }
  },
  methods: {
      billDetail(index) {
          let loadingInstance = this.$loading();
          if(!this.tbDate){
              this.tbDate = [];
          }
          this.$ajax({
                method:'post',
                url:'/insurance/api/order/depOrderInfoList',
                data:{
                    limit:10,
                    page:index,
                    billCode:this.tbNumber,
                    depName:this.searchName,
                    proName:this.goodsName,
                    startTime:this.tbDate[0],
                    endTime:this.tbDate[1],
                    timeQuery:this.timeType
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.billData = res.data.outData.data;
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
          this.billDetail(val-1)
      },
      handleCurrentChange(val) {
          this.billDetail(val-1)
      },
      billdeSearch() {
          this.currentPage = 1;
          this.billDetail(0);
      }
  },
  mounted() {
      this.billDetail(0);
      if(!this.tbDate){
            this.tbDate = [];
        }
      if(window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1){
            this.downloadUrl = 'http://127.0.0.1:9900/insurance/api/order/depOrderInfoListExport?billCode=' + this.tbNumber + '&depName=' + this.searchName + '&proName=' + this.goodsName + '&startTime=' + this.tbDate[0] + '&endTime=' + this.tbDate[1] + '&timeQuery=' + this.timeType;
        }else{
            this.downloadUrl = '/insurance/api/order/depOrderInfoListExport?billCode=' + this.tbNumber + '&depName=' + this.searchName + '&proName=' + this.goodsName + '&startTime=' + this.tbDate[0] + '&endTime=' + this.tbDate[1] + '&timeQuery=' + this.timeType;
        }
  }
}
</script>

