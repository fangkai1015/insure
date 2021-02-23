<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="account-menu">
                    <ul>
                        <li><router-link to="/finance/income" class="srgl" active-class="current">收入管理</router-link></li>
                        <li><router-link to="/finance/balance" class="yegl" active-class="current">余额管理</router-link></li>
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
  name: 'Finance',
  components:{
        Footer,
        Header
   },
  data () {
    return {
    }
  }
}
</script>

