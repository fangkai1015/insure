<template>
    <div class="insure-tb">
        <div class="insureTb-account clearfix">
            我的商品(共{{totalCount}}款)
            <div class="goods-act">
                <div class="goodsInfo">
                <el-input v-model="goodsName" placeholder="请输入商品名称进行搜索"></el-input>
                </div>
                <div class="goodsInfo">
                     <el-button type="primary" @click="searchFun">搜索</el-button>
                </div>
                <div class="goodsInfo uploadExcel">
                    <a :href="excelUrl"><el-button plain>导出excel</el-button></a>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="tbxx-top clearfix">
                <div class="tbxx-name">商品列表</div>
            </div>
            <div class="productTab">
                二级分类：<span v-for="(typeItem,index) in typeList" :key="typeItem.typeId" :class="{'on':typeCur == index}" @click="subClick(index,typeItem.typeId)">{{typeItem.typeName}}</span>
            </div>
            <div class="productTab">
                商品标签：<span v-for="(labelItem,index) in labelList" :key="labelItem.id" :class="{'on':labelCur == index}" @click="labelClick(index,labelItem.id)">{{labelItem.labelName}}</span>
            </div>
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>产品名称</td>
                            <td>保险公司</td>
                            <!-- <td>页面地址</td> -->
                            <td>基础价格</td>
                            <td>推广费</td>
                            <td>加入后台投保</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="myGoods in myGoodsList" :key="myGoods.comboId">
                            <td>{{myGoods.proName}}-{{myGoods.comboName}}</td>
                            <td>{{myGoods.insurerName}}</td>
                            <!-- <td><a href="javascript:;" class="account-act" target="_blank">页面地址</a></td> -->
                            <td>￥{{myGoods.price}}</td>
                            <td>{{myGoods.rate}}%</td>
                            <td><a href="javascript:;" class="account-act" @click="joinAct(myGoods.comboId,myGoods.backInsureFlag)">{{myGoods.backInsureFlag === 1 ? '取消加入' : '加入'}}</a></td>
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
  name: 'MyGoods',
  inject:['reload'],
  data () {
    return {
        typeCur:0,
        goodsName: '',//商品名称
        myGoodsList:[],
        totalCount:0,
        currentPage:1,
        size:10,
        excelUrl: '',
        typeList:[{
            typeName: "全部",
            typeId: ''
        }],
        subId:'',
        labelCur:0,
        labelList:[{
            labelName: "全部",
            id: ''
        }],
        labelId:''
    }
  },
  methods: {
      subClick(index,id) {
          this.currentPage = 1;
          this.typeCur = index;
          this.subId = id;
          this.myGoods(0);
      },
      labelClick(index,id) {
        this.currentPage = 1;
        this.labelCur = index;
        this.labelId = id;
        this.myGoods(0);
      },
      myGoods(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/product/queryProMyProductPage',
                data:{
                    limit:10,
                    page:index,
                    proName:this.goodsName,
                    subTypeId:this.subId,
                    labelId:this.labelId
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.myGoodsList = res.data.outData.rows;
                   this.totalCount = res.data.outData.total;
                }
            })
      },
      joinAct(id,flag) {
          let ajaxUrl = '';
          if(flag === 1){
              ajaxUrl = '/insurance/api/userCollect/removeBackInsure/' + id;
          }else{
              ajaxUrl = '/insurance/api/userCollect/addBackInsure/' + id;
          }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:ajaxUrl
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
      },
      handleSizeChange(val) {
          this.myGoods(val-1)
      },
      handleCurrentChange(val) {
          this.myGoods(val-1)
      },
      searchFun() {
          this.currentPage = 1;
          this.myGoods(0);
      },
      subType() {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/product/productSubType',
                data:{
                    leve1Name:''
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   res.data.outData.typeList.map((data,i) => {
                       this.typeList.push(data);
                   })
                }
            })
      },
      insLabel() {
        let loadingInstance = this.$loading();
        this.$ajax({
          method:'post',
          url:'/insurance/api/product/productLabel',
          data:{
            labelName:''
          }
        })
          .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
              res.data.outData.labelList.map((data,i) => {
                this.labelList.push(data);
              })
            }
          })
      }
  },
  mounted() {
      this.myGoods(0);
      this.subType();
      this.insLabel();
      if(window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1){
            this.excelUrl = 'http://127.0.0.1:9900/insurance/api/product/queryProMyProductExport?proName='+ this.goodsName;
        }else{
            this.excelUrl = '/insurance/api/product/queryProMyProductExport?proName='+ this.goodsName;
        }
  }
}
</script>

