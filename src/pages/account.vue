<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="account-menu">
                    <ul>
                        <li v-if="mainIntro"><router-link to="/account/accountInfo" class="ztxx" active-class="current">主体信息</router-link></li>
                        <li><router-link to="/account/accountSafe" class="zhsz" active-class="current">账号设置</router-link></li>
                        <li><router-link to="/account/contact" class="qxsz" active-class="current">常用联系人</router-link></li>
                    </ul>
                </div>
            </div>

            <router-view></router-view>
        </div>
        <Footer></Footer>
    </section>
</template>

<script>
import Footer from '../components/footer'
import Header from '../components/header'
export default {
  name: 'Account',
  components:{
        Footer,
        Header
   },
  data () {
    return {
        mainIntro: false
    }
  },
  mounted() {
       let userInfo = JSON.parse(localStorage.getItem('user'));
        if(userInfo.userType === 3 || userInfo.userType === 4 || userInfo.userType === 5){//PRO用户
                this.mainIntro = true;
            }
    }
}
</script>

