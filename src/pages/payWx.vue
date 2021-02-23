<template>
    <section class="insure-content">
        <Header></Header>
        <div class="insure-subMain">
            <div class="subMain">
                <div class="payWx-money">微信支付：<span class="wx-count"><span class="wxMoney">1.2</span>元</span></div>
                <div class="wxPay-act clearfix">
                    <div class="wxPay-ewm">
                        <img src="https://payment.huize.com/v2/wechat_pay?trade_no=H0722011200000003556" class="pay-ewm">
                        <div class="wxPay-txt">微信扫码支付</div>
                    </div>
                    <div class="wxPay-layer"></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Header from '../components/header'
export default {
  name: 'PayWx',
  components:{
        Header
   },
  data () {
    return {
        
    }
  }
}
</script>

