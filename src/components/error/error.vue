<template>
  <div class="error">
    <div class="err">稍等片刻，再刷新一下就好啦</div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  filters: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.error {
  background: url(/static/icon/pay_bg.jpg) no-repeat center -120px;
  background-size: 70%;
  .err {
    width: 900px;
    margin: 30px auto 50px;
    line-height: 600px;
    text-align: center;
    font-size: 14px;
  }
}
</style>
