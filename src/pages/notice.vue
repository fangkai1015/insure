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
                        <div class="tbxx-top clearfix">
                            <div class="tbxx-name">公告信息</div>
                        </div>
                        <div class="notice-box">
                            <div class="notice-list">
                                <ul>
                                    <li v-for="noticeItem in noticeList" :key="noticeItem.id"><a href="javascript:;" :class="noticeItem.readFlag === 0 ? '' : 'read'" @click="enterDetail(noticeItem.id)">{{noticeItem.title}}</a><span class="notice-date">{{noticeItem.createTimeStr}}</span></li>
                                </ul>
                            </div>
                        </div>
                        <el-pagination
                            hide-on-single-page
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="size"
                            layout="prev, pager, next"
                            :total="totalCount">
                        </el-pagination>
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
  name: 'Notice',
  components:{
        Footer,
        Header
   },
  data () {
    return {
        noticeList:[],
        totalCount:0,
        currentPage:1,
        size:10
    }
  },
  methods: {
      showNotice(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/notice/sysNotice',
                data:{
                    limit:10,
                    page:index
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.noticeList = res.data.outData.rows;
                   this.totalCount = res.data.outData.total;
                }
            })
      },
      enterDetail(id) {
          this.$router.push({path:'/noticeDetail/'+id});
      },
      handleSizeChange(val) {
          this.showNotice(val-1)
      },
      handleCurrentChange(val) {
          this.showNotice(val-1)
      }
  },
  mounted() {
      this.showNotice(0);
  }
}
</script>

