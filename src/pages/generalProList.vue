<template>
  <section class="insure-content">
    <Header></Header>
    <div class="insure-main">
      <el-carousel trigger="click" height="300px"  v-if="!commonType">
        <el-carousel-item v-for="item in bannerImg" :key="item.bannerId">
          <div class="club-banner-img"><a :href="item.turnUrl"
                                     :style="{'background': 'url('+item.imgUrl+') no-repeat center center'}"
                                     target="_blank"></a></div>
        </el-carousel-item>
      </el-carousel>
      <div class="jjfa contentItem" v-if="commonType">
        <div class="club-top">
          <el-carousel trigger="click" height="300px"  class="club-carousel" >
            <el-carousel-item v-for="item in bannerImg" :key="item.bannerId">
              <div class="club-banner-img"><a :href="item.turnUrl"
                                         :style="{'background': 'url('+item.imgUrl+') no-repeat center center'}"
                                         target="_blank"></a></div>
            </el-carousel-item>
          </el-carousel>

          <div class="club-header-right-top" >
            <div class="index-title"><h2>耀保网PLUS用户享特权</h2></div>
            <div>
              <p class="club-regist-button" @click="reAct()">限时免费认证</p>
            </div>
            <div class="scroll">
              <ul id="scrollDiv" ref="rollul" :class="{anim:animate==true}">
                <!--                  <li class="club-header-right-li" v-for="item in scroll_lists"><span>{{item.startCon}}</span><span class="s-2">{{randomPhoneNumber()}}</span><span>{{item.endCon}}</span><span>{{item.num}}</span><span>{{item.unit}}</span></li>-->
                <li class="club-header-right-li" v-for="item in scroll_lists"><span>{{ item }}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 平台优势 -->
      <div class="ptys contentItem">
        <div class="club-header" v-show="commonType">
          <div class="index-title">
            <h3>PLUS会员特权</h3>
          </div>
          <div class="club-header-left">
            <div class="club-header-left-middle">
<!--              <h2>开通PLUS即享六大特权</h2>-->
              <ul>
                <li>
                  <div class="icon"></div>
                  <p class="discount">买保险</p>
                  <p class="discount-name">八五折或更低</p>
                </li>
                <li>
                  <div class="icon"></div>
                  <p class="discount">7*24</p>
                  <p class="discount-name">专属客户经理</p>
                </li>
                <li>
                  <div class="icon"></div>
                  <p class="discount">快速理赔</p>
                  <p class="discount-name">绿色通道</p>
                </li>
                <li>
                  <div class="icon"></div>
                  <p class="discount">俱乐部日</p>
                  <p class="discount-name">免费保险福利</p>
                </li>
                <li>
                  <div class="icon"></div>
                  <p class="discount">更多福利</p>
                  <p class="discount-name">持续上线中...</p>
                </li>
<!--                <li>-->
<!--                  <div class="icon"></div>-->
<!--                  <p class="discount">救援互助</p>-->
<!--                  <p class="discount-name">全国救援联盟</p>-->
<!--                </li>-->
              </ul>
            </div>
          </div>

        </div>
        <!--      常购商品    -->
        <div class="plus-header" v-show="!commonType">

          <div class="index-title">
            <h3>常购商品</h3><span class="plus-header-span-right"><a href="javascript:;"@click="centerEnter">更多常购商品</a></span>
          </div>
          <div class="plus-header-left">
<!--            <div class="plus-header-left-middle"><h2>常购商品</h2>-->
<!--              <span class="plus-header-span-right"><a href="javascript:;"@click="centerEnter">更多常购商品</a></span>-->
<!--            </div>-->
            <div class="plus-header-bill">

              <div class="plus-recommend-wrapper">
                <div class="plus-recommend-wrapper-content" v-for="(buyItem,index) in regularlyBuy" :key="buyItem.combo_id">
                  <div class="plus-product-item">
                    <div class="plus-item-top">
                      <div class="plus-item-right-pic">
                        <span class="plus-item-right-pic-span">经常购买</span>
                      </div>
                      <div class="plus-item-top-span">
                          <span ><h3>{{buyItem.pro_name}}-{{buyItem.combo_name}}</h3></span>
                      </div>
                    </div>
                    <div class="plus-item-bottom">
                      <p class="plus-current-price">投保时间：{{buyItem.diffDate}}天前</p>
                      <p class="plus-current-price">投保次数：{{buyItem.buy_times}}次</p>
                      <p class="plus-current-price">投保单价：{{buyItem.view_price}}元/份</p>
                      <p class="club-policy-button" @click="productTb(buyItem.pro_id,index)">再次购买</p>
                    </div>
                  </div>
                </div>
                <div class="plus-recommend-wrapper-content" v-for="(buyItem,index) in latelyBuy" :key="buyItem.combo_id">
                  <div class="plus-product-item">
                    <div class="plus-item-top">
                      <div class="plus-item-right-pic">
                        <span class="plus-item-right-pic-span">最近购买</span>
                      </div>
                      <div class="plus-item-top-span">
                        <span ><h3>{{buyItem.pro_name}}-{{buyItem.combo_name}}</h3></span>
                      </div>
                    </div>
                    <div class="plus-item-bottom">
                      <p class="plus-current-price">投保时间：{{buyItem.diffDate}}天前</p>
                      <p class="plus-current-price">投保次数：{{buyItem.buy_times}}</p>
                      <p class="plus-current-price">投保单价：{{buyItem.view_price}}元/份</p>
                      <p class="club-policy-button" @click="productTb(buyItem.pro_id,index)">再次购买</p>
  <!--                    <p class="club-policy-button"></p>-->
                    </div>
                  </div>
                </div>
                <div class="plus-recommend-wrapper-content" v-if="regularlyBuy == ''" >
                  <div class="plus-product-item">
                    <div class="plus-item-top">
                      <div class="plus-item-right-pic">
                        <span class="plus-item-right-pic-span">还未购买</span>
                      </div>
                      <div class="plus-item-top-span">
                        <span ><h3>还没有购买过商品呀</h3></span>
                      </div>
                    </div>
                    <div class="plus-item-bottom" style="padding-left: 200px;">
                      <p class="plus-current-price">请在下方购买</p>
                      <div><img src="../../static/images/jiantou.png" height="60px"/></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      常购商品end    -->
      <div class="jjfa contentItem">
        <div class="index-title">
          <h3>会员商品精选</h3>
        </div>
        <div class="jjfa-box">

          <div class="jjfa-clumn">
            <!-- 少儿教育行业 -->
            <div class="jjfa-intro"  >
              <div class="club-recommend-wrapper">
                <di class="club-recommend-wrapper-content" v-for="(productItem,index) in goodsList" :key="productItem.id"  key="index">
                  <div class="club-product-item">
                    <div class="club-item-top">
                      <img :src="productItem.proPicUrlIndexSmall" alt=""/>
<!--                      <div class="club-productTip">{{productItem.productAdv}}</div>-->
                      <div class="club-productTip" v-html="productItem.productAdv"></div>
                    </div>
                    <div class="club-item-bottom">
                      <h2>{{ productItem.name }}</h2>
                      <p class="club-current-price">会员价：{{ productItem.originPrice }}元起</p>
                      <p class="club-old-price">原价：{{ productItem.price }}元起</p>
                      <p class="club-policy-button" @click="productTb(productItem.id,index)">{{ buttonName }}</p>
                    </div>
                  </div>
                </di>
              </div>
            </div>
            <!-- 体育户外行业 -->

          </div>
        </div>
      </div>
      <!-- 解决方案 -->
      <div class="ptys contentItem">
        <div class="index-title">
          <h3>PLUS专属商品</h3>
        </div>
        <div class="jjfa-box">
          <div class="jjfa-tab">
            <span v-for="(typeItem,index) in goodsAndTypeList" :key="typeItem.subTypeId"
                  :class="{'on':typeCur == index} "
                  @click="typeCur = index" v-if="typeItem.products.length >0 ">{{ typeItem.subTypeName }}</span>
<!--            <span @click="current = 0" :class="{on:current == 0}">少儿教育行业</span> v-if="typeItem.products.length >0 "-->
<!--            <span @click="current = 1" :class="{on:current == 1}">体育户外行业</span>-->
<!--            <span @click="current = 2" :class="{on:current == 2}">旅游签证行业</span>-->
          </div>
          <div class="jjfa-clumn">
            <!-- 少儿教育行业 -->
            <div class="jjfa-intro" v-for="(typeItem,index) in goodsAndTypeList" v-if="typeItem.products.length >0 " key="index" v-show="typeCur == index">
              <div class="club-recommend-wrapper">
                <div class="club-recommend-wrapper-content" v-for="(product,index) in typeItem.products" key="index">
                  <div class="club-product-item">
                    <div class="club-item-top">
                      <img :src="product.proPicUrlIndexSmall" alt=""/>
                      <div class="club-productTip" v-html="product.productAdv"></div>
                    </div>
                    <div class="club-item-bottom">
                      <h2>{{ product.name }}</h2>
                      <p class="club-current-price">会员价：{{ product.originPrice }}元起</p>
                      <p class="club-old-price">原价：{{ product.price }}元起</p>
                      <p class="club-policy-button" @click="productTb(product.id,index)">{{ buttonName }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 体育户外行业 -->

          </div>
        </div>
      </div>
      <!-- 合作平台 -->
      <div class="jjfa contentItem" v-if="commonType">
        <div class="index-title">
          <h3>PLUS会员极简认证</h3>
        </div>
        <div class="jjrz-image">
          <img class="plus-regist-img" src="../../static/images/rzlc.png">
        </div>
        <div>
          <p class="club-regist-button" @click="reAct()">立即认证</p>
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
          <el-form-item label="行业">
            <el-select v-model="areaName" placeholder="请选择" @change="fieldSel1">
              <el-option
                v-for="item in areaNames"
                :key="item.id"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="场景">
            <el-select v-model="cjName" multiple placeholder="请选择">
              <el-option
                v-for="item in cjNames"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="身份">
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
          <el-radio v-model="imgType" label="1">培训机构可上传场地、培训工作照等</el-radio>
          <br>
          <el-radio v-model="imgType" label="2">领队、导游等组织者可上传带队出行图片</el-radio>
          <br>
          <el-radio v-model="imgType" label="3">或其他证明材料</el-radio>
          <br>
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
import Vue from 'vue'
// import BScroll from "better-scroll";

import {Image, Carousel, CarouselItem} from 'element-ui';

Vue.use(Image)
Vue.use(Carousel)
Vue.use(CarouselItem)
export default {
  name: 'index',
  components: {
    Footer,
    Header
  },
  data() {
    return {
      rztj: false,
      imgType: '1',
      imgShow: false,
      imgSrc: '',
      fileName: '',
      areaCode: '',
      areaName: '',
      areaNames: [],
      cjName: [],
      cjNames: [],
      sfName: '',
      sfNames: [],
      rzIntro: {
        name: '',
        phone: ''
      },
      reWeebox: false,
      currentPage: 1,
      size: 10,
      products: [],
      com: [],
      commonType: false,
      buttonName: '立即购买',
      current: 0,
      act: 0,
      bannerImg: [],
      menuName: ['产品列表'],
      typeCur: 0,
      typeList: [],
      subId: '',
      userName: '',
      loginBefore: false,
      loginAfter: false, animate: false,
      scroll_lists: [
        ['通知：刚刚', this.randomPhoneNumber(), '加入了Plus会员'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚', this.randomPhoneNumber(), '加入了Plus会员'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚', this.randomPhoneNumber(), '加入了Plus会员'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚', this.randomPhoneNumber(), '加入了Plus会员'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚', this.randomPhoneNumber(), '加入了Plus会员'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
        ['通知：刚刚', this.randomPhoneNumber(), '加入了Plus会员'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(2), '元'].join(''),
        ['通知：刚刚会员', this.randomPhoneNumber(), '投保节省了', this.randomMoneyNumber(1), '元'].join(''),
      ],
      goodsName: '',
      goodsList: [],
      goodsAndTypeList: [],
      totalCount: 0,
      latelyBuy:[],
      regularlyBuy:[],
      isBuy:true,
    }
  },
  created() {
    setInterval(this.scroll, 3000)
  },
  methods: {
    productEnter(id) {
      if (this.commonType) {//普通用户
        this.reAct();
      } else {
        this.$router.push({
          name: 'productDetail',
          params: {
            id: id
          }
        })
      }
    },
    productTb(id, index) {
      if (this.commonType) {//普通用户
        this.reAct();
      } else {
        let pruId = {
          proId: id
          // comboId:this.products[index].comboList[0].comboId
        }
        localStorage.setItem('pruId', JSON.stringify(pruId));
        this.$router.push({
          name: 'productDetail',
          params: {
            id: id
          }
        })
      }
    },
    reAct() {
      this.fieldFun();
      let loadingInstance = this.$loading();
      this.$ajax({
        method: 'post',
        url: '/insurance/api/user/plusApplyInfo'
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            let shCon = res.data.outData.userAuthInfo;
            if (shCon.authState === 0 || shCon.authState === 3) {//初始状态、审核失败状态
              this.reWeebox = true;
              this.rzIntro.name = shCon.name;
              this.rzIntro.phone = shCon.mobile;
              this.imgType = shCon.authType || '1';
              this.areaName = shCon.industry;
              if (this.areaName) {
                this.fieldSel1(this.areaName);
              }
              this.cjName = shCon.scene.split(',');
              this.sfName = shCon.identity;
              if (shCon.authPicUrl) {
                this.imgShow = true;
                this.imgSrc = res.data.outData.vistPath + shCon.authPicUrl;
              }
            } else if (shCon.authState === 1) {//正在审核中
              this.$message('平台正在审核中，如长时间未审核请联系相关客服人员');
            } else if (shCon.authState === 2) {//认证通过
              this.$message({
                message: '认证通过，刷新后可投保',
                duration: 2000,
                type: 'success',
                onClose: () => {
                  this.reload();
                }
              });
            }
          }
        })
    },
    reSubmit() {
      let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
      if (this.rzIntro.name === '') {
        this.$message({
          message: '请输入姓名',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      if (this.rzIntro.phone === '' || !phoneReg.test(this.rzIntro.phone)) {
        this.$message({
          message: '请输入正确的手机号码',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      if (this.areaName === '') {
        this.$message({
          message: '请选择行业标签',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      if (this.cjName.length === 0) {
        this.$message({
          message: '请选择场景标签',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      if (this.sfName === '') {
        this.$message({
          message: '请选择身份标签',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      if (this.imgSrc === '') {
        this.$message({
          message: '请上传认证图片',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      let loadingInstance = this.$loading();
      this.$ajax({
        method: 'post',
        url: '/insurance/api/user/plusApply',
        data: {
          authPicUrl: this.fileName,
          authType: this.imgType,
          identity: this.sfName,
          industry: this.areaName,
          scene: this.cjName.join(','),
          name: this.rzIntro.name,
          mobile: this.rzIntro.phone
        }
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            this.reWeebox = false;
            this.rztj = true;
          } else {
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
      this.$ajax.post('/insurance/api/user/uploadPlusApplyFile', fileFormData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then((res) => {
          loadingInstance.close();
          if (res.data && res.data.code === 1) {
            this.imgSrc = res.data.outData.vistPath + res.data.outData.fileName;
            this.imgShow = true;
            this.fileName = res.data.outData.fileName;
          } else {
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'error'
            });
            return;
          }
        })
        .catch((error) => {
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
        method: 'post',
        url: '/insurance/api/common/loadIndustryLabelList'
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            this.areaNames = res.data.outData.industryLabel;
          } else {
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'error'
            });
            return;
          }
        })
    },
    fieldSel1(val) {
      this.areaNames.map((data, i) => {
        if (data.value === val) {
          this.areaCode = data.code;
        }
      });
      this.cjName = [];
      this.sfName = '';
      let loadingInstance = this.$loading();
      this.$ajax({
        method: 'post',
        url: '/insurance/api/common/loadIndustryLabelSubList',
        params: {
          industryLabelCode: this.areaCode
        }
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            this.cjNames = res.data.outData.sceneLabel;
            this.sfNames = res.data.outData.identityLabel;
          } else {
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'error'
            });
            return;
          }
        })
    },
    subClick(index, id, anchor) {
      this.currentPage = 1;
      this.typeCur = index;
      this.subId = id;
      document.getElementById(anchor).scrollIntoView();
      // this.selectType(anchor);
    },
    subType() {
      let loadingInstance = this.$loading();
      this.$ajax({
        method: 'post',
        url: '/insurance/api/product/productSubType',
        data: {
          leve1Name: ''
        }
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            res.data.outData.typeList.map((data, i) => {
              this.typeList.push(data);
            })
          }
        })
    },
    productFun() {
      let loadingInstance = this.$loading();
      this.$ajax({
        method: 'post',
        url: '/insurance/api/product/productAndTypeList',
        data: {
          // pageSize:10,
          // pageNo:index,
          proName: this.goodsName,
          proTypeId: this.subId
        }
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            this.goodsAndTypeList = res.data.outData.typeAndProduct;
            this.totalCount = res.data.outData.total;
            //初始化tab
            this.goodsAndTypeList.map((data, i) => {
              this.com.push(0);
            })
          }
        })
    },
    productListFun(index) {
      let loadingInstance = this.$loading();
      this.$ajax({
        method:'post',
        url:'/insurance/api/product/productList',
        data:{
          pageSize:3,
          pageNo:index,
          proTypeId:this.subId
        }
      })
        .then((res)=>{
          loadingInstance.close();
          if(res.data.code === 1){
            this.goodsList = res.data.outData.products;
            this.totalCount = res.data.outData.total;
            //初始化tab
            this.goodsList.map((data,i) => {
              this.com.push(0);
            })
          }
        })
    },
    buyIntro(buyNum) {
      let loadingInstance = this.$loading();
      let buyUrl = '';
      if (buyNum === 1) { //常购
        buyUrl = '/insurance/api/product/queryRegularlyBuyProduct';
      } else {//最近购买
        buyUrl = '/insurance/api/product/queryLatelyBuyProduct';
      }
      this.$ajax({
        method: 'post',
        url: buyUrl,
        data: {
          limit: 1,
          page: 0
        }
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            if (buyNum === 1) { //常购
              this.regularlyBuy = res.data.outData.rows;
              if(this.regularlyBuy.length < 1){
                this.isBuy =false;
              }
            } else {//最近购买
              this.latelyBuy = res.data.outData.rows;
              if(this.latelyBuy.length < 1){
                this.isBuy =false;
              }
            }

          } else {
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'error'
            });
            return;
          }
        })
    },

    //页面滚动触发的方法
    handleScroll() {
      // windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      var arrDom = document.getElementsByClassName("contentItem");
      for (var i = 0; i < arrDom.length; i++) {
        if (arrDom[0].offsetTop - scrollTop > 0) {
          this.act = 0;
        }
        //因为下面使用到了i+1，所以需要把最后一个分离出来判断,还有最后一个内容量小，滚动条到底部
        if (arrDom[arrDom.length - 1].offsetTop - scrollTop <= 0 || scrollTop + windowHeight == scrollHeight) {
          this.act = arrDom.length;
        } else {
          if (arrDom[i].offsetTop - scrollTop <= 0 && arrDom[i + 1].offsetTop - scrollTop > 0) {
            this.act = i + 1;
          }
        }
      }
    },
    bannerCon(type) {
      this.$ajax({
        method: 'get',
        url: '/insurance/api/common/indexBanner/' + type
      })
        .then((res) => {
          if (res.data.code === 1) {
            let bannerIntro = res.data.outData.banners;
            this.bannerImg = bannerIntro;
          }
        })
    },
    loginOut() {
      let loadingInstance = this.$loading();
      this.$ajax({
        method: 'post',
        url: '/insurance/api/user/logout'
      })
        .then((res) => {
          loadingInstance.close();
          if (res.data.code === 1) {
            localStorage.removeItem('user');
            this.$router.push('/login');
          }
        })
    },
    checkLogin() {
      this.$ajax({
        method: 'post',
        url: '/insurance/api/user/checkLogin'
      })
        .then((res) => {
          if (res.data.code === -1) {//未登录
            this.loginBefore = true;
          }
          if (res.data.code === 1) {//已登录
            let userIntro = JSON.parse(localStorage.getItem('user'));
            this.loginAfter = true;
            this.userName = userIntro.name || userIntro.mobile;
          }
        })
    },
    centerEnter() {
      let userInfo = JSON.parse(localStorage.getItem('user'));
      if (userInfo) {
        if (userInfo.userType === 3 || userInfo.userType === 4 || userInfo.userType === 5) {//PRO用户
          this.$router.push('/insure');
        }
        if (userInfo.userType === 1 || userInfo.userType === 2) {//普通用户、plus用户
          this.$router.push('/user');
        }
      }
    },
    // 根据字典生成随机序列
    randomCode: function (len, dict) {

      for (var i = 0, rs = ''; i < len; i++)
        rs += dict.charAt(Math.floor(Math.random() * 100000000) % dict.length);

      return rs;

    },

    // 生成随机手机号码
    randomPhoneNumber: function () {

      // 第1位是1 第2,3位是3458 第4-7位是* 最后四位随机 this.$options.methods使用上一个函数的返回值
      return [1, this.$options.methods.randomCode(2, '3458'), '****', this.$options.methods.randomCode(4, '0123456789')].join('');
    },
    // 生成随机金额
    randomMoneyNumber: function (num) {

      // 第1位是1 第2,3位是3458 第4-7位是* 最后四位随机 this.$options.methods使用上一个函数的返回值
      return this.$options.methods.randomCode(num, '123456789');
    },
    scroll() {
      this.animate = true;
      var that = this;
      setTimeout(function () {
        that.scroll_lists.push(that.scroll_lists[0]);
        that.scroll_lists.shift();
        that.animate = false;
      }, 3000)
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    document.getElementsByTagName('body')[0].className = 'bgColor';

    this.checkLogin();
    this.productFun();
    this.productListFun(0);

    this.subType();
    let userIntro = JSON.parse(localStorage.getItem('user'));
    if (userIntro.userType === 1) {//普通账户
      this.commonType = true;
      this.buttonName = '认证购买';
      this.bannerCon(2);
      // this.fieldFun();
      // this.fieldSel1();
    }else{
      this.bannerCon(3);
      this.buyIntro(1);
      this.buyIntro(2);
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    document.body.removeAttribute('class')
  }
}
</script>
<style>
.bgColor {
  background: #FFF;
}

.pthz-list .el-image__inner {
  vertical-align: middle;
}
</style>
