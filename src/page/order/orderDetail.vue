<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <div class="ordertop">
        <div class="container box">
          <router-link tag="div" to="/" class="img" title="信安首页">
            <img src="/static/icon/logo_black.png" alt />
          </router-link>
          <div class="navs">
            <router-link tag="span" to="/home" class="nav">首页</router-link>
            <router-link tag="span" to="/orderList" class="nav">我的订单</router-link>
          </div>
        </div>
      </div>
      <div class="orderDetail">
        <div class="container box">
          <div class="main">
            <div class="stateCont">
              <div class="orderStatus">
                <div class="num">订单号：{{detail.orderNum}}</div>
                <div class="ht" @click="viewLease">查看合同</div>
                <div
                  class="status"
                  :class="detail.orderState==4?'complete':''"
                >{{detail.orderState | filterStatus}}</div>
                <router-link
                  tag="div"
                  :to="'/comment/'+ id"
                  class="comment"
                  v-if="detail.orderState==5"
                  title="点击去评价"
                >评价</router-link>
                <router-link
                  tag="div"
                  :to="'/pay/'+ id"
                  class="comment"
                  v-if="detail.orderState==1"
                  title="点击去评价"
                >立即付款</router-link>
              </div>
              <logistics :data="logistics" style="padding: 0 20px;"></logistics>
            </div>
            <div class="orderInfo">
              <div class="item">
                <div class="title">收货人信息</div>
                <div class="itm">
                  <div class="n">收货人：</div>
                  <div class="v">{{detail.consignee}}</div>
                </div>
                <div class="itm">
                  <div class="n">地址：</div>
                  <div class="v">{{detail.addressV}}</div>
                </div>
                <div class="itm">
                  <div class="n">手机号码：</div>
                  <div
                    class="v"
                    v-if="detail.consigneePhone"
                  >{{detail.consigneePhone | filterPhone}}</div>
                </div>
              </div>
              <div class="item">
                <div class="title">配送信息</div>
                <div class="itm">
                  <div class="n">配送方式：</div>
                  <div class="v">普通快递</div>
                  <!-- <div class="v">{{detail.courierWay}}</div> -->
                </div>
                <div class="itm">
                  <div class="n">运费：</div>
                  <div
                    class="v"
                    v-if="detail.courierMoney!=null&&detail.courierMoney!=''"
                  >￥{{detail.courierMoney}}</div>
                  <div class="v" v-else>￥0</div>
                  <!-- <div class="v">￥{{detail.courierMoney}}</div> -->
                </div>
              </div>
              <div class="item">
                <div class="title">付款信息</div>
                <div class="itm">
                  <div class="n">付款方式：</div>
                  <div class="v">在线支付</div>
                  <!-- <div class="v"v-if="detail.payType!=null">{{detail.payType}}</div> -->
                  <!-- <div class="v" v-else>未支付</div> -->
                </div>
                <div class="itm">
                  <div class="n">付款时间：</div>
                  <div class="v" v-if="detail.payTime!=null">{{detail.payTime}}</div>
                  <div class="v" v-else>未支付</div>
                </div>
                <div class="itm">
                  <div class="n">租金：</div>
                  <div class="v">￥{{detail.rent}}</div>
                </div>
                <div class="itm">
                  <div class="n">押金：</div>
                  <div class="v">￥{{detail.deposit}}</div>
                </div>
                <div class="itm">
                  <div class="n">应支付金额：</div>
                  <div class="v">￥{{detail.payMoney}}</div>
                </div>
              </div>
              <div class="item" v-if="detail.taxNum">
                <div class="title">发票信息</div>
                <div class="itm">
                  <div class="n">发票类型：</div>
                  <div class="v">{{detail.invoiceType}}</div>
                </div>
                <div class="itm">
                  <div class="n">公司名称：</div>
                  <div class="v">{{detail.name}}</div>
                </div>
                <div class="itm">
                  <div class="n">公司税号：</div>
                  <div class="v">{{detail.taxNum}}</div>
                </div>
                <div class="itm">
                  <div class="n">公司地址：</div>
                  <div class="v">{{detail.addressV}}</div>
                </div>
              </div>
              <div class="item" v-else>
                <div class="title">发票信息</div>
                <div class="itm">
                  <div class="n">发票信息：</div>
                  <div class="v">无发票信息</div>
                </div>
              </div>
            </div>
            <div class="goodsInfo">
              <el-row class="title">
                <el-col :span="10" class="im name">商品品牌</el-col>
                <el-col :span="4" class="im orderNum">类型和尺寸</el-col>
                <el-col :span="3" class="im price">价格（元）</el-col>
                <el-col :span="2" class="im num">商品数量</el-col>
                <el-col :span="5" class="im opt">操作</el-col>
              </el-row>
              <div class="table">
                <el-row class="b" v-for="(item,index) of goods" :key="index">
                  <el-col :span="10" class="name">
                    <div class="img">
                      <img :src="item.goodsImg" alt />
                    </div>
                    <div class="info">
                      <div class="name ellipsis" :title="item.goodsName">{{item.goodsName}}</div>
                      <div
                        class="name ellipsis3"
                        :title="item.proIntroduction"
                      >{{item.proIntroduction}}</div>
                    </div>
                  </el-col>
                  <el-col :span="4" class="im orderNum">{{item.dispose}}</el-col>
                  <el-col :span="3" class="im price">
                    <div class="info">
                      <div class="size">租金：{{item.rent}}</div>
                      <div class="size">押金：{{item.deposit}}</div>
                    </div>
                  </el-col>
                  <el-col :span="2" class="im num">
                    <div v-if="type==1">x{{item.goodsNumber}}</div>
                    <div v-if="type==2&&item.deposit==0">续租：{{item.goodsNumber}}</div>
                    <div v-if="type==2&&item.deposit>0">续租：{{item.goodsNumber - item.newNumber }}</div>
                    <div v-if="type==2&&item.deposit>0">新租：{{item.newNumber}}</div>
                  </el-col>
                  <el-col :span="5" class="im opt">
                    <router-link
                      tag="div"
                      :to="'/renewalOrder/'+id"
                      v-if="detail.orderState==4||detail.orderState==5"
                      title="去续租订单"
                    >续租</router-link>
                    <router-link
                      tag="div"
                      :to="'/service/'+id+'/'+item.id"
                      v-if="detail.orderState==4||detail.orderState==5"
                      title="申请售后"
                    >申请售后</router-link>
                  </el-col>
                </el-row>
                <div
                  class="pinfo"
                  style="text-align:left;font-size:14px;"
                  v-if="remark!=''&&remark!=null&&remark!=undefined"
                >
                  <span>留言：{{remark}}</span>
                </div>
                <div class="pinfo">
                  <ul>
                    <li class="itm">
                      <div class="n">商品租金：</div>
                      <div class="v">￥{{detail.rent}}</div>
                    </li>
                    <li class="itm">
                      <div class="n">商品押金：</div>
                      <div class="v">￥{{detail.deposit}}</div>
                    </li>
                    <li class="itm">
                      <div class="n">物品运费：</div>
                      <div
                        class="v"
                        v-if="detail.courierMoney!=null&&detail.courierMoney!=''"
                      >￥{{detail.courierMoney}}</div>
                      <div class="v" v-else>￥0</div>
                    </li>
                    <li class="itm">
                      <div class="n">商品总额：</div>
                      <div class="v">￥{{detail.money}}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <foot-guide></foot-guide>

      <el-dialog
        title="信安租赁租赁协议"
        :visible.sync="centerDialogVisible"
        v-if="centerDialogVisible"
        width="100%"
        top="0"
        bottom="0"
        custom-class="leaseAggrement"
      >
        <el-row>
          <el-col :span="24" style="color:#f08200;">合同编号：{{contract.uid}}</el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="22">甲方（出租方）：信安租赁（深圳）有限公司</el-col>
              <el-col :span="22">法定代表人：韩大平</el-col>
              <el-col :span="22">地址：深圳市南山区桃源街道红花岭工业区朋年大学城科技园B栋507-509</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="22">已方（承租方）：{{contract.companyName}}</el-col>
              <el-col :span="22">法定代表人：{{contract.contactsName}}</el-col>
              <el-col :span="22">地址：{{contract.companyAddress}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <div class="title">正文</div>
          <div class="cont">
            根据中华人民共和国相关法律法规，甲方为专业的办公IT设备租赁服务提供方，乙方愿意向甲方租赁:
            <span
              v-for="(item,index) in contract.orderGoodsList"
              style="color:#f08200;"
            >“{{item.goodsName}}”</span>，甲乙双方就租赁
            <span
              v-for="(item,index) in contract.orderGoodsList"
              style="color:#f08200;"
            >“{{item.goodsName}}”</span>设备事宜一致达成以下条款，由双方共同遵守：
            <br />一、设备租期及租金
            <br />1.1 租期：租期共计 月（详见附件一），租赁期满后，甲方收回设备。
            <br />1.2设备：具体租赁设备的详细信息，包括品牌、型号、配置、租金单价、租金总价、数量，设备价值等等，参见本合同（附件一）。
            <br />1.3 租金采取先付后用的方式进行租金支付：
            <br />a)一次性支付 租金计人民币元，大写： ，（合同租期小于租期提前退租解除合同的，则扣除所有已支付租金作为违约金）。如租赁期限延长，需在协议到期前三天内另行签订延期补充协议，按延长期限一次性付清租金。
            <br />b) 保证金计 元，设备到期完好无损退还时，7个工作日内退还到原支付账户。
            <br />c) 甲方收到款项后5个工作日内发货并提供产品租金费用全额（6%）服务费发票给乙方。
            <br />1.4乙方所租赁的设备出现故障时，甲方要在收到通知后3个工作日内完成维修或调换设备给甲方使用，每延误一天甲方向乙方每日支付滞纳金，金额为需维护设备当月月租金的百分之二。
            <br />1.5若设备在租赁期间因任何原因丢失或实质性报废，乙方应按照附件一所列设备等同价值或当时设备市场价值进行赔偿。
            <br />二、租赁物使用地点及维护：
            <br />2.1乙方承诺 为乙方办公地址或/设备使用地址。
            <br />2.2甲方根据2.1地址向乙方发货以及后期维护、技术支持等服务。
            <br />2.3乙方指定 为联系人，联系方式 ，为乙方公司 事务联系人 ，与甲方对接有但不限于设备维护、使用、租金支付、设备回收等相关事宜。
            <br />2.4乙方办公地址/联系地址、对接人若发生变更，需在变更后2个工作日内通知甲方。
            <br />2.5甲方办公地址 深圳市南山区桃源街道红花岭工业区朋年大学城科技园B栋507-509，联系电话：13798459879 ，乙方通过此联系方式向甲方要求提供服务、寄送合同等相关事宜。
            <br />三、 乙方权利与义务
            <br />3.1乙方在租赁期间拥有租赁设备的合法使用权。
            <br />3.2使用租赁设备时应遵守相关法律、法规以及本协议的约定。
            <br />3.3按协议之约定按时、足额向甲方支付租金。在约定日未足额支付租金的，每日需要向甲方支付滞纳金，金额为本合同约定的每台租金总金额的百分之五。
            <br />3.4 在租期结束时，应向甲方主动归还租赁设备。乙方应保证租赁设备在归还时的正常使用性能，包括各部件完好，其硬件与订单中硬件配置一致且未被私自更换，设备硬件外观及功能运行正常等。经甲方验收通过后，视为乙方已履行完归还义务。
            <br />3.5甲方可指导乙方安排人合理使用并妥善保管租赁设备；配合乙方完成保障设备性能的各项工作。
            <br />3.6不得买卖、抵押、质押、转租、转借租赁设备；不得擅自变动、修理、添改租赁设备硬件任何部位或部件。若乙方有上述行为的，甲方可立即解除合同并没收剩余租金及押金。
            <br />3.7乙方在租赁期间内，不得在未通知甲方的情况下擅自变更企业法定代表人或变更企业名称等。若发生变更行为，需在变更前5个工作日内告知甲方，变更完成后5个工作日内提供新的营业执照给乙方，否则视为乙方违约，甲方有权提前解除该合同，并且没收剩余租金和押金，收回设备。
            <br />3.8乙方做为承租方不得将所租赁的设备做入“企业资产负债表”。
            <br />3.9在租赁期间，乙方有义务保障设备安全，承担有但不限于租赁物被盗窃、不可抗力造成的租赁物灭失，报废等损失（如设备是非人为、正常使用情况下，如：实质性报废原因是因甲方设备导致，包含但不限于设备短路、设备散热不良引起的配件损坏导致设备的损坏或报废承租方无需承担赔偿责任)。
            <br />3.10除移动设备外，甲方必须保证设备是在2.1条款中所述的地址使用，否则视为违约。
            <br />3.11承担由于违反本条3.1至3.10款所产生的全部责任及经济损失。
            <br />3.12承担因使用或保管不当造成租赁设备修理的损失。承担因不当使用租赁设备或其他故意或者过失造成的任何损失。
            <br />3.13乙方提前终止合同及甲方因乙方原因而解除合同的，或甲方发生违约行为而造成的设备回收，乙方需承担设备回收的费用。
            <br />四、 甲方权利与义务
            <br />4.1按本协议约定向乙方收取租金。
            <br />4.2拥有乙方所租赁设备的所有权。
            <br />4.3对于符合条件的租赁设备在合理使用中出现的故障，甲方应提供更换或维修的服务。即维修过程发生的来回运费，以及更换各种配件全都由甲方承担；但若是因为乙方原因损坏，则由乙方承担因此产生的全部费用，包括但不限于配件费、维修费、运费等。
            <br />4.4 向乙方交付运行正常的设备，保证硬件配置和乙方在订单中标明的一致。
            <br />4.5在乙方归还租赁设备时进行检查并就乙方违反协议约定的行为进行追偿。
            <br />4.6当乙方违反租赁协议时或可能造成更大损失时，甲方有权收回租赁设备、终止履行协议并要求赔偿。
            <br />4.7乙方不承担由乙方使用租赁设备引发的任何责任，包括但不限于各种人身伤害、财产损失、影响企业商誉。
            <br />4.8运输过程中发生的设备损失由甲方承担，但甲方不承担乙方应此原因产生的误工费等其他任何损失。
            <br />五、失信客户的处理及信息披露约定
            <br />1. 满足以下情况之一的，乙方将被认定为失信客户：
            <br />1）逾期1个月不支付设备租金的；
            <br />2）按约定应当归还设备，但拒不归还的；
            <br />3）在租期结束前提前归还设备，但不按协议支付归还服务费或违约金的；
            <br />4）归还的设备严重损坏，但拒不按协议偿付维修费用的；
            <br />5）对归还的设备硬件进行私自更换并刻意隐瞒的。
            <br />2. 乙方同意，对于因出现违反本协议约定内容被认定为失信客户的，甲方将有权利采取包括但不限于以下的措施：
            <br />1) 不接受失信客户的服务需求；
            <br />2) 向征信机构，金融大数据平台上报乙方的失信信息及违约记录；
            <br />3) 向公安机关报案；
            <br />4) 向法院起诉，并依照相关法律规定，报请将失信租户的身份信息及相关公司信息至中华人民共和国全国法院被执行人信息网公布，并将乙方违约失信信息及乙方个人信息向任何其他方进行披露，该其他方包括但不限于：所有公共媒体、征信机构、公安司法机关、甲方用人单位等，披露信息形式包括但不限于：文字、照片、音频、视频。
            <br />六、 违约责任
            <br />6.1. 如果本协议任何一方违约，违约方应对守约方由此产生的经济损失承担赔偿责任，赔偿范围包括但不限于：守约方为履行本协议支出的一切合理的费用，及守约方根据本款为实现自己的请求而发生的诉讼费、律师费、差旅费等一切合理费用。
            <br />6.2. 任何一方违反其义务，导致他人向对方提出权利或赔偿请求，责任方应就对方产生的一切损失提供完全、有效的赔偿。赔偿范围包括但不限于：赔偿给他人的费用；为对抗上述请求和根据本款实现自己的请求而发生的诉讼费、律师费、差旅费等一切合理费用。
            <br />七、 争议处理
            <br />7.1. 本协议适用中华人民共和国法律。
            <br />7.2. 所有与本协议有关的争议将通过双方友好协商解决，如果协商不成，则可向乙方所在地人民法院提起诉讼。
            <br />7.3. 诉讼进行过程中，甲乙双方将继续执行诉讼部分以外的协议其他部分。
            <br />八、特别约定
            <br />8.1 乙方有义务保障数据在使用过程中的及时备份和安全，甲方不为因设备硬件故障带来的数据丢失而负责。设备归还后，甲方不承担原硬盘数据保密义务。
            <br />8.2乙方实际租赁期小于6个月的，若非因甲方原因导致乙方提前解除合同的，则扣除本合同项剩余租金作为违约金。
            <br />8.3 如乙方向甲方租赁的是全新设备时则乙方实际租赁期数大于等于12个月时，在设备正常使用、无明显破损的情况下，退租不属于违约行为，视为双方自愿终止合同。乙方若违反此项，乙方需向甲方支付剩余租金的50%作为违约金。
            <br />8.4 若乙方租期在3个月以内的，在支付租金的同时需要额外支付2个月的租金做为设备总价值的保证金，租期满后乙方退还设备给甲方时，甲方负责检测设备完好度，检测设备无人为损坏或严重外观损毁则保证金全额退还给甲方，如检测有人为损坏则按损坏程度由甲方进行赔偿，并优先用保证金进行抵扣赔偿，保证金多退少补。
            <br />8.5无论乙方选择何种租金支付方式，一旦发生非甲方原因造成的提前退租行为：非全新设备参照本协议第8.2条，全新设备参照第8.3条并同时承担本协议内其他违约责任条款。
            <br />8.7乙方企业法定代表人承担连带担保责任，担保期限为两年。
            <br />九、提前终止合同
            <br />1、若乙方出现下列违约情形之一，则乙方基于本协议项下所有义务立即提前到期：
            <br />1.1、乙方主动申请提前到期，到期日为乙方提出申请日。
            <br />1.2、乙方出现以下情形之一，本协议项下所有乙义务自以下情形发生之日立即自动提前到期，提前到期日为情形发生之日：
            <br />1.2.1、乙方成为民事诉讼被告（乙方可提供证据证明该诉讼不影响乙方履行本协议能力，并经甲方书面认可的除外）；
            <br />1.2.2、乙方被刑事立案侦查；
            <br />1.2.3、乙方提供给甲方以供审核的信息被证实为虚假；
            <br />1.2.4、乙方企业财产被有权国家机关查封；
            <br />1.2.5、以乙方为法定代表人的法人被宣告进入破产程序；
            <br />1.2.6、乙方处于无法联系状态（甲方连续三天或三天以上未能和乙方取得联系）；
            <br />1.2.7、乙方处于逾期状态，经甲方提醒催告还款事项，仍未能按照催告的时间足额归还租金和设备的。
            <br />十 、保密义务
            <br />协议各方应当对签署和履行本协议过程中所知晓的其他方的有关经营、财务方面的资料及信息等进行保密，非因交易所需或有合法依据，不得对外披露。
            <br />十一、附则
            <br />11.1本协议壹式两份，甲，乙方各一份，具有同等法律效力。
            <br />11.2本协议双方签章后即时生效。
            <br />11.3甲乙双方订立的法律文件均采用电子方式订立，每一份法律文件可以有多份副本，并且每份副本均具有同等法律效力。无论是否亲自进行的操作，在甲方平台账户对应之唯一登录信息（包括但不限于绑定邮箱、昵称、ID等）、设置了对应的登录密码并对各方提供的身份信息进行验证后，任何人通过平台账户之登录信息和登录密码登录进确认方式签署的电子协议，均视为乙方的真实意思表示和行为，一经成立生效即不可撤销，且对各方具有法律约束力并产生可强制执行的效力。本协议留存于丁方为此设立的专用服务器上备查，甲、乙双方均确认本协议的真实性，并认可该形式协议的法律效力。
            <br />11.4本协议以及平台的相关规则以电子方式签署相应的法律文件后，非经法定或约定的方式和程序，不得擅自修改。各方对法律文件的真伪、版本有任何争议，应以平台的记录为准。
            <br />11.5如果本协议中的任何一条或多条违反适用的法律法规，则该条将被视为无效，但该无效条款并不影响本协议其他条款的效力。
            <br />十二、租金缴纳方式
            <br />1．付款信息：
            <br />账号：1101 4752 2310 02
            <br />户名：信安租赁（深圳）有限公司
            <br />开户行：平安银行深圳西丽支行
            <br />甲、乙双方已经充分阅读并理解以上协议条款内容并对本协议无异议。
            <br />甲方：
            <span style="width:300px;display:inline-block;">信安租赁（深圳）有限公司</span>签约代表：韩大平
            <br />乙方：
            <span style="width:300px;display:inline-block;">{{contract.companyName}}</span>
            签约代表：{{contract.contactsName}}
            <br />
            签约日期：{{ contract.createTime | filterTime }}
          </div>
          <!-- 设备清单 -->
          <br />附件一：设备清单
          <br />
          承租人：{{contract.contactsName}}
          <div class="tab" v-for="(item,index) in contract.orderGoodsList">
            <el-row class="row">
              <el-col :span="4" class="a br c">租期及数量</el-col>
              <el-col :span="20" class="b br">租期{{item.goodsCycle}}个月,总计{{item.goodsNumber}}台</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租赁起止时间</el-col>
              <el-col
                :span="20"
                class="b br"
              >{{ contract.createTime | filterTime }}日起（具体开始时间以收到设备日期算起）</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">设备使用地址</el-col>
              <el-col :span="20" class="b br">{{contract.companyAddress}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">设备类型</el-col>
              <el-col :span="20" class="b br">
                <el-col :span="24">
                  <el-col :span="6" class="br c">配置情况</el-col>
                  <el-col :span="6" class="br c">数量（台）</el-col>
                  <el-col :span="6" class="br c">单台租金</el-col>
                  <el-col :span="6" class="b c">设备租金合计</el-col>
                </el-col>
                <el-col :span="24" class="row">
                  <el-col :span="6" class="r c">{{item.dispose}},{{item.des}}</el-col>
                  <el-col :span="6" class="r c">{{item.goodsNumber}}</el-col>
                  <el-col :span="6" class="r c">{{item.rent}}</el-col>
                  <el-col :span="6" class="c">{{item.goodsNumber*item.rent*item.goodsCycle}}</el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租金合计（元）</el-col>
              <el-col :span="20" class="b br">{{item.goodsNumber*item.rent*item.goodsCycle}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">押金合计（元）</el-col>
              <el-col :span="20" class="b br">{{item.goodsNumber*item.deposit}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租金及押金合计（元）</el-col>
              <el-col
                :span="20"
                class="b br"
              >{{item.goodsNumber*item.rent*item.goodsCycle + item.goodsNumber*item.deposit}}</el-col>
            </el-row>
          </div>
          <br />附件一：企业信息资料（营业执照、法人身份证复印件）
          <div>
            营业执照
            <img v-if="contract.imgs1" :src="contract.imgs1.img1" alt style="width:300px;" />
            法人身份证复印件
            <img
              v-if="contract.imgs2"
              :src="contract.imgs2.positive"
              alt
              style="width:300px;"
            />
            <img v-if="contract.imgs2" :src="contract.imgs2.negative" alt style="width:300px;" />
            <!-- <img :src="authentication.imgs1.img1" alt=""> -->
            <!-- <img :src="authentication.imgs2.positive" alt=""> -->
            <!-- <img :src="authentication.imgs2.negative" alt=""> -->
          </div>
        </el-row>
      </el-dialog>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="addressBox">
        <div class="top">
          <div class="name">{{detail.consignee}}</div>
          <div class="phone">{{detail.phone}}</div>
        </div>
        <div class="bottom">{{detail.addressV}}</div>
      </div>

      <div class="main">
        <div class="item" v-for="(item,index) of goods" :key="index">
          <div class="img">
            <img :src="item.goodsImg" />
          </div>
          <div class="info">
            <div class="des ellipsis2">{{item.goodsName}}</div>
            <div class="size ellipsis">{{item.proIntroduction}}</div>
            <div
              class="size ellipsis"
            >数量：{{item.goodsNumber}}，租期{{item.goodsCycle}}个月，{{item.dispose}}</div>
            <div class="price">
              ￥
              <span>{{item.rent}}</span>
              <span class="deposit">押金{{item.deposit}}/1台</span>
            </div>
          </div>
        </div>
        <div class="oInfo">
          <div class="n">
            配送方式：
            <span>普通快递</span>
          </div>
        </div>
        <div class="oInfo">
          <div class="n">发票信息</div>
          <div class="v">
            <span class="tx" v-if="detail.taxNum">类型：{{detail.type}}</span>
            <span class="tx" v-if="detail.taxNum">名称：{{detail.name}}</span>
            <span class="tx" v-if="detail.taxNum">税号：{{detail.taxNum}}</span>
            <span class="tx" v-if="detail.taxNum">地址：{{detail.addressV}}</span>
            <span class="tx" v-else>暂无发票信息</span>
          </div>
        </div>
        <div class="oInfo">
          <div class="n">
            订单状态：
            <span>{{detail.orderState | filterStatus}}</span>
          </div>
          <div class="n">
            订单编号：
            <span>{{detail.orderNum}}</span>
            <span
              style="color:#f08200;margin-left:8rpx;"
              v-clipboard:copy="detail.orderNum"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</span>
          </div>
          <div class="n">
            下单时间：
            <span>{{detail.createTime}}</span>
          </div>
          <div class="n" v-if="detail.payTime">
            支付时间：
            <span>{{detail.payTime}}</span>
          </div>
        </div>
        <div class="priceInfo">
          <div class="itm">
            <div class="n">商品租金</div>
            <div class="v">￥{{detail.rent}}</div>
          </div>
          <div class="itm">
            <div class="n">商品押金</div>
            <div class="v">￥{{detail.deposit}}</div>
          </div>
          <div class="itm">
            <div class="n">运费</div>
            <div
              class="v"
            >￥{{detail.courierMoney!=null&&detail.courierMoney!='' ? detail.courierMoney: 0}}</div>
          </div>
          <div class="itm">
            <div class="n b">实付金额</div>
            <div class="v">￥{{detail.money}}</div>
          </div>
        </div>
      </div>

      <div class="opt">
        <router-link
          tag="span"
          :to="'/renewalOrder/'+id"
          v-if="detail.orderState==4||detail.orderState==5"
        >续租</router-link>
        <span class="b" v-if="detail.orderState==1" @click="paymoney">立即支付</span>
        <span v-if="detail.orderState>2&&detail.orderState!=7" @click="viewLogistics">查看物流</span>
        <router-link tag="span" :to="'/comment/'+id" v-if="detail.orderState==5">去评价</router-link>
        <span v-if="detail.orderState==7" style="border:none;">待确认付款</span>
      </div>

      <el-dialog
        title="物流信息"
        :visible.sync="dialogLogistics"
        width="100%"
        :fullscreen="true"
        :close-on-click-modal="false"
      >
        <logistics :data="logistics"></logistics>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogLogistics = false">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import logistics from "@/components/logistics/logistics";
import headertop from "@/components/mobile/header";
import { mt_getOrderDetail, mt_queryLeaseContractByUserId } from "@/api/order";
import { formatDate } from "@/config/often";
export default {
  name: "orderDetail",
  components: {
    headTop,
    footGuide,
    logistics,
    headertop
  },
  data() {
    return {
      type: 1, //1订单  2续租订单
      id: "",
      detail: {}, //订单详情
      goods: [],
      logistics: [],
      remark: "",

      centerDialogVisible: false, //信安租赁协议弹窗
      contract: {},
      headValue: "订单详情",
      dialogLogistics: false
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {},
  filters: {
    // 0已取消 1待付款 2待发货 3待收货 4已完成 5待评价 6已申请售后
    filterStatus(value) {
      if (value == 0) {
        return "已取消";
      } else if (value == 1) {
        return "待付款";
      } else if (value == 2) {
        return "待发货";
      } else if (value == 3) {
        return "待收货";
      } else if (value == 4) {
        return "已完成";
      } else if (value == 5) {
        return "待评价";
      } else if (value == 6) {
        return "已申请售后";
      } else if (value == 7) {
        return "待确认打款";
      }
    },
    filterPhone(val) {
      return val.substr(0, 3) + "****" + val.substr(7);
    },
    filterTime(val) {
      return formatDate(val, "yyyy-MM-dd hh:mm");
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.getOrderDetail(this.id);
  },
  methods: {
    //查看物流
    viewLogistics() {
      // //console.log(value);
      this.getOrderDetail(this.id);
      this.dialogLogistics = true;
    },
    //获取我的订单
    getOrderDetail(id) {
      let that = this;
      mt_getOrderDetail(id).then(data => {
        //console.log(data.data);
        that.logistics =
          data.data.express != null
            ? JSON.parse(data.data.express.content)
            : [];
        if (
          data.data.goods[0].reletId != "" &&
          data.data.goods[0].reletId != null &&
          data.data.goods[0].reletId != undefined
        ) {
          that.type = 2;
        } else {
          that.type = 1;
        }
        data.data.goods.forEach(item => {
          if (item.deposit > 0) {
            item.newNumber = Number(item.deposit) / Number(item.oldDeoisit);
          } else {
            item.newNumber = 0;
          }
        });
        that.remark = data.data.goods[0].remark;
        that.goods = data.data.goods;
        that.detail = data.data.order;
        that.detail.addressV = data.data.order.address.split(",").join("");
        that.detail.phone =
          data.data.order.consigneePhone.substr(0, 3) +
          "****" +
          data.data.order.consigneePhone.substr(7);
      });
    },
    //查看租赁协议
    viewLease() {
      let that = this;
      mt_queryLeaseContractByUserId().then(data => {
        //console.log(data.data);
        if (data.data) {
          //console.log(that.detail.orderNum);
          data.data.forEach(item => {
            if (item.uid == that.detail.orderNum) {
              that.contract = item;
              that.contract.imgs1 = JSON.parse(item.imgs);
              that.contract.imgs2 = JSON.parse(item.legalManImgs);
              that.centerDialogVisible = true;
              //console.log(that.contract);
            }
          });
        }
      });
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message({
        message: "链接已复制！",
        type: "success",
        duration: 1000
      });
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message({
        message: "抱歉，复制失败！",
        type: "success",
        duration: 1000
      });
    },
    //移动端立即支付
    paymoney() {
      if (this.mobileMode.result) {
        this.$confirm("请前往电脑端或小程序端支付?", "支付提示", {
          confirmButtonText: "确定",
          showClose: false,
          showCancelButton: false,
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
  /deep/ .el-dialog.leaseAggrement {
    margin: 0 auto !important;
  }
  .tab {
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
    margin-bottom: 20px;
    font-size: 12px;
    .br {
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      padding: 0 5px;
    }
    .b {
      border-bottom: 1px solid #ddd;
      padding: 0 5px;
    }
    .r {
      border-right: 1px solid #ddd;
      padding: 0 5px;
    }
    .c {
      text-align: center;
      padding: 0 5px;
    }
    .row {
      display: flex;
    }
  }
  .orderDetail {
    .box {
      padding: 20px 0;
      .main {
        .stateCont {
          display: flex;
          padding: 20px 0;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          .orderStatus {
            flex: 300px 0 0;
            width: 300px;
            padding: 20px;
            border-right: 1px solid #f1f1f1;
            text-align: center;
            .num {
              margin-bottom: 10px;
              font-size: 13px;
              line-height: 18px;
              color: #999999;
            }
            .ht {
              margin-bottom: 10px;
              font-size: 13px;
              line-height: 18px;
              color: #999999;
              &:hover {
                cursor: pointer;
                text-decoration: underline;
                color: #f08200;
              }
            }
            .status {
              margin-bottom: 30px;
              font-size: 20px;
              font-weight: bold;
              line-height: 20px;
              color: #71b247;
              &.complete {
                color: #71b247;
              }
            }
            .comment {
              display: inline-block;
              line-height: 30px;
              padding: 0 30px;
              font-size: 13px;
              color: $mainColor;
              border-radius: 3px;
              border: 1px solid $mainColor;
              &:hover {
                cursor: pointer;
                background-color: $mainColor;
                color: #ffffff;
              }
            }
          }
        }
        .orderInfo {
          display: flex;
          margin-top: 20px;
          padding: 20px 0;
          min-height: 250px;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          .item {
            flex: 1;
            border-right: 1px solid #f1f1f1;
            &:last-child {
              border-right: none;
            }
            .title {
              font-size: 14px;
              line-height: 14px;
              color: #333333;
              margin-bottom: 15px;
              padding: 0 20px;
            }
            .itm {
              padding: 0 20px;
              display: flex;
              .n {
                flex: 84px 0 0;
                width: 84px;
                font-size: 12px;
                line-height: 24px;
                color: #666666;
              }
              .v {
                font-size: 12px;
                line-height: 24px;
                color: #666666;
              }
            }
          }
        }
        .goodsInfo {
          margin-top: 20px;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          .title {
            background-color: #f7f7f7;
            padding: 0 20px;
            .im {
              text-align: center;
              line-height: 34px;
              font-size: 14px;
              color: #333333;
            }
          }
          .table {
            line-height: 24px;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #333333;
            .b {
              padding: 20px 0;
              border-bottom: 1px solid #dddddd;
              .name {
                text-align: left;
                display: flex;
                .img {
                  flex: 60px 0 0;
                  width: 60px;
                  height: 60px;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
                .info {
                  flex: 1;
                  padding-left: 15px;
                  .name {
                    font-size: 12px;
                    line-height: 20px;
                    color: #666666;
                    &:hover {
                      cursor: pointer;
                      color: $mainColor;
                    }
                  }
                  .size {
                    font-size: 12px;
                    line-height: 20px;
                    color: #999999;
                  }
                }
              }
              .opt {
                div {
                  margin-bottom: 10px;
                  &:hover {
                    cursor: pointer;
                    color: $mainColor;
                    text-decoration: underline;
                  }
                }
              }
            }
            .pinfo {
              padding-top: 30px;
              overflow: hidden;
              ul {
                float: right;
                .itm {
                  width: 200px;
                  display: flex;
                  font-size: 12px;
                  line-height: 24px;
                  margin-bottom: 5px;
                  &:last-child {
                    .n {
                      color: $mainColor;
                    }
                    .v {
                      font-size: 18px;
                      font-weight: bold;
                      color: $mainColor;
                    }
                  }
                  .n {
                    flex: 60px 0 0;
                    text-align: left;
                    color: #666666;
                  }
                  .v {
                    flex: 1;
                    width: 100%;
                    text-align: right;
                    color: #666666;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
    padding-bottom: 44px;
    background-color: #f7f7f7;
    .addressBox {
      width: 100%;
      padding: 12px 10px;
      background-color: #ffffff;
      border-bottom: 1px dashed #dddddd;
      .nodata {
        line-height: 49px;
        text-align: center;
      }
      .top {
        display: flex;
        line-height: 24px;
        font-size: 16px;
        font-weight: bold;
        color: #333333;
      }
      .top .name {
        margin-right: 10px;
      }
      .bottom {
        font-size: 12px;
        line-height: 20px;
        color: #666666;
      }
    }
    .main .item {
      margin-top: 10px;
      padding: 10px 15px;
      display: flex;
      justify-content: flex-start;
      background-color: #ffffff;
      border-bottom: 1px solid #f1f1f1;
    }
    .main .item .img {
      flex: 94px 0 0;
      width: 94px;
      height: 94px;
    }
    .main .item .img img {
      width: 100%;
      height: 100%;
    }
    .main .item .info {
      flex: 1;
      height: 94px;
      padding-left: 8px;
      position: relative;
    }
    .main .item .info .des {
      max-height: 32px;
      line-height: 16px;
      font-size: 14px;
      color: #333333;
    }
    .main .item .info .size {
      margin-top: 5px;
      height: 10px;
      line-height: 10px;
      font-size: 10px;
      color: #666666;
    }
    .main .item .info .price {
      content: "";
      position: absolute;
      bottom: 0;
      left: 6px;
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 8px;
      color: #f63f45;
    }
    .main .item .info .price .deposit {
      display: inline-block;
      line-height: 20px;
      margin-left: 10px;
      font-size: 10px;
      font-weight: normal;
      color: #666666;
    }
    .main .item .info .price text {
      font-size: 15px;
      font-weight: bold;
    }
    .main .item .info .price .num {
      float: right;
      padding-right: 10px;
      font-size: 13px;
      font-weight: normal;
      color: #959595;
    }

    .main .item .price .opNum {
      float: right;
      margin-right: 10px;
      display: flex;
      justify-content: flex-start;
      width: 100px;
      height: 23px;
      line-height: 23px;
      border: 1px solid #eeeeee;
      border-radius: 2px;
      text-align: center;
    }
    .main .item .price .opNum .wj {
      width: 30px;
      font-size: 23px;
      position: relative;
      top: -2px;
    }
    .main .item .price .opNum .reduce,
    .main .item .price .opNum .add {
      color: #959595;
    }
    .main .item .price .opNum .reduce.true,
    .main .item .price .opNum .add.true {
      color: #188dec;
    }
    .main .item .price .opNum .num {
      flex: 1;
      border-left: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;
      font-size: 13px;
      font-weight: bold;
      color: #2e2e2e;
    }
    .oInfo {
      padding: 10px 15px;
      background-color: #ffffff;
      margin-bottom: 10px;
    }
    .oInfo .n {
      line-height: 20px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #333333;
    }
    .oInfo .n text {
      color: #999999;
    }
    .oInfo .n .btn {
      float: right;
    }
    .oInfo .v .input {
      width: 100%;
      height: 40px;
      line-height: 15px;
      padding: 5px;
      border: 1px solid #dddddd;
      color: #666666;
    }
    .oInfo .v .input1 {
      width: 60%;
      height: 30px;
      line-height: 30px;
      padding: 0 5px;
      border: 1px solid #dddddd;
      color: #666666;
    }
    .oInfo .v .tx {
      margin-right: 10px;
      font-size: 13px;
      line-height: 20px;
      color: #999999;
    }
    .oInfo .v .radio {
      line-height: 20px;
      color: #1197d3;
      font-size: 12px;
    }

    .priceInfo {
      padding: 10px 15px;
      background-color: #ffffff;
    }
    .priceInfo .itm {
      display: flex;
      line-height: 21px;
    }
    .priceInfo .itm .n {
      flex: 1;
      color: #333333;
    }
    .priceInfo .itm .n.b {
      font-weight: bold;
    }
    .priceInfo .itm .v {
      color: #e93b3d;
    }
    .priceInfo .sub {
      margin-top: 15px;
    }
    .priceInfo .sub .btn {
      height: 46px;
      line-height: 46px;
      text-align: center;
      border-radius: 4px;
      font-size: 18px;
      color: #ffffff;
      background-color: #3884ff;
    }
    .opt {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      height: 44px;
      line-height: 44px;
      padding: 6px 15px 0 15px;
      font-size: 0;
      text-align: right;
      background-color: #ffffff;
      border-top: 1px solid #f1f1f1;
    }
    .opt span {
      display: inline-block;
      margin-left: 15px;
      font-size: 14px;
      color: #333333;
      line-height: 27px;
      padding: 0 10px;
      border: 1px solid #dddddd;
      border-radius: 5px;
    }
    .opt span.b {
      border: 1rpx solid #f08200;
      color: #f08200;
    }
  }
}
</style>
