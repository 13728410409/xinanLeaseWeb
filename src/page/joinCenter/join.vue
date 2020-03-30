<template>
  <div>
    <div class="pc" v-if="!mobileMode.result">
      <head-top></head-top>
      <account-head></account-head>
      <div class="company">
        <div class="container box">
          <div class="ownlist">
            <div class="aslide">
              <!-- <router-link tag="div" to="/accountSet" class="itm">返回</router-link> -->
              <div class="itm tit">加盟中心</div>
              <div
                class="itm"
                v-if="applyType!=3"
                :class="type!=3?'active':''"
                @click="selectType(5)"
              >金牌入驻</div>
              <div
                class="itm"
                v-if="applyType==3"
                :class="type==3?'active':''"
                @click="selectType(3)"
              >代理商入驻</div>
            </div>
            <div class="main">
              <div class="top">
                <div class="n">
                  入驻信息
                  <span
                    v-if="status==3"
                    style="color:red;font-size:24px;font-weight:bold;margin-left:20px;"
                  >审核失败，请重新填写</span>
                </div>
                <div class="step">
                  <el-steps :space="200" :active="step" finish-status="success">
                    <el-step title="填写资料"></el-step>
                    <el-step title="等待审核"></el-step>
                    <el-step title="审核成功"></el-step>
                  </el-steps>
                </div>
              </div>
              <div class="mInfo" v-if="status==0||status==3">
                <div class="cInfo">
                  <div class="title">企业信息</div>
                  <div class="vBox">
                    <el-row>
                      <el-col :span="16">
                        <el-row class="itm">
                          <el-col :span="12">
                            <div class="n">代理区域：</div>
                            <div class="val">
                              <el-select v-model="agentRegion" filterable placeholder="请选择">
                                <el-option
                                  v-for="item in options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </div>
                          </el-col>
                          <el-col :span="12" v-if="type!=3">
                            <div class="n">加盟类型：</div>
                            <div class="val">
                              <el-select v-model="type" filterable placeholder="请选择">
                                <el-option
                                  v-for="item in optionsType"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row class="itm">
                          <div class="n">选择企业类型：</div>
                          <div class="val ctype">
                            <span :class="ctype==1?'active':''" @click="selectCType(1)">公司</span>
                            <span :class="ctype==2?'active':''" @click="selectCType(2)">个体工商户</span>
                            <span
                              v-if="type!=3"
                              :class="ctype==3?'active':''"
                              @click="selectCType(3)"
                            >个人</span>
                          </div>
                        </el-row>
                        <el-row class="itm">
                          <el-col :span="12">
                            <div class="n">企业名称：</div>
                            <div class="val">
                              <el-input v-model="companyName"></el-input>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div class="n">营业执照号：</div>
                            <div class="val">
                              <el-input v-model="businessCode" placeholder="企业类型为个人可不填"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row class="itm">
                          <el-col :span="12">
                            <div class="n">法人姓名：</div>
                            <div class="val">
                              <el-input v-model="conact"></el-input>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div class="n">法人手机号：</div>
                            <div class="val">
                              <el-input maxlength="11" v-model="phone"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row class="itm">
                          <el-col :span="20">
                            <div class="n">注册地址：</div>
                            <div class="val">
                              <el-input v-model="address" placeholder="请输入详细地址"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="8" class="statusImg">
                        <img v-if="step==3" src="/static/icon/success.png" alt />
                      </el-col>
                    </el-row>
                    <el-row class="itm">
                      <el-col :span="24">
                        <div class="imgs">
                          <div class="img">
                            <img class="show" v-if="yyzz!=''" :src="yyzz" alt />
                            <img class="show" v-if="yyzz==''" src="/static/icon/yyzz.png" alt />
                            <input-file
                              class="uploadImg"
                              v-model="yyzz"
                              type="String"
                              :upType="upType"
                              :multiple="false"
                            ></input-file>
                          </div>
                          <div class="img">
                            <img class="show" v-if="zzjg!=''" :src="zzjg" alt />
                            <img class="show" v-if="zzjg==''" src="/static/icon/zzjg.png" alt />
                            <input-file
                              class="uploadImg"
                              v-model="zzjg"
                              type="String"
                              :upType="upType"
                              :multiple="false"
                            ></input-file>
                          </div>
                          <div class="img">
                            <img class="show" v-if="swdj!=''" :src="swdj" alt />
                            <img class="show" v-if="swdj==''" src="/static/icon/swdj.png" alt />
                            <input-file
                              class="uploadImg"
                              v-model="swdj"
                              type="String"
                              :upType="upType"
                              :multiple="false"
                            ></input-file>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div
                          class="zp"
                        >温馨提示：所有资质证明文件需加盖公章的复印件或彩色扫描件，大小均不超过1M。三件合一或五证合一的企业只需提供企业营业执照， 无需提供税务登记证和组织机构代码证</div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="cInfo">
                  <div class="title" v-if="ctype!=3">法人信息</div>
                  <div class="title" v-else>个人信息</div>
                  <div class="vBox">
                    <el-row class="itm">
                      <el-col :span="14">
                        <div class="n" v-if="ctype!=3">法人身份证正反面：</div>
                        <div class="n" v-else>个人身份证正反面：</div>
                        <div class="val">
                          <div class="imgs">
                            <div class="img">
                              <img class="show" v-if="zhengmian!=''" :src="zhengmian" alt />
                              <img
                                class="show"
                                v-if="zhengmian==''"
                                src="/static/icon/zhengmian.png"
                                alt
                              />
                              <input-file
                                class="uploadImg"
                                v-model="zhengmian"
                                type="String"
                                :upType="upType"
                                :multiple="false"
                              ></input-file>
                            </div>
                            <div class="img">
                              <img class="show" v-if="fanmian!=''" :src="fanmian" alt />
                              <img
                                class="show"
                                v-if="fanmian==''"
                                src="/static/icon/fanmian.png"
                                alt
                              />
                              <input-file
                                class="uploadImg"
                                v-model="fanmian"
                                type="String"
                                :upType="upType"
                                :multiple="false"
                              ></input-file>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="cInfo" v-if="ctype!=3">
                  <div class="title">公司信息</div>
                  <div class="vBox">
                    <el-row>
                      <el-col :span="24">
                        <el-row class="itm">
                          <el-col :span="8">
                            <div class="n">企业人数：</div>
                            <div class="val">
                              <el-input v-model="com1"></el-input>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div class="n">商务人数：</div>
                            <div class="val">
                              <el-input v-model="com2"></el-input>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div class="n">销售人数：</div>
                            <div class="val">
                              <el-input v-model="com3"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row class="itm">
                          <el-col :span="8">
                            <div class="n">技术人数：</div>
                            <div class="val">
                              <el-input v-model="com4"></el-input>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div class="n">财务人数：</div>
                            <div class="val">
                              <el-input v-model="com5"></el-input>
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="cInfo">
                  <div class="title">推荐人</div>
                  <div class="vBox">
                    <el-input v-model="recommend" placeholder="推荐人编码(非必填）" style="width:220px;"></el-input>
                  </div>
                </div>
              </div>
              <div class="mInfo" v-if="status==1||status==2">
                <div class="cInfo" v-if="status==1">
                  <div class="title">{{applyType | filterType}}费用缴纳</div>
                  <div class="showInfo" v-if="authentication.payState!=1">
                    <div class="topEwm">
                      <div class="img">
                        <span>微信企业付款码</span>
                        <div id="qrCode" ref="qrCodeDiv" style="width: 170px;margin: 0 auto;"></div>
                        <span class="refresh" @click="getNewInfo">支付完成后请点击刷新</span>
                      </div>
                      <div class="alipay">
                        <span @click="payAlipay">立即支付宝支付</span>
                        <img src="/static/icon/alipay.png" alt @click="payAlipay" />
                      </div>
                      <el-row class="itm bankInfo">
                        <el-col :span="24">
                          <el-col :span="24" class="tip">请根据以下对公账户进行打款</el-col>
                          <el-col :span="6" class="name">帐户名称：</el-col>
                          <el-col :span="18" class="val">{{bankInfo.name}}</el-col>
                          <el-col :span="6" class="name">收款账户：</el-col>
                          <el-col :span="18" class="val">{{bankInfo.number}}</el-col>
                          <el-col :span="6" class="name">银行账户：</el-col>
                          <el-col :span="18" class="val">{{bankInfo.bankName}}</el-col>
                          <el-col :span="6" class="name">银行地址：</el-col>
                          <el-col :span="18" class="val">{{bankInfo.bankCity}}</el-col>
                          <el-col :span="6" class="name">开户网点：</el-col>
                          <el-col :span="18" class="val">{{bankInfo.bankDian}}</el-col>
                          <!-- <div v-if="weixinFlag" id="qrCode1" ref="qrCode1" style="width: 170px;margin: 0 auto;"></div> -->
                          <!-- <div class="btnRechargeStatus" @click="rechargeAccount">立即充值</div> -->
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="showInfo" v-if="authentication.payState==1">
                    <div class="tip">加盟费已经付款成功，等待平台审核</div>
                  </div>
                </div>
                <div class="cInfo">
                  <div class="title">{{applyType | filterType}}</div>
                  <div class="showInfo">
                    <div class="authenticationSuccess" v-if="status==2"></div>
                    <div class="authenticationSuccess authenting" v-if="status==1"></div>
                    <el-row class="sitm">
                      <el-col :span="8" class="tx">
                        代理区域：
                        <span>{{authentication.agentRegion }}</span>
                      </el-col>
                      <el-col :span="8" class="tx">
                        加盟类型：
                        <span>{{JoinTypeText}}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="8" class="tx">
                        企业类型：
                        <span>{{authentication.type | filterCtype }}</span>
                      </el-col>
                      <el-col :span="8" class="tx">
                        企业名称：
                        <span>{{authentication.name }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="8" class="tx">
                        营业执照号：
                        <span>{{authentication.number }}</span>
                      </el-col>
                      <el-col :span="8" class="tx">
                        联系人：
                        <span>{{authentication.contactsName }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="8" class="tx">
                        联系号码：
                        <span>{{authentication.contactsPhone }}</span>
                      </el-col>
                      <el-col :span="8" class="tx">
                        注册地址：
                        <span>{{authentication.companyAddress }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm" v-if="authentication.type!=3">
                      <el-col :span="8" class="tx">
                        企业人数：
                        <span>{{authentication.company.companiesNum }}</span>
                      </el-col>
                      <el-col :span="8" class="tx">
                        商务人数：
                        <span>{{authentication.company.businessNum }}</span>
                      </el-col>
                      <el-col :span="8" class="tx">
                        销售人数：
                        <span>{{authentication.company.salesNum }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="sitm" v-if="authentication.type!=3">
                      <el-col :span="8" class="tx">
                        技术人数：
                        <span>{{authentication.company.technicalNum }}</span>
                      </el-col>
                      <el-col :span="8" class="tx">
                        财务人数：
                        <span>{{authentication.company.financialNum }}</span>
                      </el-col>
                    </el-row>

                    <el-row class="sitm">
                      <el-col :span="24" class="t">营业执照</el-col>
                      <el-col :span="24" class="imgs">
                        <div class="img">
                          <img :src="authentication.imgs1.img1" alt />
                        </div>
                        <div class="img">
                          <img
                            v-if="authentication.imgs1.img2!=''"
                            :src="authentication.imgs1.img2"
                            alt
                          />
                        </div>
                        <div class="img">
                          <img
                            v-if="authentication.imgs1.img2!=''"
                            :src="authentication.imgs1.img3"
                            alt
                          />
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="sitm">
                      <el-col :span="24" class="t">法人身份证</el-col>
                      <el-col :span="16" class="imgs">
                        <div class="img">
                          <img :src="authentication.imgs2.positive" alt />
                        </div>
                        <div class="img">
                          <img :src="authentication.imgs2.negative" alt />
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>

              <el-button
                type="primary"
                style="margin-top:20px;"
                @click="submit"
                v-if="status==0||status==3"
              >提交审核</el-button>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <foot-guide></foot-guide>
    </div>
    <div class="mobile" v-if="mobileMode.result">
      <headertop :value="headValue"></headertop>
      <div class="top">
        <div class="mInfo" v-if="status==0||status==3">
          <div class="cInfo">
            <div class="vBox">
              <el-row>
                <el-col :span="24">
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">代理区域：</div>
                      <div class="val">
                        <el-select v-model="agentRegion" filterable placeholder="请选择">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24" v-if="type!=3">
                      <div class="n">加盟类型：</div>
                      <div class="val">
                        <el-select v-model="type" filterable placeholder="请选择">
                          <el-option
                            v-for="item in optionsType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <div class="n">选择企业类型：</div>
                    <div class="val ctype">
                      <span :class="ctype==1?'active':''" @click="selectCType(1)">公司</span>
                      <span :class="ctype==2?'active':''" @click="selectCType(2)">个体工商户</span>
                      <span v-if="type!=3" :class="ctype==3?'active':''" @click="selectCType(3)">个人</span>
                    </div>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">企业名称：</div>
                      <div class="val">
                        <el-input v-model="companyName"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">营业执照号：</div>
                      <div class="val">
                        <el-input v-model="businessCode" placeholder="企业类型为个人可不填"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">法人姓名：</div>
                      <div class="val">
                        <el-input v-model="conact"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">法人手机号：</div>
                      <div class="val">
                        <el-input maxlength="11" v-model="phone"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">注册地址：</div>
                      <div class="val">
                        <el-input v-model="address" placeholder="请输入详细地址"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8" class="statusImg">
                  <img v-if="step==3" src="/static/icon/success.png" alt />
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="imgs">
                    <div class="img">
                      <img class="show" v-if="yyzz!=''" :src="yyzz" alt />
                      <img class="show" v-if="yyzz==''" src="/static/icon/yyzz.png" alt />
                      <input-file
                        class="uploadImg"
                        v-model="yyzz"
                        type="String"
                        :upType="upType"
                        :multiple="false"
                      ></input-file>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="imgs">
                    <div class="img">
                      <img class="show" v-if="zzjg!=''" :src="zzjg" alt />
                      <img class="show" v-if="zzjg==''" src="/static/icon/zzjg.png" alt />
                      <input-file
                        class="uploadImg"
                        v-model="zzjg"
                        type="String"
                        :upType="upType"
                        :multiple="false"
                      ></input-file>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="imgs">
                    <div class="img">
                      <img class="show" v-if="swdj!=''" :src="swdj" alt />
                      <img class="show" v-if="swdj==''" src="/static/icon/swdj.png" alt />
                      <input-file
                        class="uploadImg"
                        v-model="swdj"
                        type="String"
                        :upType="upType"
                        :multiple="false"
                      ></input-file>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div
                    class="zp"
                  >温馨提示：所有资质证明文件需加盖公章的复印件或彩色扫描件，大小均不超过1M。三件合一或五证合一的企业只需提供企业营业执照， 无需提供税务登记证和组织机构代码证</div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="cInfo">
            <div class="vBox">
              <el-row class="itm">
                <el-col :span="24">
                  <div class="n" v-if="ctype!=3">法人身份证正反面：</div>
                  <div class="n" v-else>个人身份证正反面：</div>
                  <div class="val">
                    <div class="imgs">
                      <div class="img">
                        <img class="show" v-if="zhengmian!=''" :src="zhengmian" alt />
                        <img class="show" v-if="zhengmian==''" src="/static/icon/zhengmian.png" alt />
                        <input-file
                          class="uploadImg"
                          v-model="zhengmian"
                          type="String"
                          :upType="upType"
                          :multiple="false"
                        ></input-file>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="itm">
                <el-col :span="24">
                  <div class="val">
                    <div class="imgs">
                      <div class="img">
                        <img class="show" v-if="fanmian!=''" :src="fanmian" alt />
                        <img class="show" v-if="fanmian==''" src="/static/icon/fanmian.png" alt />
                        <input-file
                          class="uploadImg"
                          v-model="fanmian"
                          type="String"
                          :upType="upType"
                          :multiple="false"
                        ></input-file>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="cInfo" v-if="ctype!=3">
            <div class="vBox">
              <el-row>
                <el-col :span="24">
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">企业人数：</div>
                      <div class="val">
                        <el-input v-model="com1"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">商务人数：</div>
                      <div class="val">
                        <el-input v-model="com2"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">销售人数：</div>
                      <div class="val">
                        <el-input v-model="com3"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">技术人数：</div>
                      <div class="val">
                        <el-input v-model="com4"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="itm">
                    <el-col :span="24">
                      <div class="n">财务人数：</div>
                      <div class="val">
                        <el-input v-model="com5"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="cInfo">
            <div class="vBox">
              <el-input v-model="recommend" placeholder="推荐人编码(非必填）" style="width:220px;"></el-input>
            </div>
          </div>
        </div>
        <div style="padding: 20px 15px;">
          <el-button
            type="primary"
            style="width: 100%;"
            @click="submit"
            v-if="status==0||status==3"
          >提交审核</el-button>
        </div>
        <div class="mInfo" v-if="status==1||status==2">
          <div class="infoShow">
            <div class="title sign" v-if="status==2">
              <span v-if="authentication.userType==3">代理商认证成功</span>
              <span v-else>金牌认证成功</span>
            </div>
            <div class="title sign" v-if="status==1">
              <span v-if="authentication.userType==3">代理商认证审核中</span>
              <span v-else>金牌认证审核中</span>
            </div>
          </div>
          <div class="cInfo">
            <div class="showInfo">
              <div class="authenticationSuccess" v-if="status==2"></div>
              <div class="authenticationSuccess authenting" v-if="status==1"></div>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  代理区域：
                  <span>{{authentication.agentRegion }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  加盟类型：
                  <span>{{JoinTypeText}}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  企业类型：
                  <span>{{authentication.type | filterCtype }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  企业名称：
                  <span>{{authentication.name }}</span>
                </el-col>
              </el-row>

              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  营业执照号：
                  <span>{{authentication.number }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  联系人：
                  <span>{{authentication.contactsName }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  联系号码：
                  <span>{{authentication.contactsPhone }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  注册地址：
                  <span>{{authentication.companyAddress }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm" v-if="authentication.type!=3">
                <el-col :span="8" class="tx">
                  企业人数：
                  <span>{{authentication.company.companiesNum }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  商务人数：
                  <span>{{authentication.company.businessNum }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="8" class="tx">
                  销售人数：
                  <span>{{authentication.company.salesNum }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm" v-if="authentication.type!=3">
                <el-col :span="8" class="tx">
                  技术人数：
                  <span>{{authentication.company.technicalNum }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm" v-if="authentication.type!=3">
                <el-col :span="8" class="tx">
                  财务人数：
                  <span>{{authentication.company.financialNum }}</span>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="24" class="imgs">
                  <div class="img">
                    <img :src="authentication.imgs1.img1" alt />
                  </div>
                  <div class="img">
                    <img v-if="authentication.imgs1.img2!=''" :src="authentication.imgs1.img2" alt />
                  </div>
                  <div class="img">
                    <img v-if="authentication.imgs1.img2!=''" :src="authentication.imgs1.img3" alt />
                  </div>
                </el-col>
              </el-row>
              <el-row class="sitm">
                <el-col :span="24" class="imgs">
                  <div class="img">
                    <img :src="authentication.imgs2.positive" alt />
                  </div>
                  <div class="img">
                    <img :src="authentication.imgs2.negative" alt />
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import headTop from "@/components/header/head";
import footGuide from "@/components/footer/footGuide";
import inputFile from "common/inputFile";
import accountHead from "@/components/accountHead/accountHead";
import headertop from "@/components/mobile/header";
import { checkDouble } from "@/config/often";
import QRCode from "qrcodejs2";
import {
  mt_getJinPaiInfo,
  mt_queryMyFranchise,
  mt_applyJoin,
  mt_payJoinUs_wxpay,
  mt_payJoinUs_alipay
} from "@/api/my";
import { mt_querySystemBank } from "@/api/order";
import cityData from "../../../static/other/city.json";
const regSJH = /^[1][0-9]{10}$/; //手机号正则
export default {
  name: "goldjoin",
  components: {
    headTop,
    footGuide,
    inputFile,
    accountHead,
    headertop
  },
  data() {
    return {
      type: 3, //2金牌入驻  3代理商入驻

      upType: "image/gif, image/jpg, image/jpeg, image/png",
      status: 0, //审核状态
      step: 0, //步骤
      ctype: 1, //1公司 2个体工商户
      companyName: "",
      businessCode: "",
      conact: "",
      phone: "",
      address: "",
      agentRegion: "",

      addressData: [],
      options: [],
      optionsType: [],

      yyzz: "", //营业执照
      zzjg: "", //组织机构代码
      swdj: "", //税务登记证
      zhengmian: "", //身份证正面
      fanmian: "", //身份证反面
      recommend: "", //推荐人

      com1: 0,
      com2: 0,
      com3: 0,
      com4: 0,
      com5: 0,

      authentication: {},

      url: "http://www.duomiku.cn/home",

      applyType: "", //申请入驻的角色  3代理商 5金牌
      JoinTypeText: "",

      bankInfo: {},
      headValue: "加盟中心",
    };
  },

  watch: {
    //监听图片变化
    yyzz(newValue, oldValue) {
      if (newValue != oldValue) {
        // console.log(this.eHeadImg)
      }
    }
  },
  filters: {
    filterType(value) {
      if (value == 3) {
        return "代理商入驻";
      } else {
        return "金牌入驻";
      }
    },
    filterCtype(value) {
      if (value == 1) {
        return "公司";
      } else if (value == 2) {
        return "个体工商户";
      } else if (value == 3) {
        return "个人";
      }
    }
  },
  computed: {
    ...mapState(["userInfo", "shoppingInfo", "mobileMode"])
  },
  created() {
    let type = this.$route.params.type;
    this.type = type;
    this.applyType = type;
    this.getJinPaiInfo();
    this.getCompanyInfo();
  },
  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo"]),
    //获取对公账号信息
    querySystemBank() {
      mt_querySystemBank().then(data => {
        // console.log(data.data);
        this.bankInfo = data.data;
      });
    },
    //地址
    getAddress() {
      let that = this;
      let str = localStorage.getItem("addressOnlyCity");
      // console.log(str)
      if (str) {
        that.addressData = JSON.parse(str);
      } else {
        axios
          .get("/static/other/onlycity.json")
          .then(data => {
            // console.log(data.data.data)
            that.addressData = data.data.data;
            localStorage.setItem(
              "addressOnlyCity",
              JSON.stringify(data.data.data)
            );
          })
          .catch(response => {});
      }
      let arrCity = [];
      that.addressData.forEach((item, index) => {
        arrCity.push({ value: item.name, label: item.name });
      });
      this.options = arrCity;
      // console.log(this.options )
    },
    //切换代理商入驻和金牌入驻
    selectType(val) {
      if (val != this.type) {
        this.type = val;
        // this.$router.push("/join");
      }
    },
    //获取角色
    getJinPaiInfo() {
      let that = this;
      mt_getJinPaiInfo().then(data => {
        // console.log(data.data);
        data.data.forEach(item => {
          if (
            item.type == 5 ||
            item.type == 6 ||
            item.type == 7 ||
            item.type == 8
          ) {
            that.optionsType.push({ value: item.type, label: item.name });
          }
        });
        console.log(that.optionsType)
      });
    },
    //加盟天使
    selectAngle() {
      this.$router.push("/joinAngle");
    },
    //选择企业类型
    selectCType(val) {
      if (this.ctype != val) {
        this.ctype = val;
        if (val == 3) {
          this.com1 = 0;
          this.com2 = 0;
          this.com3 = 0;
          this.com4 = 0;
          this.com5 = 0;
        }
      }
    },
    //获取企业信息
    getCompanyInfo() {
      let that = this;
      mt_queryMyFranchise().then(data => {
        if (data.data) {
          data.data.imgs1 = JSON.parse(data.data.imgs);
          data.data.imgs2 = JSON.parse(data.data.legalManImgs);
          data.data.company = JSON.parse(data.data.companyInfo);
          that.authentication = data.data;
          that.status = data.data.status;

          let userInfo = this.userInfo;
          userInfo.joinStatus = data.data.status;
          that.setUserInfo(userInfo);
          //payState支付状态 1成功 2失败 0未支付
          console.log(data.data);
          if (data.data.status == 1 && data.data.payState != 1) {
            mt_payJoinUs_wxpay(data.data.id).then(data => {
              console.log(data.data);
              data.data.forms = JSON.parse(data.data.form);
              that.useqrcode(data.data);
            });
            that.querySystemBank();
          }
          if (data.data.status == 0 || data.data.status == 3) {
            that.step = 1;
            that.getAddress();
          } else if (data.data.status == 1) {
            that.step = 2;
          } else if (data.data.status == 2) {
            that.step = 3;
          }
          if (data.data.status == 3) {
            that.ctype = data.data.type;
            that.companyName = data.data.name;
            that.businessCode = data.data.number;
            that.conact = data.data.contactsName;
            that.phone = data.data.contactsPhone;
            that.address = data.data.companyAddress;
            that.agentRegion = data.data.agentRegion;
            that.yyzz = JSON.parse(data.data.imgs).img1;
            that.zzjg = JSON.parse(data.data.imgs).img2;
            that.swdj = JSON.parse(data.data.imgs).img3;
            that.zhengmian = JSON.parse(data.data.legalManImgs).positive;
            that.fanmian = JSON.parse(data.data.legalManImgs).negative;
            that.recommend =
              data.data.invitationCode != null ? data.data.invitationCode : "";
            that.com1 = JSON.parse(data.data.companyInfo).companiesNum;
            that.com2 = JSON.parse(data.data.companyInfo).businessNum;
            that.com3 = JSON.parse(data.data.companyInfo).salesNum;
            that.com4 = JSON.parse(data.data.companyInfo).technicalNum;
            that.com5 = JSON.parse(data.data.companyInfo).financialNum;
          }
          that.optionsType.forEach(item => {
            if (item.value == data.data.userType) {
              that.JoinTypeText = item.label;
              console.log(that.JoinTypeText);
            }
          });
          that.applyType = data.data.userType;
          that.type = data.data.userType;
        } else {
          that.getAddress();
        }
      });
    },
    //提交申请
    submit() {
      let that = this,
        state = true,
        title = "";
      let imgs = { img1: that.yyzz, img2: that.zzjg, img3: that.swdj };
      let legalManImgs = { positive: that.zhengmian, negative: that.fanmian };
      let companyInfo = {
        companiesNum: that.com1,
        businessNum: that.com2,
        salesNum: that.com3,
        technicalNum: that.com4,
        financialNum: that.com5
      };
      if (that.agentRegion == "") {
        state = false;
        title = "代理区域不能为空";
      } else if (that.type == "") {
        state = false;
        title = "加盟类型不能为空";
      } else if (that.companyName == "") {
        state = false;
        title = "企业名称不能为空";
      } else if (
        (that.ctype == 1 || that.ctype == 2) &&
        that.businessCode == ""
      ) {
        state = false;
        title = "营业执照不能为空";
      } else if (that.conact == "") {
        state = false;
        title = "法人姓名不能为空";
      } else if (!regSJH.test(that.phone)) {
        state = false;
        title = "法人手机号不正确";
      } else if (that.address == "") {
        state = false;
        title = "注册地址不能为空";
      } else if ((that.ctype == 1 || that.ctype == 2) && imgs.img1 == "") {
        state = false;
        title = "营业执照不能为空";
      } else if (legalManImgs.positive == "") {
        state = false;
        title = "身份证正面不能为空";
      } else if (legalManImgs.negative == "") {
        state = false;
        title = "身份证反面不能为空";
      } else if (!checkDouble(that.com1)) {
        state = false;
        title = "企业人数输入有误";
      } else if (!checkDouble(that.com2)) {
        state = false;
        title = "商务人数输入有误";
      } else if (!checkDouble(that.com3)) {
        state = false;
        title = "销售人数输入有误";
      } else if (!checkDouble(that.com4)) {
        state = false;
        title = "技术人数输入有误";
      } else if (!checkDouble(that.com5)) {
        state = false;
        title = "财务人数输入有误";
      }
      if (state) {
        mt_applyJoin(
          that.ctype,
          that.companyName,
          that.businessCode,
          that.type,
          that.address,
          that.conact,
          that.phone,
          JSON.stringify(imgs),
          JSON.stringify(legalManImgs),
          JSON.stringify(companyInfo),
          that.recommend,
          that.agentRegion
        ).then(data => {
          if (!that.mobileMode.result) {
            that.$message({
              message: "加盟信息提交成功",
              type: "success",
              duration: 1000
            });
          } else {
            alert('加盟信息提交成功');
          }
          // console.log(data);
          that.getCompanyInfo();
        });
      } else {
        if (!that.mobileMode.result) {
          that.$message({
            message: title,
            type: "warning",
            duration: 1000
          });
        } else {
          alert(title);
        }
      }
    },
    //获取支付回调是否信息
    getNewInfo() {
      this.destriyQrcode();
      this.getCompanyInfo();
    },
    // 销毁微信二维码
    destriyQrcode() {
      // console.log('------销毁微信二维码-----')
      var wxcode = document.getElementById("qrCode");
      var childs = wxcode.childNodes;
      if (childs != null) {
        for (var i = childs.length - 1; i >= 0; i--) {
          wxcode.removeChild(childs[i]);
        }
      }
    },
    //生成分享链接二维码
    useqrcode(url) {
      let that = this;
      setTimeout(function() {
        new QRCode(that.$refs.qrCodeDiv, {
          text: url.forms.code_url,
          width: 170,
          height: 170,
          colorDark: "#333333", //二维码颜色
          colorLight: "#ffffff", //二维码背景色
          correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        });
      }, 100);
    },
    // 支付宝支付
    payAlipay() {
      let that = this;
      mt_payJoinUs_alipay(that.authentication.id).then(data => {
        // console.log(data.data);
        that.html = data.data.form;
        var form = data.data.form;
        const div = document.createElement("div");
        div.innerHTML = form;
        document.body.appendChild(div);
        // document.forms[0].target = "_blank";
        document.forms[0].submit();
        // that
        //   .$confirm(
        //     "如果已经支付完成请点击下方‘支付完成’按钮！",
        //     "加盟费支付提示",
        //     {
        //       confirmButtonText: "支付完成",
        //       cancelButtonText: "取消",
        //       showClose: false
        //     }
        //   )
        //   .then(() => {
        //     that.getNewInfo();
        //   })
        //   .catch(() => {});
      });
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "src/style/mixin";
.pc {
  /deep/ .el-button--danger {
    color: #fff;
    background-color: $mainColor;
    border-color: $mainColor;
  }
  /deep/ .el-button--danger:hover {
    background-color: $mainHoverColor;
    border-color: $mainHoverColor;
  }
  .el-button--primary {
    background-color: $mainColor !important;
    border-color: $mainColor !important;
  }
  .el-button--primary:hover {
    background-color: $mainHoverColor !important;
    border-color: $mainHoverColor !important;
  }
  .company {
    padding: 30px 0 80px 0;
    .box {
      .ownlist {
        display: flex;
        .aslide {
          flex: 116px 0 0;
          width: 116px;
          padding-top: 15px;
          background-color: #ffffff;
          .itm {
            padding: 15px 0 15px 15px;
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            &.active,
            &:hover {
              color: $mainColor;
              cursor: pointer;
            }
            &.tit {
              font-weight: bold;
              color: #333333;
            }
          }
        }
        .main {
          min-height: 700px;
          flex: 1;
          margin-left: 20px;
          padding: 20px;
          background-color: #ffffff;
          .top {
            display: flex;
            margin-bottom: 30px;
            .n {
              flex: 1;
              padding-top: 20px;
              font-size: 16px;
              line-height: 16px;
              color: #333333;
            }
            .step {
              flex: 500px 0 0;
              width: 500px;
            }
          }
          .mInfo {
            border: 1px solid #e6e6e6;
            .cInfo {
              .title {
                line-height: 40px;
                padding-left: 20px;
                font-size: 14px;
                font-weight: bold;
                color: #333333;
                background-color: #f7f7f7;
              }
              .vBox {
                padding: 20px;
                .statusImg {
                  padding-top: 40px;
                  text-align: center;
                }
                .itm {
                  margin-bottom: 20px;
                  .n {
                    font-size: 14px;
                    line-height: 14px;
                    color: #666666;
                    margin-bottom: 15px;
                  }
                  .val {
                    padding-right: 40px;
                    &.ctype {
                      font-size: 0;
                      span {
                        display: inline-block;
                        width: 120px;
                        line-height: 36px;
                        margin-right: 20px;
                        text-align: center;
                        border: 1px solid #dddddd;
                        font-size: 14px;
                        color: #666666;
                        &.active,
                        &:hover {
                          cursor: pointer;
                          border: 1px solid $mainColor;
                          color: $mainColor;
                        }
                      }
                    }
                  }
                  .imgs {
                    display: flex;
                    .img {
                      flex: 1;
                      padding-right: 20px;
                      position: relative;
                      img {
                        width: 293px;
                        height: 200px;
                      }
                      .uploadImg {
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 2;
                        width: 293px;
                        height: 200px;
                        opacity: 0;
                      }
                    }
                  }
                  .zp {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #999999;
                  }
                }
              }
              .showInfo {
                padding: 30px 20px;
                position: relative;
                .tip {
                  font-size: 14px;
                  color: #f08200;
                  line-height: 30px;
                  text-align: center;
                }
                .topEwm {
                  text-align: center;
                  font-size: 0;
                  display: flex;
                  .img {
                    flex: 1;
                    span {
                      display: inline-block;
                      line-height: 30px;
                      font-size: 14px;
                      color: #666666;
                    }
                    .refresh {
                      font-size: 14px;
                      color: #f08200;
                      line-height: 30px;
                      cursor: pointer;
                    }
                  }
                  .alipay {
                    flex: 1;
                    padding-top: 70px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #333333;
                    img {
                      display: block;
                      margin: 0 auto;
                      width: 60px;
                      height: 60px;
                      cursor: pointer;
                    }
                    span {
                      display: inline-block;
                      line-height: 30px;
                      font-size: 14px;
                      color: #666666;
                      cursor: pointer;
                    }
                  }
                  .itm {
                    flex: 1;
                    margin: 0 auto;
                    .name {
                      line-height: 40px;
                      font-size: 14px;
                    }
                    .val {
                      line-height: 40px;
                      font-size: 14px;
                      text-align: left;
                    }
                    &.bankInfo {
                      padding: 15px 0;
                      .tip {
                        line-height: 40px;
                        font-size: 14px;
                        color: #f08200;
                        padding-left: 30px;
                      }
                      .name {
                        text-align: right;
                        padding-right: 10px;
                      }
                      .val {
                        padding-left: 10px;
                      }
                    }
                  }
                }
                .authenticationSuccess {
                  position: absolute;
                  right: 20px;
                  top: 30px;
                  z-index: 99;
                  width: 170px;
                  height: 170px;
                  background: url(/static/icon/success.png) no-repeat center
                    center;
                  &.authenting {
                    background: url(/static/icon/authenting.png) no-repeat
                      center center;
                  }
                }
                .sitm {
                  margin-bottom: 20px;
                  .tx {
                    font-size: 13px;
                    line-height: 14px;
                    color: #999999;
                    span {
                      color: #666666;
                      font-weight: bold;
                    }
                  }
                  .imgs {
                    display: flex;
                    .img {
                      flex: 1;
                      padding-right: 20px;
                      position: relative;
                      .show {
                        width: 293px;
                        height: 200px;
                      }
                      img {
                        max-width: 100%;
                      }
                    }
                  }
                  .t {
                    font-size: 14px;
                    line-height: 14px;
                    color: #666666;
                    margin-bottom: 15px;
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
    background-color: #ffffff;
    .mInfo {
      .infoShow {
        padding: 20px 0;
      }
      .infoShow .title {
        text-align: center;
      }
      .infoShow .title.sign span {
        display: inline-block;
        font-size: 15px;
        line-height: 20px;
        color: rgb(255, 103, 1);
        position: relative;
      }

      .cInfo {
        title {
          line-height: 35px;
          padding: 0 15px;
          font-size: 14px;
          color: #f08200;
        }
        .vBox {
          padding: 10px 20px;
          .statusImg {
            padding-top: 40px;
            text-align: center;
          }
          .itm {
            margin-bottom: 20px;
            .n {
              font-size: 14px;
              line-height: 14px;
              color: #666666;
              margin-bottom: 5px;
            }
            .val {
              &.ctype {
                font-size: 0;
                span {
                  display: inline-block;
                  width: 28%;
                  line-height: 30px;
                  margin-right: 20px;
                  margin: 0 1.5%;
                  text-align: center;
                  border: 1px solid #dddddd;
                  font-size: 12px;
                  color: #666666;
                  &.active,
                  &:hover {
                    cursor: pointer;
                    border: 1px solid $mainColor;
                    color: $mainColor;
                  }
                }
              }
            }
            .imgs {
              display: flex;
              .img {
                flex: 1;
                padding-right: 20px;
                position: relative;
                img {
                  width: 293px;
                  height: 200px;
                }
                .uploadImg {
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 2;
                  width: 293px;
                  height: 200px;
                  opacity: 0;
                }
              }
            }
            .zp {
              margin-top: 20px;
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
      .sitm {
        .tx {
          display: flex;
          justify-content: flex-start;
          padding: 0 15px;
          font-size: 14px;
          line-height: 35px;
          color: #333333;
          border-bottom: 1px solid #f1f1f1;
          width: 100%;
          span {
            flex: 1;
            text-align: right;
          }
        }
        .imgs {
          padding: 0 15px;
          .img {
            img {
              display: block;
              max-width: 100%;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
}
</style>
