<template>    
    <div class="insure-tb">
        <!-- 主体信息 -->
        <div class="ztxx-main">
            <div class="insure-tbxx insureOrder">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">账户状态</div>
                </div>
                <div class="zh-status clearfix">
                    <div class="rz-icon" :class="{'rz-no':userInfo.auditStatus === 2 || userInfo.auditStatus === 0}"></div>
                    <div class="rz-intro">
                        <div class="rz-name">{{userInfo.auditStatus === 1 || userInfo.auditStatus === 3 ? '已认证' : '未认证'}}</div>
                        <div class="rz-tips">认证后在线不可更改主体信息及财务信息，如需修改请联系客服</div>
                    </div>
                </div>
            </div>

            <div class="insure-tbxx">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">帐户基本信息</div>
                    <!-- <div class="tbxx-bill">
                        <i class="ok-icon"></i>
                        <span class="ok-txt">已完成</span>
                    </div> -->
                </div>
                <div class="ztxx-item">
                    <ul>
                        <li><span class="ztxx-label">主体类型：</span>{{userInfo.bodyType === '1' ? '个人' : '公司'}}</li>
                        <li><span class="ztxx-label">行业：</span>{{userInfo.industry}}</li>
                    </ul>
                </div>
            </div>

            <div class="insure-tbxx">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">{{userInfo.bodyType === '1' ? '个人' : '公司'}}信息</div>
                    <!-- <div class="tbxx-bill">
                        <i class="ok-icon no-icon"></i>
                        <span class="ok-txt">未完成</span>
                    </div> -->
                </div>
                <div class="ztxx-item" v-if="userInfo.auditStatus === 1 || userInfo.auditStatus === 3 || userInfo.baseInfoFlag">
                    <ul>
                        <li><span class="ztxx-label">{{userInfo.bodyType === '1' ? '姓名' : '企业名称'}}：</span>{{userInfo.name}}</li>
                        <li><span class="ztxx-label">{{userInfo.bodyType === '1' ? '个人身份证' : '企业营业执照'}}：</span>{{userInfo.authPicUrl ? '已上传' : '未上传'}}</li>
                        <li><span class="ztxx-label">服务费发票类型：</span>
                            <template v-if="userInfo.invoiceType === 1">电子发票</template>
                            <template v-if="userInfo.invoiceType === 2">增值税专用发票</template>
                            <template v-if="userInfo.invoiceType === 3">普通发票</template>
                        </li>
                        <li><span class="ztxx-label">发票税点：</span>{{userInfo.invoiceRate}}%</li>
                        <li><span class="ztxx-label">所属城市：</span>{{userInfo.areaInfo}}</li>
                        <li><span class="ztxx-label">详细地址：</span>{{userInfo.address}}</li>
                        <li><span class="ztxx-label">联系电话：</span>{{userInfo.tel}}</li>
                    </ul>
                </div>
                <div class="ztxx-button" v-else>
                    <el-button @click="baseIntroShow = true">填写{{userInfo.bodyType === '1' ? '个人' : '企业'}}信息</el-button>
                </div>
            </div>

            <div class="insure-tbxx">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">财务信息</div>
                    <!-- <div class="tbxx-bill">
                        <i class="ok-icon"></i>
                        <span class="ok-txt">已完成</span>
                    </div> -->
                </div>
                <div class="ztxx-item" v-if="userInfo.auditStatus === 1 || userInfo.auditStatus === 3 || userInfo.financeInfoFlag">
                    <ul>
                        <li><span class="ztxx-label">账号名称：</span>{{userInfo.bankAccount}}</li>
                        <li><span class="ztxx-label">开户银行：</span>{{userInfo.bankName}}</li>
                        <li><span class="ztxx-label">开户分行：</span>{{userInfo.bankAddress}}</li>
                        <li><span class="ztxx-label">银行卡号：</span>{{userInfo.bankNum}}</li>
                    </ul>
                </div>
                <div class="ztxx-button" v-else>
                    <el-button @click="cwShow = true">填写财务信息</el-button>
                </div>
            </div>
        </div>
        <!-- 个人企业信息 -->
        <el-dialog
            :title="userInfo.bodyType === '1' ? '个人信息' : '公司信息'"
            :visible.sync="baseIntroShow"
            width="40%"
            top="10vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="baseIntro" label-width="80px">
                    <el-form-item :label="userInfo.bodyType === '1' ? '姓名' : '企业名称'">
                        <el-input v-model="baseIntro.name" :placeholder="'请输入'+ (userInfo.bodyType === '1' ? '姓名' : '企业名称')"></el-input>
                    </el-form-item>
                    <el-form-item label="发票类型">
                        <el-select v-model="fpType" placeholder="请选择">
                            <el-option
                            v-for="item in fpTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发票税点">
                        <el-input v-model="baseIntro.shui" placeholder="请输入发票税点" type="number">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="所在城市">
                        <el-select v-model="province" placeholder="省份" @change="provinceSel" style="width:50%">
                            <el-option
                            v-for="item in provinces"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="city" placeholder="城市" style="width:48%">
                                <el-option
                                v-for="item in citys"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入详细地址"
                            v-model="baseIntro.address">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="baseIntro.telephone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                </el-form>
                <div class="renz-tips">
                    {{userInfo.bodyType === '1' ? '上传身份证' : '上传营业执照'}}
                </div>
                <div class="renz-upload">
                    <div class="upload-intro">
                        <div class="uploadTxt">
                            点击选择图片<br>(需小于10M)
                        </div>
                        <img :src="imgSrc" class="uploadImg" v-if="imgShow">
                        <input type="file" name="file" id="file" class="uploadFile" accept="image/*" @change="uploadImg">
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="baseSubmit">提交</el-button>
            </span>
        </el-dialog>

        <!-- 财务信息 -->
        <el-dialog
            title="财务信息"
            :visible.sync="cwShow"
            width="40%"
            top="10vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="cwIntro" label-width="80px">
                    <el-form-item label="账户名称">
                        <el-input v-model="cwIntro.name" placeholder="请输入账户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行">
                        <el-input v-model="cwIntro.bank" placeholder="请输入开户银行"></el-input>
                    </el-form-item>  
                    <el-form-item label="开户支行">
                        <el-input v-model="cwIntro.subBank" placeholder="请输入开户支行"></el-input>
                    </el-form-item>    
                    <el-form-item label="银行卡号">
                        <el-input v-model="cwIntro.bankNumber" placeholder="请输入银行卡号"></el-input>
                    </el-form-item>                
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cwSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'AccountInfo',
  inject:['reload'],
  data () {
    return {
        cwShow:false,
        userInfo:{},
        baseIntroShow:false,
        cwIntro:{
            name:'',//账号名称
            bank:'',//开户银行
            subBank:'',//开户支行
            bankNumber:''//银行卡号
        },
        baseIntro:{
            name:'',//个人企业名称
            shui:'',//发票税点
            address:'',//详细地址
            telephone:''//联系电话
        },
        imgShow:false,
        imgSrc:'',//上传图片
        fpType:'',
        fpTypes:[{
            value: '1',
            label: '电子发票'
        },
        {
            value: '2',
            label: '增值税专用发票'
        },
        {
            value: '3',
            label: '普通发票'
        }],
        province:'',
        provinces:[],
        city:'',
        citys:[],
        fileName:''
    }
  },
  methods: {
      cwSubmit() {
          if(this.cwIntro.name === ''){
              this.$message({
                message: '请输入账户名称',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.cwIntro.bank === ''){
              this.$message({
                message: '请输入开户银行',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.cwIntro.subBank === ''){
              this.$message({
                message: '请输入开户分行',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.cwIntro.bankNumber === ''){
              this.$message({
                message: '请输入银行卡号',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/userAuditInfoUpdate',
                data:{
                   updateAuditType:3,
                   bankType:1,
                   bankAccount:this.cwIntro.name,
                   bankName:this.cwIntro.bank,
                   bankAddress:this.cwIntro.subBank,
                   bankNum:this.cwIntro.bankNumber
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
      baseSubmit() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/,
          zuoReg = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
          if(this.baseIntro.name === ''){
              let msgName  = this.userInfo.bodyType === '1' ? '请输入姓名' : '请输入企业名称';
              this.$message({
                message: msgName,
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.fpType === ''){
              this.$message({
                message: '请选择发票类型',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.baseIntro.shui === ''){
              this.$message({
                message: '请输入发票税点',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.province === '' || this.city === ''){
              this.$message({
                message: '请选择所在城市',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.baseIntro.address === ''){
              this.$message({
                message: '请输入详细地址',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(!phoneReg.test(this.baseIntro.telephone) && !zuoReg.test(this.baseIntro.telephone)){
              this.$message({
                message: '请输入正确格式的联系电话',
                duration: 1000,
                type: 'error'
                });
                return;
          }
          if(this.imgSrc === ''){
              let msgName  = this.userInfo.bodyType === '1' ? '请上传身份证' : '请上传企业营业执照';
              this.$message({
                message: msgName,
                duration: 1000,
                type: 'error'
                });
                return;
          }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/userAuditInfoUpdate',
                data:{
                   updateAuditType:2,
                   name:this.baseIntro.name,
                   invoiceType:this.fpType,
                   invoiceRate:this.baseIntro.shui,
                   province:this.province,
                   city:this.city,
                   address:this.baseIntro.address,
                   tel:this.baseIntro.telephone,
                   authPicUrl:this.fileName
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
      userFun() {
          let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/user/userAuditInfo'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.userInfo = res.data.outData.userInfo;
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
      provinceFun() {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/insArea/loadProvinceInfo'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.provinces = res.data.outData.data;
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
      provinceSel(val) {
          this.city = '';
          this.provinces.map((data,i) => {
              if(data.value === val){
                  this.provinceTxt = data.name;
              }
          });
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/insArea/loadCityListByProvinceCode',
                params:{
                    insProvince:val
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.citys = res.data.outData.data;
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
      uploadImg() {
          let fileVal = document.querySelector("#file").files[0];
        // 此时可以自行将文件上传至服务器
		let fileFormData = new FormData();
        fileFormData.append('file', fileVal);
        let loadingInstance = this.$loading();
        this.$ajax.post('/insurance/api/user/uploadPlusApplyFile',fileFormData,{headers: {'Content-Type': 'multipart/form-data'}})
          .then((res)=>{
              loadingInstance.close();
              if(res.data &&  res.data.code === 1){
                  this.imgSrc = res.data.outData.vistPath + res.data.outData.fileName;
                  this.imgShow = true;
                  this.fileName = res.data.outData.fileName;
              }else{
                this.$message({
                message: res.data.message,
                duration: 1000,
                type: 'error'
                });
                return;
              }
          })
          .catch((error)=>{
             loadingInstance.close();
             this.$message({
            message: res.data.message,
            duration: 1000,
            type: 'error'
            });
            return;
          })
      }
  },
  mounted() {
      this.userFun();
      this.provinceFun();
  }
}
</script>

