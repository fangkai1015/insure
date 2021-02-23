<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top">部门账户<a href="javascript:;" class="exp-icon" @click="bmzh = true"></a></div>
                <div class="channel-sea">
                    费率模板
                    <el-select v-model="channelName" placeholder="请选择">
                        <el-option
                        v-for="item in channelNames"
                        :key="item.id"
                        :label="item.templateName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <div class="channel-input"><el-input v-model="searchName" placeholder="输入联系人，手机号进行搜索"></el-input></div>
                    <el-button type="primary" @click="searchChannel">查询</el-button>
                    <el-button class="mrmb" plain @click="addBmzh = true">新增部门账户</el-button>
                    <el-button class="mrmb" plain @click="xzmb = true">默认模板设置</el-button>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>部门名称</td>
                            <td>联系人</td>
                            <td>手机号</td>
                            <td>费率模板</td>
                            <td>创建时间</td>
                            <td>状态</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="channelInfo in channelCon" :key="channelInfo.id">
                            <td>{{channelInfo.name}}</td>
                            <td>{{channelInfo.contacts}}</td>
                            <td>{{channelInfo.mobile}}</td>
                            <td>{{channelInfo.templateName || '未设置'}}</td>
                            <td>{{channelInfo.createTime}}</td>
                            <td>{{channelInfo.status === 1 ? '开启' : '关闭'}}</td>
                            <td class="channel-action">
                                <a href="javascript:;" @click="setFl(channelInfo.id)">设置费率</a>
                                <a href="javascript:;" @click="updateFun(channelInfo.name,channelInfo.contacts,channelInfo.mobile,channelInfo.id)">修改</a>
                                <a href="javascript:;" @click="channelAct(channelInfo.status,channelInfo.id,channelInfo.name)">{{channelInfo.status === 1 ? '冻结' : '开启'}}</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
        <!-- 部门账户 -->
        <el-dialog
            title="部门账户"
            :visible.sync="bmzh"
            width="50%"
            top="20vh"
            center>
            <div class="bmzh-content">
                <div class="bmzh-intro">
                    <div class="bmzh-title">如何管理下级费率？</div>
                    <div class="bmzh-page">您可通过费率模板配置您的下级渠道费率</div>
                </div>
                <div class="bmzh-intro">
                    <div class="bmzh-title">财务结算流程？</div>
                    <div class="bmzh-page">1.账户不具有独立的财务信息及结算权限，服务费率将统一结算给当前账户<br>
2.您可通过部门账单，将部门收入结算给您的下级部门<br>
3.下级部门可在自己的财务信息中查看自己的收入，但不具有结算权限</div>
                </div>
                <div class="bmzh-intro">
                    <div class="bmzh-title">下级部门的权限和主账户是否一致？</div>
                    <div class="bmzh-page">1.下级部门账户将默认继承主账户的品牌信息<br>
2.下级部门的权限与主账户一致</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="bmzh = false">我知道了</el-button>
            </span>
        </el-dialog>

        <!-- 选择模板 -->
        <el-dialog
            title="选择模板"
            :visible.sync="xzmb"
            width="40%"
            top="20vh"
            center>
            <div class="xzmb-con">
                <div class="xzmb-check" v-for="mbCheck in channelNames.slice(1,mbLen+1)" :key="mbCheck.id"><el-radio v-model="mb" :label="mbCheck.id">{{mbCheck.templateName}}</el-radio></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="defaultMb">提交</el-button>
            </span>
        </el-dialog>

        <!-- 新增部门账户 -->
        <el-dialog
            title="新增部门账户"
            :visible.sync="addBmzh"
            width="50%"
            top="20vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="channelIntro" label-width="80px">
                    <el-form-item label="部门名称">
                        <el-input v-model="channelIntro.name" placeholder="请输入部门名称"></el-input>
                    </el-form-item>
                     <el-form-item label="真实姓名">
                        <el-input v-model="channelIntro.realName" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                     <el-form-item label="登录账号">
                        <el-input v-model="channelIntro.user" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码">
                        <el-input v-model="channelIntro.password" placeholder="请输入6-20位登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="选择模板">
                        <el-select v-model="channelIntro.channelName" placeholder="非必选">
                            <el-option
                            v-for="item in channelNames"
                            :key="item.id"
                            :label="item.templateName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addChannelFun">提交</el-button>
            </span>
        </el-dialog>

        <!-- 修改部门账户 -->
        <el-dialog
            title="修改部门账户"
            :visible.sync="updateBmzh"
            width="50%"
            top="20vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="updateIntro" label-width="80px">
                    <el-form-item label="部门名称">
                        <el-input v-model="updateIntro.name" placeholder="请输入部门名称"></el-input>
                    </el-form-item>
                     <el-form-item label="真实姓名">
                        <el-input v-model="updateIntro.realName" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                     <el-form-item label="登录账号">
                        <el-input v-model="updateIntro.user" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码">
                        <el-input v-model="updateIntro.password" placeholder="请输入6-20位登录密码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateChannelFun">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'ChannelAccount',
  inject:['reload'],
  data () {
    return {
        channelName: '',
        channelNames: [],
        mbLen:'',
        searchName: '',
        bmzh: false,
        xzmb: false,
        mb: '',
        addBmzh: false,
        updateBmzh:false,
        channelIntro: {
            name: '',
            realName: '',
            user: '',
            password: '',
            channelName: ''
        },
        updateIntro: {
            name: '',
            realName: '',
            user: '',
            password: ''
        },
        channelCon:[],
        totalCount:0,
        currentPage:1,
        size:10,
        channelId: ''
    }
  },
  methods: {
      setFl(id) {
          this.$router.push({
            name: 'bmRate',
            params:{
                id:id
            }
          })
      },
      channelFun(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/subDeptAccountPage',
                data:{
                    limit:10,
                    page:index,
                    contact:this.searchName,
                    tempateId:this.channelName
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.channelCon = res.data.outData.rows;
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
      mbList() {
         let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userRate/userTemplateList'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    let empty = {
                        id: '',
                        templateName: "请选择"
                    }
                    this.channelNames = res.data.outData.data;
                    this.mbLen = res.data.outData.data.length;
                    this.channelNames.unshift(empty);
                    this.channelIntro.channelName = res.data.outData.defDepTemplateId || '';
                    this.mb = res.data.outData.defDepTemplateId || '';
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
      updateChannelFun() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/,
          realNameReg = /^([\u4e00-\u9fa5]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5]|\u3007)+$/;
          if(this.updateIntro.name === ''){
              this.$message({
                message: '请输入部门名称',
                duration: 1000,
                type: 'error'
              });
              return;
          }
        if(this.updateIntro.realName === '' || !realNameReg.test(this.updateIntro.realName)){
            this.$message({
                message: '请输入正确的真实姓名',
                duration: 1000,
                type: 'error'
            });
            return;
        }
        if(this.updateIntro.user === '' || !phoneReg.test(this.updateIntro.user)){
            this.$message({
                message: '请输入正确的账号',
                duration: 1000,
                type: 'error'
            });
            return;
        }
        if(this.updateIntro.password === '' || this.updateIntro.password.length < 6 || this.updateIntro.password.length > 20){
            this.$message({
                message: '请输入正确的密码',
                duration: 1000,
                type: 'error'
            });
            return;
        }
        let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/updateDepAccount',
                data: {                   
                    contacts: this.updateIntro.realName,
                    mobile: this.updateIntro.user,
                    name: this.updateIntro.name,
                    password: this.updateIntro.password,
                    userId: this.channelId
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
      addChannelFun() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/,
          realNameReg = /^([\u4e00-\u9fa5]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5]|\u3007)+$/;
          if(this.channelIntro.name === ''){
              this.$message({
                message: '请输入部门名称',
                duration: 1000,
                type: 'error'
              });
              return;
          }
        if(this.channelIntro.realName === '' || !realNameReg.test(this.channelIntro.realName)){
            this.$message({
                message: '请输入正确的真实姓名',
                duration: 1000,
                type: 'error'
            });
            return;
        }
        if(this.channelIntro.user === '' || !phoneReg.test(this.channelIntro.user)){
            this.$message({
                message: '请输入正确的账号',
                duration: 1000,
                type: 'error'
            });
            return;
        }
        if(this.channelIntro.password === '' || this.channelIntro.password.length < 6 || this.channelIntro.password.length > 20){
            this.$message({
                message: '请输入正确的密码',
                duration: 1000,
                type: 'error'
            });
            return;
        }
        let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/addDepAccount',
                data: {                   
                    contacts: this.channelIntro.realName,
                    mobile: this.channelIntro.user,
                    name: this.channelIntro.name,
                    password: this.channelIntro.password,
                    templateId: this.channelIntro.channelName
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
      searchChannel() {
          this.currentPage = 1;
          this.channelFun(0);
      },
      handleSizeChange(val) {
          this.channelFun(val-1)
      },
      handleCurrentChange(val) {
          this.channelFun(val-1)
      },
      updateFun(name,contacts,mobile,id){
          this.updateIntro.name = name;
          this.updateIntro.realName = contacts;
          this.updateIntro.user = mobile;
          this.channelId = id;
          this.updateBmzh = true;
      },
      defaultMb() {
          if(this.mb === ''){
              this.$message({
                message: '请选择默认模板',
                duration: 1000,
                type: 'error'
                });
            return;
          }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userRate/setDefaultProDepTemplate/' + this.mb
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
      channelAct(status,id,name) {
          let type = '',typeTxt = '';
          if(status === 1){//开启
            type = 'FROZEN';
            typeTxt = '冻结';
          }else{
             type = 'ENABLE';
             typeTxt = '开启';
          }
          this.$confirm('确认'+typeTxt+name+'账户的使用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
              let loadingInstance = this.$loading();
                this.$ajax({
                        method:'post',
                        url:'/insurance/api/user/enableOrFrozenDepAccount/' + id + '/' + type
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
      }
  },
  mounted() {
      this.channelFun(0);
      this.mbList();
  }
}
</script>

