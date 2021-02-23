<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top clearfix">
                    <span class="breadCon">
                        <router-link to="/channel/rate">费率模板</router-link> > {{mbName}}
                    </span>
                    <div class="bread-search">
                        <el-button plain @click="setWeebox = true">批量设置费率</el-button>
                        <el-button plain @click="saveFun">保存</el-button>
                        <el-button plain @click="goBack">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="setRate-tips">模板中的商品包含了您商品库中的所有商品；渠道费率表中可设置您默认上架给下级的商品</div>
            <div class="yj-table setRate-table">
                <table>
                    <thead>
                        <tr>
                            <td>序号</td>
                            <td>产品名称</td>
                            <td>我的费率</td>
                            <td>剩余费率</td>
                            <td>下级费率</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(flItem,index) in flBox" :key="flItem.id">
                            <td>{{index + 1}}</td>
                            <td>{{flItem.proName}}-{{flItem.planName}}</td>
                            <td>{{flItem.myRate}}%</td>
                            <td>{{flItem.remainRate}}%</td>
                            <td>
                                <input type="text" class="setInput" :value="flItem.subRate" :ref="'cInput'+index">  %
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
         </div>
         <!-- 批量设置 -->
        <el-dialog
            title="批量设置"
            :visible.sync="setWeebox"
            width="30%"
            top="20vh"
            center>
            <div class="setBox">
                下级费率 = 我的费率 - <input type="text" class="setInput" v-model="setFl">  %
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setOk">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'SetRate',
  inject:['reload'],
  data () {
    return {
       flBox: [], 
       mbName: '',
       setWeebox: false,
       setFl: '',
    }
  },
  methods: {
      saveFun() {
          let numberReg = /^[0-9]*$/;
          let setList = [];
          for(let [i,data] of new Map( this.flBox.map( ( item, i ) => [ i, item ] ) )){
            　　let setObj = {};
              let inputVal = this.$refs['cInput'+i][0].value;
              if(inputVal === '' || !numberReg.test(inputVal)){
                  this.$message({
                    message: '请输入整数的下级费率',
                    duration: 1000,
                    type: 'error'
                });
                return false;
              }
              if(data.myRate < inputVal){
                  this.$message({
                    message: '设置的下级费率不得大于我的费率',
                    duration: 1000,
                    type: 'error'
                });
                 return false;
              }
              setObj = {
                  'id':data.id,
                  'rate':inputVal
              }
              setList.push(setObj);
            }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/updateUserTemplateProductRate',
                data:{
                    infoList:setList,
                    templateId:this.$route.params.id,
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.reload();
                }else{
                    this.$message({
                    message: res.data.message,
                    duration: 1000,
                    type: 'error'
                    });
                    return;
                }
            })
      },
      setOk() {
          let numberReg = /^[0-9]*$/;
          let setList = [];
          if(this.setFl === '' || !numberReg.test(this.setFl)){
              this.$message({
                message: '请输入整数的下级费率',
                duration: 1000,
                type: 'error'
              });
               return false;
          }
          for(let data of this.flBox){
              let setObj = {};
              if(data.myRate < this.setFl){
                  this.$message({
                    message: '设置的下级费率不得大于我的费率',
                    duration: 1000,
                    type: 'error'
                });
                 return false;
              }
              setObj = {
                  'id':data.id,
                  'rate':data.myRate - this.setFl
              }
              setList.push(setObj);
          }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/updateUserTemplateProductRate',
                data:{
                    infoList:setList,
                    templateId:this.$route.params.id,
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.reload();
                }else{
                    this.$message({
                    message: res.data.message,
                    duration: 1000,
                    type: 'error'
                    });
                    return;
                }
            })
      },
      setFun(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/templateDetail/'+ this.$route.params.id,
                data:{
                    limit:1000,
                    page:index,
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.flBox = res.data.outData.rows;
                    this.mbName = res.data.outData.templateName;
                }else{
                    this.$message({
                    message: res.data.message,
                    duration: 1000,
                    type: 'error'
                    });
                    return;
                }
            })
      },
      goBack() {
          this.$router.go(-1);
      }
  },
  mounted() {
      this.setFun(0);
  }
}
</script>

