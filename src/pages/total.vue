<template>
    <section class="insure-content">
        <Header></Header>
        <div class="tb-main">
            <div class="total-banner"><img src="../../static/images/grzx_banner.jpg" alt="banner"></div>
            <!-- 业绩统计 -->
            <div class="yjtj">
                <div class="yj-top clearfix">
                    <div class="yjTop-left">
                        <span class="yj-title">业绩统计</span>
                        <span class="yj-sum">截止昨日24点整</span>
                        <span class="yj-sum">总数据包含渠道及下级部门的订单数据</span>
                    </div>
                </div>
                <div class="yj-total clearfix">
                    <div class="yjTotal-clumn">
                        <div class="yjTotal-name">
                            昨日保费（元）<span class="info-icon" @mouseenter="infoEnter(1)" @mouseleave="infoLeave(1)"></span>
                            <div class="info-con" v-show="infoShow1">
                                昨日0时到24时之间支付的保费-退费的保费
                            </div>
                        </div>
                        <div class="yjTotal-count">325.36</div>
                    </div>

                    <div class="yjTotal-clumn">
                        <div class="yjTotal-name">
                            昨日保单（个）<span class="info-icon" @mouseenter="infoEnter(2)" @mouseleave="infoLeave(2)"></span>
                            <div class="info-con"  v-show="infoShow2">
                                昨日0时到24时之间出单的保单个数-退保单的个数
                            </div>
                        </div>
                        <div class="yjTotal-count">2</div>
                    </div>

                    <div class="yjTotal-clumn">
                        <div class="yjTotal-name">
                            昨日承担客户（个）<span class="info-icon" @mouseenter="infoEnter(3)" @mouseleave="infoLeave(3)"></span>
                            <div class="info-con"  v-show="infoShow3">
                                昨日0时到24时之间承保的被保险人个数，不含当天退保的
                            </div>
                        </div>
                        <div class="yjTotal-count">2</div>
                    </div>

                    <div class="yjTotal-clumn">
                        <div class="yjTotal-name">
                            累计保费（元）<span class="info-icon" @mouseenter="infoEnter(4)" @mouseleave="infoLeave(4)"></span>
                            <div class="info-con"  v-show="infoShow4">
                                从合作到昨日24时之间累计已支付保费-退保的保费
                            </div>
                        </div>
                        <div class="yjTotal-count">2,325.36</div>
                    </div>

                    <div class="yjTotal-clumn">
                        <div class="yjTotal-name">
                            累计保单（个）<span class="info-icon" @mouseenter="infoEnter(5)" @mouseleave="infoLeave(5)"></span>
                            <div class="info-con"  v-show="infoShow5">
                                从合作到昨日24时之间累计已支付保单-退保的保单
                            </div>
                        </div>
                        <div class="yjTotal-count">24</div>
                    </div>

                    <div class="yjTotal-clumn">
                        <div class="yjTotal-name">
                            累计承担客户（个）<span class="info-icon" @mouseenter="infoEnter(6)" @mouseleave="infoLeave(6)"></span>
                            <div class="info-con"  v-show="infoShow6" style="right:-73px">
                                从合作到昨日24时之间累计承保的被保险人个数，不含已退保的
                            </div>
                        </div>
                        <div class="yjTotal-count">2597</div>
                    </div>
                </div>
            </div>    
            <!-- 业绩报表 -->
            <div class="yjbb">
                <div class="yj-top clearfix">
                    <div class="yjTop-left">
                        <span class="yj-title">业绩报表</span>
                        <span class="yj-sum">包含下级分销的数据</span>
                    </div>
                    <div class="yjTop-right">
                        <el-select v-model="value1">
                            <el-option
                            v-for="item in options1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="date1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            readonly
                            v-if="zdyFan1">
                        </el-date-picker>
                        <el-date-picker
                            v-model="defined1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            unlink-panels
                            v-if="zdy1">
                        </el-date-picker>
                        <span class="yj-download">下载</span>
                    </div>
                </div>

                <div class="yj-table">
                    <table>
                        <thead>
                            <tr>
                                <td>日期</td>
                                <td>合计保费(元)</td>
                                <td>合计服务费(元)</td>
                                <td>已支付保费(元)/订单(个)</td>
                                <td>未支付保费(元)/订单(个)</td>
                                <td>退保保费(元)/订单(个)</td>
                                <td>承担客户(个)</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2020-11-01</td>
                                <td>5,120.02</td>
                                <td>5,120.02</td>
                                <td>5,120.02/2</td>
                                <td>5,120.02/2</td>
                                <td>5,120.02/2</td>
                                <td>3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
            <!-- 部门业绩 -->
            <div class="bmyj">
                <div class="yj-top clearfix">
                    <div class="yjTop-left">
                        <span class="yj-title">部门业绩</span>
                    </div>
                    <div class="yjTop-right">
                        <el-select v-model="value2">
                            <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="date2"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            readonly
                            v-if="zdyFan2">
                        </el-date-picker>
                        <el-date-picker
                            v-model="defined2"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            unlink-panels
                            v-if="zdy2">
                        </el-date-picker>
                        <span class="yj-download">下载</span>
                    </div>
                </div>

                <div class="yj-table">
                    <table>
                        <thead>
                            <tr>
                                <td>部门联系人</td>
                                <td>部门名称</td>
                                <td>合计保费(元)</td>
                                <td>合计服务费(元)</td>
                                <td>承担客户(个)</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>王晓芳</td>
                                <td>销售部</td>
                                <td>5,120.02</td>
                                <td>5,120.02</td>
                                <td>24</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
            <!-- 商品 -->
            <div class="shangping">
                <div class="yj-top clearfix">
                    <div class="yjTop-left">
                        <span class="yj-title">商品</span>
                        <span class="yj-sum">包含下级分销的数据</span>
                    </div>
                    <div class="yjTop-right">
                        <el-select v-model="value3">
                            <el-option
                            v-for="item in options3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="date3"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            readonly
                            v-if="zdyFan3">
                        </el-date-picker>
                        <el-date-picker
                            v-model="defined3"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" 
                            unlink-panels
                            v-if="zdy3">
                        </el-date-picker>
                        <span class="yj-download">下载</span>
                    </div>
                </div>

                <div class="yj-table">
                    <table>
                        <thead>
                            <tr>
                                <td>商品名称</td>
                                <td>已支付订单(个)</td>
                                <td>合计保费(元)</td>
                                <td>合计服务费(元)</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>商品名称</td>
                                <td>15467</td>
                                <td>12420.23</td>
                                <td>12420.23</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
        </div>
        <Footer></Footer>
    </section>
</template>

<script>
import Footer from '../components/footer'
import Header from '../components/header'
export default {
  name: 'Total',
  components:{
        Footer,
        Header
   },
  data () {
    return {
        infoShow1:false,
        infoShow2:false,
        infoShow3:false,
        infoShow4:false,
        infoShow5:false,
        infoShow6:false,
        zdyFan1:true,
        zdyFan2:true,
        zdyFan3:true,
        zdy1:false,
        zdy2:false,
        zdy3:false,
        value1:'01',
        value2:'01',
        value3:'01',
        defined1:'',
        defined2:'',
        defined3:'',
        date1:['2020-11-04','2020-11-11'],
        date2:['2020-11-04','2020-11-11'],
        date3:['2020-11-04','2020-11-11'],
        options1:[{
          value: '01',
          label: '近一周'
        }, {
          value: '02',
          label: '近15天'
        }, {
          value: '03',
          label: '近30天'
        }, {
          value: '04',
          label: '自定义'
        }],
        options2:[{
          value: '01',
          label: '近一周'
        }, {
          value: '02',
          label: '近15天'
        }, {
          value: '03',
          label: '近30天'
        }, {
          value: '04',
          label: '自定义'
        }],
        options3:[{
          value: '01',
          label: '近一周'
        }, {
          value: '02',
          label: '近15天'
        }, {
          value: '03',
          label: '近30天'
        }, {
          value: '04',
          label: '自定义'
        }]
    }
  },
  methods: {
      infoEnter(index) {
          this['infoShow' + index] = true;
      },
      infoLeave(index) {
          this['infoShow' + index] = false;
      }
  }
}
</script>
<style>
    
</style>
