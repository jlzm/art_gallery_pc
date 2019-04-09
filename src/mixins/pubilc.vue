
<script>
export default {
  methods: {
    /**
     * 比较时间大小(时分)
     */
    compareDate(start, end) {
      let date = new Date();
      let a = start.split(":");
      let b = end.split(":");
      if(date.setHours(a[0], a[1]) >= date.setHours(b[0], b[1])) {
        this.$message.error("开始时间不能大于或等于结束时间");
        return true;
      }
    }
  }
};
</script>

<style>
</style>
