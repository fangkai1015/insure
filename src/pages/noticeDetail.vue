<template>
    <section class="insure-content">
        <Header></Header>
        <div class="yao-main clearfix">
            <div class="insure-menu">
                <div class="account-menu">
                    <ul>
                        <li><router-link :to="{name:'notice'}" class="notice-icon">公告信息</router-link></li>
                    </ul>
                </div>
            </div>

            <div class="insure-tb">
                <div class="notice-main">
                    <div class="insure-tbxx insureOrder">                        
                        <div class="notice-box">
                            <div class="notice-top clearfix">
                                <div class="notice-title">{{noticeBox.title}}</div>
                                <span class="notice-time">{{noticeBox.createTimeStr}}</span>
                            </div>
                            <div class="noticeDetail-main" v-html="noticeBox.content">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </section>
</template>

<script>
import Footer from '../components/footer'
import Header from '../components/header'
export default {
  name: 'NoticeDetail',
  components:{
        Footer,
        Header
   },
  data () {
    return {
        noticeBox:{}
    }
  },
  methods: {
      noticeCon() {
          let noticeId = this.$route.params.id
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/notice/sysNotice/' + noticeId
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.noticeBox = res.data.outData.notice;
                }
            })
      }
  },
  mounted() {
      this.noticeCon();
  }
}
</script>

