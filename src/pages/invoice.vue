<template>
    <section class="insure-content">
        <SubHeader></SubHeader>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="account-menu">
                    <ul>
                        <li><router-link to="/invoice/bill" class="kjfp" active-class="current">开具发票</router-link></li>
                        <li><router-link to="/invoice/history" class="kjls" active-class="current">开具历史</router-link></li>
                    </ul>
                </div>
            </div>
            <router-view></router-view>
        </div>
        <Footer></Footer>
    </section>
</template>

<script>
import SubHeader from '../components/subHeader'
import Footer from '../components/footer'
export default {
  name: 'Invoice',
   components:{
        SubHeader,
        Footer
   },
  data () {
    return {
    }
  }
}
</script>

