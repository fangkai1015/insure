<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-tbxx banlanceYe">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">产品列表</div>
                </div>
                <div class="productTab">
                    二级分类：<span v-for="(typeItem,index) in typeList" :key="typeItem.typeId" :class="{'on':typeCur == index}" @click="subClick(index,typeItem.typeId)">{{typeItem.typeName}}</span>
                </div>
            </div>

            <div class="insure-tbxx">
                <div class="productList-box">
                    <div class="productItem clearfix" v-for="(productItem,index) in products" :key="productItem.id">
                        <div class="productImg fl">
                            <span class="productType">{{productItem.subTypeName}}</span>
                            <img :src="productItem.proPicUrlIndexSmall" alt="">
                            <div class="productTip">{{productItem.productAdv}}</div>
                        </div>
                        <div class="productIntro fl">
                            <div class="productName">{{productItem.name}}</div>
                            <div class="productCombo">
                                <ul class="comboTab">
                                    <li v-for="(comboItem,i) in productItem.comboList" :key="comboItem.comboId" :class="{'on':com[index] == i}" @click="comboTab(index,i)"><p>{{comboItem.comboName}}</p></li>
                                </ul>
                                <div class="comboBox">
                                    <div class="comboList" v-for="(comboItem,i) in productItem.comboList" :key="comboItem.comboId" :class="{'active':com[index] == i}">
                                        <ul>
                                            <li v-for="contentItem in comboItem.contents" :key="contentItem.contentId">
                                                <div class="comboName fl">{{contentItem.contentName}}</div>
                                                <div class="comboMoney fl">{{contentItem.price}}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <a href="javascript:;" class="comboMore" @click="productEnter(productItem.id)">查看详情 ></a>
                            </div>
                        </div>
                        <div class="productAct">
                            <div class="productPrice"><span>{{productItem.originPrice}}</span> 元起</div>
                            <div class="priceBefore">原价：{{productItem.price}}元起</div>
                            <a href="javascript:;" class="productBtn" @click="productTb(productItem.id,index)">立即投保</a>
                        </div>
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
        <!--认证plus用户-->
        <el-dialog
            title="认证plus用户"
            :visible.sync="reWeebox"
            width="40%"
            top="10vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="rzIntro" label-width="80px">
                    <el-form-item label="姓名">
                        <el-input v-model="rzIntro.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="rzIntro.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="行业标签">
                        <el-select v-model="areaName" placeholder="请选择" @change="fieldSel1">
                            <el-option
                            v-for="item in areaNames"
                            :key="item.id"
                            :label="item.value"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="场景标签">
                        <el-select v-model="cjName" multiple placeholder="请选择">
                            <el-option
                            v-for="item in cjNames"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="身份标签">
                        <el-select v-model="sfName" placeholder="请选择">
                            <el-option
                            v-for="item in sfNames"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="renz-tips">
                    认证资料类型：<br>
                    <el-radio v-model="imgType" label="1">培训机构可上传场地、培训工作照等</el-radio><br>
                    <el-radio v-model="imgType" label="2">领队、导游等组织者可上传带队出行图片</el-radio><br>
                    <el-radio v-model="imgType" label="3">或其他证明材料</el-radio><br>
                </div>
                <div class="renz-upload">
                    <div class="upload-intro">
                        <div class="uploadTxt">
                            点击选择图片<br>(需小于10M)
                        </div>
                        <img :src="imgSrc" class="uploadImg" v-if="imgShow">
                        <input type="file" name="file" id="file" class="uploadFile" accept="image/*" @change="uploadImg">
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reSubmit">提交</el-button>
            </span>
        </el-dialog>
        <!-- 认证成功提示 -->
        <el-dialog
        title="认证提示"
        :visible.sync="rztj"
        width="30%"
        top="30vh"
        center>
        <div style="text-align:center">提交成功，待后台审核！</div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="rztj = false">确 定</el-button>
        </span>
        </el-dialog>
        <Footer></Footer>
    </section>
</template>

<script>
import Footer from '../components/footer'
import Header from '../components/header'
export default {
  name: 'productList',
  inject:['reload'],
  components:{
        Footer,
        Header
   },
  data () {
    return {
        rztj:false,
        imgType:'1',
        imgShow:false,
        imgSrc: '',
        fileName:'',
        areaCode:'',
        areaName: '',
        areaNames:[],
        cjName:[],
        cjNames:[],
        sfName:'',
        sfNames:[],
        rzIntro:{
            name:'',
            phone:''
        },
        reWeebox:false,
       totalCount:0,
        currentPage:1,
        size:10,
       typeCur:0,
        typeList:[{
            typeName: "全部",
            typeId: ''
        }],
        subId:'',
        products:[],
        com:[],
        commonType:false
    }
  },
  methods: {
      productEnter(id) {
          if(this.commonType) {//普通用户
            this.reAct();
          }else{
              this.$router.push({
                name: 'productDetail',
                params:{
                    id:id
                }
            })
          }
      },
      productTb(id,index) {
          if(this.commonType) {//普通用户
            this.reAct();
          }else{
              let pruId = {
                proId:id,
                comboId:this.products[index].comboList[0].comboId
                }
            localStorage.setItem('pruId', JSON.stringify(pruId));
            this.$router.push('/productDetail');
          }
      },
      reAct() {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/plusApplyInfo'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    let shCon = res.data.outData.userAuthInfo;
                    if(shCon.authState === 0 || shCon.authState === 3){//初始状态、审核失败状态
                        this.reWeebox = true;
                        this.rzIntro.name = shCon.name;
                        this.rzIntro.phone = shCon.mobile;
                        this.imgType = shCon.authType || '1';
                        this.areaName = shCon.industry;
                        if(this.areaName){
                            this.fieldSel1(this.areaName);
                        }
                        this.cjName = shCon.scene.split(',');
                        this.sfName = shCon.identity;
                        if(shCon.authPicUrl){
                            this.imgShow = true;
                            this.imgSrc = res.data.outData.vistPath + shCon.authPicUrl;
                        }
                    }else if(shCon.authState === 1){//正在审核中
                        this.$message('平台正在审核中，如长时间未审核请联系相关客服人员');
                    }else if(shCon.authState === 2){//认证通过
                        this.$message({
                            message: '认证通过，刷新后可投保',
                            duration: 2000,
                            type: 'success',
                            onClose:()=>{
                                this.reload();
                            }
                        });
                    }
                }
            })
      },
      reSubmit() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
          if(this.rzIntro.name === ''){
              this.$message({
                message: '请输入姓名',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.rzIntro.phone === '' || !phoneReg.test(this.rzIntro.phone)){
              this.$message({
                message: '请输入正确的手机号码',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.areaName === ''){
            this.$message({
                message: '请选择行业标签',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.cjName.length === 0){
            this.$message({
                message: '请选择场景标签',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.sfName === ''){
            this.$message({
                message: '请选择身份标签',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.imgSrc === ''){
              this.$message({
                message: '请上传认证图片',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/plusApply',
                data:{
                    authPicUrl:this.fileName,
                    authType:this.imgType,
                    identity:this.sfName,
                    industry:this.areaName,
                    scene:this.cjName.join(','),
                    name:this.rzIntro.name,
                    mobile:this.rzIntro.phone
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.reWeebox = false;
                    this.rztj = true;
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
      uploadImg() {
          let fileVal = document.querySelector("#file").files[0];
        // 此时可以自行将文件上传至服务器
		let fileFormData = new FormData();
        fileFormData.append('file', fileVal);
        let loadingInstance = this.$loading();
        this.$ajax.post('/insurance/api/user/uploadPlusApplyFile',fileFormData,{headers: {'Content-Type': 'multipart/form-data'}})
          .then((res)=>{
              loadingInstance.close();
              if(res.data &&  res.data.code === 1){
                  this.imgSrc = res.data.outData.vistPath + res.data.outData.fileName;
                  this.imgShow = true;
                  this.fileName = res.data.outData.fileName;
              }else{
                this.$message({
                message: res.data.message,
                duration: 1000,
                type: 'error'
                });
                return;
              }
          })
          .catch((error)=>{
             loadingInstance.close();
             this.$message({
            message: res.data.message,
            duration: 1000,
            type: 'error'
            });
            return;
          })
      },
      fieldFun() {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/common/loadIndustryLabelList'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.areaNames = res.data.outData.industryLabel;
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
      fieldSel1(val){
          this.areaNames.map((data,i) => {
              if(data.value === val){
                  this.areaCode = data.code;
              }
          });
          this.cjName = [];
          this.sfName = '';
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/common/loadIndustryLabelSubList',
                params:{
                    industryLabelCode:this.areaCode
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.cjNames = res.data.outData.sceneLabel;
                    this.sfNames = res.data.outData.identityLabel;
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
      comboTab(index,i) {
          this.com[index] = i;
          this.$forceUpdate();
      },
      subClick(index,id) {
          this.currentPage = 1;
          this.typeCur = index;
          this.subId = id;
          this.productFun(0);
      },
      productFun(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/product/productList',
                data:{
                    pageSize:10,
                    pageNo:index,
                    proTypeId:this.subId
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.products = res.data.outData.products;
                   this.totalCount = res.data.outData.total;
                   //初始化tab
                   this.products.map((data,i) => {
                       this.com.push(0);
                   })
                }
            })
      },
      handleSizeChange(val) {
          this.productFun(val-1)
      },
      handleCurrentChange(val) {
          this.productFun(val-1)
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
      }
  },
  mounted() {
      this.fieldFun();
      this.subType();
      this.productFun(0);
      let userIntro = JSON.parse(localStorage.getItem('user'));
    if(userIntro.userType === 1){//普通账户
      this.commonType = true;
    }
  }
}
</script>

