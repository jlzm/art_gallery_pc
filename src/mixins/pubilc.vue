
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
      if (date.setHours(a[0], a[1]) >= date.setHours(b[0], b[1])) {
        this.$message.error("开始时间不能大于或等于结束时间");
        return true;
      }
    },

    /**
     * 获取老师
     * (对象， 是否合并)
     */
    getTeacherData(data, concat) {
      
      data.mainTheaterOption = [];
      data.assistantTheaterOption = [];
      return this.$axios.post("/getTeacherSelectVul").then(res => {
        if (res) {

          // this.$set(data, 'mainTheaterOption', res.data.mainTheater)
          // this.$set(data, 'assistantTheaterOption', res.data.assistantTheater)
          data.mainTheaterOption = res.data.mainTheater;
          data.assistantTheaterOption = res.data.assistantTheater;
        }

        if(concat) {
          this.recordForm.teacherOption = (data.mainTheaterOption).concat(data.assistantTheaterOption);
        }
        console.log('data', data);
      });
    }
  }
};
</script>

<style>
</style>
