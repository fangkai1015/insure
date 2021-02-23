<template>
  <section class="insure-content">
    <Header></Header>
    <div class="yao-main clearfix">
      <div class="insure-menu" v-if="menuShow">
        <div class="insureNav">
          <div class="insureNav-title" :class="buyShow ? 'insureNav-down' : 'insureNav-up'" @click="buyShop">常投保险商品
          </div>
          <div class="insureNav-list" v-show="buyShow">
            <ul>
              <li v-for="(buyItem,index) in buyList" :key="buyItem.pro_id"
                  @click="buyTab(buyItem.combo_id,buyItem.pro_id,index)"><a href="javascript:;"
                                                                            :class="{'current':buyact==index}">{{buyItem.pro_name}}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="insureNav" v-for="(productCon,index) in productIntro" :key="index">
          <div class="insureNav-title insureNav-down" @click="showSub(index)" :ref="'nav'+index">
            {{productCon.typeName}}
          </div>
          <div class="insureNav-list" :ref="'listBox'+index" style="display:block">
            <ul>
              <li v-for="subproduct in productCon.proList" :key="subproduct.pro_id"
                  @click="insureTab(subproduct.combo_id,subproduct.pro_id)"><a href="javascript:;"
                                                                               :class="{'current':act==subproduct.pro_id}">{{subproduct.pro_name}}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="insure-tb tb-content" :class="{'tbContent':plusShow}">
        <div class="insureFill">
          <div class="insure-tbxx banlanceYe">
            <div class="tbxx-top clearfix">
              <div class="tbxx-name">投保信息一<span>{{product.proName}}</span><a href="javascript:;" class="productGo"
                                                                             v-if="plusShow" @click="detailEnter">查看详情
                ></a></div>
              <div class="tbxx-textLink">
                <!-- <a :href="flDoc" target="_blank">费率表</a> -->
                <a :href="bdDoc" target="_blank">保单样本下载</a>
                <a href="javascript:;" @click="detailTk(product.proId)">详细条款</a>
              </div>
            </div>
            <div class="tbxx-submit clearfix">
              <div class="tbxx-model" id="plan-select">
                <span class="tbxx-label">计划选择：</span>
                <el-select v-model="plan" placeholder="请选择" @change="planChange">
                  <el-option
                    v-for="item in combos"
                    :key="item.comboId"
                    :label="item.comboName"
                    :value="item.comboId">
                  </el-option>
                </el-select>
              </div>

              <div class="tbxx-model" style="width:50%">
                <span class="tbxx-label">起保日期：</span>
                <el-date-picker
                  v-model="tbDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  placeholder="选择日期"
                  @change="startTime">
                </el-date-picker>
                <span class="tbxx-time" v-if="jsGo1">{{startSecond}}</span>
                <span class="tbxx-time" v-if="jsGo2">以实际出单时间为准</span>
              </div>

              <div class="tbxx-model" style="width:50%">
                <span class="tbxx-label">结束日期：</span>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions1"
                  placeholder="选择日期"
                  :disabled="disEnd"
                  @change="endTime">
                </el-date-picker>
                <span class="tbxx-time" v-if="jsGo1">{{endSecond}}</span>
                <span class="tbxx-time" v-if="jsGo2">以实际出单时间为准</span>
              </div>

              <div class="tbxx-model" style="width:50%">
                <span class="tbxx-label">保障期限：</span>
                <el-select v-model="bzqx" placeholder="请选择" @change="bzPrice">
                  <el-option
                    v-for="item in bzqxs"
                    :key="item.view_time"
                    :label="item.view_time"
                    :value="item.view_time">
                  </el-option>
                </el-select>
              </div>

              <div class="tbxx-model" style="width:50%">
                <span class="tbxx-label">备注：</span>
                <el-input v-model="beizhu" placeholder="请输入备注（选填）"></el-input>
              </div>

              <div class="tbxx-model" style="width:50%" v-for="otherItem in otherInfo" :key="otherItem.id">
                <span class="tbxx-label">{{otherItem.showName}}：</span>
                <el-input v-model="otherData[otherItem.fieldName]"
                          :placeholder="'请输入' + otherItem.showName + (otherItem.required ? '' : '（选填）')"></el-input>
              </div>
              <div class="tbxx-model" style="width:100%" v-if="product.insureType">
                <span class="tbxx-label">出单方式：</span>
                <template v-if="product.insureType === 1">
                  <el-radio v-model="cdType" label="1">每人一张保单</el-radio>
                </template>
                <template v-if="product.insureType === 2">
                  <el-radio v-model="cdType" label="2">多人一张保单</el-radio>
                </template>
                <template v-if="product.insureType === 3">
                  <el-radio v-model="cdType" label="1">每人一张保单</el-radio>
                  <el-radio v-model="cdType" label="2">多人一张保单</el-radio>
                </template>
              </div>
              <div class="tbxx-model" style="width:100%">
                <span class="tbxx-label">投保价格：</span>
                <span class="tbxx-money">{{price}}元</span>
              </div>
            </div>
          </div>
          <div class="insure-tbxx">
            <div class="tbxx-top clearfix">
              <div class="tbxx-name">投保人信息</div>
            </div>

            <div class="tbxx-submit tbrIntro clearfix">
              <div class="tbxx-model">
                <span class="tbxx-label">投保人信息：</span>
                <el-select v-model="tbrType" placeholder="请选择" @change="tbType">
                  <el-option
                    v-for="item in tbrTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="tbxx-model" style="width:66.6%">
                <div class="cylxr" @click="lxrVisible = true">常用联系人</div>

                <div class="kpbk" @mouseenter="kpbk = true" @mouseleave="kpbk = false">开票必看</div>
                <div class="kpbk-con" v-show="kpbk">
                  <i class="arrow-top"></i>
                  <p>1.只可开投保人抬头的发票</p>
                  <p>2.投保人一致,保险产品一致的保单才可以合并开票,可合并的保单上限以各家保险公司的政策为准</p>
                  <p>3.如不需要发票抬头中显示投保人英文名称,请在投保时不要填写企业英文名称</p>
                </div>
              </div>
              <div class="tbxx-model">
                <span class="tbxx-label">{{tbName}}：</span>
                <el-input v-model="realName" :placeholder="tbNametip" @blur="nameBlur"></el-input>
              </div>

              <div class="tbxx-model">
                <span class="tbxx-label">证件类型：</span>
                <el-select v-model="zjType" placeholder="请选择" @change="zjChange">
                  <el-option
                    v-for="item in zjTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>

              <div class="tbxx-model">
                <span class="tbxx-label">证件号码：</span>
                <el-input v-model="zjNumber" placeholder="请输入证件号码" @blur="zjBlur"></el-input>
              </div>

              <div class="tbxx-model" v-if="person">
                <span class="tbxx-label">出生日期：</span>
                <el-date-picker
                  v-model="birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :disabled="birthdayDis"
                  placeholder="请选择出生日期">
                </el-date-picker>
              </div>

              <div class="tbxx-model" v-if="person">
                <span class="tbxx-label">性别：</span>
                <el-select v-model="sex" placeholder="请选择" :disabled="birthdayDis">
                  <el-option
                    v-for="item in sexs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>

              <div class="tbxx-model">
                <span class="tbxx-label">手机号码：</span>
                <el-input v-model="tbPhone" placeholder="请输入手机号码" @blur="phoneBlur"></el-input>
              </div>

              <div class="tbxx-model">
                <span class="tbxx-label">电子邮箱：</span>
                <el-input v-model="tbEmail" placeholder="请输入电子邮箱(非必填)" @blur="emailBlur"></el-input>
              </div>
              <div class="tbxx-model">
                <span class="tbxx-label">发票抬头：</span>
                <el-input v-model="fpName" placeholder="与投保人姓名一致" disabled></el-input>
              </div>
              <!--                            <div class="tbxx-fp">-->
              <!--                                <div class="kpbk" @mouseenter="kpbk = true" @mouseleave="kpbk = false">开票必看</div>-->
              <!--                                <div class="kpbk-con" v-show="kpbk">-->
              <!--                                    <i class="arrow-top"></i>-->
              <!--                                    <p>1.只可开投保人抬头的发票</p>-->
              <!--                                    <p>2.投保人一致,保险产品一致的保单才可以合并开票,可合并的保单上限以各家保险公司的政策为准</p>-->
              <!--                                    <p>3.如不需要发票抬头中显示投保人英文名称,请在投保时不要填写企业英文名称</p>-->
              <!--                                </div>-->
              <!--                            </div>-->
              <div class="saveAction"><span class="rules-icon" :class="joinLxr==true ? 'rules-yes' : 'rules-no'"
                                            @click="saveLxr"></span><span class="lxr-txt">保存为常用联系人</span></div>
            </div>
          </div>

          <div class="insure-tbxx">
            <div class="tbxx-top clearfix">
              <div class="tbxx-name">被保险人信息<span>（{{this.insured.length}}/499）</span></div>
              <div class="tbxx-action">
                <span @click="copyIntro = true">名单粘贴</span>
                <span><a :href="downloadUrl">名单模板</a></span>
                <span>
                                    上传名单
                                    <input type="file" name="file" id="excelFile" class="uploadFile"
                                           @change="uploadExcel($event)">
                                </span>
                <span @click="addInsured">添加名单</span>
                <span @click="delInsured">选中删除</span>
              </div>
            </div>

            <div class="yj-table">
              <table>
                <thead>
                <tr>
                  <td width="40">
                    <el-checkbox v-model="allchecked" @change="allCheck"></el-checkbox>
                  </td>
                  <td width="20"></td>
                  <td>姓名</td>
                  <td>证件类型</td>
                  <td>证件号码</td>
                  <td>出生日期</td>
                  <td>性别</td>
                  <td>手机号码</td>
                  <td>投保价格</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(insuredItem,index) in insured" :key="index">
                  <td>
                    <el-checkbox v-model="checked[index]" @change="listCheck"></el-checkbox>
                  </td>
                  <td>{{index+1}}</td>
                  <td>
                    <el-input v-model="insuredItem.name" class="input-name" @blur="nameCheck(index)"></el-input>
                  </td>
                  <td>
                    <el-select v-model="insuredItem.zjType" placeholder="请选择" class="select-type"
                               @change="changeType(index)">
                      <el-option
                        v-for="item in bbrTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="insuredItem.number" class="input-number" @blur="numberCheck(index)"></el-input>
                  </td>
                  <td>
                    <el-date-picker
                      v-model="insuredItem.birthday"
                      type="date"
                      :disabled="insuredItem.dateAble"
                      value-format="yyyy-MM-dd"
                      class="select-type">
                    </el-date-picker>
                  </td>
                  <td>
                    <el-select v-model="insuredItem.sex" placeholder="请选择" class="select-sex"
                               :disabled="insuredItem.dateAble">
                      <el-option
                        v-for="item in sexs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="insuredItem.phone" class="input-phone" placeholder="选填"
                              @blur="phoneCheck(index)"></el-input>
                  </td>
                  <td>{{price}}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="login-rules insure-rules"><span class="rules-icon"
                                                        :class="rulesIntro==true ? 'rules-yes' : 'rules-no'"
                                                        @click="rulesClick"></span><span class="rules-txt">本人已充分理解并同意<a
              href="javascript:;" @click="detailTk(product.proId)">《保险条款》</a><a href="javascript:;"
                                                                                @click="weeboxNotice('投保声明')">《投保声明》</a><a
              href="javascript:;" @click="weeboxNotice('个人信息保护政策')">《个人信息保护政策》</a></span></div>
            <div class="login-rules insure-tip"><span class="rules-icon"
                                                      :class="rulesTip==true ? 'rules-yes' : 'rules-no'"
                                                      @click="readClick"></span><span class="rules-txt">本人已逐页阅读并同意<a
              href="javascript:;" @click="weeboxNotice('免责内容')">《免责内容》</a><a href="javascript:;"
                                                                             @click="weeboxNotice('被保险人同意声明')">《被保险人同意声明》</a><a
              href="javascript:;" @click="weeboxNotice('投保提示')">《投保提示》</a></span></div>
            <div class="ljtb-btn" @click="ljtb">立即投保</div>
            <div class="toubao-allMoney">保费合计：<span>{{allPrice}}元</span></div>
          </div>
          <div class="insureFill-tigger" v-if="tiggerShow" @click="tiggerFun"></div>
          <!-- <div class="insureFill-tigger" v-if="common" @click="reAct"></div> -->
        </div>
        <!-- 投保须知 -->
        <div class="insure-tbxx">
          <div class="tbxx-top clearfix">
            <div class="tbxx-name">投保须知</div>
          </div>
          <div class="tbxz-content" v-html="information.hint"></div>
        </div>
        <!-- 保障计划 -->
        <div class="insure-tbxx">
          <div class="tbxx-top clearfix">
            <div class="tbxx-name">保障计划</div>
            <div class="bzjh-tab">
              <span v-for="(planItem,index) in combos" :key="planItem.comboId" :class="{'on':planCur == index}">{{planItem.comboName}}</span>
            </div>
          </div>
          <div class="bzjh-content">
            <div class="bzjh-box clearfix">
              <div class="bzjh-allIntro fl">
                <ul>
                  <li v-for="(allItem,index) in allContentList" :key="index" class="clearfix">
                    <div class="bzjh-subName">{{allItem.contentName}}</div>
                    <div class="bzjh-tips">
                      <i class="plan-icon" @mouseenter="contentShow(index)" @mouseleave="contentHide(index)"></i>
                      <div class="plan-tips" style="display: none;" :ref="'content'+index">
                        {{allItem.contentContent}}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="bzjh-allCon">
                <div class="bzjh-conItem" v-for="(comItem,index) in combos" :key="comItem.comboId">
                  <ul :class="{'on':planCur == index}">
                    <li v-for="(contentItem,index) in comItem.contents" :key="index">{{contentItem.price}}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="确认进入投保流程"
      :visible.sync="centerDialogVisible"
      width="50%"
      top="30vh"
      center>
      尊敬的客户：<br>
      <div class="tbxz"> 您即将进入投保流程，请咨询阅读保险条款。本保险产品由<span>《{{companyName}}》</span>承保，由问鼎保险经纪有限公司提供销售和协助理赔等间接服务。</div>
      <div class="tbxz">投保前请阅读<a :href="noticeDoc" target="_blank">《客户告知书》</a>。</div>
      <div class="tbxz-tips">点击“确认并开始投保”，您在销售页面的操作将会记录和保持。</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">暂不投保</el-button>
                <el-button type="primary" @click="sureInsure">确定并开始投保</el-button>
            </span>
    </el-dialog>
    <!--条款政策弹层-->
    <el-dialog
      :title="weeboxName"
      :visible.sync="weeboxVisible"
      width="40%"
      top="20vh"
      center>
      <div class="weebox-content" v-html="weeboxContent"></div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="weeboxVisible = false">确定</el-button>
            </span>
    </el-dialog>

    <!-- 阅读条款 -->
    <el-dialog
      title=""
      :visible.sync="readVisible"
      width="40%"
      top="20vh"
      center>
      <div class="readWeebox">
        <div class="readTitle">
          <span v-for="(readItem,index) in readTitle" :key="index" :class="{'on':readAct === index}">{{readItem}}</span>
        </div>

        <div class="weebox-content" v-show="readAct === 0" v-html="information.preventDuty"></div>
        <div class="weebox-content" v-show="readAct === 1" v-html="information.insuredDeclare"></div>
        <div class="weebox-content" v-show="readAct === 2" v-html="information.insuranceTip"></div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="readEnter">已阅读并同意{{readTitle[readAct]}}</el-button>
            </span>
    </el-dialog>

    <!-- 常用联系人 -->
    <el-dialog
      title="选择联系人"
      :visible.sync="lxrVisible"
      width="50%"
      top="30vh">
      <div class="lxr-btn">
        <el-button v-for="(contactItem,index) in contactsList" :key="contactItem.id" @click="loadContact(index)">
          {{contactItem.name}}
        </el-button>
      </div>
    </el-dialog>
    <!-- 粘贴名单 -->
    <el-dialog
      title="粘贴名单数据至文本框中"
      :visible.sync="copyIntro"
      width="50%"
      top="20vh"
      center>
      <div class="listName">
        <div class="listName-tip">
          <span class="teachCopy" @mouseenter="teachShow = true" @mouseleave="teachShow = false">教我怎么用</span>
          <div class="nameTip" v-show="teachShow">
            <p><b>规则:</b> 一行一个名单信息 空格进行分割，如：<br> <span style="margin-left: 30px;">张三 男 110101199901017917</span> <br>
              <span style="margin-left:30px;">张红 女 E12345678 1980-01-10</span><br> <span style="margin-left:30px;">辛巴·巴新 女 E12345678 1980-08-08</span>
            </p>
            <p><b>身份证:</b>只需提供姓名和证件号,网站自动识别身份证中的出生日期和性别,如果出现不能识别,将证件类型改为其他</p>
            <p><b>护照:</b>可识别大多数国家的护照,如果出现部分国家的无法识别,将证件类型改为其他</p>
            <p><b>出生日期:</b>目前可识别格式如:1982-8-25, 1983/8/25, 19800825 如需更改，请于右上角选择特殊日期格式</p>
          </div>
        </div>
        <textarea class="listName-textarea" placeholder="请按规则输入名单数据" v-model.trim="copyName"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="listCopy">名单分析</el-button>
        </span>
    </el-dialog>
    <Footer></Footer>
  </section>
</template>

<script>
  import Footer from '../components/footer'
  import Header from '../components/header'

  export default {
    name: 'Insure',
    inject: ['reload'],
    components: {
      Footer,
      Header
    },
    data() {
      return {
        plusShow: false,
        menuShow: true,
        allContentList: [],
        disEnd: false,
        jsGo1: true,
        jsGo2: false,
        endSecond: '23:59:59',
        startSecond: '00:00:00',
        readOk: false,
        readAct: 0,
        readTitle: ['《免责内容》', '《被保险人同意声明》', '《投保提示》'],
        readVisible: false,
        weeboxName: '',
        weeboxContent: '',
        weeboxVisible: false,
        rulesTip: false,
        buyact: -1,
        buyShow: true,
        downloadUrl: '',
        copyName: '',
        teachShow: false,
        copyIntro: false,
        birthdayDis: true,
        otherData: {},
        checkCount: 0,
        insured: [{
          name: '',
          zjType: '01',
          number: '',
          birthday: '',
          sex: '男',
          phone: '',
          dateAble: true
        }],
        allchecked: '',
        checked: [],
        person: true,
        tbName: '姓名',
        tbNametip: '请输入姓名',
        planCur: 0,
        tiggerShow: true,
        centerDialogVisible: false,
        plan: '',//计划
        tbDate: '',//起保日期
        endDate: '',//结束日期
        beizhu: '',//备注
        mdd: '',//目的地
        bzqx: '',//保障期限
        bzqxs: [],//保障期限select列表
        cdType: '',//出单方式
        kpbk: false,
        tbrType: '1',//投保人类型值
        tbrTypes: [{//投保人类型select
          value: '1',
          label: '个人'
        }, {
          value: '2',
          label: '单位'
        }],
        realName: '',//投保人姓名
        zjType: '01',//证件类型值01-身份证,02-护照,03-军人证,05-港澳回乡证,07-台胞证
        zjTypes: [{
          value: '01',
          label: '身份证'
        },
          {
            value: '02',
            label: '护照'
          },
          {
            value: '03',
            label: '军官证'
          },
          {
            value: '05',
            label: '港澳回乡证'
          },
          {
            value: '07',
            label: '台胞证'
          }],
        bbrTypes: [{
          value: '01',
          label: '身份证'
        },
          {
            value: '02',
            label: '护照'
          },
          {
            value: '03',
            label: '军官证'
          },
          {
            value: '05',
            label: '港澳回乡证'
          },
          {
            value: '06',
            label: '台胞证'
          }],
        zjNumber: '',//证件号码
        birthday: '',//出生日期
        sex: '男',// 性别
        sexs: [{//性别列表
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
        tbPhone: '',//投保人手机号码
        tbEmail: '',//投保人电子邮箱
        joinLxr: true,//加入常用联系人
        lxrVisible: false,//常用联系人弹层
        rulesIntro: false,
        productIntro: [],
        act: '',
        cur: 0,
        pickerOptions: {
          disabledDate: this.disabledDate
        },
        pickerOptions1: {
          disabledDate: this.disabledDate1
        },
        combos: [],
        information: {},
        product: {},
        price: '',
        allPrice: '',
        otherInfo: [],
        fpName: '',
        orderId: '',//订单编号
        priceId: '',
        productPrice: [],
        viewTime: '',
        eleView1: '',
        eleView2: '',
        deSex: '',
        viewAgeBelong: '',
        profList: [],
        assuredList: [],
        contactsList: [],//常用联系人
        flDoc: '',//费率表
        bdDoc: '',//保单样本
        noticeDoc: '',//客户告知书
        bookList: [],
        buyList: [],
        companyName: '',//保险公司名字
        companyCode: '',//保险公司编码
        endNow: Date.now(),
        startNow: Date.now(),
        maxNow: Date.now() + 8.64e7 * 364,
        maxLen: 0,
        insureTimeUnit: '',
        insureTime: '',
        insureFlag: 1
      }
    },
    watch: {
      price(val) {
        this.allPrice = this.price * this.insured.length;
        this.allPrice = this.allPrice.toFixed(2);
      }
    },
    methods: {
      detailEnter() {
        this.$router.push({
          name: 'productDetail',
          params: {
            id: this.product.proId
          }
        })
      },
      dayFun(dayCount) {
        console.log(dayCount);
        for (let i = 0; i < this.bzqxs.length; i++) {
          if (i === 0) {
            if (dayCount <= this.bzqxs[i].totalDays) {
              this.bzqx = this.bzqxs[i].view_time;
            }
          } else if (i === 1) {
            if (dayCount <= this.bzqxs[i].totalDays) {
              this.bzqx = this.bzqxs[i].view_time;
            } else {
              this.bzqx = this.bzqxs[i + 1].view_time;
            }
          } else if (i === this.bzqxs.length - 1) {
            if (this.bzqxs[i - 1].totalDays < dayCount && this.bzqxs[i].totalDays >= dayCount) {
              this.bzqx = this.bzqxs[i].view_time;
            }
          } else {
            if (this.bzqxs[i].totalDays == dayCount) {
              this.bzqx = this.bzqxs[i].view_time;
            }
            if (this.bzqxs[i].totalDays < dayCount && this.bzqxs[i + 1].totalDays >= dayCount) {
              this.bzqx = this.bzqxs[i + 1].view_time;
            }
          }
        }
        this.bzqxs.map((data, i) => {
          if (data.view_time === this.bzqx) {
            this.insureTime = data.totalDays;
            this.insureTimeUnit = data.insure_time_unit;
          }
        })
        this.combos.map((data, i) => {
          if (data.comboId === this.plan) {
            if (data.priceCalcuFlag) {
              this.viewTime = this.bzqx;
              this.priceComputer(this.product.proId, this.plan)
            } else {
              this.bzqx = this.product.viewInsureTime;
              this.bzqxs = [{
                'view_time': this.product.viewInsureTime,
                'totalDays': this.product.insureTime,
                'insure_time_unit': this.product.insureTimeUnit
              }];
              this.price = data.viewPrice;
              this.insureTime = this.product.insureTime;
              this.insureTimeUnit = this.product.insureTimeUnit;
            }
          }
        })
      },
      endTime() {
        if (this.tbDate) {
          let dayCount = ((Date.parse(this.endDate) - Date.parse(this.tbDate)) / 8.64e7) + 1;
          this.dayFun(dayCount);
        }
      },
      computerDay() {
        let dayCount = '';
        this.bzqxs.map((data, i) => {
          if (data.view_time == this.bzqx) {
            dayCount = data.totalDays || data.insure_time;
          }
        })
        let endT = new Date(Date.parse(this.tbDate) + 8.64e7 * (parseInt(dayCount) - 1));
        this.endDate = endT.getFullYear() + '-' + (endT.getMonth() + 1 < 10 ? '0' + (endT.getMonth() + 1) : endT.getMonth() + 1) + '-' + endT.getDate();
      },
      startTime() {
        //判断年月结束日期不让选择
        this.bzqxs.map((data, i) => {
          if (data.view_time == this.bzqx) {
            if (data.insure_time_unit === 1) {//天数
              this.disEnd = false;
            } else {//月年
              this.disEnd = true;
            }
          }
        })
        this.endNow = Date.parse(this.tbDate) - 8.64e7;
        let nowDate = new Date();
        let nowDay = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1) + '-' + (nowDate.getDate() < 10 ? '0' + (nowDate.getDate()) : nowDate.getDate());
        if (this.product.immediatelyFlag && (this.tbDate == nowDay) && this.product.immediatelyTimeLimit > nowDate.getHours()) {//即时投保
          this.maxNow = Date.parse(this.tbDate) - 8.64e7;
          let date = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
          this.startSecond = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
          let dateTime = new Date(Date.parse(this.tbDate));
          this.endDate = dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1) + '-' + dateTime.getDate();
          this.jsGo1 = false;
          this.jsGo2 = true;
          this.dayFun(1);//即时投保二天保障
        } else {
          this.maxNow = Date.parse(this.tbDate) + 8.64e7 * this.maxLen;
          this.jsGo1 = true;
          this.jsGo2 = false;
          this.computerDay();
          this.startSecond = '00:00:00';
        }
        if (!this.tbDate) {//清空起保日期
          this.endNow = Date.now() - 8.64e7;
        }
      },
      disabledDate1(time) {
        return time.getTime() < this.endNow || this.maxNow < time.getTime();
      },
      disabledDate(time) {
        return time.getTime() < this.startNow;
      },
      detailTk(id) {
        let routeData = this.$router.resolve({
          name: 'provision',
          params: {
            id: id
          }
        })
        window.open(routeData.href, '_blank');
      },
      readEnter() {
        if (this.readAct === 2) {//阅读完成
          this.readOk = true;
          this.rulesTip = true;
          this.readVisible = false;
        } else {
          this.readAct++;
        }
      },
      readClick() {
        if (this.readOk) {//已阅读
          if (this.rulesTip) {
            this.rulesTip = false;
          } else {
            this.rulesTip = true;
          }
        } else {//未阅读
          this.readVisible = true;
        }
      },
      weeboxNotice(content) {
        this.weeboxName = content;
        if (content === '免责内容') {
          this.weeboxContent = this.information.preventDuty;
        }
        if (content === '被保险人同意声明') {
          this.weeboxContent = this.information.insuredDeclare;
        }
        if (content === '投保提示') {
          this.weeboxContent = this.information.insuranceTip;
        }
        if (content === '投保声明') {
          this.weeboxContent = this.product.insuranceDeclare;
        }
        if (content === '个人信息保护政策') {
          this.weeboxContent = this.product.protectionPolicy;
        }
        this.weeboxVisible = true;
      },
      buyShop() {
        if (this.buyShow) {
          this.buyShow = false;
        } else {
          this.buyShow = true;
        }
      },
      loadContact(index) {
        this.contactsList.map((data, i) => {
          if (index == i) {
            this.sex = data.sex;
            this.tbPhone = data.mobile;
            this.realName = data.name;
            this.zjNumber = data.certificateContent;
            this.birthday = data.birthday;
            this.fpName = data.name;
            if (data.type == 1) {//个人
              this.tbrType = '1';
              this.zjTypes = [{
                value: '01',
                label: '身份证'
              },
                {
                  value: '02',
                  label: '护照'
                },
                {
                  value: '03',
                  label: '军官证'
                },
                {
                  value: '05',
                  label: '港澳回乡证'
                },
                {
                  value: '07',
                  label: '台胞证'
                }]
              this.zjType = data.certificateType;
              this.person = true
            } else {
              this.tbrType = '2';
              this.zjTypes = [{
                value: '1',
                label: '营业执照'
              }, {
                value: '2',
                label: '组织机构代码证'
              }]
              this.zjType = data.certificateType;
              this.person = false
            }
            this.lxrVisible = false;
          }
        })
      },
      uploadExcel(event) {
        let fileVal = document.querySelector("#excelFile").files[0];
        // 此时可以自行将文件上传至服务器
        let fileFormData = new FormData();
        fileFormData.append('file', fileVal);
        let loadingInstance = this.$loading();
        event.target.value = '';
        this.$ajax.post('/insurance/api/insure/insureExcelAnalyse', fileFormData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then((res) => {
            loadingInstance.close();
            if (res.data && res.data.code === 1) {
              this.assuredList = res.data.outData.assuredList;
              if (this.assuredList.length > 499) {
                this.assuredList = res.data.outData.assuredList.slice(0, 499);
              }
              if (this.assuredList.length > 0) {
                // this.insured = [];
                for (let [i, data0] of new Map(this.insured.map((item, i) => [i, item]))) {
                  if (data0) {
                    let arrIndex = [i];
                    this.insured = this.insured.filter((item, index) => !arrIndex.includes(index));
                  }
                }
                this.assuredList.map((data, i) => {
                  let proObj = {};
                  let able = data.certificateType == '01' ? true : false;
                  proObj = {
                    name: data.name,
                    zjType: data.certificateType.toString(),
                    number: data.certificateContent,
                    birthday: data.birthday,
                    sex: data.sex,
                    phone: data.mobile || '',
                    dateAble: able
                  }
                  this.insured.push(proObj)
                })
                this.allPrice = this.price * this.insured.length;
                this.allPrice = this.allPrice.toFixed(2);
              }
            } else {
              this.$message({
                message: res.data.message,
                duration: 3000,
                type: 'error'
              });
              return;
            }
            document.querySelector("#excelFile").tar
          }).catch((error) => {
          loadingInstance.close();
          this.$message({
            message: res.data.message,
            duration: 2000,
            type: 'error'
          });
          return;
        })
      },
      listCopy() {
        if (this.copyName === '') {
          this.$message({
            message: '请输入名单数据',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/insure/analysisInsuredList',
          data: {
            insuredStr: this.copyName
          }
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              this.profList = res.data.outData.profList;
              //最多只取499条数据
              if (this.profList.length > 499) {
                this.profList = res.data.outData.profList.slice(0, 499);
              }
              if (this.profList.length > 0) {
                // this.insured = [];
                for (let [i, data0] of new Map(this.insured.map((item, i) => [i, item]))) {
                  if (data0) {
                    let arrIndex = [i];
                    this.insured = this.insured.filter((item, index) => !arrIndex.includes(index));
                  }
                }
                this.profList.map((data, i) => {
                  let proObj = {};
                  let able = data.certificateType == '01' ? true : false;
                  proObj = {
                    name: data.name,
                    zjType: data.certificateType.toString(),
                    number: data.certificateContent,
                    birthday: data.birthday,
                    sex: data.sex,
                    phone: '',
                    dateAble: able
                  }
                  this.insured.push(proObj)
                })
                this.allPrice = this.price * this.insured.length;
                this.allPrice = this.allPrice.toFixed(2);
              }
              this.copyIntro = false;
            }
          })
      },
      ljtb() {
        let numberReg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/,
          //let numberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          hkCardReg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/,
          twCardReg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/,
          passportReg = /^([a-zA-z]|[0-9]){5,17}$/,
          armyReg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/,
          emailReg = /[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}/,
          phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/,
          nameReg = /^([\u4e00-\u9fa5]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5]|\u3007)+$/;
        let assuredCon = [], extentionCon = [], insuredNumber = [];
        if (!this.rulesIntro || !this.rulesTip) {
          this.$message({
            message: '请先阅读并勾选投保声明和免责内容等重要提示项',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        if (this.tbDate === '') {
          this.$message({
            message: '请输入起保日期',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        if (this.endDate === '') {
          this.$message({
            message: '请输入结束日期',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        if (this.otherInfo && this.otherInfo.length > 0) {
          for (let [i, data] of new Map(this.otherInfo.map((item, i) => [i, item]))) {
            if (!this.otherData[data.fieldName] && data.required) {
              this.$message({
                message: '请输入' + data.showName,
                duration: 2000,
                type: 'error'
              });
              return;
            }
            let extentionObj = {
              'colName': data.fieldName,
              'colValue': this.otherData[data.fieldName] || ''
            }
            extentionCon.push(extentionObj)
          }
        }
        window.console.log("this.tbrType = " + this.tbrType);
        if (this.tbrType === '1') {//个人
          if (this.realName === '' || !nameReg.test(this.realName)) {
            this.$message({
              message: '请输入二个汉字以上的投保人姓名',
              duration: 2000,
              type: 'error'
            });
            return;
          }
          if (!this.zjType || this.zjType === '01') {//身份证
            if (this.zjNumber === '' || !numberReg.test(this.zjNumber) || !this.checkParity(this.zjNumber)) {
              this.$message({
                message: '请输入正确格式的投保人的身份证号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (!this.zjType || this.zjType === '02') {//护照
            if (this.zjNumber === '' || !passportReg.test(this.zjNumber)) {
              this.$message({
                message: '请输入正确格式的投保人的护照号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (!this.zjType || this.zjType === '03') {//军人证
            if (this.zjNumber === '' || !armyReg.test(this.zjNumber)) {
              this.$message({
                message: '请输入正确格式的投保人的军人证号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (!this.zjType || this.zjType === '05') {//港澳回乡证
            if (this.zjNumber === '' || !hkCardReg.test(this.zjNumber)) {
              this.$message({
                message: '请输入正确格式的投保人的港澳回乡证号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (!this.zjType || this.zjType === '07') {//台胞证
            if (this.zjNumber === '' || !twCardReg.test(this.zjNumber)) {
              this.$message({
                message: '请输入正确格式的投保人的台胞证号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          }

          if (!this.birthday || this.birthday === '') {
            this.$message({
              message: '请选择投保人出生日期',
              duration: 2000,
              type: 'error'
            });
            return;
          }

          if (!this.sex || this.sex === '') {
            this.$message({
              message: '请选择投保人性别',
              duration: 2000,
              type: 'error'
            });
            return;
          }
          window.console.log("this.birthday = " + this.birthday);
        } else {
          if (!this.realName || this.realName === '' || !nameReg.test(this.realName)) {
            this.$message({
              message: '请输入二个汉字以上的投保企业名称',
              duration: 2000,
              type: 'error'
            });
            return;
          }
        }
        if (!this.zjNumber || this.zjNumber === '') {
          this.$message({
            message: '请输入投保证件号码',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        if (!this.tbPhone || this.tbPhone === '' || !phoneReg.test(this.tbPhone)) {
          this.$message({
            message: '请输入正确格式的投保人手机号码',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        if (this.tbEmail !== '' && !emailReg.test(this.tbEmail)) {
          this.$message({
            message: '请输入正确格式的投保人电子邮箱',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        if (this.insured.length === 0) {
          this.$message({
            message: '请添加被保人',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        for (let [i, data] of new Map(this.insured.map((item, i) => [i, item]))) {
          if (!data.name) {
            this.$message({
              message: '请输入被保人姓名',
              duration: 2000,
              type: 'error'
            });
            return;
          }
          if (!data.zjType) {//身份证
            if (data.number === '' || !numberReg.test(data.number) || !this.checkParity(data.number)) {
              let row = i + 1;
              this.$message({
                message: '第' + row + '行证件类型为空',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (data.zjType === '01') {//身份证
            if (!data.number || data.number === '' || !numberReg.test(data.number) || !this.checkParity(data.number)) {
              let row = i + 1;
              this.$message({
                message: '第' + row + '行身份证号码有误',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (data.zjType === '02') {//护照
            if (!data.number || data.number === '' || !passportReg.test(data.number)) {
              this.$message({
                message: '请输入正确格式的被保人的护照号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (data.zjType === '03') {//军人证
            if (!data.number || data.number === '' || !armyReg.test(data.number)) {
              this.$message({
                message: '请输入正确格式的被保人的军人证号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (data.zjType === '05') {//港澳回乡证
            if (!data.number || data.number === '' || !hkCardReg.test(data.number)) {
              this.$message({
                message: '请输入正确格式的被保人的港澳回乡证号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          } else if (data.zjType === '07') {//台胞证
            if (!data.number || data.number === '' || !twCardReg.test(data.number)) {
              this.$message({
                message: '请输入正确格式的被保人的台胞证号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          }
          if (!data.number || data.number === '') {
            this.$message({
              message: '请输入被保人证件号码',
              duration: 2000,
              type: 'error'
            });
            return;
          }
          if (!data.birthday || data.birthday === '') {
            this.$message({
              message: '请选择被保人出生日期',
              duration: 2000,
              type: 'error'
            });
            return;
          }
          if (data.phone !== '') {
            if (!phoneReg.test(data.phone)) {
              this.$message({
                message: '请输入被保人正确格式的手机号码',
                duration: 2000,
                type: 'error'
              });
              return;
            }
          }
          let assuredObj = {
            'birthday': data.birthday,
            'certificateContent': data.number,
            'certificateType': data.zjType,
            'mobile': data.phone,
            'name': data.name,
            'sex': data.sex
          }
          assuredCon.push(assuredObj);
          insuredNumber.push(data.number);
        }
        let numberHash = [];
        let msg = '';
        let isError = false;
        for (var i = 0; i < insuredNumber.length; i++) {
          if (numberHash.indexOf(insuredNumber[i]) == -1) {
            numberHash.push(insuredNumber[i]);
          } else {
            let index = i + 1,
              page = numberHash.indexOf(insuredNumber[i]) + 1;
            // this.$message({
            // message: '第'+ page + '行身份证号码与第' + index + '行身份证号码重复',
            // duration: 2000,
            // type: 'error'
            // });
            // return;
            msg += '第' + page + '行身份证号码与第' + index + '行身份证号码重复；\n'
            isError = true;
          }
        }
        if (isError) {
          this.$message({
            message: msg,
            duration: 3000,
            type: 'error'
          });
          return;
        }
        let joinMr = this.joinLxr ? '1' : '0';
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/insure/saveBillSubmitForm',
          data: {
            assuredList: assuredCon,
            extentionList: extentionCon,
            insBill: {
              'enableDate': this.tbDate + ' ' + this.startSecond,
              'disEnableDate': this.endDate + ' 23:59:59',
              'id': this.orderId,
              'insureType': this.cdType,
              'proId': this.product.proId,
              'remark': this.beizhu
            },
            insurer: {
              'insBirthday': this.birthday,
              'insCredentials': this.zjNumber,
              'insCredentialsType': this.zjType,
              'insEmail': this.tbEmail,
              'insName': this.realName,
              'insPhone': this.tbPhone,
              'insSex': this.sex,
              'insType': this.tbrType,
              'saveContactsFlag': joinMr
            },
            optType: '2',
            productPriceVo: {
              'comboId': this.plan,
              'proId': this.product.proId,
              'viewTime': this.viewTime,
              'eleView1': this.eleView1,
              'eleView2': this.eleView2,
              'priceId': this.priceId,
              'proId': this.product.proId,
              'sex': this.deSex,
              'viewAgeBelong': this.viewAgeBelong,
              'insureTime': this.insureTime,
              'insureTimeUnit': this.insureTimeUnit
            }
          }
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              let orderId = res.data.outData.data.id;
              this.$router.push({
                name: 'orderDetail',
                params: {
                  id: orderId
                }
              })
            } else {
              this.$message({
                message: res.data.message,
                duration: 2000,
                type: 'error'
              });
              return;
            }
          })
      },
      zjChange(val) {
        if (val === '01') {//身份证
          this.birthdayDis = true
        } else {
          this.birthdayDis = false
        }
      },
      emailBlur() {
        let emailReg = /[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}/;
        if (this.tbEmail !== '') {
          if (!emailReg.test(this.tbEmail)) {
            this.$message({
              message: '请输入正确格式的电子邮箱',
              duration: 2000,
              type: 'error'
            });
            return;
          }
        }
      },
      phoneBlur() {
        let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
        if (this.tbPhone !== '') {
          if (!phoneReg.test(this.tbPhone)) {
            this.$message({
              message: '请输入正确格式的手机号码',
              duration: 2000,
              type: 'error'
            });
            return;
          }
        }
      },
      nameBlur() {
        let nameReg = /^([\u4e00-\u9fa5]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5]|\u3007)+$/;
        if (this.realName === '' || !nameReg.test(this.realName)) {
          this.$message({
            message: '请输入二个汉字以上',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        this.fpName = this.realName;
      },
      zjBlur() {
        let numberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (this.zjType === '01') {//身份证
          if (this.zjNumber === '' || !numberReg.test(this.zjNumber) || !this.checkParity(this.zjNumber)) {
            this.$message({
              message: '请输入正确格式的身份证号码',
              duration: 2000,
              type: 'error'
            });
            return;
          }
          this.birthday = this.getCard(this.zjNumber);
          this.sex = this.getSex(this.zjNumber);
        } else {
          if (this.zjNumber === '') {
            this.$message({
              message: '请输入证件号码',
              duration: 2000,
              type: 'error'
            });
            return;
          }
        }
      },
      phoneCheck(index) {
        let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
        if (this.insured[index].phone !== '') {
          if (!phoneReg.test(this.insured[index].phone)) {
            this.$message({
              message: '请输入正确格式的手机号码',
              duration: 2000,
              type: 'error'
            });
            return;
          }
        }
      },
      numberCheck(index) {
        let numberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (this.insured[index].zjType === '01') {//身份证
          if (this.insured[index].number === '' || !numberReg.test(this.insured[index].number) || !this.checkParity(this.insured[index].number)) {
            this.$message({
              message: '请输入正确格式的身份证号码',
              duration: 2000,
              type: 'error'
            });
            return;
          }
          this.insured[index].birthday = this.getCard(this.insured[index].number);
          this.insured[index].sex = this.getSex(this.insured[index].number);
        } else {
          if (this.insured[index].number === '') {
            this.$message({
              message: '请输入证件号码',
              duration: 2000,
              type: 'error'
            });
            return;
          }
        }
      },
      //身份证识别出生日期
      getCard(idCard) {
        var birthday = "";
        if (idCard != null && idCard != "") {
          if (idCard.length == 15) {
            birthday = "19" + idCard.substr(6, 6);
          } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8);
          }
          birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
        }
        return birthday;
      },
      getSex(certificateNum) {
        //15位身份证号，倒数第一位能看出性别，男单数女双数
        //18位身份证号，倒数第二位能看出性别，男单数女双数
        var sex;
        if (certificateNum.length == '15') {
          if (parseInt(certificateNum.charAt(14) / 2) * 2 != certificateNum.charAt(14)) {
            sex = '男';
          } else {
            sex = '女';
          }
        } else if (certificateNum.length == '18') {
          if (parseInt(certificateNum.charAt(16) / 2) * 2 != certificateNum.charAt(16)) {
            sex = '男'
          } else {
            sex = '女'
          }
        }
        return sex;
      },
      //身份证校验位的检测
      checkParity(card) {
        //15位转18位
        card = this.changeFivteenToEighteen(card);
        var len = card.length;
        if (len == '18') {
          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
          var cardTemp = 0, i, valnum;
          for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
          }
          valnum = arrCh[cardTemp % 11];
          if (valnum == card.substr(17, 1).toLocaleUpperCase()) {
            return true;
          }
          return false;
        }
        return false;
      },
      //15位转18位身份证号
      changeFivteenToEighteen(card) {
        if (card.length == '15') {
          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
          var cardTemp = 0, i;
          card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
          for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
          }
          card += arrCh[cardTemp % 11];
          return card;
        }
        return card;
      },
      nameCheck(index) {
        let nameReg = /^([\u4e00-\u9fa5]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5]|\u3007)+$/;
        if (this.insured[index].name === '' || !nameReg.test(this.insured[index].name)) {
          this.$message({
            message: '请输入二个字以上的姓名',
            duration: 2000,
            type: 'error'
          });
          return;
        }
      },
      changeType(index) {
        if (this.insured[index].zjType === '01') {
          this.insured[index].dateAble = true
        } else {
          this.insured[index].dateAble = false
        }
      },
      delInsured() {

        console.log("delInsured：this.checkCount = " + this.checkCount);
        if (this.checkCount === 0) {
          this.$message({
            message: '请选择需删除项',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        let arrIndex = [];
        this.checked.map((val, i) => {
          if (val) {
            arrIndex.push(i);
          }
        })
        this.insured = this.insured.filter((item, index) => !arrIndex.includes(index))
        this.checkCount = 0;
        if (this.insured.length === 0) {
          this.allchecked = false;
          this.checked = [];
        }
        this.insured.map((data, i) => {
          this.checked[i] = false;
        })
        this.allPrice = (this.price * this.insured.length).toFixed(2);
      },
      addInsured() {
        if (this.insured.length > 499) {
          this.$message({
            message: '最大支持499个被保人',
            duration: 2000,
            type: 'error'
          });
          return;
        }
        let addObj = {
          name: '',
          zjType: '01',
          number: '',
          birthday: '',
          sex: '男',
          phone: '',
          dateAble: true
        };
        this.insured.push(addObj);
        this.allPrice = this.price * this.insured.length;
        this.allPrice = this.allPrice.toFixed(2);
      },
      listCheck(val) {
        if (!val) {//取消
          this.allchecked = false;
          this.checkCount--;
          console.log("反选 this.checkCount = " + this.checkCount);
        } else {
          this.checkCount++;
          if (this.checkCount == this.insured.length) {
            this.allchecked = true;
            console.log("全选 this.checkCount = " + this.checkCount);
          }
        }
      },
      allCheck(val) {
        if (val) {//全选
          this.insured.map((data, i) => {
            this.checked[i] = true;
          })
          this.checkCount = this.insured.length;
        } else {
          this.insured.map((data, i) => {
            this.checked[i] = false;
          })
          this.checkCount = 0;
        }
      },
      tbType(val) {
        if (val == '1') {//个人
          this.tbName = '姓名';
          this.tbNametip = '请输入姓名';
          this.person = true;
          this.zjType = '01';
          this.zjTypes = [{
            value: '01',
            label: '身份证'
          },
            {
              value: '02',
              label: '护照'
            },
            {
              value: '03',
              label: '军官证'
            },
            {
              value: '05',
              label: '港澳回乡证'
            },
            {
              value: '07',
              label: '台胞证'
            }]
        } else {//单位
          this.tbName = '企业名称';
          this.tbNametip = '请输入企业名称';
          this.person = false;
          this.zjType = '1';
          this.zjTypes = [{
            value: '1',
            label: '营业执照'
          }, {
            value: '2',
            label: '组织机构代码证'
          }]
        }
      },
      planChange(val) {
        this.tbDate = '';
        this.endDate = '';
        this.combos.map((data, i) => {
          if (data.comboId === val) {
            if (data.priceCalcuFlag) {
              this.queryDate(this.product.proId, val)
            } else {
              this.bzqx = this.product.viewInsureTime;
              this.bzqxs = [{
                'view_time': this.product.viewInsureTime,
                'totalDays': this.product.insureTime,
                'insure_time_unit': this.product.insureTimeUnit
              }];
              this.maxLen = parseInt(this.product.insureTime) - 1;
              this.maxNow = Date.now() + 8.64e7 * this.maxLen;
              this.price = data.viewPrice;
              this.insureTime = this.product.insureTime;
              this.insureTimeUnit = this.product.insureTimeUnit;
            }
            this.planCur = i;
          }
        })
      },
      bzPrice(val) {
        if (this.tbDate && this.endDate) {
          let dayCount = '';
          this.bzqxs.map((data, i) => {
            if (data.view_time == val) {
              dayCount = data.totalDays;
            }
          })
          let endT = new Date(Date.parse(this.tbDate) + 8.64e7 * (parseInt(dayCount) - 1));
          this.endDate = endT.getFullYear() + '-' + (endT.getMonth() + 1 < 10 ? '0' + (endT.getMonth() + 1) : endT.getMonth() + 1) + '-' + endT.getDate();
        }
        this.bzqxs.map((data, i) => {
          if (data.view_time === val) {
            this.insureTime = data.totalDays;
            this.insureTimeUnit = data.insure_time_unit;
            if (data.insure_time_unit === 1) {//天数
              this.disEnd = false;
            } else {//月年
              this.disEnd = true;
            }
          }
        })
        this.combos.map((data, i) => {
          if (data.comboId === this.plan) {
            if (data.priceCalcuFlag) {
              this.viewTime = val;
              this.priceComputer(this.product.proId, this.plan)
            } else {
              this.bzqx = this.product.viewInsureTime;
              this.bzqxs = [{
                'view_time': this.product.viewInsureTime,
                'totalDays': this.product.insureTime,
                'insure_time_unit': this.product.insureTimeUnit
              }];
              this.price = data.viewPrice;
              this.insureTime = this.product.insureTime;
              this.insureTimeUnit = this.product.insureTimeUnit;
            }
          }
        })
      },
      priceComputer(proId, comboId) {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/insure/findProductPriceByKeysActualAge',
          data: {
            comboId: comboId,
            eleView1: this.eleView1,
            eleView2: this.eleView2,
            priceId: this.priceId,
            proId: proId,
            sex: this.deSex,
            viewAgeBelong: this.viewAgeBelong,
            viewTime: this.viewTime,
            insureTime: this.insureTime,
            insureTimeUnit: this.insureTimeUnit
          }
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              let priceIntro = res.data.outData.priceInfo;
              if (priceIntro) {
                this.price = priceIntro.price;
                this.priceId = priceIntro.id;
              } else {
                this.combos.map((data, i) => {
                  if (data.comboId == comboId) {
                    this.price = data.viewPrice;
                  }
                })
              }
            } else {
              this.combos.map((data, i) => {
                if (data.comboId == comboId) {
                  this.price = data.viewPrice;
                }
              })
            }
          })
      },
      queryDate(proId, comboId) {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/insure/queryInsProductPriceDistinctItemByCombId/' + proId + '/' + comboId
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              let insureTime = res.data.outData.insureTimeList;
              this.insureTime = res.data.outData.defaulePrice.insureTime || '';
              this.insureTimeUnit = res.data.outData.defaulePrice.insureTimeUnit || '';
              this.viewTime = res.data.outData.defaulePrice.viewTime;
              this.eleView1 = res.data.outData.defaulePrice.eleView1 || '',
                this.eleView2 = res.data.outData.defaulePrice.eleView2 || '',
                this.sex = res.data.outData.defaulePrice.sex || '',
                this.viewAgeBelong = res.data.outData.defaulePrice.iewAgeBelong || '';
              this.priceId = res.data.outData.defaulePrice.id || '';
              if (insureTime) {
                this.bzqx = res.data.outData.defaulePrice.viewTime;
                this.bzqxs = insureTime;
                //价格计算
                this.priceComputer(proId, comboId);
                //计算最大保障时间范围
                this.maxLen = parseInt(insureTime[insureTime.length - 1].totalDays) - 1;
                this.maxNow = Date.now() + 8.64e7 * this.maxLen;
              } else {
                this.bzqx = this.product.viewInsureTime;
                this.bzqxs = [{
                  'view_time': this.product.viewInsureTime,
                  'totalDays': this.product.insureTime,
                  'insure_time_unit': this.product.insureTimeUnit
                }];
                this.maxLen = parseInt(this.product.insureTime) - 1;
                this.maxNow = Date.now() + 8.64e7 * this.maxLen;
              }
            } else {
              this.bzqx = this.product.viewInsureTime;
              this.bzqxs = [{
                'view_time': this.product.viewInsureTime,
                'totalDays': this.product.insureTime,
                'insure_time_unit': this.product.insureTimeUnit
              }];
              this.maxLen = parseInt(this.product.insureTime) - 1;
              this.maxNow = Date.now() + 8.64e7 * this.maxLen;
            }
          })
      },
      contentShow(index) {
        this.$refs['content' + index][0].style.display = 'block';
      },
      contentHide(index) {
        this.$refs['content' + index][0].style.display = 'none';
      },
      planTab(index) {
        this.planCur = index;
      },
      sureInsure() {
        this.centerDialogVisible = false;
        this.tiggerShow = false;
      },
      tiggerFun() {
        this.centerDialogVisible = true;
      },
      saveLxr() {
        if (this.joinLxr) {
          this.joinLxr = false
        } else {
          this.joinLxr = true
        }
      },
      rulesClick() {
        if (this.rulesIntro) {
          this.rulesIntro = false
        } else {
          this.rulesIntro = true
        }
      },
      //产品列表
      productList(proId, comboId) {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/product/collectProductList'
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              this.productIntro = res.data.outData.typeList;
              this.productIntro.map((data, i) => {
                if (i === 0) {
                  if (!proId) {
                    data.proList.map((val, index) => {
                      if (index === 0) {
                        this.insureInfo(val.pro_id, val.combo_id);
                        this.act = val.pro_id;
                      }
                    })
                  }
                }
                data.proList.map((val, index) => {
                  if (proId) {
                    if (val.pro_id == proId) {
                      this.insureInfo(val.pro_id, comboId);
                      this.act = val.pro_id;
                    }
                  }
                })
              })
            }
          })
      },
      insureInfo(proId, comboId) {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/insure/insureInfo/' + proId,
          params: {
            comboId: comboId,
            backInsureFlag: this.insureFlag
          }
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              this.allContentList = res.data.outData.allContentList;
              this.combos = res.data.outData.combos;
              this.information = res.data.outData.information;
              this.product = res.data.outData.product;
              this.otherInfo = res.data.outData.formInput.otherInfo;
              this.plan = comboId;
              if (this.product.insureType === 2) {
                this.cdType = '2'
              } else if (this.product.insureType === 1) {
                this.cdType = '1'
              } else {
                this.cdType = '2'
              }
              if (!localStorage.getItem('orderId')) {//不是从订单过来的
                this.combos.map((data, i) => {
                  if (i === 0) {
                    this.plan = data.comboId;
                    this.price = data.viewPrice;
                    this.allPrice = data.viewPrice;
                    if (data.priceCalcuFlag) {
                      this.queryDate(this.product.proId, data.comboId);
                    } else {
                      this.bzqx = this.product.viewInsureTime;
                      this.bzqxs = [{'view_time': this.product.viewInsureTime}];
                    }
                  }
                })
              } else {
                this.queryDate(this.product.proId, comboId);
              }
              this.bookList = res.data.outData.bookList;
              let server = res.data.outData.productFileServer
              if (this.bookList.length !== 0) {
                this.bookList.map((data, i) => {
                  if (data.docType === '04') {//保单样本
                    this.bdDoc = server + data.docLink;
                  }
                  if (data.docType === '05') {//费率表
                    this.flDoc = server + data.docLink;
                  }
                  if (data.docType === '03') {//客户告知书
                    this.noticeDoc = server + data.docLink;
                  }
                })
              }
              this.companyName = res.data.outData.insurer.insurerName;
              this.companyCode = res.data.outData.insurer.insurerCode;
            } else {
              this.$message({
                message: res.data.message,
                duration: 2000,
                type: 'error'
              });
              return;
            }
            //计算即时投保起始日期
            if (this.product.immediatelyFlag && this.product.immediatelyTimeLimit > new Date().getHours()) {//即时投保
              this.endNow = Date.now() - 8.64e7;
              this.startNow = Date.now() - 8.64e7;
            } else {
              this.endNow = Date.now();
              this.startNow = Date.now();
            }
          })
      },
      buyTab(comboId, proId, index) {
        localStorage.removeItem('orderId');
        this.buyact = index;
        this.act = '';
        this.insureInfo(proId, comboId);
        this.defaultData();
      },
      insureTab(comboId, proId) {
        localStorage.removeItem('orderId');
        this.act = proId;
        this.buyact = -1;
        this.insureInfo(proId, comboId);
        this.defaultData();
      },
      //初始化数据
      defaultData() {
        this.orderId = '';
        this.tbDate = '';
        this.endDate = '';
        this.disEnd = false;
        this.beizhu = '';
        this.otherData = {};
        this.insured = [{
          name: '',
          zjType: '01',
          number: '',
          birthday: '',
          sex: '男',
          phone: '',
          dateAble: true
        }];
        this.rulesIntro = false;
        this.rulesTip = false;
        let userIntro = JSON.parse(localStorage.getItem('user'));
        if (userIntro.userType !== 1) {//非普通账户
          this.tiggerShow = true;
        }
        this.readAct = 0;
        this.readOk = false;
        this.jsGo1 = true;
        this.jsGo2 = false;
        this.startSecond = '00:00:00';
      },
      showSub(index) {
        if (this.$refs['listBox' + index][0].style.display === 'block') {
          this.$refs['listBox' + index][0].style.display = 'none';
          this.$refs['nav' + index][0].className = 'insureNav-title insureNav-up';
        } else {
          this.$refs['listBox' + index][0].style.display = 'block';
          this.$refs['nav' + index][0].className = 'insureNav-title insureNav-down';
        }
      },
      orderDetail(id) {
        let loadingInstance = this.$loading();
        this.$ajax({
          method: 'post',
          url: '/insurance/api/order/grepInsBillInfo/' + id
        })
          .then((res) => {
            loadingInstance.close();
            if (res.data.code === 1) {
              let proId = res.data.outData.billInfo.productPriceVo.proId;
              let comboId = res.data.outData.billInfo.productPriceVo.comboId;
              this.bzqx = res.data.outData.billInfo.productPriceVo.viewTime;
              this.beizhu = res.data.outData.billInfo.insBill.remark;
              this.tbDate = res.data.outData.billInfo.insBill.enableDate.substr(0, 10);
              this.endDate = res.data.outData.billInfo.insBill.disEnableDate.substr(0, 10);
              if (res.data.outData.billInfo.extentionList && res.data.outData.billInfo.extentionList.length !== 0) {
                res.data.outData.billInfo.extentionList.map((data, i) => {
                  this.otherData[data.colName] = data.colValue;
                })
              }
              this.cdType = res.data.outData.billInfo.insBill.insureType;
              this.price = res.data.outData.billInfo.price;
              this.allPrice = res.data.outData.billInfo.premium;
              this.allPrice = this.allPrice.toFixed(2);
              let insurer = res.data.outData.billInfo.insurer;
              if (insurer.insType === 2) {//团体
                this.person = false;
                this.zjTypes = [{
                  value: '1',
                  label: '营业执照'
                }, {
                  value: '2',
                  label: '组织机构代码证'
                }]
              }
              this.birthday = insurer.insBirthday;
              this.zjNumber = insurer.insCredentials;
              this.zjType = insurer.insCredentialsType;
              this.tbEmail = insurer.insEmail;
              this.realName = insurer.insName;
              this.fpName = insurer.insName;
              this.tbPhone = insurer.insPhone;
              this.sex = insurer.insSex;
              this.tbrType = insurer.insType.toString();
              this.productList(proId, comboId);
              let assuredList = res.data.outData.billInfo.assuredList;
              this.insured = [];
              assuredList.map((data, i) => {
                let able = data.certificateType === '01' ? true : false;
                let assObj = {
                  name: data.name,
                  zjType: data.certificateType,
                  number: data.certificateContent,
                  birthday: data.birthday,
                  sex: data.sex,
                  phone: data.mobile,
                  dateAble: able
                }
                this.insured.push(assObj);
              });
              this.orderId = res.data.outData.billInfo.insBill.id;
            } else {
              this.$message({
                message: res.data.message,
                duration: 2000,
                type: 'error'
              });
              return;
            }
          })
      },
      contactUser() {
        this.$ajax({
          method: 'post',
          url: '/insurance/api/userContacts/allContacts'
        })
          .then((res) => {
            if (res.data.code === 1) {
              this.contactsList = res.data.outData.userContactsList;
            } else {
              this.$message({
                message: res.data.message,
                duration: 2000,
                type: 'error'
              });
              return;
            }
          })
      },
      buyFun() {
        this.$ajax({
          method: 'post',
          url: '/insurance/api/product/queryRegularlyBuyProductList/10',
        })
          .then((res) => {
            if (res.data.code === 1) {
              this.buyList = res.data.outData.rows;
            } else {
              this.$message({
                message: res.data.message,
                duration: 2000,
                type: 'error'
              });
              return;
            }
          })
      }
    },
    mounted() {
      this.contactUser();
      this.buyFun();
      if (window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1) {
        this.downloadUrl = 'http://127.0.0.1:9900/insurance/api/insure/downloadAssureTemplate';
      } else {
        this.downloadUrl = '/insurance/api/insure/downloadAssureTemplate';
      }
      let orderId = localStorage.getItem('orderId'),
        plusType = localStorage.getItem('plusType'),
        pruId = JSON.parse(localStorage.getItem('pruId'));
      if (orderId) {//修改订单过来的
        if (plusType) {//plus用户过来的
          this.plusShow = true;
          this.menuShow = false;
          this.insureFlag = '';
        }
        this.orderDetail(orderId);
      } else {
        this.defaultData();
        if (pruId) {//plus用户产品过来的
          this.plusShow = true;
          this.menuShow = false;
          this.insureFlag = '';
          this.productList(pruId.proId, pruId.comboId);
        } else {
          this.productList();
        }
      }
    },
    beforeDestroy() {
      localStorage.removeItem('orderId');
      localStorage.removeItem('pruId');
      localStorage.removeItem('plusType');
    }
  }
</script>
<style>

</style>

