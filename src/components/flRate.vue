<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top clearfix">
                    <span class="breadCon">
                        <router-link to="/channel/rate">费率模板</router-link> > 设置费率_{{mbName}}
                    </span>
                    <div class="bread-search">
                        <div class="channel-input"><el-input v-model="searchName" placeholder="输入产品名称搜索"></el-input></div>
                        <el-button type="primary" @click="searchIntro">查询</el-button>
                        <el-button plain @click="addShop(0)">新增商品</el-button>
                        <el-button plain @click="allSet">批量设置</el-button>
                        <el-button plain @click="allDel">批量删除</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td width="5%"><el-checkbox v-model="goodschecked" @change="listAllCheck"></el-checkbox></td>
                            <td>序号</td>
                            <td>产品名称</td>
                            <td>保险公司</td>
                            <td>我的费率</td>
                            <td>剩余费率</td>
                            <td>下级费率</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(flItem,index) in flBox" :key="flItem.id">
                            <td><el-checkbox v-model="onechecked[index]" @change="listOneCheck"></el-checkbox></td>
                            <td>{{index + 1}}</td>
                            <td>{{flItem.proName}}-{{flItem.planName}}</td>
                            <td>{{flItem.insurerName}}</td>
                            <td>{{flItem.myRate}}%</td>
                            <td>{{flItem.remainRate}}%</td>
                            <td>
                                <span class="childRate" :ref="'cTxt'+index">{{flItem.subRate}}%</span>
                                <input type="text" class="childInput" :value="flItem.subRate" :ref="'cInput'+index">
                            </td>
                            <td class="channel-action">
                                <a href="javascript:;" @click="updateFun(index)" :ref="'act1'+index">修改</a>
                                <a href="javascript:;" :ref="'act2'+index" @click="delFun(flItem.id)">移除</a>
                                <a href="javascript:;" class="updateShow" :ref="'upTxt1'+index" @click="saveFun(flItem.id,flItem.planId,flItem.proId,flItem.myRate,flItem.remainRate,index)">保存</a>
                                <a href="javascript:;" class="updateShow" :ref="'upTxt2'+index" @click="comfireFun(index)">取消</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
         </div>
        <!-- 新增商品 -->
        <el-dialog
            title="新增商品"
            :visible.sync="addWeebox"
            width="60%"
            top="10vh"
            center>
            <div class="addGoods-box">
                <div class="addGoods-top clearfix">
                    全部商品
                    <div class="addGoods-sea">
                        <div class="channel-input"><el-input v-model="searchShop" placeholder="输入商品名称搜索"></el-input></div>
                        <el-button type="primary" @click="cxGood">查询</el-button>
                    </div>
                </div>
                <div class="addGoods-list">
                    <div class="yj-table">
                        <table>
                            <thead>
                                <tr>
                                    <td width="10%"><el-checkbox v-model="allchecked" @change="allCheck"></el-checkbox></td>
                                    <td width="30%">产品名称</td>
                                    <td>保险公司</td>
                                    <td>基础价格</td>
                                    <td>返点</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(shops,index) in addShops" :key="index">
                                    <td><el-checkbox v-model="checked[index]" @change="listCheck"></el-checkbox></td>
                                    <td>{{shops.proName}}-{{shops.planName}}</td>
                                    <td>{{shops.insurerName}}</td>
                                    <td>￥{{shops.price}}</td>
                                    <td>{{shops.myRate}}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addAction">确认</el-button>
                <el-button @click="addWeebox = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'FlRate',
  inject:['reload'],
  data () {
    return {
        mbName:'',
        searchName: '',
        searchShop:'',
        addWeebox: false,
        goodschecked: false,
        onechecked: [],
        allchecked: false,
        checked: [],
        flBox:[],
        checkCount:0,
        addShops:[],
        listCount:0,
    }
  },
  methods: {
      allSet() {
          this.$router.push({
            name: 'setRate',
            params:{
                id:this.$route.params.id
            }
          })
      },
      addAction() {
          if(this.checkCount === 0){
              this.$message({
                message: '没有选择任何商品',
                duration: 1000,
                type: 'error'
                });
              return;
          }
          let addArry = [];
          this.checked.map((data,i) => {
              let addObj = {};
              if(data){
                  addObj = {
                      'planId': this.addShops[i].planId,
                      'proId': this.addShops[i].proId
                  }
                  addArry.push(addObj);
              }
          })
          let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/addUserTemplateProduct',
                data: {
                    templateId:this.$route.params.id,
                    infoList:addArry
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
      cxGood() {
          this.addShop(0);
      },
      listAllCheck(val) {
          if(val){//全选
            this.flBox.map((data,i) => {
                this.onechecked[i] = true;
            })
            this.listCount = this.flBox.length;
          }else{
             this.flBox.map((data,i) => {
                this.onechecked[i] = false;
            }) 
            this.listCount = 0;
          }
      },
      listOneCheck(val) {
          if(!val){//取消
            this.goodschecked = false;
            this.listCount--;
          }else{
            this.listCount++;
            if(this.listCount == this.flBox.length){
                this.goodschecked = true;
            }
          }
      },
      allDel() {
          if(this.listCount === 0){
              this.$message({
                message: '没有选择任何商品',
                duration: 1000,
                type: 'error'
                });
              return;
          }
          let addArry = [];
          this.onechecked.map((data,i) => {
              let addObj = {};
              if(data){
                  addObj = {
                      'id': this.flBox[i].id
                  }
                  addArry.push(addObj);
              }
          })
          let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/delTemplateDetail',
                data: {
                    templateId:this.$route.params.id,
                    infoList:addArry
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
      allCheck(val) {
          if(val){//全选
            this.addShops.map((data,i) => {
                this.checked[i] = true;
            })
            this.checkCount = this.addShops.length;
          }else{
             this.addShops.map((data,i) => {
                this.checked[i] = false;
            }) 
            this.checkCount = 0;
          }
      },
      listCheck(val) {
          if(!val){//取消
            this.allchecked = false;
            this.checkCount--;
          }else{
            this.checkCount++;
            if(this.checkCount == this.addShops.length){
                this.allchecked = true;
            }
          }
      },
      flFun(index) {
         let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/templateDetail/'+ this.$route.params.id,
                data:{
                    limit:1000,
                    page:index,
                    proName:this.searchName
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
      searchIntro() {
         this.flFun(0); 
      },
      updateFun(index) {
          this.$refs['cTxt'+index][0].style.display = 'none';
          this.$refs['cInput'+index][0].style.display = 'inline-block';
          this.$refs['act1'+index][0].style.display = 'none';
          this.$refs['act2'+index][0].style.display = 'none';
          this.$refs['upTxt1'+index][0].style.display = 'inline-block';
          this.$refs['upTxt2'+index][0].style.display = 'inline-block';
      },
      comfireFun(index) {
          this.$refs['cTxt'+index][0].style.display = 'inline-block';
          this.$refs['cInput'+index][0].style.display = 'none';
          this.$refs['act1'+index][0].style.display = 'inline-block';
          this.$refs['act2'+index][0].style.display = 'inline-block';
          this.$refs['upTxt1'+index][0].style.display = 'none';
          this.$refs['upTxt2'+index][0].style.display = 'none';
      },
      saveFun(id,planId,proId,myRate,remainRate,index) {
          let numberReg = /^[0-9]*$/,
          rateVal = this.$refs['cInput'+index][0].value;
          if(rateVal === '' || !numberReg.test(rateVal)){
              this.$message({
                message: '请输入整数费率',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(myRate < rateVal){
              this.$message({
                message: '下级费率不能超过当前费率',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          this.$confirm('保存后费率调整立即生效，是否确认提交当前修改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
                    method:'post',
                    url:'/insurance/api/userTemplate/updateUserTemplateProductRate',
                    data: {
                        templateId:this.$route.params.id,
                        infoList:[{
                            'id':id,
                            'rate':rateVal
                        }]
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
          }).catch(() => {
          });
      },
      delFun(id) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/delTemplateDetail',
                data: {
                    templateId:this.$route.params.id,
                    infoList:[{
                        'id':id
                    }]
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
       addShop(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/addNewTempalteProductList',
                data:{
                    limit:1000,
                    page:index,
                    proName:this.searchShop,
                    templateId:this.$route.params.id
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.addShops = res.data.outData.rows;
                   this.addWeebox = true;
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
      this.flFun(0);
  }
}
</script>

