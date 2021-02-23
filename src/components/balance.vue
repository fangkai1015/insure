<template>
    <div class="insure-tb">
        <div class="finance-main balance-main">
            <div class="insure-tbxx banlanceYe">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">余额管理</div>
                    <div class="tbxx-action">
                        <span><a :href="bandownload">导出</a></span>
                    </div>
                </div>
                <div class="tbxx-submit balance-submit clearfix">
                    <div class="tbxx-model clearfix">
                        <span class="tbxx-label order-label">消费类型：</span>
                        <div class="balance-xuan">
                            <el-select v-model="balanceType">
                                <el-option
                                v-for="item in balanceTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="tbxx-model clearfix">
                        <span class="tbxx-label order-label">操作时间：</span>
                        <div class="balance-xuan">
                            <el-date-picker
                                v-model="czDate"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="起始日期"
                                end-placeholder="终止日期" 
                                value-format="yyyy-MM-dd"
                                unlink-panels>
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="finance-cx" @click="banlanSearch">查询</div>
                    <div class="finance-reset" @click="resetSearch">重置</div>
                </div>
                <div class="balance-item">
                    <div class="yj-table">
                        <table>
                            <thead>
                                <tr>
                                    <td>序号</td>
                                    <td>发生金额</td>
                                    <td>类型</td>
                                    <td>余额</td>
                                    <td>描述</td>
                                    <td>操作时间</td>
                                    <td>操作人</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(banlanceItem,index) in banlanceRow" :key="banlanceItem.id">
                                    <td>{{index+1}}</td>
                                    <td>{{banlanceItem.changeAmount}}</td>
                                    <td>{{opeType[index]}}</td>
                                    <td>{{banlanceItem.balance}}</td>
                                    <td>{{banlanceItem.remark}}</td>
                                    <td>{{banlanceItem.updateTime}}</td>
                                    <td>{{banlanceItem.optUser}}</td>
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
    </div>
</template>

<script>
export default {
  name: 'Balance',
  data () {
    return {
        totalCount:0,
        currentPage:1,
        size:10,
        balanceType: '',
        balanceTypes: [{
            value: '',
            label: '全部'
        },
        {
            value: '1',
            label: '充值'
        },
        {
            value: '2',
            label: '投保消费'
        },
        {
            value: '3',
            label: '退保退费'
        },
        {
            value: '4',
            label: '活动奖励'
        },
          {
            value: '5',
            label: '后台充值'
          },
          {
            value: '6',
            label: '后台扣款'
          }
        ],
        czDate: [],
        banlanceRow:[],
        opeType:[],
        bandownload:''
    }
  },
  methods: {
      banlanceFun(index) {
          let loadingInstance = this.$loading();
        if(!this.czDate){//初始化日期
            this.czDate = [];
        }
        this.$ajax({
            method:'post',
            url:'/insurance/api/fn/accountChangeList',
            data:{
                limit:10,
                page:index,
                startTime:this.czDate[0],
                endTime:this.czDate[1],
                optType:this.balanceType
            }
        })
        .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
                this.banlanceRow = res.data.outData.rows;
                this.totalCount = res.data.outData.total;
                this.opeType = [];
                this.banlanceRow.map((data,i) => {
                    let banType = '';
                    switch(data.optType) {
                        case 1:
                            banType = '充值';
                            break;
                        case 2:
                           banType = '投保消费';
                            break; 
                        case 3:
                           banType = '退保退费';
                            break;
                        case 4:
                           banType = '活动奖励';
                            break;
                        case 5:
                            banType = '后台充值';
                            break;
                        case 6:
                            banType = '后台扣款';
                            break;
                    }
                    this.opeType.push(banType);
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
          this.banlanceFun(val-1)
      },
      handleCurrentChange(val) {
          this.banlanceFun(val-1)
      },
      banlanSearch() {
          this.currentPage = 1;
         this.banlanceFun(0);
      },
      resetSearch() {
          this.currentPage = 1;
          this.czDate = [];
          this.balanceType = '';
          this.banlanceFun(0);
      }
  },
  mounted() {
      this.banlanceFun(0);
      if(!this.czDate){//初始化日期
            this.czDate = [];
        }
      if(window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1){
            this.bandownload = 'http://127.0.0.1:9900/insurance/api/fn/accountChangeList?optType=' + this.balanceType + '&startTime=' + this.czDate[0] + '&endTime=' + this.czDate[1];
        }else{
            this.bandownload = '/insurance/api/fn/accountChangeList?optType=' + this.balanceType + '&startTime=' + this.czDate[0] + '&endTime=' + this.czDate[1];
        }
  }
}
</script>

