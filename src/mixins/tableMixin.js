// 主要用于混入table相关的mixin
import tables from '../components/myTable.vue';

const mixin = {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表格配置
      tableOption: {}
    };
  },
  // 多选表格的基本项
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearSelect() {
      this.$refs.table.clearSelection();
    }
  },
  computed: {
    selectLength() {
      return this.multipleSelection.length;
    }
  },
  components: {
    tables
  }
};
export default mixin;
