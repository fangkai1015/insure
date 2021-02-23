<template>    
    <div class="insure-tb">
        <!-- 常用联系人 -->
        <div class="qxsz-box">
            <div class="insure-tbxx insureOrder">
                <div class="tbxx-top clearfix">
                    <div class="tbxx-name">常用联系人</div>
                    <div class="tbxx-bill">
                        <span class="ok-txt" @click="addlxr">新增常用联系人</span>
                    </div>
                </div>
                <div class="qxsz-content clearfix">
                    <ul>
                        <li v-for="contact in contactItem" :key="contact.id">
                            <div class="qxsz-header clearfix">
                                <div class="qxsz-name">{{contact.name}}</div>
                                <div class="qxsz-act">
                                    <span class="qzsx-del" @click="deleteContact(contact.id)">删除</span>
                                    <span class="qzsx-edit" @click="editContact(contact.id)">编辑</span>
                                </div>
                            </div>
                            <div class="qxsz-intro">
                                <div class="qxsz-txt">证件号码：<span>{{contact.certificateContent}}</span></div>
                                <div class="qxsz-txt">出生日期：<span>{{contact.birthday}}</span></div>
                                <div class="qxsz-txt">手机号码：<span>{{contact.mobile}}</span></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 新增常用联系人 -->
        <el-dialog
            title="常用联系人"
            :visible.sync="cyContact"
            width="40%"
            top="10vh"
            center>
            <div class="addChildSubmit">
                <el-form ref="form" :model="contactIntro" label-width="83px">
                    <el-form-item label="联系人类型">
                        <el-select v-model="contactIntro.userType" @change="typeSel">
                            <el-option
                            v-for="item in userTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="userName">
                        <el-input v-model="contactIntro.name" :placeholder="'请输入'+userName"></el-input>
                    </el-form-item>
                    <el-form-item label="证件类型">
                        <el-select v-model="contactIntro.zjlxValue">
                            <el-option
                            v-for="item in zjlx"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件号码">
                        <el-input v-model="contactIntro.number" placeholder="请输入证件号码"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" v-if="person">
                        <el-radio v-model="contactIntro.sex" label="男">男</el-radio>
                        <el-radio v-model="contactIntro.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label="出生日期"  v-if="person">
                        <el-date-picker
                            v-model="contactIntro.birthday"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择出生日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="contactIntro.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addContact">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Contact',
  inject:['reload'],
  data () {
    return {
        cyContact: false,
        zjlx: [{
            value: '01',
            label: '身份证'
        },
        {
            value: '02',
            label: '护照'
        },
        {
            value: '99',
            label: '其他'
        }],
        userTypes: [{
            value: '1',
            label: '个人'
        },
        {
            value: '2',
            label: '单位'
        }],
        contactIntro: {
            userType:'1',//个人
            name: '',//姓名
            zjlxValue: '01',//证件类型
            number: '',//证件号码
            sex: '男',//性别
            birthday: '',//出生日期
            phone: ''//手机号码
        },
        contactItem:[],
        contactId: '',
        userName: '姓名',
        person:true
    }
  },
  methods: {
      typeSel(val) {
          if(val == '1'){//个人
            this.userName = '姓名';
            this.person = true;
            this.contactIntro.zjlxValue = '01';
            this.zjlx = [{
                value: '01',
                label: '身份证'
            },
            {
                value: '02',
                label: '护照'
            },
            {
                value: '99',
                label: '其他'
            }];
          }else{//单位
            this.userName = '企业名称';
            this.person = false;
            this.contactIntro.zjlxValue = '1';
            this.zjlx = [{
                value: '1',
                label: '营业执照'
            },{
                value: '2',
                label: '组织机构代码证'
            }]
          }
      },
      contactList() {
        let loadingInstance = this.$loading();
        this.$ajax({
                method:'post',
                url:'/insurance/api/userContacts/allContacts'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.contactItem = res.data.outData.userContactsList;
                }
            })
      },
      addlxr() {
          this.cyContact = true;
          //初始化内容
          this.person = true;
          this.contactIntro.userType = '1';
          this.contactIntro.name = '';
          this.contactIntro.number = '';
          this.contactIntro.sex = '男';
          this.contactIntro.birthday = '';
          this.contactIntro.phone = '';
          this.contactId = '';
          this.zjlx = [{
                value: '01',
                label: '身份证'
            },
            {
                value: '02',
                label: '护照'
            },
            {
                value: '99',
                label: '其他'
            }];
         this.contactIntro.zjlxValue = '01';
      },
      //删除联系人
      deleteContact(id) {
          this.$confirm('确认删除该联系人？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let loadingInstance = this.$loading();
            this.$ajax({
                method:'post',
                url:'/insurance/api/userContacts/delContactsById/'+ id
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.cyContact = true;
                    this.reload();
                }else{

                }
            })
          }).catch(() => {
          });

      },
      //编辑展示内容
      editContact(id) {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/userContacts/getContactsById/'+ id
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                   this.cyContact = true;
                   let contactInfo = res.data.outData.userContactsEntity;
                   this.contactIntro.name = contactInfo.name;
                   this.contactIntro.number = contactInfo.certificateContent;
                   this.contactIntro.sex = contactInfo.sex;
                   this.contactIntro.birthday = contactInfo.birthday;
                   this.contactIntro.phone = contactInfo.mobile;
                   this.contactId = contactInfo.id;
                   if(contactInfo.type == 1){
                        this.contactIntro.userType = '1';
                        this.person = true;
                        this.zjlx = [{
                            value: '01',
                            label: '身份证'
                        },
                        {
                            value: '02',
                            label: '护照'
                        },
                        {
                            value: '99',
                            label: '其他'
                        }];
                        this.contactIntro.zjlxValue = contactInfo.certificateType;
                   }else{
                       this.contactIntro.userType = '2';
                        this.person = false;
                        this.zjlx = [{
                            value: '1',
                            label: '营业执照'
                        },{
                            value: '2',
                            label: '组织机构代码证'
                        }]
                        this.contactIntro.zjlxValue = contactInfo.certificateType;
                   }
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
      addContact() {
          let numberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
          if(this.contactIntro.userType === '1'){//个人
                if(this.contactIntro.name === ''){
                    this.$message({
                            message: '请输入姓名',
                            duration: 1000,
                            type: 'error'
                    });
                    return;
                }
                if(this.contactIntro.sex === ''){
                    this.$message({
                            message: '请输入出生日期',
                            duration: 1000,
                            type: 'error'
                    });
                return;
                }
          }else{//单位
            if(this.contactIntro.name === ''){
                this.$message({
                        message: '请输入企业名称',
                        duration: 1000,
                        type: 'error'
                });
                return;
            }
          }
        if(this.contactIntro.number === ''){
            this.$message({
                    message: '请输入证件号码',
                    duration: 1000,
                    type: 'error'
             });
             return;
        }
        if(this.contactIntro.zjlxValue === '01' && !numberReg.test(this.contactIntro.number)){
            this.$message({
                    message: '请输入正确的身份证格式',
                    duration: 1000,
                    type: 'error'
             });
             return;
        }
        if(this.contactIntro.phone === ''){
            this.$message({
                    message: '请输入手机号码',
                    duration: 1000,
                    type: 'error'
             });
             return;
        }
        if(!phoneReg.test(this.contactIntro.phone)){
            this.$message({
                    message: '请输入正确的手机号码格式',
                    duration: 1000,
                    type: 'error'
             });
             return;
        }
        let loadingInstance = this.$loading();
        this.$ajax({
            method:'post',
            url:'/insurance/api/userContacts/addOrUpdate',
            data: {
                type:this.contactIntro.userType,
                name:this.contactIntro.name,
                certificateType:this.contactIntro.zjlxValue,
                certificateContent:this.contactIntro.number,
                sex:this.contactIntro.sex,
                birthday:this.contactIntro.birthday,
                mobile:this.contactIntro.phone,
                id:this.contactId
            }
        })
        .then((res)=>{
            loadingInstance.close();
            if(res.data.code === 1){
                this.reload();
            }
        })
      }
  },
  created() {
      this.contactList();
  }
}
</script>

