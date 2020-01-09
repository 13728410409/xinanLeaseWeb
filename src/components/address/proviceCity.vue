<template>
  <div class="address">
    <el-cascader
    placeholder="选择城市"
    :options="options"
    v-model="addressVal" 
    @change="handleChange"
    filterable></el-cascader>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  data() {
    return {
      value: false,
      addressVal: [],

      addressData: [],
      cityData: [],
      provice: "",
      city: "",
    };
  },
  watch: {
    data(val) {
      this.addressVal = val;
      // console.log(this.addressVal)
    },
  },
  created() {
    this.getAddress();
    console.log(this.data)
    if (this.data instanceof Array) {
      this.addressVal = this.data;
      this.provice = this.data[0]
      this.city = this.data[1]
    }
  },
  mounted() {
    
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    //获取数据
    getAddress() {
      let that = this;
      let str = localStorage.getItem("address");
      if (str) {
        that.addressData = JSON.parse(str);
      } else {
        axios.get("/static/other/city.json").then(data => {
          // console.log(data.data)
          that.addressData = data.data;
          localStorage.setItem("address", JSON.stringify(data.data));
        }).catch(response => {});
      }
      let arrCity = []
      that.addressData.forEach((item,index)=>{
        arrCity.push({'value':item.name,'label':item.name, 'children': []})
        item.citys.forEach((items,indexs)=>{
          arrCity[index].children.push({'value':items.name,'label':items.name})
        })
      })
      this.options = arrCity
    },
    //当绑定值变化时触发的事件
    handleChange(value) {
      this.addressVal = value
      // console.log(this.addressArr);
      this.$emit('selectVal',value)
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.address{
  position: relative;
  .val{
    display: inline-block;
    min-width: 220px;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    color: #333333;
    padding: 0 10px;
    border: 1px solid #dddddd;
  }
  .list{
    position: absolute;
    left: 0;
    top: 38px;
    z-index: 999;
    width: 500px;
    padding: 10px 0;
    background-color: #ffffff;
    border: 1px solid #dddddd;
    box-shadow: 0px 0px 20px 5px rgba(200,200,200,0.4);
    display: flex;
    .d{
      flex: 1;
      height: 400px;
      overflow-y: scroll;
      .itm{
        line-height: 20px;
        padding-left: 10px;
        font-size: 14px;
        color: #666666;
        &:hover,&.active{
          cursor: pointer;
          background-color: #f2f2f2;
          color: $mainColor;
        }
      }
    }
    .d1{
      flex: 180px 0 0;
    }
  }
}
.mask{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 998;
  background-color: rgba(200,200,200,0.4);
  opacity: 0.5;
}
</style>
