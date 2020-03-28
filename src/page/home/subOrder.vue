<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <div class="hometop2">
        <div class="container box">
          <router-link tag="div" to="/" class="img" title="信安首页">
            <img src="/static/icon/logo_black.png" alt />
          </router-link>
          <div class="searchBox">
            <search></search>
          </div>
          <div class="shoppingcartBox">
            <shoppingcart></shoppingcart>
          </div>
        </div>
      </div>
      <div class="shoppingcartlist" v-if="!noData">
        <div class="container box">
          <div class="ot">填写并核对订单信息</div>
          <div class="goodsDetail">
            <div class="oinfo">
              <div class="otitle">
                收货人信息
                <span
                  v-if="!moreAddress&&addressList.length>1"
                  @click="moreAddress=true"
                >&nbsp;更多</span>
                <span v-if="moreAddress" @click="moreAddress=false">&nbsp;隐藏</span>
                <span class="fr" title="点击新增收货地址" @click="add">新增收货地址</span>
              </div>
              <div
                class="val receive"
                v-for="(item,index) of addressList"
                :key="index"
                v-if="addressList.length>0 && index<1"
              >
                <span
                  class="select"
                  :class="selectedAddress.id==item.id?'active':''"
                  @click="selectAddress(item)"
                  title="选择该地址"
                >{{item.consignee}}</span>
                <span class="name">{{item.consignee}}</span>
                <span class="address">{{item.addressV}}</span>
                <span class="phone">{{item.phone | filterPhone}}</span>
                <span class="edit fr" @click="edit(item)">编辑</span>
                <span class="setDefault fr" v-if="item.isDefault==0" @click="setDefault(item)">设为默认</span>
              </div>
              <div
                class="val receive"
                v-for="(item,index) of addressList"
                :key="index"
                v-if="addressList.length>0 && moreAddress && index>=1"
              >
                <span
                  class="select"
                  :class="selectedAddress.id==item.id?'active':''"
                  @click="selectAddress(item)"
                  title="选择该地址"
                >{{item.consignee}}</span>
                <span class="name">{{item.consignee}}</span>
                <span class="address">{{item.addressV}}</span>
                <span class="phone">{{item.phone | filterPhone}}</span>
                <span class="edit fr" @click="edit(item)">编辑</span>
                <span class="setDefault fr" v-if="item.isDefault==0" @click="setDefault(item)">设为默认</span>
              </div>
              <div class="noaddress" v-if="addressList.length == 0">暂无收货地址，请先新增收货地址</div>
            </div>
            <div class="oinfo">
              <div class="otitle">支付方式</div>
              <div class="val way">
                <span class="active">在线支付</span>
              </div>
            </div>
            <div>
              <el-row class="itm title">
                <el-col :span="9">&nbsp;&nbsp;&nbsp;&nbsp;商品名称</el-col>
                <el-col :span="5">类型和尺寸</el-col>
                <el-col :span="3" class="number">价格</el-col>
                <el-col :span="3" class="number">租期</el-col>
                <el-col :span="4" class="number">数量</el-col>
              </el-row>
              <el-row class="itm" v-for="(item,index) in cartList" :key="index">
                <el-col :span="9" class="gd">
                  <div class="img">
                    <img :src="item.img" alt />
                  </div>
                  <div class="info">
                    <div class="des">{{item.des}}</div>
                    <div class="sign">{{item.sign}}</div>
                  </div>
                </el-col>
                <el-col :span="5" class="type">{{item.collocation.config}}</el-col>
                <el-col :span="3" class="number price" style="text-align: left;padding-left: 10px;">
                  <div style="color: #e1481f;">租金：￥{{item.rent }}</div>
                  <div style="color: #e1481f;">押金：￥{{item.deposit}}</div>
                </el-col>
                <el-col :span="3" class="number">
                  <div style="color: #e1481f;">租期：{{item.leaseTerm}}个月</div>
                </el-col>
                <el-col :span="4" class="number">
                  <el-input-number
                    v-model="item.num"
                    @change="changeNum(index,item)"
                    size="mini"
                    :min="1"
                    :step="1"
                    step-strictly
                    label="数量"
                  ></el-input-number>
                </el-col>
                <!-- <el-col :span="2" class="delete">
                <i class="el-icon-delete"></i>
                </el-col>-->
              </el-row>
              <el-row class="itm">
                <el-col :span="24" class="leaveMsg">
                  <el-col :span="12" class="inp">
                    <span>给平台留言：</span>
                    <el-input
                      type="textarea"
                      v-model="leaveMsg"
                      :rows="2"
                      placeholder="给平台留言"
                      class="textarea"
                    ></el-input>
                  </el-col>
                  <el-col :span="5" class="type">配送方式：快递</el-col>
                  <el-col :span="2" class="price">￥{{freight}}</el-col>
                </el-col>
              </el-row>
            </div>
            <div class="oinfo" style="padding-top:30px;">
              <div class="otitle">发票信息</div>
              <div class="val invoice" v-if="invoice.taxNum!=''&&invoice.taxNum!=undefined">
                <span>类型：{{invoice.type | filterInvoiceType}}</span>
                <span>名称：{{invoice.name}}</span>
                <span>税号：{{invoice.taxNum}}</span>
                <span>地址：{{invoice.address}}</span>
                <span class="op edit" @click="editInvoice" title="点击编辑发票信息">编辑发票信息</span>
              </div>
              <div class="val invoice" v-else>
                <span>暂未添加发票信息</span>
                <span class="op add" @click="addInvoice" title="点击添加发票信息">添加发票信息</span>
              </div>
            </div>
            <div class="oinfo" style="padding-top:30px;">
              <div class="otitle">租赁协议</div>
              <div class="val lease">
                <div class="l" @click="viewLease">
                  <el-radio-group v-model="radio">
                    <el-radio :label="1">默认选择接受《信安租赁协议》</el-radio>
                  </el-radio-group>
                </div>
                <div class="code">
                  <span>邀请码：</span>
                  <el-input class="inp" v-model="invitationCode" placeholder="请输入邀请人的手机号"></el-input>
                </div>
              </div>
            </div>
            <div class="priceInfo">
              <div class="p">
                <span>商品租金：￥{{rent}}</span>
                <span>商品押金：￥{{deposit}}</span>
                <span>运费：￥{{freight}}</span>
              </div>
              <div class="ai">
                <div class="a" v-if="selectedAddress.addressV">确认地址：{{selectedAddress.addressV}}</div>
                <div class="a" v-else>确认地址：暂无</div>
                <div
                  class="a"
                  v-if="selectedAddress.phone"
                >收货人：{{selectedAddress.consignee}}&nbsp;&nbsp;&nbsp;&nbsp;{{selectedAddress.phone | filterPhone}}</div>
                <div class="a" v-else>收货人：暂无</div>
              </div>
              <div class="sbtn">
                <span class="v">
                  总计：
                  <i>￥{{totalPrice}}</i>
                </span>
                <span class="subOrder" @click="subOrder">提交订单</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <error v-else></error>

      <foot-guide></foot-guide>

      <!-- 地址管理弹窗 -->
      <el-dialog
        title="地址管理"
        :visible.sync="dialogPAddress"
        width="700px"
        :close-on-click-modal="false"
      >
        <div class="infoList">
          <el-row class="item">
            <el-col :span="4" class="name">
              <i>*</i>收货人
            </el-col>
            <el-col :span="8" class="line40">
              <el-input v-model="name" maxlength="12" placeholder="收货人" class="einp"></el-input>
            </el-col>
            <el-col :span="4" class="name">
              <i>*</i>联系方式
            </el-col>
            <el-col :span="8" class="line40">
              <el-input v-model="phone" maxlength="11" placeholder="联系方式" class="einp"></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="4" class="name">
              <i>*</i>所在地区
            </el-col>
            <el-col :span="20" class="line40">
              <el-cascader
                style="width: 100%;"
                :options="options"
                v-model="addressArr"
                @change="handleChange"
              ></el-cascader>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="4" class="name">
              <i>*</i>详细地址
            </el-col>
            <el-col :span="20">
              <el-input
                style="width: 100%;"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="detailAddress"
                maxlength="30"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPAddress = false">取消</el-button>
          <el-button type="danger" @click="submit">确认</el-button>
        </span>
      </el-dialog>

      <!-- 发票信息 -->
      <el-dialog
        title="发票信息"
        :visible.sync="dialogInvoice"
        width="1000px"
        :close-on-click-modal="false"
      >
        <div class="infoList">
          <el-row class="item">
            <el-col :span="3" class="name">
              <i>*</i>发票类型
            </el-col>
            <el-col :span="8" class="line40">
              <el-select v-model="invoicetype" placeholder="请选择">
                <el-option
                  v-for="item in invoiceTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" class="name">
              <i>*</i>公司名称
            </el-col>
            <el-col :span="8" class="line40">
              <el-input v-model="invoicename" placeholder="名称"></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="3" class="name">
              <i>*</i>公司税号
            </el-col>
            <el-col :span="8" class="line40">
              <el-input v-model="invoicetaxNum" placeholder="税号"></el-input>
            </el-col>
            <el-col :span="3" class="name">
              <i>*</i>公司地址
            </el-col>
            <el-col :span="8" class="line40">
              <el-input v-model="invoiceaddress" placeholder="填写寄送地址"></el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogInvoice = false">取消</el-button>
          <el-button type="danger" @click="submitInvoice">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="信安租赁租赁协议"
        :visible.sync="centerDialogVisible"
        width="100%"
        top="0"
        bottom="0"
        custom-class="leaseAggrement"
      >
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="22">甲方（出租方）：信安租赁（深圳）有限公司</el-col>
              <el-col :span="22">法定代表人：韩大平</el-col>
              <el-col :span="22">地址：深圳市南山区桃源街道红花岭工业区朋年大学城科技园B栋507-509</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="22">已方（承租方）：{{authentication.name}}</el-col>
              <el-col :span="22">法定代表人：{{authentication.contactsName}}</el-col>
              <el-col :span="22">地址：{{authentication.companyAddress}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <div class="title">正文</div>
          <div class="cont">
            根据中华人民共和国相关法律法规，甲方为专业的办公IT设备租赁服务提供方，乙方愿意向甲方租赁:
            <span
              v-for="(item,index) in cartList"
              style="color:#f08200;"
            >“{{item.collocation.config}}”</span>，甲乙双方就租赁
            <span
              v-for="(item,index) in cartList"
              style="color:#f08200;"
            >“{{item.collocation.config}}”</span>设备事宜一致达成以下条款，由双方共同遵守：
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
            <span style="width:300px;display:inline-block;">{{authentication.name}}</span>
            签约代表：{{authentication.contactsName}}
            <br />
            签约日期：{{htDate[0]}}年{{htDate[1]}}月{{htDate[2]}}日
          </div>
          <!-- 设备清单 -->
          <br />附件一：设备清单
          <br />
          承租人：{{authentication.contactsName}}
          <div class="tab" v-for="(item,index) in cartList">
            <el-row class="row">
              <el-col :span="4" class="a br c">租期及数量</el-col>
              <el-col :span="20" class="b br">租期{{item.leaseTerm}}个月,总计{{item.num}}台</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租赁起止时间</el-col>
              <el-col
                :span="20"
                class="b br"
              >{{htDate[0]}}年{{htDate[1]}}月{{htDate[2]}}日起（具体开始时间以收到设备日期算起）</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">设备使用地址</el-col>
              <el-col :span="20" class="b br">{{authentication.companyAddress}}</el-col>
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
                  <el-col :span="6" class="r c">{{item.collocation.config}}</el-col>
                  <el-col :span="6" class="r c">{{item.num}}</el-col>
                  <el-col :span="6" class="r c">{{item.rent}}</el-col>
                  <el-col :span="6" class="c">{{item.num*item.rent*item.leaseTerm}}</el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租金合计（元）</el-col>
              <el-col :span="20" class="b br">{{item.num*item.rent*item.leaseTerm}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">押金合计（元）</el-col>
              <el-col :span="20" class="b br">{{item.num*item.deposit}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租金及押金合计（元）</el-col>
              <el-col
                :span="20"
                class="b br"
              >{{item.num*item.rent*item.leaseTerm + item.num*item.deposit}}</el-col>
            </el-row>
          </div>
          <br />附件一：企业信息资料（营业执照、法人身份证复印件）
          <div>
            营业执照
            <img
              v-if="authentication.imgs1"
              :src="authentication.imgs1.img1"
              alt
              style="width:300px;"
            />
            法人身份证复印件
            <img
              v-if="authentication.imgs2"
              :src="authentication.imgs2.positive"
              alt
              style="width:300px;"
            />
            <img
              v-if="authentication.imgs2"
              :src="authentication.imgs2.negative"
              alt
              style="width:300px;"
            />
            <!-- <img :src="authentication.imgs1.img1" alt=""> -->
            <!-- <img :src="authentication.imgs2.positive" alt=""> -->
            <!-- <img :src="authentication.imgs2.negative" alt=""> -->
          </div>
        </el-row>
      </el-dialog>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="addressBox" @click="addressListShow" v-if="selectedAddress.consignee">
        <div class="top">
          <div class="name">{{selectedAddress.consignee}}</div>
          <div class="phone">{{selectedAddress.phones}}</div>
        </div>
        <div class="bottom">{{selectedAddress.addressV}}</div>
      </div>
      <div class="addressBox" @click="addressListShow" v-else>
        <div class="nodata">请选择地址</div>
      </div>
      <div class="addressListBox" v-if="addressListState">
        <div class="address">
          <div class="nbox">
            <div
              class="nzxItm"
              v-for="(item,index) of addressList"
              :key="index"
              @click="selectedAddressValue(item)"
            >
              <div class="ninfo">
                <div class="top" data-type="1">
                  <span>{{item.consignee}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.phones}}</span>
                </div>
                <div class="middle" v-if="item.address!=''">{{item.addressV}}</div>
              </div>
              <div class="nbtn">
                <span class="y" @click="edit(item)">改</span>
                <span class="b" @click="deleteA(item.id,index)">删</span>
              </div>
            </div>
            <div class="nodata" v-if="addressList.length==0">
              <span>暂无收货地址</span>
            </div>
          </div>
          <div class="submit" @click="add">
            <div>新增收货地址</div>
          </div>
        </div>
      </div>

      <div class="main">
        <div class="item" v-for="(item,index) of cartList" :key="index">
          <div class="img">
            <img :src="item.img" />
          </div>
          <div class="info">
            <div class="des ellipsis2">{{item.des}}</div>
            <div class="size ellipsis">{{item.collocation.config}}</div>
            <div class="size ellipsis">{{item.startTime}}起租，租期{{item.leaseTerm}}个月，{{item.wayValue}}</div>
            <div class="price">
              ￥
              <span>{{item.rent}}</span>
              <span class="deposit">押金{{item.deposit}}/1台</span>
              <div class="opNum">
                <span class="wj reduce" :class="item.num>1?'true':''" @click="reduce(index)">-</span>
                <span class="num" style="padding-right:0;">{{item.num}}</span>
                <span class="wj add true" @click="add(index)">+</span>
              </div>
            </div>
          </div>
        </div>
        <div class="oInfo">
          <div class="n">
            配送方式：
            <span>快递</span>
          </div>
          <div class="v">
            <el-input
              type="textarea"
              v-model="leaveMsg"
              :rows="2"
              placeholder="给平台留言"
              class="textarea"
            ></el-input>
          </div>
        </div>
        <div class="oInfo">
          <div class="n">
            发票信息
            <span
              class="btn"
              v-if="invoice.taxNum!=''&&invoice.taxNum!=undefined"
              @click="editInvoice"
            >编辑发票信息</span>
            <span class="btn" v-else @click="addInvoice">添加发票信息</span>
          </div>
          <div class="v">
            <span class="tx" v-if="invoice.type">类型：{{invoice.type}}</span>
            <span class="tx" v-if="invoice.type">名称：{{invoice.name}}</span>
            <span class="tx" v-if="invoice.type">税号：{{invoice.taxNum}}</span>
            <span class="tx" v-if="invoice.type">地址：{{invoice.address}}</span>
            <span class="tx" v-else>暂未填写</span>
          </div>
        </div>
        <div class="oInfo">
          <div class="n">租赁协议</div>
          <div class="v" @click="viewLease">
            <span class="radio">默认选择接受《信安租赁协议》</span>
          </div>
        </div>
        <div class="oInfo">
          <div class="n">邀请码</div>
          <div class="v">
            <el-input v-model="invitationCode" placeholder="请输入邀请人的手机号"></el-input>
          </div>
        </div>
        <div class="priceInfo">
          <div class="itm">
            <div class="n">商品租金</div>
            <div class="v">￥{{rent}}</div>
          </div>
          <div class="itm">
            <div class="n">商品押金</div>
            <div class="v">￥{{deposit}}</div>
          </div>
          <div class="itm">
            <div class="n">运费</div>
            <div class="v">￥{{freight}}</div>
          </div>
          <div class="itm">
            <div class="n b">实付金额</div>
            <div class="v">￥{{totalPrice}}</div>
          </div>
          <div class="sub">
            <div class="btn" @click="subOrder">提交订单</div>
          </div>
        </div>
      </div>

      <!-- 地址管理弹窗 -->
      <el-dialog
        title="地址管理"
        :visible.sync="dialogPAddress"
        width="360px"
        :close-on-click-modal="false"
      >
        <div class="infoList">
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-input v-model="name" maxlength="12" placeholder="收货人" class=""></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-input v-model="phone" maxlength="11" placeholder="联系方式" class=""></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-cascader
                style="width: 100%;"
                :options="options"
                v-model="addressArr"
                @change="handleChange"
              ></el-cascader>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24">
              <el-input
                style="width: 100%;"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址"
                v-model="detailAddress"
                maxlength="30"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPAddress = false">取消</el-button>
          <el-button type="danger" @click="submit">确认</el-button>
        </span>
      </el-dialog>

      <!-- 发票信息 -->
      <el-dialog
        title="发票信息"
        :visible.sync="dialogInvoice"
        width="300px"
        :close-on-click-modal="false"
      >
        <div class="infoList">
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-input v-model="invoicename" placeholder="公司名称"></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-input v-model="invoicetaxNum" placeholder="公司税号"></el-input>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24" class="line40">
              <el-input v-model="invoiceaddress" placeholder="寄送地址"></el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogInvoice = false">取消</el-button>
          <el-button type="danger" @click="submitInvoice">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="信安租赁租赁协议"
        :visible.sync="centerDialogVisible"
        width="100%"
        top="0"
        bottom="0"
        custom-class="leaseAggrement"
      >
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="22">甲方（出租方）：信安租赁（深圳）有限公司</el-col>
              <el-col :span="22">法定代表人：韩大平</el-col>
              <el-col :span="22">地址：深圳市南山区桃源街道红花岭工业区朋年大学城科技园B栋507-509</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="22">已方（承租方）：{{authentication.name}}</el-col>
              <el-col :span="22">法定代表人：{{authentication.contactsName}}</el-col>
              <el-col :span="22">地址：{{authentication.companyAddress}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <div class="title">正文</div>
          <div class="cont">
            根据中华人民共和国相关法律法规，甲方为专业的办公IT设备租赁服务提供方，乙方愿意向甲方租赁:
            <span
              v-for="(item,index) in cartList"
              style="color:#f08200;"
            >“{{item.collocation.config}}”</span>，甲乙双方就租赁
            <span
              v-for="(item,index) in cartList"
              style="color:#f08200;"
            >“{{item.collocation.config}}”</span>设备事宜一致达成以下条款，由双方共同遵守：
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
            <span style="display:inline-block;">信安租赁（深圳）有限公司</span>签约代表：韩大平
            <br />乙方：
            <span style="display:inline-block;">{{authentication.name}}</span>
            签约代表：{{authentication.contactsName}}
            <br />
            签约日期：{{htDate[0]}}年{{htDate[1]}}月{{htDate[2]}}日
          </div>
          <!-- 设备清单 -->
          <br />附件一：设备清单
          <br />
          承租人：{{authentication.contactsName}}
          <div class="tab" v-for="(item,index) in cartList">
            <el-row class="row">
              <el-col :span="4" class="a br c">租期及数量</el-col>
              <el-col :span="20" class="b br">租期{{item.leaseTerm}}个月,总计{{item.num}}台</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租赁起止时间</el-col>
              <el-col
                :span="20"
                class="b br"
              >{{htDate[0]}}年{{htDate[1]}}月{{htDate[2]}}日起（具体开始时间以收到设备日期算起）</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">设备使用地址</el-col>
              <el-col :span="20" class="b br">{{authentication.companyAddress}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">设备类型</el-col>
              <el-col :span="20" class="b br">
                <el-col :span="24">
                  <el-col :span="24" class="b c">配置情况</el-col>
                  <el-col :span="24" class="b c">{{item.collocation.config}}</el-col>
                  <el-col :span="24" class="b c">数量（台）</el-col>
                  <el-col :span="24" class="b c">{{item.num}}</el-col>
                  <el-col :span="24" class="b c">单台租金</el-col>
                  <el-col :span="24" class="b c">{{item.rent}}</el-col>
                  <el-col :span="24" class="b c">设备租金合计</el-col>
                  <el-col :span="24" class="c">{{item.num*item.rent*item.leaseTerm}}</el-col>
                </el-col>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租金合计（元）</el-col>
              <el-col :span="20" class="b br">{{item.num*item.rent*item.leaseTerm}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">押金合计（元）</el-col>
              <el-col :span="20" class="b br">{{item.num*item.deposit}}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4" class="a br c">租金及押金合计（元）</el-col>
              <el-col
                :span="20"
                class="b br"
              >{{item.num*item.rent*item.leaseTerm + item.num*item.deposit}}</el-col>
            </el-row>
          </div>
          <br />附件一：企业信息资料（营业执照、法人身份证复印件）
          <div>
            营业执照
            <img
              v-if="authentication.imgs1"
              :src="authentication.imgs1.img1"
              alt
              style="width:300px;"
            />
            法人身份证复印件
            <img
              v-if="authentication.imgs2"
              :src="authentication.imgs2.positive"
              alt
              style="width:300px;"
            />
            <img
              v-if="authentication.imgs2"
              :src="authentication.imgs2.negative"
              alt
              style="width:300px;"
            />
            <!-- <img :src="authentication.imgs1.img1" alt=""> -->
            <!-- <img :src="authentication.imgs2.positive" alt=""> -->
            <!-- <img :src="authentication.imgs2.negative" alt=""> -->
          </div>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import search from "@/components/search/search";
import shoppingcart from "@/components/shopping/shoppingcart";
import error from "@/components/error/error";
import headertop from "@/components/mobile/header";
import cityData from "../../../static/other/city.json";
import {
  mt_selectAllcart,
  mt_insertcart,
  mt_deletecart,
  mt_getUserPostage
} from "@/api/common";
import {
  mt_getAddressList,
  mt_addAddress,
  mt_editAddress,
  mt_setDefaultAddress,
  mt_queryCompanyInfo
} from "@/api/my";
import { mt_createOrder } from "@/api/order";
import { mt_invoice, mt_getinvoice } from "@/api/home";
import { formatNum, accMul } from "@/config/often";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "subOrder",
  components: {
    headTop,
    footGuide,
    search,
    shoppingcart,
    error,
    headertop
  },
  data() {
    return {
      noData: false,
      addressList: [],
      moreAddress: false,
      cartList: [], //商品信息
      selectedAddress: {}, //选择的地址
      way: 1, //在线支付
      invoice: {}, //发票信息
      leaveMsg: "",
      radio: 1, //租赁协议
      invitationCode: "", //邀请码
      companyName: "",

      totalPrice: 0, //总费用
      rent: 0, //租金
      deposit: "", //押金
      freight: 0, //运费

      dialogPAddress: false, //新增地址弹窗是否显示
      opType: "", //操作类型  1添加  2修改
      editId: "", //修改地址id
      name: "",
      phone: "",
      address: "",
      detailAddress: "",
      isDefault: false, //是否默认

      options: [],
      addressArr: [], //地址数组

      dialogInvoice: false,
      invoiceTypes: [
        {
          value: 1,
          label: "普通发票"
        },
        {
          value: 2,
          label: "增值税发票"
        }
      ],
      invoicetype: 1, //类型发票类型，1，普通发票，2增值税发票
      invoicename: "",
      invoicetaxNum: "",
      invoiceaddress: "",

      centerDialogVisible: false, //信安租赁协议弹窗
      authentication: {}, //实名认证信息
      htDate: [], //协议日期

      headValue: "订单确认", //头部名称
      addressListState: false //地址弹窗显示
    };
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  watch: {
    //数量
    num(newVal, oldVal) {
      console.log(newVal);
    },
    $route() {
      this.subTime = this.$route.params.subTime;
      let obj = this.shoppingInfo;
      // console.log(this.shoppingInfo);
      if (obj) {
        // console.log(obj.list);
        if (this.subTime != "") {
          let arr = [];
          obj.list.forEach(item => {
            if (item.subTime == this.subTime) {
              item.leaveMsg = "";
              arr.push(item);
            }
          });
          this.cartList = arr;
          if (this.cartList.length == 0) {
            this.noData = true;
            setTimeout(() => {
              this.$router.push("/");
            }, 2000);
          }
        }
      }
    }
  },
  filters: {
    filterPhone(val) {
      return val.substr(0, 3) + "****" + val.substr(7);
    },
    filterMoney2wei(value) {
      return value.toFixed(2);
    },
    filterInvoiceType(value) {
      if (value == 1) {
        return "普通发票";
      } else if (value == 2) {
        return "增值税发票";
      }
    }
  },
  created() {
    // console.log(this.shoppingInfo);
    // 组装地址数据
    let arrCity = [];
    cityData.forEach((item, index) => {
      arrCity.push({ value: item.name, label: item.name, children: [] });
      item.citys.forEach((items, indexs) => {
        arrCity[index].children.push({
          value: items.name,
          label: items.name,
          children: []
        });
        items.citys.forEach((itemss, indexss) => {
          arrCity[index].children[indexs].children.push({
            value: itemss.name,
            label: itemss.name
          });
        });
      });
    });
    this.options = arrCity;

    this.subTime = this.$route.params.subTime;
    let obj = this.shoppingInfo;
    // console.log(this.shoppingInfo);
    if (obj) {
      console.log(obj.list);
      if (this.subTime != "") {
        let arr = [];
        obj.list.forEach(item => {
          if (item.subTime == this.subTime) {
            item.leaveMsg = this.leaveMsg;
            let a = JSON.parse(item.leaseTermOptions);
            a.forEach(items => {
              if (item.leaseTerm == items.value) {
                item.rent = items.rentMoney;
                item.deposit = items.depositMoney;
              }
            });
            arr.push(item);
          }
        });
        this.cartList = arr;
        // console.log(this.cartList)
        if (this.cartList.length == 0) {
          this.noData = true;
          this.$message({
            message: "订单已处理，自动返回首页",
            type: "warning",
            duration: 1000
          });
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        }
      }
    }
    this.getUserPostage(); //计算运费

    this.getAddressList();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo", "setShoppingInfo"]),
    //显示地址列表
    addressListShow() {
      this.addressListState = true;
    },
    //选中
    selectedAddressValue(value) {
      console.log(value)
      this.selectedAddress = value;
      this.addressListState = false;
    },
    //计算运费
    getUserPostage() {
      mt_getUserPostage().then(data => {
        // console.log(data.data);
        let userPostage = data.data.data;
        let arr = [];
        // console.log(this.cartList);
        this.cartList.forEach(item => {
          arr.push(item.gcreator);
        });
        // console.log(arr);
        let creators = Array.from(new Set(arr)); //去重后的商家id集合
        let fprice = 0;
        creators.forEach((item, index) => {
          userPostage.forEach((items, indexs) => {
            if (item == items.userId) {
              fprice += items.money;
            }
          });
        });
        // console.log(fprice);
        this.freight = fprice;
        this.computedPrice();
      });
    },
    //获取地址
    getAddressList() {
      let that = this;
      mt_getAddressList().then(data => {
        console.log(data.data.data);
        let arr = [];
        if (data.data.data.length > 0) {
          data.data.data.forEach(item => {
            item.addressArr = item.address.split(",");
            item.addressV = item.addressArr.join("");
            item.phones =
              item.phone.substr(0, 3) + "****" + item.phone.substr(7);
            if (item.isDefault == 1) {
              arr.unshift(item);
              if (
                that.selectedAddress.phone == "" ||
                that.selectedAddress.phone == undefined
              ) {
                that.selectedAddress = item;
              }
            } else {
              arr.push(item);
            }
            if (that.selectedAddress.id == item.id) {
              that.selectedAddress = item;
            }
          });
          that.addressList = arr;
          if (
            that.selectedAddress.phone == "" ||
            that.selectedAddress.phone == undefined
          ) {
            that.selectedAddress = arr[0];
          }
        } else {
          that.addressList = [];
        }
      });
    },
    //选中地址
    selectAddress(val) {
      if (val.id != this.selectedAddress.id) {
        this.selectedAddress = val;
      }
    },
    //添加地址
    add(e) {
      this.addressArr = [];
      this.dialogPAddress = true;
      this.opType = 1;
      this.name = "";
      this.phone = "";
      this.detailAddress = "";
    },
    //修改地址
    edit(value) {
      // console.log(value);
      this.editId = value.id;
      this.addressArr = [];
      this.dialogPAddress = true;
      this.opType = 2;
      this.name = value.consignee;
      this.phone = value.phone;
      this.isDefault = value.isDefault;
      this.addressArr.push(value.addressArr[0]);
      this.addressArr.push(value.addressArr[1]);
      this.addressArr.push(value.addressArr[2]);
      this.detailAddress = value.addressArr[3];
    },
    //删除地址
    deleteA(id, index) {},
    //设为默认
    setDefault(value) {
      let that = this;
      // console.log(value);
      mt_editAddress(
        value.id,
        value.consignee,
        value.phone,
        value.addressArr[0] +
          "," +
          value.addressArr[1] +
          "," +
          value.addressArr[2] +
          "," +
          value.addressArr[3],
        1
      ).then(data => {
        // console.log(data);
        that.$message({
          message: "设为默认成功",
          type: "success",
          duration: 1000
        });
        that.getAddressList();
      });
    },
    //当地址选择变化
    handleChange(value) {
      // console.log(value);
      this.addressArr = value;
      // console.log(this.addressArr);
    },
    //确认添加或修改地址
    submit() {
      let that = this;
      let aa = /[,]/g;
      if (that.name == "" || aa.test(that.name)) {
        that.$message({
          message: "收货人输入错误",
          type: "warning",
          duration: 1000
        });
      } else if (that.phone == "") {
        that.$message({
          message: "手机号不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (!regSJH.test(that.phone)) {
        that.$message({
          message: "手机号格式不正确",
          type: "warning",
          duration: 1000
        });
      } else if (that.addressArr.length == 0) {
        that.$message({
          message: "所在地区不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (that.detailAddress == "" || aa.test(that.detailAddress)) {
        that.$message({
          message: "详细地址输入错误",
          type: "warning",
          duration: 1000
        });
      } else {
        let tip = "";
        if (that.opType == 1) {
          mt_addAddress(
            that.name,
            that.phone,
            that.addressArr[0] +
              "," +
              that.addressArr[1] +
              "," +
              that.addressArr[2] +
              "," +
              that.detailAddress
          ).then(data => {
            that.$message({
              message: "添加收货地址成功",
              type: "success",
              duration: 1000
            });
            that.dialogPAddress = false;
            that.getAddressList();
          });
        } else if (that.opType == 2) {
          // id,phone,contacts,province,city,county,address
          mt_editAddress(
            that.editId,
            that.name,
            that.phone,
            that.addressArr[0] +
              "," +
              that.addressArr[1] +
              "," +
              that.addressArr[2] +
              "," +
              that.detailAddress,
            that.isDefault
          ).then(data => {
            that.$message({
              message: "修改收货地址成功",
              type: "success",
              duration: 1000
            });
            that.dialogPAddress = false;
            that.getAddressList();
          });
        }
      }
    },
    //查看租赁协议
    viewLease() {
      // console.log(1111);

      //获取实名认证信息
      mt_queryCompanyInfo().then(data => {
        // console.log(data.data);
        let date = new Date();
        this.htDate.push(date.getFullYear());
        this.htDate.push(date.getMonth() + 1);
        this.htDate.push(date.getDate());
        if (data.data) {
          data.data.imgs1 = JSON.parse(data.data.imgs);
          data.data.imgs2 = JSON.parse(data.data.legalManImgs);
          this.authentication = data.data;
          this.centerDialogVisible = true;
        }
      });
    },
    //数量加减
    changeNum(index, item) {
      // console.log(index);
      this.cartList[index].selected = true;
      this.computedPrice();
    },
    //计算价格
    computedPrice() {
      this.selectedNum = 0;
      this.rent = 0;
      this.deposit = 0;
      this.totalPrice = 0;
      this.cartList.forEach((item, index) => {
        this.selectedNum += 1;
        this.deposit += item.num * item.deposit;
        this.rent += item.rent * item.num * item.leaseTerm;
      });
      this.totalPrice = this.rent + this.deposit + this.freight;
    },
    //获取发票信息
    getInvoice() {
      let that = this;
      mt_getinvoice().then(data => {
        that.invoice = data.data;
      });
    },
    //添加发票信息
    addInvoice() {
      this.dialogInvoice = true;
      mt_getinvoice().then(data => {
        if (data.data.type != "" && data.data.type != undefined) {
          this.invoicetype = data.data.type;
          this.invoicename = data.data.name;
          this.invoicetaxNum = data.data.taxNum;
          this.invoiceaddress = data.data.address;
        }
      });
    },
    //编辑发票信息
    editInvoice() {
      this.dialogInvoice = true;
      this.invoicetype = this.invoice.type;
      this.invoicename = this.invoice.name;
      this.invoicetaxNum = this.invoice.taxNum;
      this.invoiceaddress = this.invoice.address;
    },
    //确认添加发票信息
    submitInvoice() {
      let that = this;
      if (that.invoicename == "") {
        that.$message({
          message: "公司名称不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (that.invoicetaxNum == "") {
        that.$message({
          message: "公司税号不能为空",
          type: "warning",
          duration: 1000
        });
      } else if (that.invoiceaddress == "") {
        that.$message({
          message: "地址不能为空",
          type: "warning",
          duration: 1000
        });
      } else {
        // name,taxNum,type,id
        mt_invoice(
          that.invoicetype,
          that.invoicename,
          that.invoicetaxNum,
          that.invoiceaddress,
          that.invoice.id ? that.invoice.id : ""
        ).then(data => {
          // console.log(data)
          that.$message({
            message: "发票添加成功",
            type: "success",
            duration: 1000
          });

          that.dialogInvoice = false;
          that.getInvoice();
        });
      }
    },
    //提交订单
    subOrder() {
      let that = this,
        state = true,
        title = "";
      // console.log(this.selectedAddress);
      if (
        that.selectedAddress.id == "" ||
        that.selectedAddress.id == undefined
      ) {
        state = false;
        title = "地址不能为空";
      }
      // console.log(that.invoice);
      if (state) {
        // console.log(that.cartList);
        let arr = [];
        that.cartList.forEach(item => {
          let d = {
            goodsId: item.gid,
            goodsCycle: item.leaseTerm,
            goodsNumber: item.num,
            courierWay: 1,
            // courierMoney: 0,
            remark: that.leaveMsg,
            deposit: item.deposit,
            rent: item.rent,
            dispose: item.collocation.config
          };
          arr.push(d);
        });
        let leaseOrderGoodsInfo = JSON.stringify(arr);
        // console.log(that.selectedAddress);
        mt_createOrder(
          that.selectedAddress.id,
          leaseOrderGoodsInfo,
          that.invoice.id ? that.invoice.id : "",
          that.invitationCode,
          that.companyName,
          that.freight
        ).then(data => {
          // console.log(data.data);
          that.remove();
          if (!that.mobileMode.result) {
            that.$router.push("/pay/" + data.data);
          } else {
            this.$confirm("请前往信安IT租赁电脑端或小程序端支付?", "支付提示", {
              confirmButtonText: "确定",
              showClose: false,
              showCancelButton: false,
              type: "warning"
            })
              .then(() => {
                that.$router.replace("/orderList");
              })
              .catch(() => {});
          }
        });
      } else {
        that.$message({
          message: title,
          type: "warning",
          duration: 1000
        });
      }
    },
    // 移除购物车数据
    remove() {
      this.subTime = this.$route.params.subTime;
      let obj = [];
      obj = this.cartList;

      let arr = [],
        obh = {},
        val = "",
        ids = [];
      obj.forEach(item => {
        // console.log(item);
        if (item.subTime == this.subTime) {
          ids.push(item.id);
        }
      });
      this.deleteCart(ids.join(","));
    },
    //更新购物车
    updateCart(arr) {
      mt_insertcart(JSON.stringify(arr)).then(data => {
        // console.log(data);
      });
    },
    deleteCart(ids) {
      // console.log(ids);
      mt_deletecart(ids).then(data => {
        // console.log(data);
        this.getCarList();
      });
    },
    //获取购物车列表
    getCarList() {
      let that = this;
      mt_selectAllcart().then(data => {
        // console.log(data.data);
        let arr =
          that.shoppingInfo.list != null && that.shoppingInfo.list != undefined
            ? that.shoppingInfo.list
            : [];
        let arr1 = data.data.data;
        arr1.forEach(item => {
          item.address = JSON.parse(item.address);
          item.collocation = JSON.parse(item.collocation);
        });
        that.cartList = arr1;
        let obj = {};
        obj.list = arr1;
        that.setShoppingInfo(obj);
      });
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
/deep/ .el-button--danger {
  color: #fff;
  background-color: $mainColor;
  border-color: $mainColor;
}
/deep/ .el-button--danger:hover {
  background-color: $mainHoverColor;
  border-color: $mainHoverColor;
}
/deep/ .el-dialog.leaseAggrement {
  margin: 0 auto !important;
}
.pc {
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
  .shoppingcartlist {
    background-color: #ffffff;
    padding: 30px 0 50px 0;
    border-top: 2px solid $mainColor;
    .box {
      .ot {
        line-height: 16px;
        margin-bottom: 20px;
        font-size: 16px;
        color: #333333;
      }
      .goodsDetail {
        padding: 20px;
        border: 1px solid #f0f0f0;
        .oinfo {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e6e6e6;
          .noaddress {
            font-size: 14px;
            line-height: 14px;
            color: $mainColor;
          }
          .otitle {
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            margin-bottom: 20px;
            span {
              font-size: 14px;
              color: #3573d8;
              &:hover {
                cursor: pointer;
                color: $mainColor;
              }
            }
          }
          .receive {
            margin-top: 10px;
            font-size: 0;
            padding-right: 60px;
            span {
              display: inline-block;
              font-size: 14px;
              line-height: 34px;
              color: #666666;
            }
            .select {
              margin-right: 32px;
              padding: 0 25px;
              line-height: 30px;
              border: 2px solid #dddddd;
              &.active,
              &:hover {
                cursor: pointer;
                border: 2px solid $mainColor;
                background-color: #ffffff;
              }
              &.active {
                background: url(/static/icon/selected.png) no-repeat right
                  bottom;
              }
            }
            .name {
              margin-right: 30px;
            }
            .address {
              margin-right: 30px;
            }
            .edit,
            .setDefault {
              display: none;
              margin-left: 20px;
              &:hover {
                cursor: pointer;
                color: $mainColor;
              }
            }
            &:hover {
              background-color: #f7f7f7;
              .select {
                background-color: #ffffff;
              }
              .edit,
              .setDefault {
                display: block;
              }
            }
          }
          .way {
            span {
              display: inline-block;
              padding: 0 25px;
              line-height: 30px;
              font-size: 14px;
              color: #666666;
              border: 2px solid #dddddd;
              &.active {
                border: 2px solid $mainColor;
                background: url(/static/icon/selected.png) no-repeat right
                  bottom;
              }
            }
          }
          .invoice {
            font-size: 0;
            padding-left: 20px;
            overflow: hidden;
            span {
              display: inline-block;
              line-height: 30px;
              margin-right: 30px;
              font-size: 12px;
              color: #666666;
              &.op {
                float: right;
                line-height: 30px;
                padding: 0 20px;
                font-size: 12px;
                background-color: #c4c4c4;
                color: #333333;
                border-radius: 20px;
                cursor: pointer;
              }
              &.add {
                background-color: $mainColor;
                color: #ffffff;
              }
            }
          }
          .lease {
            padding-left: 20px;
            display: flex;
            line-height: 40px;
            .l {
              flex: 260px 0 0;
              width: 260px;
              font-size: 12px;
              color: #666666;
            }
            .code {
              flex: 1;
              display: flex;
              span {
                font-size: 12px;
                color: #666666;
              }
              .inp {
                width: 190px;
              }
            }
          }
        }
        .title {
          height: 40px;
          line-height: 40px;
          padding: 0 !important;
          background-color: #999999 !important;
          &.itm {
            color: #333333;
          }
        }
        .itm {
          padding: 20px 0 20px 20px;
          font-size: 14px;
          color: #666666;
          background-color: #f7f7f7;
          &:first-child {
            padding: 0;
            border-bottom: none;
          }
          &:last-child {
            padding-bottom: 0;
            .leaveMsg {
              border-bottom: none;
              padding-bottom: 30px;
            }
          }
          .gd {
            display: flex;
            .img {
              flex: 80px 0 0;
              width: 80px;
              height: 80px;
              position: relative;
              img {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0);
                max-width: 80px;
                max-height: 80px;
              }
            }
            .info {
              flex: 1;
              padding: 0 50px 0 20px;
              .des,
              .sign {
                font-size: 14px;
                line-height: 18px;
                color: #666666;
                &:hover {
                  cursor: pointer;
                  color: $mainColor;
                }
              }
              .sign {
                margin-top: 14px;
              }
            }
          }
          .type {
            padding-right: 50px;
            font-size: 14px;
            line-height: 18px;
            color: #666666;
          }
          .price {
            font-size: 14px;
            line-height: 18px;
            color: #333333;
          }
          .number,
          .delete {
            text-align: center;
            i {
              font-size: 20px;
              padding-top: 4px;
              &:hover {
                cursor: pointer;
                color: $mainColor;
              }
            }
          }
          .leaveMsg {
            padding: 30px 0;
            border-top: 1px solid #c4c4c4;
            border-bottom: 2px solid #ffffff;
            .inp {
              display: flex;
              span {
                line-height: 40px;
                font-size: 12px;
                color: #666666;
              }
              .textarea {
                flex: 1;
                padding: 0 60px 0 10px;
              }
            }
            .type {
              line-height: 40px;
              font-size: 12px;
              color: #666666;
            }
            .price {
              line-height: 40px;
              font-size: 12px;
              color: #666666;
            }
          }
        }
        .priceInfo {
          text-align: right;
          .p {
            margin-bottom: 20px;
            font-size: 0;
            span {
              margin-left: 30px;
              font-size: 14px;
              line-height: 14px;
              color: #333333;
            }
          }
          .ai {
            .a {
              margin-bottom: 10px;
              font-size: 14px;
              line-height: 14px;
              color: #333333;
            }
          }
          .sbtn {
            font-size: 0;
            margin-top: 40px;
            span {
              display: inline-block;
              font-size: 14px;
              line-height: 50px;
              margin-left: 30px;
              &.v {
                color: #666666;
                i {
                  font-style: normal;
                  font-size: 20px;
                  color: $mainColor;
                  font-weight: bold;
                }
              }
              &.subOrder {
                padding: 0 42px;
                background-color: $mainColor;
                color: #ffffff;
                border-radius: 3px;
                font-size: 18px;
                &:hover {
                  cursor: pointer;
                  background-color: $mainHoverColor;
                }
              }
            }
          }
        }
      }
    }
  }
  .infoList {
    .item {
      margin-bottom: 20px;
      .einp {
        width: 200px;
      }
      .name {
        line-height: 40px;
        padding-right: 20px;
        font-size: 14px;
        color: #333333;
        text-align: right;
        i {
          font-style: normal;
          font-weight: bold;
          color: #e1481f;
          margin-right: 5px;
          position: relative;
          top: 3px;
        }
      }
      .line40 {
        line-height: 40px;
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .mobile {
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
  }
  .infoList {
    .item {
      margin-bottom: 20px;
      .einp {
        width: 200px;
      }
      .name {
        line-height: 40px;
        padding-right: 10px;
        font-size: 10px;
        color: #333333;
        text-align: right;
        i {
          font-style: normal;
          font-weight: bold;
          color: #e1481f;
          margin-right: 2px;
          position: relative;
          top: 3px;
        }
      }
      .line40 {
        line-height: 40px;
        /deep/ .el-input__inner {
          width: 100%;
          font-size: 10px;
        }
      }
    }
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
  .addressListBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    z-index: 2;
    background-color: #fff;
    .address {
      border-top: 1px solid #f1f1f1;

      .nbox .nzxItm {
        background-color: #ffffff;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px 0;
        display: flex;
        box-shadow: #ddd 0 0 5px;
      }
      .nbox .nzxItm:last-child {
        margin-bottom: 0;
      }
      .nzxItm .nicon {
        flex: 35px 0 0;
        height: 55px;
        line-height: 55px;
        text-align: right;
        padding-right: 7px;
      }
      .nzxItm .nicon .sl {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 1rpx solid #b4b4b4;
        border-radius: 50%;
      }
      .nzxItm .nicon image {
        display: inline-block;
        width: 18px;
        height: 18px;
      }

      .nbox .nzxItm .ninfo {
        flex: 1;
        padding-left: 10px;
      }
      .nbox .nzxItm .ninfo .top {
        height: 20px;
        line-height: 20px;
        overflow: hidden;
      }
      .nbox .nzxItm .ninfo .top span {
        float: left;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: bold;
      }
      .nbox .nzxItm .ninfo .top img {
        float: left;
        width: 6px;
        height: 10px;
        margin-left: 5px;
        position: relative;
        top: 5px;
      }
      .nbox .nzxItm .ninfo .middle {
        overflow: hidden;
        margin-bottom: 5px;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        color: #666;
      }

      .nbox .nzxItm .nbtn {
        flex: 0 80px 0;
        width: 80px;
        padding-top: 12px;
        font-size: 0;
      }
      .nbox .nzxItm .nbtn span {
        display: inline-block;
        margin: 0 5px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 50%;
        text-align: center;
      }
      .nbox .nzxItm .nbtn span.y {
        background-color: #ffd200;
        color: #333;
      }
      .nbox .nzxItm .nbtn span.b {
        background-color: #00bcf4;
        color: #fff;
      }

      .submit {
        padding: 15px;
      }
      .submit view {
        width: 150px;
        height: 40px;
        line-height: 40px;
        margin: 0 auto;
        text-align: center;
        font-size: 14px;
        color: #333333;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 5px;
      }
      .nodata {
        padding: 5px 15px;
        font-size: 13px;
        text-align: center;
        color: #333333;
      }
    }
    /deep/ .el-input__inner,
    /deep/ .el-cascader-menu__item{
      font-size: 10px;
    }
    
  }
}
</style>
