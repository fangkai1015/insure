<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main productMain clearfix">
            <div class="productBanner">
                <img :src="product.proPicUrlIndexBig" alt="">
            </div> 
            <div class="productDetail-left fl">
                <div class="insure-tbxx">
                    <div class="tbxx-top clearfix">
                        <div class="tbxx-name">{{product.name}}</div>
                    </div>
                    <div class="tbxx-top clearfix">
                        <div class="tbxx-name">保障计划</div>
                        <div class="bzjh-tab">
                            <span v-for="(planItem,index) in combos" :key="planItem.comboId" :class="{'on':planCur == index}" @click="planTab(index)">{{planItem.comboName}}</span>
                        </div>
                    </div>
                     <div class="bzjh-content">
                        <div class="bzjh-box clearfix">
                            <div class="bzjh-allIntro fl">
                                <ul>
                                    <li v-for="(allItem,index) in allContentList" :key="index" class="clearfix">
                                        <div class="bzjh-subName">{{allItem.contentName}}</div>
                                        <div class="bzjh-tips">
                                            <i class="plan-icon" @mouseenter="contentShow(index)" @mouseleave="contentHide(index)"></i>
                                            <div class="plan-tips" style="display: none;" :ref="'content'+index">
                                               {{allItem.contentContent}}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="bzjh-allCon">
                                <div class="bzjh-conItem" v-for="comItem in combos" :key="comItem.comboId">
                                    <ul>
                                        <li v-for="(contentItem,index) in comItem.contents" :key="index">{{contentItem.price}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>   

            <div class="insure-tbxx">
                <div class="tbxx-top clearfix">
                    <span class="orderMenu">
                        <a href="javascript:;" :class="{'current':cur === 0}" @click="cur = 0">产品分析</a>
                        <a href="javascript:;" :class="{'current':cur === 1}" @click="cur = 1">投保须知</a>
                        <a href="javascript:;" :class="{'current':cur === 2}" @click="cur = 2">常见问题</a>
                        <a href="javascript:;" :class="{'current':cur === 3}" @click="cur = 3">投保案例</a>
                        <a href="javascript:;" :class="{'current':cur === 4}" @click="cur = 4">理赔指引</a>
                    </span>
                </div>
                <div class="productSub">
                    <!-- 产品分析 -->
                    <div class="subContent" v-show="cur === 0" v-html="information.productCase"></div>
                    <!-- 投保须知 -->
                    <div class="subContent" v-show="cur === 1" v-html="information.hint"></div>
                    <!-- 常见问题 -->
                    <div class="subContent" v-show="cur === 2">
                        <div class="questionList">
                            <ul>
                                <li v-for="(questionItem,index) in questionList" :key="questionItem.id">
                                    <div class="questionName">{{index+1}}、{{questionItem.clauseQuestion}}</div>
                                    <div class="questionAns">{{questionItem.clauseAnswer}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- 投保案例 -->
                    <div class="subContent" v-show="cur === 3" v-html="information.productIntroduce"></div>
                    <!--  理赔指引 -->
                    <div class="subContent" v-show="cur === 4" v-html="information.compensationHint"></div>
                </div>
            </div>  
            </div>
            
            <div class="productDetail-right fr">
                <div class="insure-tbxx">
                    <div class="proAct">
                        <div class="payPrice"><span>{{price}}</span>元起</div>
                        <div class="payBtn" @click="productTb">立即投保</div>
                    </div>
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
  name: 'productDetail',
  inject:['reload'],
  components:{
        Footer,
        Header
   },
  data () {
    return {
        planCur:0,
        cur:0,
        product:{},
        information:{},
        combos:[],
        allContentList:[],
        questionList:[],
        price:''
    }
  },
  methods: {
      planTab(index) {
          this.planCur = index;
          this.price = this.combos[index].viewPrice;
      },
      productTb() {
        let pruId = {
            proId:this.$route.params.id,
            comboId:this.combos[0].comboId
        }
        localStorage.setItem('pruId', JSON.stringify(pruId));
        this.$router.push('/insure');
      },
      contentShow(index) {
          this.$refs['content'+index][0].style.display = 'block';
      },
      contentHide(index) {
          this.$refs['content'+index][0].style.display = 'none';
      },
     detailFun() {
         let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/product/details/' + this.$route.params.id
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.product = res.data.outData.product;
                    this.information = res.data.outData.information;
                    this.combos = res.data.outData.combos;
                    this.allContentList = res.data.outData.allContentList;
                    this.questionList = res.data.outData.questionList;
                    this.price = this.combos[0].viewPrice;
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
      this.detailFun();
  }
}
</script>

