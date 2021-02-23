<template>
    <section class="insure-content">
        <header class="insure-header">
            <div class="header-con clearfix">
                <div class="logo"><router-link :to="{name:'index'}"><img src="../../static/images/logo.png" alt="logo"  class="logo-img"></router-link></div>
                <div class="header-menu">
                    <ul>
                        <li v-for="(name, index) in menuName" :key="index" @click="selectNav(index)"><a href="javascript:;" :class="{active:act==index}">{{name}}</a></li>
                    </ul>
                </div>
                <div class="header-user"  v-if="loginBefore">
                    <router-link :to="{name:'login'}" class="header-login">登录</router-link><span>|</span><router-link :to="{name:'register'}" class="header-res">注册</router-link>
                </div>
                <div class="header-user" v-if="loginAfter">
                    <a href="javascript:;" @click="centerEnter">{{userName}}</a><span>|</span><a href="javascript:;" @click="loginOut">退出</a>
                </div>
            </div>
        </header>
        <div class="insure-main">
            <el-carousel trigger="click" height="500px">
                <el-carousel-item v-for="item in bannerImg" :key="item.bannerId">
                    <div class="banner-img"><a :href="item.turnUrl" :style="{'background': 'url('+item.imgUrl+') no-repeat center center'}" target="_blank"></a></div>
                </el-carousel-item>
            </el-carousel>
            <!-- 平台优势 -->
            <div class="ptys contentItem">
                <div class="index-title">
                    <h3>平台优势</h3>
                    <div class="title-sub">PLATFORM ADVANTAGE</div>
                </div>
                <div class="ptys-box clearfix">
                    <ul>
                        <li>
                            <div class="ptys-img1"></div>
                            <div class="ptys-title">产品全面/种类丰富</div>
                            <div class="ptys-line"></div>
                            <div class="ptys-sum">10+年产品专家特约定制，<br>
                                多款产品获得行业高度认可。</div>
                        </li>
                        <li>
                            <div class="ptys-img2"></div>
                            <div class="ptys-title">专业细致/1V1服务</div>
                            <div class="ptys-line"></div>
                            <div class="ptys-sum">12+年专业服务团队，<br>
                                为行业提供保险科普、保单体检、<br>
                                风险测评、家庭规划等服务。</div>
                        </li>
                        <li class="li-last">
                            <div class="ptys-img3"></div>
                            <div class="ptys-title">极速理赔</div>
                            <div class="ptys-line"></div>
                            <div class="ptys-sum">专业核赔团队倾力打造，<br>
                                一对一专人全程跟进、<br>
                                24小时客服电话400-660-9195。</div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 解决方案 -->
            <div class="jjfa contentItem">
                <div class="index-title">
                    <h3>解决方案</h3>
                    <div class="title-sub">SOLUTIONS</div>
                </div>
                <div class="jjfa-box">
                    <div class="jjfa-tab">
                        <span @click="current = 0" :class="{on:current == 0}">少儿教育行业</span>
                        <span @click="current = 1" :class="{on:current == 1}">体育户外行业</span>
                        <span @click="current = 2" :class="{on:current == 2}">旅游签证行业</span>
                    </div>
                    <div class="jjfa-clumn">
                        <!-- 少儿教育行业 -->
                        <div class="jjfa-intro" v-show="current == 0">
                            <div class="jjfa-top">
                                <div class="jjfaTitle1">Children's Education</div>
                                <div class="jjfaTitle2">少儿教育行业</div>
                            </div>
                            <div class="jjfa-wrap">
                                <div class="jjfaWrap-tips">
                                    围绕少儿教育完整链条，提供满足需求之定制化险种，<br>
并对客户提供追踪服务、协助理赔等优质服务。
                                </div>
                                <div class="jjfaWrap-list clearfix">
                                    <ul>
                                        <li>活动培训</li>
                                        <li>研学</li>
                                        <li>早教机构</li>
                                        <li>托儿所</li>
                                        <li>幼儿园</li>
                                        <li>小学</li>
                                        <li>特长班</li>
                                        <li>少儿活动</li>
                                    </ul>
                                </div>
                                <div class="jjfa-cur">
                                    <span>01</span> | 03
                                </div>
                            </div>
                            <div class="jjfa-banner">
                                <img src="../../static/images/datu.jpg" alt="少儿教育行业" class="datu-img">
                            </div>
                        </div>
                        <!-- 体育户外行业 -->
                        <div class="jjfa-intro"  v-show="current == 1">
                          <div class="jjfa-top">
                            <div class="jjfaTitle1">Sports & Outdoors</div>
                            <div class="jjfaTitle2">体育户外行业</div>
                          </div>
                          <div class="jjfa-wrap">
                            <div class="jjfaWrap-tips">
                              围绕不同体育户外活动类型，<br>根据潜在风险，定制专属保险方案，规避户外体育机构风险，<br>提供专项保险、专属风险顾问、紧急救援服务等。
                            </div>
                            <div class="jjfaWrap-list sport-list clearfix">
                              <ul>
                                <li>户外俱乐部</li>
                                <li>拓展培训机构</li>
                                <li>户外运动社区</li>
                                <li>户外活动平台</li>
                                <li>户外设备提供商</li>
                                <li>体育赛事主办方</li>
                                <li>体育运动协会</li>
                                <li>体育场馆运营机构</li>
                              </ul>
                            </div>
                            <div class="jjfa-cur">
                              <span>02</span> | 03
                            </div>
                          </div>
                          <div class="jjfa-banner">
                            <img src="../../static/images/tyhw.jpg" alt="体育户外行业" class="datu-img">
                          </div>
                        </div>
                        <!-- 旅游签证行业 -->
                        <div class="jjfa-intro" v-show="current == 2">
                            <div class="jjfa-top">
                                <div class="jjfaTitle1">Travel & Visa</div>
                                <div class="jjfaTitle2">旅游签证行业</div>
                            </div>
                            <div class="jjfa-wrap">
                                <div class="jjfaWrap-tips">
                                    围绕旅行前、中、后的完整行程，<br>为大家提供不同旅游场景的定制险种，<br>并针对性的提供旅行风险控制服务及系统支撑解决方案。
                                </div>
                                <div class="jjfaWrap-list travel-list clearfix">
                                    <ul>
                                        <li>领队</li>
                                        <li>旅行社</li>
                                        <li>签证机构</li>
                                        <li>旅游服务机构</li>
                                        <li>票务代理机构</li>
                                        <li>商旅服务平台</li>
                                        <li>游学/留学机构</li>
                                        <li>出国中介</li>
                                        <li>旅游俱乐部</li>
                                        <li style="width: 50%;">旅游业SASS服务商</li>
                                    </ul>
                                </div>
                                <div class="jjfa-cur">
                                    <span>03</span> | 03
                                </div>
                            </div>
                            <div class="jjfa-banner">
                                <img src="../../static/images/lvqz.jpg" alt="旅游签证行业" class="datu-img">
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- 合作平台 -->
            <div class="pthz contentItem">
                <div class="index-title">
                    <h3>合作保险公司</h3>
                    <div class="title-sub">COLLABORATION INSURANCE COMPANISE</div>
                </div>
                <div class="pthz-main">
                    <div class="pthz-tips">
                        多家合作保险公司，专业化定制保险产品。<br>
专业用心的服务团队，精挑细选的产品方案，经验丰富的理赔协助。<br>助您明明白白省钱买保险。
                    </div>
                    <div class="pthz-list clearfix">
                      <ul>
                        <li v-for="(url, index) in imgUrl" :key="index">
                          <el-image :src="url" lazy></el-image>
                        </li>
                      </ul>
                    </div>
                </div>
            </div>
            <!-- 关于我们 -->
            <div class="about-us contentItem">
                <div class="index-title">
                    <h3>关于我们</h3>
                    <div class="title-sub">ABOUT US</div>
                </div>
                <div class="about-tips">
                    广州问鼎保险经纪旗下品牌耀保网，<br>
是一家专注为企业定制行业风险管理解决方案的互联网保险服务平台。<br>
拥有10+年风险管理经验，通过提供全险种产品和配套服务，<br>
为各细分行业提供风险评估、保险咨询、在线投保、紧急救援、理赔协助等一站式风险管理定制服务。<br>
助力企业全面提升行业风险管控能力，为企业持续健康发展保驾护航。
                </div>
                <div class="res-btn"><router-link :to="{name:'register'}">注册</router-link></div>
                <div class="about-data clearfix">
                    <div class="aboutData-con">
                        <div class="aboutData-t1"><span>10</span>年</div>
                        <div class="aboutData-txt">风险管理经验</div>
                    </div>
                    <div class="aboutData-con">
                        <div class="aboutData-t1"><span>12</span>年</div>
                        <div class="aboutData-txt">专业服务团队</div>
                    </div>
                    <div class="aboutData-con">
                        <div class="aboutData-t1"><span>365</span>天</div>
                        <div class="aboutData-txt">一对一专人跟进服务</div>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </section>
</template>

<script>
import Footer from '../components/footer'
import Vue from 'vue'
import { Image,Carousel,CarouselItem } from 'element-ui';
Vue.use(Image)
Vue.use(Carousel)
Vue.use(CarouselItem)
export default {
  name: 'index',
  components:{
        Footer
   },
  data () {
    return {
        current:0,
        act:0,
        bannerImg:[],
        imgUrl:[
            '../../static/images/comp-01.png',
            '../../static/images/comp-02.png',
            '../../static/images/comp-03.png',
            '../../static/images/comp-04.png',
            '../../static/images/comp-05.png',
            '../../static/images/comp-06.png',
            '../../static/images/comp-07.png',
            '../../static/images/comp-08.png'
        ],
        menuName:['首页','平台优势','解决方案','合作平台','关于我们'],
        userName: '',
        loginBefore: false,
        loginAfter: false
    }
  },
  methods: {
      selectNav(index){
          this.act = index;
          var arrDom = document.getElementsByClassName("contentItem");
          if(index == 0){
              document.documentElement.scrollTop = arrDom[0].offsetTop;
              document.body.scrollTop = arrDom[0].offsetTop;
          }else{
              var arrDom = document.getElementsByClassName("contentItem");
              document.documentElement.scrollTop = arrDom[index-1].offsetTop;
              document.body.scrollTop = arrDom[index-1].offsetTop;
          }
      },
      //页面滚动触发的方法
    handleScroll () {
      // windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      // scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      var arrDom = document.getElementsByClassName("contentItem");
       for (var i = 0; i < arrDom.length; i++) {
           if(arrDom[0].offsetTop-scrollTop > 0){
               this.act = 0;
           }
           //因为下面使用到了i+1，所以需要把最后一个分离出来判断,还有最后一个内容量小，滚动条到底部
           if( arrDom[arrDom.length-1].offsetTop-scrollTop <=0 ||  scrollTop+windowHeight==scrollHeight){
              this.act = arrDom.length;
           }else{
              if(arrDom[i].offsetTop-scrollTop<=0 && arrDom[i+1].offsetTop-scrollTop>0){
                this.act = i+1;
             }
           }
       }
    },
    bannerCon() {
        this.$ajax({
                method:'get',
                url:'/insurance/api/common/indexBanner/1'
            })
            .then((res)=>{
                if(res.data.code === 1){
                    let bannerIntro = res.data.outData.banners;
                    this.bannerImg = bannerIntro;
                }
            })
    },
    loginOut() {
        let loadingInstance = this.$loading();
        this.$ajax({
            method:'post',
            url:'/insurance/api/user/logout'
        })
        .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
                localStorage.removeItem('user');
                this.$router.push('/login');
            }
        })
    },
    checkLogin() {
        this.$ajax({
            method:'post',
            url:'/insurance/api/user/checkLogin'
        })
        .then((res)=>{
            if(res.data.code === -1){//未登录
                this.loginBefore = true;
            }
            if(res.data.code === 1){//已登录
             let userIntro = JSON.parse(localStorage.getItem('user'));
                this.loginAfter = true;
                this.userName = userIntro.name || userIntro.mobile;
            }
        })
    },
    centerEnter() {
        let userInfo = JSON.parse(localStorage.getItem('user'));
        if(userInfo){
            if(userInfo.userType === 3 || userInfo.userType === 4 || userInfo.userType === 5){//PRO用户
                this.$router.push('/insure');
            }
            if(userInfo.userType === 1 || userInfo.userType === 2){//普通用户、plus用户
                this.$router.push('/user');
            }
        }
    }
  },
mounted () {
    window.addEventListener('scroll', this.handleScroll);
    document.getElementsByTagName('body')[0].className = 'bgColor';
    this.bannerCon();
    this.checkLogin();
},
destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
    document.body.removeAttribute('class')
}
}
</script>
<style>
    .bgColor{
        background: #FFF;
    }
    .pthz-list .el-image__inner{
        vertical-align: middle;
    }
</style>
