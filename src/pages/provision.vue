<template>
    <section class="provision-main">
        <h3 class="provision-title">
            {{produceName}}
        </h3>
        <div class="provision-box">
            <div class="provisionName">主条款</div>
            <div class="provisionList">
                <ul>
                    <li v-for="mainItem in mainClausesList" :key="mainItem.id">
                        <div class="prosubName fl">{{mainItem.docName}}</div>
                        <div class="proUpload fr">
                            <el-button class="lookBtn" plain><a :href="server + mainItem.docLink" target="_blank">查看</a></el-button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="provision-box">
            <div class="provisionName">附加条款</div>
            <div class="provisionList">
                <ul>
                    <li v-for="addItem in additionClausesList" :key="addItem.id">
                        <div class="prosubName fl">{{addItem.docName}}</div>
                        <div class="proUpload fr">
                            <el-button class="lookBtn" plain><a :href="server + addItem.docLink" target="_blank">查看</a></el-button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  name: 'Provision',
  data () {
    return {
        additionClausesList:[],
        mainClausesList:[],
        server:'',
        produceName:''
    }
  },
  methods: {
      provisionFun() {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/product/productClauses/' + this.$route.params.id
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.additionClausesList = res.data.outData.additionClausesList;
                    this.mainClausesList = res.data.outData.mainClausesList;
                    this.server = res.data.outData.productFileServer;
                    this.produceName = res.data.outData.product.name;
                }else{
                    this.$message({
                    message: res.data.message,
                    duration: 1000,
                    type: 'error'
                    });
                    return;
                }
            })
      }
  },
  mounted() {
      this.provisionFun();
  }
}
</script>

