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

      // data.mainTheaterOption = [];
      // data.assistantTheaterOption = [];
      // return this.$axios.post("/getTeacherSelectVul").then(res => {
      //   if (res) {
      //     data.mainTheaterOption = res.data.mainTheater;
      //     data.assistantTheaterOption = res.data.assistantTheater;
      //   }

      //   if (concat) {
      //     data.teacherOption = (res.data.mainTheater).concat(res.data.assistantTheater);
      //   }
      //   console.log('data', data);
      //   return res;
      // });
      data.mainTheaterOption = [];
      return this.$axios.post("/getTeacherSelectVul").then(res => {
        console.log('res', res);
        if (res.data && res.data.length) {
          data.mainTheaterOption = res.data;
        }
        return res;
      });
    }
  }
};
