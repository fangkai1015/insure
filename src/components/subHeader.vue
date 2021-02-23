<template>
    <header class="insure-header">
        <div class="header-con clearfix">
            <div class="logo"><router-link :to="{name:'insure'}"><img src="../../static/images/logo.png" alt="logo"  class="logo-img"></router-link></div>
            <div class="header-user">
                <a href="javascript:;" class="header-return"><router-link :to="{name:'index'}">返回首页</router-link></a>
            </div>
        </div>
    </header>
</template>

<script>

export default {
  name: 'SubHeader',
  data () {
    return {
    }
  }
}
</script>

