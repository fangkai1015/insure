<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="insureNav">
                    <div class="insureNav-title insureNav-order">个人订单</div>
                    <div class="insureNav-list">
                        <ul>
                            <li><router-link to="/order/allOrder" active-class="current">所有订单</router-link></li>
                            <li><router-link to="/order/payOrder" active-class="current">可批量支付订单</router-link></li>
                        </ul>
                    </div>
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
  name: 'Order',
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

