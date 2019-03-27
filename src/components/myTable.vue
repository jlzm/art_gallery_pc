<template>
  <div class="my-table">
    <div class="tips" v-show="selectLength > 0">
      <i class="el-icon-info"></i>
      <div class="hasSelect">已选择<span class="select-number">{{selectLength}}</span>项</div>
      <div class="delete" @click="clearSelect">清空</div>
    </div>
    <div class="table">
      <el-table
        :data="pageType === 'front' ? fontData : backData"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        ref="table">
        <el-table-column
          type="selection"
          width="55"
          align="center"
          v-if="tableOption.isMutiple">
        </el-table-column>
        <el-table-column
          type="index"
          width="50"
          v-if="tableOption.showIndex"
          label="序号"
          align="center">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableOption.column"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :show-overflow-tooltip="item.tooltip"
          :formatter="item.formatter || defaults.formatter"
          v-if="item.hidden !== 'hidden'"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          v-if="tableOption.showOpr">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="tableOption.showDetail(scope)" v-if="tableOption.showDetailBtn">
              详情
            </el-button>
            <el-button type="text" size="small" @click="tableOption.editDetail(scope)" v-if="tableOption.showEditBtn">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="tableOption.delete(scope)" v-if="tableOption.showDelBtn">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        v-show="tableData.length"
        :page-sizes="pageSize"
        :page-size="pagesizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total || (this.pageType === 'front' ? tableData.length : backData.length)"
        @size-change="changePage"
        :current-page.sync='currentPage'
        @current-change="changeCurrent"
        @prev-click="prevClick"
        @next-click="nextClick">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import util from '@/util/util';
  /*
  数据解释
  multipleSelection： 与多选删除联动的数据，选取后会向外触发一个handleSelectionChange事件，在组件上监听这个数据
  tableData： 表格数据
  pageSize： 分页器数据
  pageType： 分页属性 front表示前端分页 back表示后台分页
  total: 表示总条数
  backData： 后台分页传入的数据
  tableOption: 对于表格参数的配置
  {
    column: { 表格列数据
      label: '', 名字
      width: ''， 宽度
      prop: ''对应列名
      tooltip: 超出提示
      formatter 格式化函数
      hidden 是否隐藏该列 hidden为隐藏
    }，
    showOpr: false 是否开启最后一列为操作列
    showDetail: 详情操作
    editDetail： 编辑操作
    delete： 删除操作
  }
  */
  export default {
    name: 'tables',
    mounted() {
    },
    data() {
      return {
        multipleSelection: [],
        defaults: {
          formatter(row, column, cellValue, index) {
            return cellValue;
          }
        },
        pagesizes: this.pageSize[0],
        currentPage: 1
      };
    },
    props: {
      tableData: {
        type: Array
      },
      tableOption: {
        type: Object,
        required: true
      },
      pageSize: {
        type: Array,
        default() {
          return [10, 20, 30, 50, 100];
        }
      },
      total: {
        type: Number
      },
      // 分页属性 后台分页或者前端分页 front or back
      pageType: {
        type: String,
        default: 'front'
      },
      backData: {
        type: Array,
        default() {
          return [];
        }
      },
      loading: {
        type: Boolean
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.$emit('handleSelectionChange', val);
      },
      clearSelect() {
        this.$refs.table.clearSelection();
      },
      changePage(val) {
        this.pagesizes = val;
      },
      changeCurrent(val) {
        this.currentPage = val;
      },
      prevClick(val) {
        this.currentPage = val;
      },
      nextClick(val) {
        this.currentPage = val;
      }
    },
    computed: {
      selectLength() {
        return this.multipleSelection.length;
      },
      // 计算当前分页开始位置
      currentStart() {
        return (this.currentPage - 1) * this.pagesizes;
      },
      // 初始化前端分页数据
      fontData() {
        return this.tableData.slice(this.currentStart, this.currentPage * this.pagesizes);
      },
      changeWatch() {
        return {
          currentPage: this.currentPage,
          currentSize: this.pagesizes
        };
      }
    },
    watch: {
      changeWatch: {
        deep: true,
        handler() {
          // 去抖事件，防止ele内部分页器change事件导致多次传递
          util.debounce(this.$emit('pageChange', {
            currentPage: this.currentPage,
            pageSize: this.pagesizes
          }), 10);
        }
      }
    }
  };
</script>

<style scope>
  .tips {
    margin-bottom: 20px;
  }

  .table {
    margin: 0 0 20px 0;
  }

  .table /deep/ thead {
    background: #eee;
  }

  .table /deep/ thead th, .table /deep/ thead tr {
    background: #eee;
  }

  .tips {
    border-radius: 5px;
    background: rgba(74, 185, 194, 0.2);
    border-color: #b3d8ff;
    padding: 10px;
    display: flex;
    align-items: center;
  }

  .tips i {
    color: #409EFF;
  }

  .tips .hasSelect {
    margin-left: 10px;
  }

  .tips .select-number {
    color: rgba(74, 185, 194, 1);
    margin: 0 8px;
  }

  .tips .delete {
    margin: 0 20px;
    color: rgba(74, 185, 194, 1);
    cursor: pointer;
  }

  .table /deep/ .el-button--text {
    color: rgba(74, 185, 194, 1);
  }
</style>
