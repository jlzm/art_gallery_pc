export default {
  methods: {
    /**
     * 导出学生列表方法
     */
    getStudentExcel(url, propsData) {
      if (!this.tableData.length) return;
      this.$axios
        .get(url, {
          params: propsData
        })
        .then(res => {
          console.log("res", res);
          // console.log('res', res.request.responseURL);
          /**
           * 脱了裤子放屁.。。.
           */
          window.open(res.request.responseURL);
        });
    },
  }
};
