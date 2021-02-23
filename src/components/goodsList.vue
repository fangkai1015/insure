<template>
    <div class="insure-tb">
        <div class="insureTb-account clearfix">
            商品库(共{{totalCount}}款)
            <div class="goods-act">
                <div class="goodsInfo">
                <el-input v-model="goodsName" placeholder="请输入商品名称进行搜索"></el-input>
                </div>
                <div class="goodsInfo">
                     <el-button type="primary" @click="searchFun">搜索</el-button>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="tbxx-top clearfix">
                <div class="tbxx-name">商品库</div>
            </div>
            <div class="productTab">
                二级分类：<span v-for="(typeItem,index) in typeList" :key="typeItem.typeId" :class="{'on':typeCur == index}" @click="subClick(index,typeItem.typeId)">{{typeItem.typeName}}</span>
            </div>
            <div class="productTab">
                商品标签：<span v-for="(labelItem,index) in labelList" :key="labelItem.id" :class="{'on':labelCur == index}" @click="labelClick(index,labelItem.id)">{{labelItem.labelName}}</span>
            </div>
            <div class="goodsList">
                <ul>
                    <li v-for="(goods,index) in goodsList" :key="index">
                        <div class="goodsList-intro">
                            <div class="goodsList-name"><span>{{goods.proName}}</span>-<span class="goodsCombo-name">{{goods.comboName}}</span></div>
                            <div class="goodsList-bz">
                                <div class="goodsBz-con clearfix" v-for="subCon in goods.contents" :key="subCon.contentId">
                                    <span class="bz-name">{{subCon.contentName}}</span>
                                    <span class="bz-money">{{subCon.price}}</span>
                                </div>
                            </div>
                        </div>

                        <div class="goodsList-right">
                            <div class="goodsList-price">¥<span>{{goods.price}}</span></div>
                            <a href="javascript:;" class="joinBtn" @click="joinFun(goods.comboId,goods.collectFlag)">{{goods.collectFlag === 0 ? '加入我的商品': '取消加入'}}</a>
                            <div class="goodsList-xl">销量：{{goods.buyNum}}</div>
                            <div class="goodsList-fd">返点：{{goods.rate}}%</div>
                        </div>
                    </li>
                </ul>
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
</template>

<script>
export default {
  name: 'goodsList',
  inject:['reload'],
  data () {
    return {
        goodsName: '',
        goodsList:[],
        totalCount:0,
        currentPage:1,
        size:10,
        typeCur:0,
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
          this.goodsFun(0);
      },
      labelClick(index,id) {
        this.currentPage = 1;
        this.labelCur = index;
        this.labelId = id;
        this.goodsFun(0);
      },
      goodsFun(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/product/queryProProductLibraryPage',
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
                   this.goodsList = res.data.outData.rows;
                   this.totalCount = res.data.outData.total;
                }
            })
      },
      joinFun(id,flag) {
          let ajaxUrl = '';
          if(flag === 0){
              ajaxUrl = '/insurance/api/userCollect/addUserCollect/' + id;
          }else{
              ajaxUrl = '/insurance/api/userCollect/delUserCollect/' + id;
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
          this.goodsFun(val-1)
      },
      handleCurrentChange(val) {
          this.goodsFun(val-1)
      },
      searchFun() {
          this.currentPage = 1;
          this.goodsFun(0);
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
      this.goodsFun(0);
      this.subType();
      this.insLabel();
  }
}
</script>

