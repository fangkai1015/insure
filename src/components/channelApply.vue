<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top">Pro账户<a href="javascript:;" class="exp-icon" @click="qdzh = true"></a></div>
                <div class="applyTop">您的邀请注册地址：<span id="inviteUrl">{{inviteUrl}}</span><a href="javascript:;" class="setMb" v-clipboard:copy="inviteUrl" v-clipboard:success="copy" v-clipboard:error="onError">复制</a></div>
                <div class="applyTop">默认费率模板： {{mbSet}}<a href="javascript:;" class="setMb" @click="xzmb = true">设置</a></div>
                <a :href="inviteUrl" target="_blank"><el-button type="primary" class="inviteBtn">邀请注册</el-button></a>
                <textarea id="textCopy" style="display:none"></textarea>
            </div>
        </div>

        <div class="insure-tbxx">
            <div class="tbxx-top clearfix">
                <div class="tbxx-name">Pro用户管理</div>
                <div class="apply-action">
                    <div class="channel-input"><el-input v-model="searchName" placeholder="输入姓名，手机号进行搜索"></el-input></div>
                    <el-button type="primary" @click="searchApply">查询</el-button>
                </div>
            </div>

            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>渠道联系人</td>
                            <td>账户类型</td>
                            <td>机构名称</td>
                            <td>联系方式</td>
                            <td>费率模板</td>
                            <td>创建时间</td>
                            <td>账户状态</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="applyItem in applyCon" :key="applyItem.id">
                            <td>{{applyItem.contacts || '暂无'}}</td>
                            <td>{{applyItem.userType === 3 ? 'Pro个人' : 'Pro企业'}}</td>
                            <td>{{applyItem.name}}</td>
                            <td>{{applyItem.mobile}}</td>
                            <td>{{applyItem.templateName || '未设置'}}</td>
                            <td>{{applyItem.createTime}}</td>
                            <td>{{applyItem.status === 1 ? '正常' : '禁用'}}</td>
                            <td class="channel-action">
                                <a href="javascript:;" @click="setFl(applyItem.id)">设置费率</a>
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
        <!-- 渠道账户 -->
        <el-dialog
            title="Pro账户"
            :visible.sync="qdzh"
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
                    <div class="bmzh-page">1.账户具有独立的财务信息及结算权限，需独立与耀保网结算<br>
2.您获得的收入部分可在财务模块查看</div>
                </div>
                <div class="bmzh-intro">
                    <div class="bmzh-title">渠道账户注册流程？</div>
                    <div class="bmzh-page">邀请渠道注册，注册后渠道需审核及认证</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="qdzh = false">我知道了</el-button>
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
                <div class="xzmb-check" v-for="mbCheck in channelNames" :key="mbCheck.id"><el-radio v-model="mb" :label="mbCheck.id">{{mbCheck.templateName}}</el-radio></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="defalutFun">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'ChannelApply',
  inject:['reload'],
  data () {
    return {
        qdzh: false,
        searchName: '',
        xzmb: false,
        mb: '',
        channelNames:[],
        applyCon:[],
        totalCount:0,
        currentPage:1,
        size:10,
        inviteUrl:'',
        mbSet: '',
    }
  },
  methods: {
      copy(e) {
          this.$message({
            message: '复制成功',
            duration: 1000,
            type: 'success'
          });
      },
      onError(e) {
            this.$message({
                message: e,
                duration: 1000,
                type: 'warning'
            });
        },
      setFl(id) {
          this.$router.push({
            name: 'proRate',
            params:{
                id:id
            }
          })
      },
      applyFun(index) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/subProAccountPage',
                data:{
                    limit:10,
                    page:index,
                    contact:this.searchName
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.applyCon = res.data.outData.rows;
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
      handleSizeChange(val) {
          this.applyFun(val-1)
      },
      handleCurrentChange(val) {
          this.applyFun(val-1)
      },
      inviteCode() {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/user/proRecRegisterInfo'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.inviteUrl = window.location.protocol + '//' + window.location.host + '/#/invite?code=' + encodeURIComponent(res.data.outData.shareCode);
                    this.mbSet = res.data.outData.templateName || '未设置';
                    this.mb = res.data.outData.templateId || '';
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
      searchApply() {
          this.currentPage = 1;
          this.applyFun(0);
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
      defalutFun() {
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
                url:'/insurance/api/userRate/setDefaultProRecommend/' + this.mb
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
      this.applyFun(0);
      this.inviteCode();
      this.mbList();
  }
}
</script>

