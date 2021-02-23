<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="insureNav">
                    <div class="insureNav-title insureNav-goods">商品管理</div>
                    <div class="insureNav-list">
                        <ul>
                            <li><router-link to="/goods/myGoods" active-class="current">我的商品</router-link></li>
                            <li><router-link to="/goods/goodsList" active-class="current">商品库</router-link></li>
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
  name: 'Goods',
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

