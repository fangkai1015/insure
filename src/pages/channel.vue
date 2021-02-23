<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="insureNav">
                    <div class="insureNav-title insureNav-up insureNav-branch" :class="{'insureNav-down':!downOk1}" @click="subTab(1)">账号管理</div>
                    <div class="insureNav-list" v-show="downOk1">
                        <ul>
                            <li><router-link to="/channel/channelAccount" active-class="current">部门账号</router-link></li>
                            <li><router-link to="/channel/channelApply" active-class="current">Pro账号</router-link></li>
                        </ul>
                    </div>
                </div>
                <div class="insureNav">
                    <div class="insureNav-title insureNav-up insureNav-qd" :class="{'insureNav-down':!downOk2}" @click="subTab(2)">账单管理</div>
                    <div class="insureNav-list"  v-show="downOk2">
                        <ul>
                            <li><router-link to="/channel/channelBill" active-class="current">部门账单</router-link></li>
                            <li><router-link to="/channel/channelBilldetail" active-class="current">账单明细</router-link></li>
                        </ul>
                    </div>
                </div>
                <div class="insureNav">
                    <div class="insureNav-title insureNav-fl"><router-link to="/channel/rate" active-class="current">费率模板</router-link></div>
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
  name: 'Channel',
  components:{
        Footer,
        Header
   },
  data () {
    return {
        downOk1: true,
        downOk2: true
    }
  },
  methods: {
      subTab(index) {
          if(this['downOk' + index]){
              this['downOk' + index] = false
          }else{
              this['downOk' + index] = true
          }               
    }
  }
}
</script>

