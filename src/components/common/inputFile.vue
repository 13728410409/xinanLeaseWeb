<template>
  <input type="file" @change="uploadFile($event)" :multiple="multiple" :accept="accept" />
</template>
<script>
import qiniuUpload from "./qiniu.js";
export default {
  data() {
    return {
      fileUrl: [],
      accept: ''
    };
  },
  props: {
    value: {
      default: []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    length: {
      default: 10
    },
    type: {
      default: "Array"
    },
    upType: {
      type: String,
      default: ""
    },
  },
  created() {
    if (this.value) {
      this.fileUrl = this.value
    }
    if (this.upType) {
      this.accept = this.upType
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.fileUrl = val
      }
    },
    upType(val,oldVal) {
      if (val!=oldVal) {
        this.accept = val
        // //console.log(val)
      }
    },
  },
  methods: {
    uploadFile(event) {
      const _this = this;
      if (!(_this.fileUrl instanceof Array)) {
        _this.fileUrl = new Array();
      }
      //文件数据体
      var files = event.target.files;
      qiniuUpload(files).then(res => {
        // //console.log("图片上传完成", res);
        if (_this.fileUrl.length >= _this.length) {
          _this.fileUrl.splice(0, 1);
        }
        _this.fileUrl.push(res);
        // //console.log(_this.fileUrl);
        if (_this.type == "Array") {
          _this.$emit("input", _this.fileUrl);
          _this.$emit("change", _this.fileUrl[0]);
        } else {
          _this.$emit("input", _this.fileUrl[0]);
          _this.$emit("change", _this.fileUrl[0]);
        }
      });
    }
  },
  mounted() {
    const _this = this;
  }
};
</script>