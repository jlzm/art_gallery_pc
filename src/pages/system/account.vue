<template>
  <div class="uid">
    <div class="search">
      <el-form :inline="true" :model="accountForm" class="form-inline">
        <el-form-item label="账号">
          <el-input v-model="searchForm.uid" placeholder="输入账号" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.uname" placeholder="输入姓名" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item class="oprator">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showModal">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <tables :tableOption="tableOption" :tableData="tableData"></tables>
    </div>
    <div class="dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="accountFormVisible"
        :close-on-click-modal="false"
        width="350px"
      >
        <el-form
          :model="accountForm"
          ref="accountForm"
          :label-position="'left'"
          label-width="80px"
          :rules="rule"
        >
          <el-form-item label="账号" prop="uid">
            <el-input v-model="accountForm.uid" size="small"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="uname">
            <el-input v-model="accountForm.uname" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="accountForm.password"
              size="small"
              :type="showPas ? 'text': 'password'"
              show-password
            >
              <i
                slot="suffix"
                :title="showPas ? '隐藏密码': '显示密码'"
                style="cursor:pointer;"
                :style="showPas&&'color:#5cb6ff;'"
                @click="togglePas"
                class="el-input__icon iconfont el-icon-view"
              ></i>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="accountFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertUser()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";
export default {
  uname: "uid",
  mixins: [mixin],
  mounted() {
    this.initTable();
    this.tableData = [];
  },
  data() {
    return {
      // 表格配置
      tableOption: {},
      tableData: [],
      dialogTitle: "新建账号",
      accountFormVisible: false,
      searchForm: {
        uid: "",
        uname: ""
      },
      accountForm: {
        uid: "",
        uname: "",
        password: ""
      },
      rule: {
        uid: [
          {
            trigger: "blur",
            message: "请输入账号",
            required: true
          }
        ],
        uname: [
          {
            trigger: "blur",
            message: "请输入姓名",
            required: true
          }
        ],
        password: [
          {
            trigger: "blur",
            message: "请输入密码",
            required: true
          }
        ]
      },
      showPas: false
    };
  },
  methods: {
    initTable() {
      this.tableOption = {
        isMutiple: false,
        showIndex: true,
        showOpr: true,
        showDelBtn: true,
        showEditBtn: true,
        column: [
          {
            prop: "uid",
            label: "账号"
          },
          {
            prop: "uname",
            label: "姓名"
          },
          {
            prop: "password",
            label: "密码",
            hidden: "hidden"
          },
          {
            prop: "instime",
            label: "创建时间",
            formatter(row) {
              return row.instime && row.instime.slice(0, -2);
            }
          }
        ],

        // 编辑账号
        editDetail: data => {
          this.accountFormVisible = true;
          this.dialogTitle = "编辑账户";
          this.accountForm.uname = data.row.uname;
          this.accountForm.uid = data.row.uid;
          this.accountForm.password = data.row.password;
        },

        // 删除账号
        delete() {
          console.log(1);
        }
      };
      this.getTableData();
    },

    showModal() {
      this.accountFormVisible = true;
      this.accountForm.uid = '';
      this.accountForm.uname = '';
      this.accountForm.password = '';

      this.dialogTitle = "新建账户";
      // this.$nextTick(() => {
      //   this.$refs.accountForm.resetFields();
      // });
    },
    
    togglePas() {
      this.showPas = !this.showPas;
    },

    /**
     * 新建用户
     */
    insertUser() {
      this.$refs.accountForm.validate(validate => {
        if (validate) {
          this.$axios.post("/insertUser", this.accountForm).then(res => {
            if (res && res.data && parseInt(res.data.code) === 1) {
              this.getTableData();
              this.$message.success("新增用户成功");
              this.accountFormVisible = false;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },

    /**
     * 获取账号数据
     *  */
    getTableData() {
      this.tableData = [];
      this.$axios.post("/getAllUser", this.searchForm).then(res => {
        if (res && res.data && res.data.length) {
          this.tableData = res.data;
        } else {
          this.$message.info("没有查到相关数据");
        }
      });
    }
  }
};
</script>

<style scope>
.uid {
  padding: 15px;
  background-color: #fff;
}
</style>
