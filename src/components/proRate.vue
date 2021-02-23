<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top clearfix">
                    <span class="breadCon">
                        <router-link to="/channel/channelApply">Pro账户</router-link> > 设置费率_{{zhName}}
                    </span>
                    <div class="bread-search">
                        <el-select v-model="flName" placeholder="请选择">
                            <el-option
                            v-for="item in flNames"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <div class="channel-input"><el-input v-model="searchName" placeholder="输入产品名称搜索"></el-input></div>
                    <el-button type="primary" @click="searchGo">查询</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="bmRate-top clearfix">
                <div class="bmRate-def">基础费率模板：{{bmName}}<i class="mb-edit" @click="xzmb = true"></i></div>
                <el-button plain class="addGoods" @click="addShop(0)">新增商品</el-button>
            </div>
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
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
                        <tr v-for="(flItem,index) in flInfo" :key="flItem.id">
                            <td>{{index + 1}}</td>
                            <td>{{flItem.proName}}-{{flItem.planName}}</td>
                            <td>{{flItem.insurerName}}</td>
                            <td :class="{'red':flItem.rateType === 1}">{{flItem.subRate}}%</td>
                            <td :class="{'red':flItem.rateType === 1}">{{flItem.remainRate}}%</td>
                            <td>
                                <span class="childRate" :ref="'cTxt'+index" :class="{'red':flItem.rateType === 1}">{{flItem.myRate}}%</span>
                                <input type="text" class="childInput" :value="flItem.myRate" :ref="'cInput'+index">
                            </td>
                            <td class="channel-action">
                                <a href="javascript:;" @click="updateFun(index)" :ref="'act1'+index">修改</a>
                                <a href="javascript:;" :ref="'act2'+index" @click="delFun(flItem.id)">移除</a>
                                <a href="javascript:;" class="updateShow" :ref="'upTxt1'+index" @click="saveFun(flItem.id,flItem.planId,flItem.proId,flItem.subRate,flItem.remainRate,index)">保存</a>
                                <a href="javascript:;" class="updateShow" :ref="'upTxt2'+index" @click="comfireFun(index)">取消</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bmTips">说明：“<span class="red">红色</span>”标记为独立费率值（即非模板费率），在费率模板中修改费率不影响独立费率</div>
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
         <!-- 选择模板 -->
        <el-dialog
            title="选择模板"
            :visible.sync="xzmb"
            width="40%"
            top="20vh"
            center>
            <div class="xzmb-con">
               <div class="xzmb-check" v-for="mbCheck in channelNames" :key="mbCheck.id"><el-radio v-model="mb" :label="mbCheck.id">{{mbCheck.templateName}}</el-radio></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeMb">提交</el-button>
            </span>
        </el-dialog>

        <!-- 新增商品 -->
        <el-dialog
            title="新增商品"
            :visible.sync="addWeebox"
            width="60%"
            top="10vh"
            center>
            <div class="addGoods-box">
                <div class="addGoods-top clearfix">
                    未添加商品
                    <div class="addGoods-sea">
                        <div class="channel-input"><el-input v-model="searchGood" placeholder="输入商品名称搜索"></el-input></div>
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
  name: 'BmRate',
  inject:['reload'],
  data () {
    return {
        flName: '',
        flNames: [
            {
                value: '',
                label: '模板/单独费率'
            },
            {
                value: '2',
                label: '模板费率'
            },
            {
                value: '1',
                label: '独立费率'
            }
        ],
        searchName: '',
        searchGood: '',
        xzmb: false,
        addWeebox: false,
        mb: '',
        allchecked: false,
        checked: [],
        zhName: '',
        bmName: '',
        channelNames: [],
        flInfo: [],
        totalCount:0,
        currentPage:1,
        size:10,
        addShops: [],
        checkCount:0,
    }
  },
  methods: {
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
      cxGood() {
          this.addShop(0);
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
                      'proId': this.addShops[i].proId,
                      'rate': this.addShops[i].myRate
                  }
                  addArry.push(addObj);
              }
          })
          let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/userRate/addOrUpdateUserRate',
                data: {
                    optUserId:this.$route.params.id,
                    rateInfoDTOList:addArry
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
      bmFun(index) {
         let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userRate/showUserRateInfo/' + this.$route.params.id,
                data:{
                    limit:10,
                    page:index,
                    proName:this.searchName,
                    rateType:this.flName
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.zhName = res.data.outData.subUserName;
                   this.bmName = res.data.outData.refTemplateName || '未设置';
                   this.mb = res.data.outData.refTemplateId || '';
                   this.flInfo = res.data.outData.rows;
                   this.totalCount = res.data.outData.total;
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
                url:'/insurance/api/userRate/userRateUnSetProList/' + this.$route.params.id,
                data:{
                    limit:1000,
                    page:index,
                    proName:this.searchGood
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
      },
      mbList() {
         let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userRate/userTemplateList'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.channelNames = res.data.outData.data;
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
      handleSizeChange(val) {
          this.bmFun(val-1)
      },
      handleCurrentChange(val) {
          this.bmFun(val-1)
      },
      searchGo() {
          this.currentPage = 1;
          this.bmFun(0);
      },
      changeMb() {
          this.xzmb = false;
          this.$confirm('修改模板后，所有商品将变更为模板费率，是否确认修改？', '修改模板', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
            method:'post',
            url:'/insurance/api/userRate/referenceUserTemplate/' + this.$route.params.id + '/' + this.mb
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.reload();
                }
            })
          }).catch(() => {
          });
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
      saveFun(id,planId,proId,subRate,remainRate,index) {
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
          if(subRate < rateVal){
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
                    url:'/insurance/api/userRate/addOrUpdateUserRate',
                    data: {
                        optUserId:this.$route.params.id,
                        rateInfoDTOList:[{
                            'planId':planId,
                            'proId':proId,
                            'rateId':id,
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
                url:'/insurance/api/userRate/delUserRate/'+id
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
      }
  },
  mounted() {
      this.bmFun(0);
      this.mbList();
  }
}
</script>

