<template>
    <section class="insure-content">
        <SubHeader></SubHeader>
        <div class="login-main clearfix">
            <div class="register-step">
                <div class="step-intro res-step1" :class="{'current':step == 1}"><span>1</span>填写基本信息</div>
                <div class="step-intro res-step2" :class="{'current':step == 2}"><span>2</span>填写登录信息</div>
                <div class="step-intro res-step3" :class="{'current':step == 3}"><span>3</span>完成</div>
            </div>
            <div class="register-box">
                <!-- 填写基本信息 -->
                <div class="register-1" v-show="step1">
                    <div class="register-intro">
                        <span class="res-lable">行业标签：</span>
                        <div class="res-actCon">
                            <el-select v-model="areaName" placeholder="请选择" @change="fieldSel1">
                                <el-option
                                v-for="item in areaNames"
                                :key="item.id"
                                :label="item.value"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">场景标签：</span>
                        <div class="res-actCon">
                            <el-select v-model="cjName" multiple placeholder="请选择">
                                <el-option
                                v-for="item in cjNames"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">身份标签：</span>
                        <div class="res-actCon">
                            <el-select v-model="sfName" placeholder="请选择">
                                <el-option
                                v-for="item in sfNames"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">主体类型：</span>
                        <div class="res-actCon">
                            <el-select v-model="zhutiName" placeholder="请选择" @change="zhutiSel">
                                <el-option
                                v-for="item in zhutiNames"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="register-intro" v-show="companyShow">
                        <span class="res-lable">企业名称：</span>
                        <div class="res-actCon"><el-input v-model="companyName" placeholder="请输入企业名称"></el-input></div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">联系人：</span>
                        <div class="res-actCon"><el-input v-model="userName" placeholder="请输入运营对接人姓名"></el-input></div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">地区：</span>
                        <div class="res-area">
                            <el-select v-model="province" placeholder="省份" @change="provinceSel">
                                <el-option
                                v-for="item in provinces"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="res-area">
                            <el-select v-model="city" placeholder="城市" @change="citySel">
                                    <el-option
                                    v-for="item in citys"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                    </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="next-btn" @click="nextStep1">下一步</div>
                </div>
                <!-- 填写登录信息 -->
                <div class="register-2" v-show="step2">
                    <div class="register-intro">
                        <span class="res-lable">手机号：</span>
                        <div class="res-logCon"><el-input v-model="telephone" placeholder="请输入手机号"></el-input></div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">图片验证码：</span>
                        <div class="res-logYzm"><el-input v-model="imgYzm" placeholder="请输入图片验证码"></el-input></div>
                        <img :src="txmImg" class="txmm">
                        <div class="txmm-change" @click="changeImg"></div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">短信验证码：</span>
                        <div class="res-logCon"><el-input v-model="yzmCode" placeholder="请输入短信验证码"></el-input></div>
                        <div class="loginMsg-btn" v-if="hqBtn" @click="yzmFun">{{text}}</div>
                        <div class="loginMsg-second" v-if="secondGo"><span>{{second}}</span>s</div>
                    </div>
                    <div class="register-intro">
                        <span class="res-lable">密码：</span>
                        <div class="res-logCon"><el-input v-model="password" placeholder="请输入6-20位密码" show-password></el-input></div>
                    </div>
                    <div class="login-rules"><span class="rules-icon rules-no" :class="{'rules-yes':rules}" @click="rulesAct"></span><span class="rules-txt">我已阅读并接受<a href="javascript:;" @click="zcxyVisible= true">《注册协议》</a><a href="javascript:;" @click="yszcVisible = true">《用户隐私政策》</a></span></div>
                    <div class="register-act">
                        <span class="resAct-prev" @click="prevStep">上一步</span>
                        <span class="res-enter" @click="tjSubmit">提交</span>
                    </div>
                </div>
            </div>
            <!-- 完成 -->
            <div class="register-ok" v-show="step3">
                <div class="resOk-top">
                    <span class="sucess-icon"></span>
                    <div class="resOk-txt">操作成功</div>
                </div>
                <div class="resOk-box">
                    <ul class="resOk-list">
                        <li><span>所属领域：</span>{{areaName}}-{{cjName.join(',')}}-{{sfName}}</li>
                        <li><span>主体类型：</span>{{zhutiName === '2' ? '企业' : '个人'}}</li>
                        <li v-show="companyShow"><span>企业名称：</span>{{companyName}}</li>
                        <li><span>联系人：</span>{{userName}}</li>
                        <li><span>地区：</span>{{provinceTxt}}-{{cityTxt}}</li>
                    </ul>
                </div>
                <div class="resOk-btn" @click="loginGo">确定</div>
            </div>
        </div>

        <!--注册协议弹层-->
        <el-dialog
            title="注册协议"
            :visible.sync="zcxyVisible"
            width="40%"
            top="20vh"
            center>
            <div class="weebox-content">
                尊敬的会员：<br>
欢迎注册耀保网平台，耀保网平台（以下简称平台）是由广州问鼎保险经纪有限公司（以下简称广州问鼎）运营的行业保险服务平台，在您正式使用平台的服务前，请认真阅读本协议的全部内容，并充分理解本协议及各条款内容，尤其需关注由粗体标示的重要条款。<br>
阅读协议的过程中，如果您不同意或无法理解本协议的任意内容，请不要点击“我已阅读并同意”按钮，并应立即停止注册程序。一旦点击“我已阅读并同意”按钮或使用平台服务的，即表示您理解并接受下述所有条款和条件，自愿受本协议的约束。<br>
<b>一、定义</b><br>
1.1 耀保网：由广州问鼎保险经纪有限公司运营的域名为：yaobx18.com的网站以及相关的APP及微信公众号。<br>
1.2 耀保网会员（以下简称“会员”或“您”）：指同意与耀保网合作，遵守本协议约定，完成耀保网会员在线注册并具备履行耀保网平台合作所需的相应资质和能力的自然人、法人或其他组织。<br>
1.3 客户：通过耀保网会员或者耀保网会员所推广的产品展示页面完成产品购买的自然人、法人或其他组织。<br>
<b>二、注册</b><br>
2.1 在您注册账户并使用平台前，您应当具备中华人民共和国法律规定的与您行为相适应的民事权利能力及民事行为能力。若您不具备前述与您行为相适应的民事权利能力及民事行为能力，则您及您的监护人应依照法律规定承担因此而导致的一切后果。<br>
2.2 用户进行注册时，需要提交本人真实的手机号；您理解并同意，您有义务保持您提供信息的真实性及准确性。耀保网通过您的上述的联系方式向您送达各类通知，而此类通知的内容可能对您的权利义务产生重大的有利或不利影响，请您务必及时关注。如因提供的联系方式不准确，或不及时告知变更后的联系方式，使相关重要信息或通知无法送达或未及时送达，由您自行承担由此可能产生的法律后果。<br>
2.3 注册完成后，您可以通过注册用户名、密码登陆平台。耀保网任何时候都不会主动要求您提供您的账户密码，您应当妥善保管您的用户名和密码，对于因密码泄露所致的损失及后果，耀保网不承担任何责任，您应通过司法、行政等救济途径向侵权行为人追偿。<br>
2.4 您保证不向其他任何人泄露用户名及密码，如您发现任何人冒用或盗用您的用户名及密码或有任何其他可能危及您的账户安全的情形时，您应当立即以有效方式通知耀保网，要求耀保网暂停相关服务。您理解耀保网对您的请求采取行动需要合理时间，且耀保网应您请求而采取的行动可能无法避免或阻止侵害后果的形成或扩大，除耀保网存在过错外，耀保网不承担任何责任。<br>
2.5 鉴于网络服务的特殊性，耀保网无义务审核是否是您本人使用该用户名及密码，仅审核用户名及密码是否与数据库中保存的一致，任何人只要输入的用户名及密码与数据库中保存的一致，即可凭借该用户名及密码登陆并使用耀保网所提供的各类服务，所以，您账户下的操作也视为您本人的行为，由您承担相关责任，请您务必妥善保管用户名和密码等账户信息。<br>
<b>三、会员权利和义务</b><br>
3.1 会员在遵守会员协议的前提下，依法享有本平台提供的服务，有权对本平台的服务进行监督、批评和指导，网站欢迎会员提出服务改进建议，并会以勤勉态度为会员提供服务。会员对于本平台提供的服务有任何疑问，应及时通知本平台。<br>
3.2 会员应当按照本协议和网站的有关管理规则提交注册信息，并保证注册信息的真实性和完整性。如发现会员账号中含有不雅文字或不恰当名称的，本系统保留取消其会员资格的权利。<br>
(1)请勿以党和国家领导人或其他社会名人的真实姓名、字号、艺名、笔名注册；<br>
(2)请勿以国家机构或其他机构的名称注册；<br>
(3)请勿注册不文明、不健康名字，或包含歧视、侮辱、猥亵类词语的账号；<br>
(4)请勿注册易产生歧义、引起他人误解或其它不符合法律规定的账号。<br>
3.3 会员有义务保证密码和账号的安全，不得以任何形式擅自转让或授权他人使用自己在本平台的会员账号，会员对其在本平台注册的会员名和密码、账户资金及其它保单资料的安全性负全部责任，并对以其会员名进行的所有活动和事件负全部责任。如会员发现账号遭到未授权的使用或发生其他任何安全问题，应立即修改账号密码并妥善保管，如有必要，请通知网站服务人员。<br>
3.4 会员通过本平台进行商务活动所引起的一切法律纠纷均与本平台无关。因会员违反有关法律、法规或本协议的有关规定而给本平台或者第三方造成损失的，会员同意赔偿因此而导致的全部损失，包括但不限于实际损失、可预期利益、因此发生的诉讼费、律师费、赔偿金等。<br>
3.5 会员在本平台实施了违法行为，导致第三方投诉（包括但不限于第三方以发函等形式指控本平台侵权，对本平台提起诉讼、仲裁，或使本平台面临相关主管机关的审查或质询)本平台有权先暂停会员对本平台的使用。会员应在收到本平台通知后，以自己名义出面与第三方协商、应诉或接受相关主管机关审查或质询，并承担所有费用，并赔偿因此给本平台造成的全部损失。<br>
3.6 会员不得通过任何方式攻击、干扰或试图攻击、干扰本平台的正常运作及有关活动，也不得帮助或教唆任何第三方从事上述活动。<br>
3.7 平台会员不得误导消费者，使消费者误认其是广州问鼎保险经纪有限公司的子公司、分公司、关联公司或代理商等。<br>
3.8 未经平台同意，擅自以广州问鼎保险经纪有限公司名义制作网页、印制单页或其他物料等；<br>
<b>四、耀保网平台权利义务</b><br>
4.1 本平台在线投保系统已嵌入承保保险公司的核保规则，所有核保工作将由系统自动进行，会员提交的投保资料将自动转入保险公司核心业务系统，若无特殊情况，将不会与会员进行二次确认信息。<br>
4.2 本平台不对外公开或向第三方提供会员的注册资料及会员在使用网络服务时存储在本系统的非公开内容，但下列情况除外：<br>
(1)事先获得会员的明确授权；<br>
(2)根据有关的法律法规要求；<br>
(3)按照相关政府主管部门的要求；<br>
(4)为维护社会公众的利益。<br>
4.3 本平台含有与其他网站的链接。本平台与链接的网站有合作关系，但并不能控制这些网站及其所提供的资源，所以本平台对链接网站上的内容、广告、服务、产品信息的真实有效性不负责任，并且对因链接网站上的内容、广告、服务、产品信息的失实而造成的损失不负任何法律责任。<br>
4.4 对于系统发生故障影响到本平台的正常运行，本平台承诺及时处理进行修复。<br>
4.5 本平台拥有对本协议条款的解释权。会员对服务或本协议条款的任何部分之意见及建议可通过客户服务部门与本平台联系。<br>
4.6 平台有权审核并决定是否接受任何单位或个人成为平台会员的申请，并有权要求平台会员提供任何本网站认为必要的资料、证书、证明等文件；<br>
4.7 平台上显示的所有图片、文字等的知识产权均归本平台所有；<br>
4.8 本平台有权确定并修订平台合作的具体方式，有权调整平台合作嵌入页面的产品，有权合理修改并完善本协议约定条款；<br>
4.9 本平台将向平台会员提供管理后台，便于平台会员进行订单、服务费的查询；<br>
4.10 会员违反法律法规、本平台本协议及平台其他规则的，本平台有权冻结或限制会员权限。<br>
4.11 平台有权随时对本协议内容进行单方面的变更，并以在平台上发布公告的方式予以公布，无需单独通知您，若您在协议变更后继续使用平台服务，则视为您同意接受变更后的协议。<br>
4.12 本协议终止后，耀保网有权继续保留您留存于平台的各类交易信息；<br>
4.12对于您过往的违约行为，本平台仍可依据本协议向您追究违约责任。<br>
<b>五、版权声明</b><br>
本平台特有的标识、版面设计、编排方式等版权均属本平台享有，未经本平台许可，不得任意复制或转载。<br>
<b>六、协议的变更、解除和终止</b><br>
6.1 变更<br>
本平台可以根据客观情况的变化随时进行业务性调整或产品性调整，并变更本会员协议，变更后的本会员协议将会在本平台上重新公布。会员可以选择继续使用调整后的业务或产品，但是如果会员对变更后的会员协议持有不同意见，可以选择退出本平台，但本平台对此不承担任何法律责任和费用补偿。如果会员继续选择享用本平台，则视为会员已经完全接受本协议及其修改。<br>
6.2 解除和终止<br>
如发生下列任何一种情形，本平台有权随时中断或终止向会员提供服务而无需通知该会员：<br>
（1）会员提供的个人资料不真实；<br>
（2）会员违反法律或者本协议及其修改文本的规定；<br>
（3）会员所需服务超出本平台服务范围。<br>
<b>七、不可抗力</b><br>
7.1 本协议是指协议双方不能合理控制、不可预见或即使预见亦无法避免的事件，该事件使任何一方根据本协议履行其全部或部分义务已不可能。该事件包括但不限于政府行为、地震、台风、洪水、火灾或其它天灾、战争或任何其它类似事件。 鉴于互联网之特殊性质，不可抗力亦包括下列影响互联网正常运行之情形：1）黑客攻击；2）电信部门技术调整导致之重大影响；3）病毒侵袭等。<br>
7.2 本平台如遭受不可抗力事件，有权暂停或终止服务，不视为违约。在不可抗力事件影响结束后，应当继续按本协议履行其义务。<br>
<b>八、法律适用及争议解决</b><br>
8.1 本协议的订立、生效、解释、执行、管辖、争议的解决均适用中华人民共和国法律。<br>
8.2 因本协议引起的或与本协议有关的任何争议，应尽最大诚意进行友好协商，如果不能协商一致，可向本平台所属公司所在地人民法院提起诉讼。<br>
<b>九、保密条款</b><br>
9.1 平台会员应对其自本平台获取或知悉的任何与本平台和本平台产品和/或服务有关的可被合理认为具有保密性的信息（以下统称“保密信息”），包括但不限于推广数据和客户信息，予以严格保密。除非经本平台书面同意，平台会员不得非为履行本协议之目的直接或间接地使用保密信息或向任何第三方透露或允许任何第三方使用保密信息。此保密义务在本协议终止后继续有效。 <br>
9.2 通过平台合作购买本平台产品的客户即为本平台的客户，该等客户的注册信息以及购买产品的信息，除非法律强制或本协议另有约定，平台会员无权使用、披露或要求本平台披露客户信息。<br>
<b>十、附则</b><br>
10.1 本平台未行使或执行本会员协议任何权利或规定，不构成对前述权利或权益之放弃。<br>
10.2 如本会员协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本会员协议的其余条款仍应有效并且有约束力。<br>
10.3 本协议的生效，并不代表耀保网与您之间存在任何隶属、代理关系，您不得以耀保网代理商或耀保网分支机构、子公司等名义对外进行宣传<br>
本协议解释权及修订权归广州问鼎保险经纪有限公司所有。

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="zcxyVisible = false">确定</el-button>
            </span>
        </el-dialog>

        <!--用户隐私政策弹层-->
        <el-dialog
            title="用户隐私政策"
            :visible.sync="yszcVisible"
            width="40%"
            top="20vh"
            center>
            <div class="weebox-content">
                为了更好地提供服务，我们按照合法、合理、安全、保密的原则，依据信息安全及保险法律法规要求，合理收集、管理和使用您的个人信息。若您未能提供相关信息和数据，可能会导致您无法在本平台（含App、微信小程序）开立账户、使用网站功能或享受相关保险服务。<br>
                <b>1.引言</b><br>
                1.1.本隐私政策适用于广州问鼎经纪旗下各类平台（范围详见附录1：定义）所有产品和服务。<br>
1.2.本隐私政策旨在帮助您了解我们会收集哪些数据、为什么收集这些数据，会利用这些数据做些什么及如何保护这些数据。<br>
1.3.若您使用广州问鼎经纪平台的服务，即表示您认同我们在本政策中所述内容。在将您的信息用于本隐私权政策未涵盖的用途时，我们会事先征求您的同意。<br>
1.4.此外，我们在产品设计的过程中及最终的呈现和用户体验环节，将尽可能地为您控制个人信息、保护个人隐私提供更为便捷的方式。例如：您可以在【搜索隐私设置】中方便地对搜索记录进行开关设置，如您关闭搜索记录，我们将不再继续记录您的搜索记录，这可能会导致您的搜索效率和搜索内容的个性化程度降低。您还可以通过【查阅/清理搜索框历史展现词】实现在您的服务界面内查阅、清理您的搜索框历史词。通过此功能，您可以查看您账户内的历史搜索词。<br>
1.5.本隐私政策将帮助您了解以下内容：<br>
(1)引言<br>
(2)我们收集的个人信息<br>
(3)我们如何使用您的个人信息<br>
(4)我们如何使用 Cookie 和同类技术<br>
(5)我们如何共享、转让、公开披露您的个人信息<br>
(6)我们如何保存及保护您的个人信息<br>
(7)您的权利<br>
(8)我们如何处理未成年人的个人信息<br>
(9)您的个人信息如何跨境转移<br>
(10)本政策如何更新<br>
(11)如何联系我们<br>
感谢您对广州问鼎经纪平台的使用和信任！我们致力于维持您对我们的信任，恪守适用法律和我们对您的承诺，尽全力保证您的个人信息安全和合理使用。同时，我们郑重承诺，我们将按业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。<br>
请在使用我们的产品和/或服务前，仔细阅读并了解本隐私政策。<br>
<b>2.我们收集的个人信息</b><br>
根据您与我们之间的关系，我们所收集的有关您的个人信息可能包括：<br>
2.1.一般信息与联系方式：姓名；地址；电子邮件地址和电话号码；性别；婚姻状况；家庭状况；出生日期；密码；教育背景；身体素质；照片；工作经历、技能与经验；专业执照与隶属机构；与投保人、被保险人之间的关系；以及发生保险事故的时间和原因。<br>
2.2.政府部门或机构颁发的识别号码：身份证号码；护照号码；社会保险号码；税务识别号码；军官证号码；或驾驶证或其它证件号码。<br>
2.3.财务信息和账户详情：支付账户和号码；银行账户号码和账户详情；信用记录和信用评分；资产；收入；以及其它支付和财务信息。<br>
2.4.疾病状况和健康状况：目前或以前的身体、心理或疾病状况；健康状况；受伤或残疾情况；已进行过的手术；个人习惯（如抽烟或饮酒）；处方情况；以及病史。<br>
2.5.其它信息：在某些情况下，我们会收集有关您的家族病史、继承信息等其他信息。在预防、识别和调查欺诈过程中，我们可能获取有关您的犯罪记录或民事诉讼记录。我们还会获取您主动提供给我们的其他信息。<br>
2.6.电话录音、在线沟通及投保轨迹：您致电或在线联系我们保险咨询顾问、或者通过移动设备或电脑访问浏览我们公司网站页面，我们将会收集您的电话录音、在线沟通及投保轨迹记录。<br>
2.7.设备信息：为了提供更好的产品和/或服务并改善用户体验，我们会收集设备属性信息（例如您的硬件型号、操作系统版本、设备配置、唯一设备标识符、国际移动设备身份码IMEI、网络设备硬件地址MAC、广告标识符IDFA等），设备连接信息（浏览器的类型、电信运营商、使用的语言）以及设备状态信息（例如设备传感器数据，设备应用安装列表）。对于从您的各种设备上收集到的信息，我们可能会将它们进行关联，以便我们能在这些设备上为您提供一致的服务。我们可能会将您的设备信息或电话号码与您的广州问鼎经纪帐户相关联。<br>
2.8.日志信息：当您使用广州问鼎经纪平台产品和服务时，我们的服务器会自动记录一些信息，例如您对我们的产品和/或服务的使用情况、IP地址、所访问服务的URL、浏览器的类型和使用的语言、下载、安装或使用移动应用和软件的信息、与通讯软件通讯的信息以及访问服务的日期、时间、时长等。<br>
2.9.位置信息：当您使用具有定位功能的广州问鼎经纪平台产品和服务时，当您开启设备定位功能并使用我们基于位置提供的相关服务时，我们可能会收集和处理有关您实际所在位置的信息，以使得您不需要手动输入自身地理坐标就可获得相关服务。我们会使用各种技术进行定位，这些技术包括 IP 地址、GPS 以及能够提供相关信息的其他传感器（比如可能会为我们提供附近设备、Wi-Fi 接入点和基站的信息）。您可以通过关闭定位功能，停止对您的地理位置信息的收集，但您可能将无法获得相关服务或功能，或者无法达到相关服务拟达到的效果。<br>
2.10.唯一应用程序编号：某些产品和服务包含唯一应用程序编号，当您安装、激活、更新、卸载相关产品和服务或当这些产品和服务定期与广州问鼎经纪通信（例如软件的更新）时，系统会将此编号以及与安装相关的信息（例如操作系统类型和应用程序版本号）发送给广州问鼎经纪。<br>
<b>3.我们如何使用个人信息</b><br>
我们将以如下目的和方式使用您的个人信息：<br>
3.1.在我们业务过程中与您和其他相关人士进行沟通。<br>
3.2.向您寄送与我们的保单、合同以及其他相关的重要信息。<br>
3.3.改善服务品质（例如，致电我们的联系电话时，对来电进行录音或监测）；进行市场研究和分析（包括满意度调查）。为了让您有更好的体验、改善我们的服务或经您同意的其他用途，在符合相关法律法规的前提下，我们可能将通过某些服务所收集的信息用于我们的其他服务。例如，将您在使用我们某项服务时的信息，用于另一项服务中向您展示个性化的内容或广告、用于用户研究分析与统计等服务。<br>
3.4.根据您所表明的营销偏好，向您提供营销信息（包括与所选第三方合作伙伴提供的其他产品和服务有关的信息）。通过使用收集的信息，我们会得以向您提供定制内容，例如向您展现或推荐相关程度更高（而非普遍推送）的搜索结果、信息流或者广告/推广信息结果。<br>
3.5.便利您参与竞赛、抽奖和类似促销活动以及管理这些活动。有些活动有附加条款和条件，其中可能包括我们如何使用和披露您的个人信息，因此，我们建议您仔细阅读这些条款和条件。<br>
3.6.用于业务运营管理；各类客户服务；财务会计、收付款项等；IT系统、数据和网站存储、业务备份等；审计、检查等。我们使用收集的信息来提供并改进我们及广州问鼎经纪关联方、合作方提供的产品和服务，并进行必要的业务运营，例如运营产品或提供服务，评估、维护和改进产品和服务的性能，开发新的产品和服务、提供客户支持等。为改进我们及广州问鼎经纪关联方、合作方的产品和服务，我们也可能会对产品使用情况进行统计和分析。同时，广州问鼎经纪可能会与公众共享这些统计信息，以展示我们服务的整体使用趋势，但这些统计信息将不会包含您的任何身份识别信息。我们会将所收集到的信息用于大数据分析。例如，我们将收集到的信息用于分析形成不包含任何个人信息的统计类产品。我们可能对外公开并与我们的合作伙伴分享经统计加工后不含身份识别内容的大数据分析信息。<br>
3.7.解决投诉，处理数据访问或资料更正请求。<br>
3.8.为您提供安全保障。为提高您使用我们与广州问鼎经纪关联方、合作方提供的产品和服务的安全性，我们可能使用您的信息用于身份验证、客户服务、安全防范、诈骗监测、信贷分析等，以预防、发现、调查欺诈、危害安全、非法或违反与我们的协议、政策或规则的行为，以保护您、我们的其他用户、我们或广州问鼎经纪关联方、合作方及社会公众的合法权益。<br>
3.9.遵守适用的法律法规和监管要求（包括您的居住国法律以外的法律），例如与反洗钱和反恐融资有关的法律法规和监管要求；遵守法律程序以及其他政府机构的要求。<br>
3.10.当我们要将信息用于本隐私政策未载明的其他用途，将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。当我们要将基于特定目的收集而来的信息用于其他目的时，会实现征求您的同意。<br>
<b>4.我们如何使用Cookie和同类技术</b><br>
4.1.为确保网站正常运转，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie 通常包含标识符、站点名称以及一些号码和字符。Cookie主要的功能是便于您使用网站产品和服务，以及帮助网站统计独立访客数量等。运用Cookie技术，我们能够为您提供更加周到的个性化服务，并允许您设定您特定的服务选项。<br>
4.2.当您使用广州问鼎经纪的产品和服务时，会向您的设备发送Cookie。当您与我们提供给合作伙伴的服务（例如广告和/或推广服务，以及可能显示在其他网站上的由广州问鼎经纪提供的服务功能）进行交互时，您必须允许我们将Cookie（或者其他匿名标识符）发送给广州问鼎经纪的服务器。<br>
4.3.我们不会将 Cookie 用于本隐私政策所述目的之外的任何用途。您可根据自己的偏好管理或删除 Cookie。有关详情，请参见 AboutCookies.org。您可以清除计算机上保存的所有 Cookie，大部分网络浏览器都设有阻止 Cookie 的功能。但如果您这么做，则无法登录或使用依赖于Cookie的广州问鼎经纪提供的服务或功能。<br>
4.4.您可以通过更改您的浏览器设置限制广州问鼎经纪公司对Cookie的使用。以IE浏览器为例，您可以在IE浏览器右上方的下拉菜单的“Internet选项”的“隐私选项卡”中，通过“设置—高级”，选择阻止我们访问您的Cookie。<br>
<b>5.我们如何共享、转让、公开披露您的个人信息</b><br>
<b>5.1.共享</b><br>
我们会以高度的勤勉义务对待您的信息。除以下情形外，未经您同意，我们不会与除广州问鼎经纪及其关联公司外的任何公司、组织和个人分享您的信息：<br>
5.1.1.在获得您的明确同意后，我们会与其他方共享您的个人信息。我们可能会根据法律法规规定，或按政府主管部门的强制性要求或司法裁定，对外共享您的个人信息。<br>
5.1.2.仅为实现本隐私政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。例如，您在投保时，我们需要与保险公司共享您的个人信息才能安排其为您提供后续服务。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享与提供服务相关的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。<br>
目前，我们的授权合作伙伴包括以下类型：<br>
(1)服务平台或服务提供商。广州问鼎经纪各产品接入了丰富的第三方服务。当您选择使用该第三方服务时，您授权我们将该信息提供给第三方服务平台或服务提供商，以便其基于相关信息为您提供服务。<br>
(2)软硬件/系统服务提供商。当第三方软硬件/系统产品或服务与广州问鼎经纪的产品或服务结合为您提供服务时，经您授权，我们会向第三方软硬件/系统服务提供商提供您必要的个人信息，以便您使用服务，或用于我们分析产品和服务使用情况，来提升您的使用体验。<br>
(3)广告、咨询类服务商/广告主。未经您授权，我们不会将您的个人身份信息（指可以识别您身份的信息，例如姓名或电子邮箱，通过这些信息可以联系到您或识别您的身份）与提供广告、咨询类服务商共享。但我们可能会将经处理无法识别您的身份且接收方无法复原的信息，例如经匿名化处理的用户画像，与广告或咨询类服务商或广告主共享，以帮助其在不识别您个人的前提下，提升广告有效触达率，以及分析我们的产品和服务使用情况等。<br>
5.1.3.为便于我们基于关联账号共同向您提供服务，推荐您可能感兴趣的信息、保护广州问鼎经纪关联公司或其他用户或公众的人身财产安全免遭侵害或与您取得联系，您的个人信息可能会与我们的关联公司共享。我们只会共享必要的个人信息（如为便于您使用广州问鼎经纪账号使用我们关联公司产品和/或服务，我们会向关联公司共享您必要的账户信息），如果我们改变个人信息的使用及处理目的，将再次征求您的授权同意。<br>
5.1.4.对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。<br>
<b>5.2.公开披露</b><br>
我们仅会在以下情形下，公开披露您的个人信息：<br>
(1)获得您的明确同意；<br>
(2)基于法律的披露：在法律法规、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开您的个人信息。<br>
<b>5.3.共享、转让、公开披露个人信息时事先征得授权同意的例外</b><br>
在以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：<br>
(1)与国家安全、国防安全直接相关的；<br>
(2)与公共安全、公共卫生、重大公共利益直接相关的；<br>
(3)与犯罪侦查、起诉、审判和判决执行等直接相关的；<br>
(4)出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；<br>
(5)您自行向社会公众公开的个人信息；<br>
(6)从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。<br>
(7)根据个人信息主体要求签订和履行合同所必需的；<br>
(8)用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；<br>
(9)法律法规规定的其他情形。<br>
根据法律规定，共享、转让经去标识化处理的个人信息，且确保数据接收方无法复原并重新识别个人信息主体的，不属于个人信息的对外共享、转让及公开披露行为，对此类数据的保存及处理将无需另行向您通知并征得您的同意。<br>
<b>6.我们如何保存和保护您的个人信息</b><br>
<b>6.1.保存期限</b><br>
您在使用广州问鼎经纪产品及服务期间，我们将持续为您保存您的个人信息。如果您注销帐户或主动删除上述信息，我们将依据网络安全法等法律法规规定保存您的信息。在您注销帐户或主动删除上述信息后，我们不会再对您的个人信息进行商业化使用，但我们可能会对您的个人信息进行匿名化处理后使用。<br>
<b>6.2.保存地域</b><br>
您的个人信息均储存于中华人民共和国境内。<br>
<b>6.3.安全措施</b><br>
6.3.1.我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权访问、公开披露、使用、修改、损坏或丢失。我们会采取一切合理可行的措施，保护您的个人信息。例如，在您的浏览器与“服务”之间交换数据（如银行卡信息）时受 SSL 加密保护；我们同时对广州问鼎经纪旗下网站提供 https 安全浏览方式；我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护机制防止数据遭到恶意攻击；我们会部署访问控制机制，确保只有授权人员才可访问个人信息；以及我们会举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识。<br>
6.3.2.我们会采取一切合理可行的措施，确保未收集无关的个人信息。我们只会在达成本政策所述目的所需的期限内保留您的个人信息，除非需要延长保留期或受到法律的允许。<br>
6.3.3.互联网并非绝对安全的环境，而且电子邮件、即时通讯、及与其他用户的交流方式并未加密，我们强烈建议您不要通过此类方式发送个人信息。请使用复杂密码，协助我们保证您的账号安全。<br>
6.3.4.互联网环境并非百分之百安全，我们将尽力确保或担保您发送给我们的任何信息的安全性。如果我们的物理、技术、或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改、或毁坏，导致您的合法权益受损，我们将承担相应的法律责任。<br>
6.3.5.在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。<br>
同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。<br>
<b>7.您的权利</b><br>
按照中国相关的法律、法规、标准，以及其他国家、地区的通行做法，我们保障您对自己的个人信息行使以下权利：<br>
<b>7.1.访问您的个人信息</b><br>
您有权访问您的个人信息，法律法规规定的例外情况除外。您可以通过以下方式自行访问您的个人信息：<br>
账户信息——如果您希望访问或编辑您的账户中的个人基本资料信息、联系方式信息、更改您的密码、添加安全信息、进行账户关联、身份认证等，您可以访问【账户安全】执行此类操作。<br>
搜索信息——您可以在【搜索隐私设置】中访问或清楚您的搜索历史记录、查看和修改兴趣以及管理其他数据。<br>
<b>7.2.更正您的个人信息</b><br>
您发现我们处理的关于您的个人信息有错误时，您有权对错误或不完整的信息作出更正或更新，您可以通过我们提供的联系方式随时与我们联系，提出更正申请。为保障安全，我们将在您行使更正权前对您的身份进行验证。<br>
<b>7.3.删除您的个人信息</b><br>
在以下情形中，您可以向我们提出删除个人信息的请求，您可以通过我们提供的联系方式反馈随时与我们联系：<br>
(1)如果我们违法法律法规或与您的约定收集、使用、与他人共享或转让您的个人信息；<br>
(2)如果我们违反法律法规规定或与您的约定，公开披露您的个人信息，您有权要求我们立即停止公开披露的行为，并发布通知要求相关接收方删除相应的信息<br>
(3)当您从我们的服务中删除信息后，我们可能不会立即从备份系统中删除相应的信息，但会在备份更新时删除这些信息。<br>
<b>7.4.改变您授权同意的范围</b><br>
每个业务功能需要一些基本的个人信息才能得以完成。对于额外收集的个人信息的收集和使用，您可以随时给予或收回您的授权同意。<br>
如您想改变授权范围，您可通过广州问鼎经纪平台产品的隐私设置修改授权范围，例如：<br>
(4)您可以登录【账号安全】界面解除广州问鼎经纪帐号与第三方帐号的绑定关系，可以在【搜索隐私设置】中方便地对搜索记录进行开关设置。<br>
(5)当您撤回同意或授权后，我们无法继续为您提供撤回同意或授权所对应的服务，也将不再处理您相应的个人信息。但您撤回同意或授权的决定，不会影响此前基于您的同意或授权而开展的个人信息处理。<br>
<b>7.5.注销您的账户</b><br>
您随时可注销此前注册的账户。您可以登录【账户安全】，注销您的广州问鼎经纪帐号。一旦您注销广州问鼎经纪账号，将无法使用广州问鼎经纪全线用户产品和服务，因此请您谨慎操作。我们为了保护您或他人的合法权益会结合您对广州问鼎经纪各产品和服务的使用情况判断是否支持您的注销请求。<br>
<b>7.6.提前获知产品和服务停止运营</b><br>
广州问鼎经纪愿一直陪伴您，若因特殊原因导致广州问鼎经纪平台产品和服务被迫停止运营，我们将按照法律法规要求在产品和/或服务的主页面或站内信或向您发送电子邮件或其他合适的能触达您的方式通知您，并将停止对您个人信息的收集，同时会按照法律规定对所持有的您的个人信息进行删除或匿名化处理等。
<b>7.7.响应您的上述请求</b><br>
为保障安全，您需要提供书面请求，或以其他方式证明您的身份。我们可能会先要求您验证自己的身份，然后再处理您的请求。<br>
对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情况收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际（例如，涉及备份磁带上存放的信息）的请求，我们可能会予以拒绝。<br>
在以下情形中，按照法律法规要求，我们将无法响应您的上述请求：<br>
(6)与国家安全、国防安全直接相关的；<br>
(7)与公共安全、公共卫生、重大公共利益直接相关的；<br>
(8)与犯罪侦查、起诉、审判和执行判决等直接相关的；<br>
(9)我们有充分证据表明您存在主观恶意或滥用权利的（如您的请求将危害公共安全和其他人合法权益，或您的请求超出了一般技术手段和商业成本可覆盖的范围）；<br>
(10)响应个人信息主体的请求将导致您或其他个人、组织的合法权益受到严重损害的；<br>
(11)涉及商业秘密的。<br>
<b>8.我们如何处理未成年人的个人信息</b><br>
我们的产品、网站和服务主要面向成人。如果没有父母或监护人的同意，未成年人不得创建自己的用户账户。<br>
对于经父母或监护人同意而收集的未成年人个人信息情况，我们只会在收到法律允许、父母或监护人明确同意或者保护儿童所必要的情况下使用或公开披露此信息。<br>
如果父母或监护人发现我们在未获其同意的情况下收集了未成年人的个人信息，请通过我们提供的联系方式联系我们，我们会设法尽快删除相关数据。<br>
<b>9.本政策如何更新</b><br>
我们可能适时修订本政策内容。如该等变更会导致您在本政策项下权利的实质减损，我们将在变更生效前，通过在页面显著位置提示、向您发送电子邮件等方式通知您。我们会在本页面上发布对本隐私政策所做的任何变更。<br>
若您不同意该等变更可以停止使用广州问鼎经纪平台产品和服务，若您继续使用我们的产品和/或服务，即表示您同意受修订后的本隐私政策的约束。<br>
本隐私政策所指的重大变更包括但不限于：<br>
(1)我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；<br>
(2)个人信息共享、转让或公开披露的主要对象发生变化；<br>
(3)您参与个人信息处理方面的权利及其行使方式发生重大变化；<br>
(4)其他可能对您的个人信息权益产生重大影响的变化时。<br>
<b>10.如何联系我们</b><br>
本隐私政策最近更新日期：2020年07月20日。<br>
如您对本隐私政策有任何疑问、意见或建议，可通过以下方式联系我们。<br>
地址：四川省成都市青羊区贝森北路5号西村5号<br>
一般情况下，我们将在三十天内回复。<br>
如果您对我们的回复不满意，特别是我们的个人信息处理行为损害了您的合法权益，您还可以通过一下外部途径寻求解决方案：将争议提交广州问鼎经纪所在地有管辖权的人民法院处理。<br>
<b>附录1：定义</b><br>
本隐私政策中使用的特定词语，具有如下含义：<br>
1.“我们”或“广州问鼎经纪”，指广州问鼎经纪保险经纪有限公司。<br>
2.“您”，指使用我们的产品和服务的全部用户。<br>
3.“广州问鼎经纪平台”，指耀保网网站（https://www.yaobx18.com/）及其小程序等。<br>
4.“广州问鼎经纪关联方、合作方”，指我们的关联公司、投资公司、联盟成员、合作伙伴及其他受信任的第三方供应商、服务商及代理商。<br>
5.“我们的产品和服务”或“广州问鼎经纪平台产品和服务”，指广州问鼎经纪旗下各平台产品和服务（包括但不限于广州问鼎经纪网、保加等网站、程序、服务、工具及客户端）。<br>
6. “个人信息”，指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。个人信息包括个人基本信息、个人身份信息、个人生物识别信息、网络身份标识信息、个人健康生理信息、个人教育工作信息、个人财产信息、个人通信信息、联系人信息、个人上网记录、个人常用设备信息、个人位置信息等。为免疑义，个人信息包括但不限于个人敏感信息。<br>
7. “个人信息主体”，指个人信息所标识的自然人。<br>
8. “个人敏感信息”，指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。个人敏感信息包括个人财产信息、个人健康生理信息、个人生物识别信息、个人身份信息、网络身份标识信息等。<br>
9. “去标识化”，指通过对个人信息的技术处理，使其在不借助额外信息的情况下，无法识别个人信息主体的过程。<br>
10. “匿名化”，指通过对个人信息的技术处理，使得个人信息主体无法被识别，且处理后的信息不能被复原的过程。<br>
11. “中国”或“中国境内”，指中华人民共和国大陆地区，仅为本隐私政策之目的，不包含香港特别行政区、澳门特别行政区和台湾地区。<br>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="yszcVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
import SubHeader from '../components/subHeader'
export default {
  name: 'Invite',
  components:{
        SubHeader
   },
  data () {
    return {
        zcxyVisible:false,
        yszcVisible:false,
        proName: '',
        rules:false,
        step:1,
        step1: true,
        step2: false,
        step3: false,
        areaName: '',
        areaNames: [],
        areaCode: '',
        cjName: [],
        cjNames: [],
        sfName: '',
        sfNames: [],
        zhutiName: '2',
        zhutiNames: [
            {
                value: '2',
                label: '企业'
            },{
                value: '1',
                label: '个人'
            }
        ],
        companyName: '',
        userName: '',
        province: '',
        provinces: [],
        provinceTxt:'',
        city: '',
        citys: [],
        cityTxt: '',
        telephone: '',
        imgYzm: '',
        yzmCode: '',
        password: '',
        companyShow: true,
        txmImg: '',
        hqBtn:true,
        secondGo:false,
        text: '获取验证码',
        second: 60,
        key: '',
        timer:null
    }
  },
  methods: {
      rulesAct() {
          if(this.rules){
              this.rules = false;
          }else{
            this.rules = true;
          }
      },
      fieldFun() {
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/common/loadIndustryLabelList'
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.areaNames = res.data.outData.industryLabel;
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
      fieldSel1(val){
          this.areaNames.map((data,i) => {
              if(data.value === val){
                  this.areaCode = data.code;
              }
          });
          this.cjName = [];
          this.sfName = '';
          let loadingInstance = this.$loading();
          this.$ajax({
                method:'post',
                url:'/insurance/api/common/loadIndustryLabelSubList',
                params:{
                    industryLabelCode:this.areaCode
                }
            })
            .then((res)=>{
                loadingInstance.close();
                if(res.data.code === 1){
                    this.cjNames = res.data.outData.sceneLabel;
                    this.sfNames = res.data.outData.identityLabel;
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
      zhutiSel(val){
          if(val == 1){//个人
            this.companyShow = false;
          }else{
            this.companyShow = true;
          }
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
      citySel(val) {
          this.citys.map((data,i) => {
              if(data.value === val){
                  this.cityTxt = data.name;
              }
          });
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
      nextStep1() {
          if(this.areaName === ''){
              this.$message({
                message: '请选择行业标签',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.cjName.length === 0){
              this.$message({
                message: '请选择场景标签',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.sfName === ''){
              this.$message({
                message: '请选择身份标签',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.companyShow && this.companyName === ''){//企业
            this.$message({
                message: '请输入企业名称',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.userName === ''){
              this.$message({
                message: '请输入运营对接人姓名',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.province === ''){
              this.$message({
                message: '请选择省份',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          if(this.city === ''){
              this.$message({
                message: '请选择城市',
                duration: 1000,
                type: 'error'
              });
              return;
          }
          this.step = 2;
          this.step1 = false;
          this.step2 = true;
      },
      prevStep() {
          this.step = 1;
          this.step1 = true;
          this.step2 = false;
      },
      //改变图片验证码
      changeImg() {
        let time = new Date().getTime();
        this.key = time;
         if(window.location.host.indexOf('127.0.0.1') !== -1 || window.location.host.indexOf('localhost') !== -1){
        this.txmImg = 'http://115.159.64.84:9001/insurance/api/common/verifyCode/'+ time;
        }else{
            this.txmImg = '/insurance/api/common/verifyCode/'+ time;
        }
      },
      yzmFun() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
          if(this.telephone === ''){
                this.$message({
                    message: '请输入手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(!phoneReg.test(this.telephone)){
                this.$message({
                    message: '请输入正确格式的手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(this.imgYzm === ''){
                this.$message({
                    message: '请输入图形验证码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            this.$ajax({
                method:'post',
                url:'/insurance/api/common/smsCode',
                data:{
                    code:this.imgYzm,
                    key:this.key,
                    mobile:this.telephone,
                    type: 'REGIST'
                }
            })
            .then((res)=>{
                if(res.data.code === 1){
                    this.secondGo = true;
                    this.hqBtn = false;
                    this.second = 60;
                    clearInterval(this.timer);
                    this.timer = setInterval(() => {
                        if(this.second > 0){
                        this.second--;
                        }else{
                        this.hqBtn = true;
                        this.secondGo = false;
                        this.text = '重新发送';
                        clearInterval(this.timer);
                        }
                    }, 1000);
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
      tjSubmit() {
          let phoneReg = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
          if(!this.rules){
              this.$message({
                message: '请先确认相关协议',
                duration: 1000,
                type: 'error'
            });
            return;
          }
          if(this.telephone === ''){
                this.$message({
                    message: '请输入手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(!phoneReg.test(this.telephone)){
                this.$message({
                    message: '请输入正确格式的手机号码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(this.imgYzm === ''){
                this.$message({
                    message: '请输入图形验证码',
                    duration: 1000,
                    type: 'error'
                });
                return;            
            }
            if(this.yzmCode === ''){
                this.$message({
                    message: '请输入短信验证码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            if(this.password === '' || this.password.length < 6 || this.password.length > 20){
                this.$message({
                    message: '请输入6-20位密码',
                    duration: 1000,
                    type: 'error'
                });
                return;
            }
            let loadingInstance = this.$loading();
            this.$ajax({
                    method:'post',
                    url:'/insurance/api/user/proRegister',
                    data:{
                        bodyType:this.zhutiName,
                        city:this.city,
                        contacts:this.userName,
                        identity:this.sfName,
                        industry:this.areaName,
                        mobile:this.telephone,
                        name:this.companyName,
                        password:this.password,
                        province:this.province,
                        scene:this.cjName.join(','),
                        shareCode:decodeURIComponent(this.$route.query.code),
                        customManeger:decodeURIComponent(this.$route.query.customManeger),
                        verifyCode:this.yzmCode
                    }
                })
                .then((res)=>{
                    loadingInstance.close();
                    if(res.data.code === 1){
                        this.step = 3;
                        this.step2 = false;
                        this.step3 = true;
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
      loginGo() {
          this.$router.push('/login');
      }
  },
  mounted() {
      this.fieldFun();
      this.provinceFun();
      this.changeImg();
  },
  destroyed () {
    clearInterval(this.timer);
  }
}
</script>

