<template>
    <div class="insure-tb">
        <div class="insure-tbxx insureOrder">
            <div class="channel-c1">
                <div class="channel-top clearfix">
                    <span class="breadCon">费率模板</span>
                    <div class="rate-act">
                        <a href="javascript:;" class="rate-tips" @click="rateSm = true">费率调整说明</a>
                        <el-button plain @click="addMbFun">新增模板</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="insure-tbxx">
            <div class="yj-table">
                <table>
                    <thead>
                        <tr>
                            <td>模板名称</td>
                            <td>使用渠道数</td>
                            <td>更新时间</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="mbInfo in mbCon" :key="mbInfo.id">
                            <td>{{mbInfo.templateName}}</td>
                            <td>{{mbInfo.useCount}}</td>
                            <td>{{mbInfo.updateTime}}</td>
                            <td class="channel-action">
                                <a href="javascript:;" @click="mbUpdate(mbInfo.id,mbInfo.templateName)">修改名称</a>
                                <a href="javascript:;" @click="setFl(mbInfo.id)">设置费率</a>
                                <a href="javascript:;" @click="mbDel(mbInfo.id)">删除</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- 费率调整说明 -->
        <el-dialog
            title="费率调整说明"
            :visible.sync="rateSm"
            width="50%"
            top="20vh"
            center>
            <div class="bmzh-content">
                <div class="bmzh-intro">
                    <div class="bmzh-page">1.若我的服务费率上调X%，则下级服务费率不变，需手动设置</div>
                </div>
                <div class="bmzh-intro">
                    <div class="bmzh-page">2.若我的服务费率下调X%，下级费率统一下调X%(去小数点取整)</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="rateSm = false">我知道了</el-button>
            </span>
        </el-dialog>

        <!-- 新增模板 -->
        <el-dialog
            :title="mbTitle"
            :visible.sync="addMb"
            width="50%"
            top="20vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="mbIntro" label-width="80px">
                    <el-form-item label="模板名称">
                        <el-input v-model="mbIntro.name" placeholder="请输入模板名称"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="mbAction">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Rate',
  inject:['reload'],
  data () {
    return {
       rateSm: false,
       addMb: false,
       mbIntro: {
           name: ''
       },
       mbCon:[],
       mbTitle: '',
       mbId: ''
    }
  },
  methods: {
      setFl(id) {
          this.$router.push({
            name: 'flRate',
            params:{
                id:id
            }
          })
      },
      mbFun() {
           let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userRate/userTemplateList'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.mbCon = res.data.outData.data;
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
      addMbFun() {
          this.mbIntro.name = '';
          this.mbTitle = '新增模板';
          this.addMb = true;
          this.mbId = '';
      },
      mbAction() {
          if(this.mbIntro.name === ''){
              this.$message({
                message: '请输入模板名称',
                duration: 1000,
                type: 'error'
            });
            return;
          }
          let mbUrl = '';
          if(this.mbId){//修改
              mbUrl = '/insurance/api/userTemplate/updateTempalteName/' + this.mbId;
          }else{//新增
              mbUrl = '/insurance/api/userTemplate/addNewTempalte'
          }
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:mbUrl,
                params:{
                    templateName:this.mbIntro.name
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
      mbDel(id) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userTemplate/delTemplate/' + id
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
      mbUpdate(id,name) {
          this.mbId = id;
          this.mbTitle = '修改模板名称';
          this.addMb = true;
          this.mbIntro.name = name;
      }
  },
  mounted() {
      this.mbFun();
  }
}
</script>

