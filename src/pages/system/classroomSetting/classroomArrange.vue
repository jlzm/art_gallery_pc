<template>
  <div class="classroom-arrange">
    <div class="search">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="newArrange()">新建</el-button>
    </div>
    <div class="tables">
      <el-table :data="tableData" :span-method="arraySpanMethod" border>
        <el-table-column prop="timeformatter" label="rmid" align="center" v-if="false"></el-table-column>
        <el-table-column prop="weeknum" label="星期" align="center"></el-table-column>

        <el-table-column prop="room" label="上课教室" align="center"></el-table-column>
        <el-table-column prop="time" label="时间段" align="center" :formatter="timeformatter"></el-table-column>
        <el-table-column prop="tname" label="上课老师" align="center"></el-table-column>
        <el-table-column prop="claszname" label="上课班级" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editRoom(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteRoom(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="arrangeFormVisible" class="dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="arrangeFormVisible"
        :close-on-click-modal="false"
        width="500px"
      >
        <el-form
          :model="arrangeForm"
          class="form-inline"
          ref="arrangeForm"
          :label-position="'left'"
          label-width="95px"
          :rules="rule"
        >
          <el-form-item label="上课星期" prop="weeknum">
            <el-select
              v-model="arrangeForm.weeknum"
              filterable
              placeholder="请选择上课星期"
              size="small"
              required
            >
              <el-option
                v-for="item in arrangeForm.weekOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="上课教室" prop="classroom" required>
            <el-select
              v-model="arrangeForm.classroom"
              filterable
              placeholder="请选择上课教室"
              size="small"
            >
              <el-option
                v-for="item in arrangeForm.classroomOption"
                :key="item.rid"
                :label="item.rname"
                :value="item.rname"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始时间段" required>
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-time-select
                  placeholder="开始时间"
                  v-model="arrangeForm.startTime"
                  :picker-options="{
                                start: '06:00',
                                step: '00:10',
                                end: '22:00',
                              }"
                ></el-time-select>
              </el-form-item>
            </el-col>
            <el-col class="tac" :span="2">~</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-time-select
                  placeholder="结束时间"
                  v-model="arrangeForm.endTime"
                  :picker-options="{
                                start: '06:00',
                                step: '00:10',
                                end: '22:00',
                                minTime: arrangeForm.startTime
                              }"
                ></el-time-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="上课老师" prop="teacher" required>
            <el-select v-model="arrangeForm.teacher" filterable placeholder="请选择上课老师" size="small">
              <el-option
                v-for="item in arrangeForm.teacherOption"
                :key="item.tid"
                :label="item.tname"
                :value="item.tid + ',' + item.tname"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课班级" prop="class">
            <el-select
              v-model="arrangeForm.class"
              filterable
              placeholder="请选择上课班级"
              size="small"
              multiple
            >
              <el-option
                v-for="item in arrangeForm.classOption"
                :key="item.clid"
                :label="item.clname"
                :value="item.clid"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="上课学员" required prop="treeValue">
                <treeselect v-model="arrangeForm.treeValue" :multiple="true" :options="arrangeForm.options" size="small"/>
          </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "classroomArrange",
  components: {
    Treeselect
  },
  mounted() {
    this.initData();
  },
  data() {
    return {
      tableData: [],
      spanObj: {
        weeknum: [],
        weekPos: 0,
        classnum: [],
        classPos: 0
      },
      pos: 0,
      arrangeFormVisible: false,
      // 新增or修改
      type: "new",
      dialogTitle: "新建教室安排",
      arrangeForm: {
        startTime: "",
        endTime: "",
        weeknum: "",
        weekOption: [
          {
            label: "星期一",
            value: "星期一"
          },
          {
            label: "星期二",
            value: "星期二"
          },
          {
            label: "星期三",
            value: "星期三"
          },
          {
            label: "星期四",
            value: "星期四"
          },
          {
            label: "星期五",
            value: "星期五"
          },
          {
            label: "星期六",
            value: "星期六"
          },
          {
            label: "星期天",
            value: "星期天"
          }
        ],
        classroom: "",
        classroomOption: [],
        classOption: [],
        treeValue: null,
        options: [],
        teacher: "",
        teacherOption: [],
        class: []
      },
      // arrangeForm表单验证
      rule: {
        weeknum: [
          {
            trigger: "change",
            required: true,
            message: "请选择上课星期"
          }
        ],
        startTime: [
          {
            trigger: "blur",
            required: true,
            message: "开始时间必选"
          }
        ],
        endTime: [
          {
            trigger: "blur",
            required: true,
            message: "结束时间必选"
          }
        ],
        classroom: [
          {
            trigger: "change",
            required: true,
            message: "请选择上课教室"
          }
        ],
        teacher: [
          {
            trigger: "change",
            required: true,
            message: "请选择上课老师"
          }
        ],
        // class: [{
        //   trigger: 'change',
        //   message: '请选择上课班级'
        // }],
        treeValue: [
          {
            trigger: "change",
            required: true,
            message: "请选择上课学员"
          }
        ]
      },
      treeVisible: false
    };
  },
  methods: {
    // 合并表格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanObj.weeknum[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      } else if (columnIndex === 1) {
        const _row = this.spanObj.room[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    getSpanArr(arr, type) {
      this.spanObj[type] = [];
      this.pos = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          this.spanObj[type].push(1);
          this.pos = 0;
        } else {
          if (type === "room") {
            // ===0表示是weeknum下一个合并的第一条，在这一条时如果出现重复的room不做合并
            if (
              item[type] === arr[index - 1][type] &&
              this.spanObj.weeknum[index] === 0
            ) {
              // 将上一个本来为0的置为1
              this.spanObj[type][this.pos] += 1;
              this.spanObj[type].push(0);
            } else {
              this.spanObj[type].push(1);
              this.pos = index;
            }
          } else {
            if (item[type] === arr[index - 1][type]) {
              // 将上一个本来为0的置为1
              this.spanObj[type][this.pos] += 1;
              this.spanObj[type].push(0);
            } else {
              this.spanObj[type].push(1);
              this.pos = index;
            }
          }
        }
      });
      return arr;
    },
    timeformatter(val) {
      return val.begintime + "-" + val.endtime;
    },

    // 提交表单
    submit() {
      this.$refs.arrangeForm.validate(validate => {
        if (validate) {
          this.saveClass();
        }
      });
    },

    // 新建教室
    newArrange() {
      this.type = "new";
      this.dialogTitle = "新建教室安排";
      this.resetNewForm();
      this.arrangeFormVisible = true;

      this.$nextTick(() => {
        if (this.$refs.accountForm) {
          this.$refs.accountForm.resetFields();
        }
      });
    },

    /**
     * 重置新建数据
     */
    resetNewForm() {
      this.arrangeForm.startTime = "";
      this.arrangeForm.endTime = "";
      this.arrangeForm.weeknum = "";
      this.arrangeForm.classroom = "";
      this.arrangeForm.treeValue = null;
      this.arrangeForm.options = "";
      this.arrangeForm.class = [];
      this.arrangeForm.teacher = "";
    },

    // 删除教室
    deleteRoom(row) {
      this.$confirm("此操作将永久删除该教室, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteRoomById(row.rmid);
      });
    },
    // 修改教室
    editRoom(row) {
      this.dialogTitle = "修改教室";
      this.type = "edit";

      this.arrangeForm.class = row.class;
      this.arrangeForm.classroom = row.room;
      this.arrangeForm.weeknum = row.weeknum;
      this.arrangeForm.rmid = row.rmid;
      this.arrangeForm.teacher = row.tid + "," + row.tname;
      this.arrangeForm.startTime = row.begintime;
      this.arrangeForm.endTime = row.begintime;
      this.arrangeForm.treeValue = row.endtime;
      this.arrangeForm.class = row.clasz.split(",");

      this.arrangeFormVisible = true;
    },
    cancelDialog() {
      this.$refs.arrangeForm.resetFields();
      this.arrangeFormVisible = false;
    },
    // 转换日期
    formatTime(time) {
      var timeArr = time.split("-");
      timeArr = timeArr.map(item => {
        return "2019 01-01 " + item;
      });
      return timeArr;
    },
    // 转换时间
    formatHour(time) {
      time = new Date(time);
      let hour = time.getHours();
      let minutes = time.getMinutes();
      hour < 10 && (hour = "0" + hour);
      minutes < 10 && (minutes = "0" + minutes);
      return hour + ":" + minutes;
    },
    /** API */
    initData() {
      /** 弹窗请求放到这里比较好，无需使用里面数据，防止点开弹窗加载过慢 */
      // 获取老师
      this.getTeacherData();
      this.getClassRoom();
      // 获取班级
      this.getClass();
      // 获取班级设置表格
      this.getClassRoomList();
    },
    // 新建教室设置
    saveClass() {
      let json = {
        weeknum: this.arrangeForm.weeknum,
        begintime: this.arrangeForm.startTime,
        endtime: this.arrangeForm.endTime,
        room: this.arrangeForm.classroom,
        tid: this.arrangeForm.teacher.split(",")[0],
        tname: this.arrangeForm.teacher.split(",")[1],
        clasz: this.arrangeForm.class.join(","),
        rmid: this.arrangeForm.rmid
      };
      let map = {
        new: {
          url: "insertClassRoom",
          errorMsg: "添加教室安排失败",
          msg: "添加教室安排成功"
        },
        edit: {
          url: "updateClassRoom",
          errorMsg: "修改教室安排失败",
          msg: "修改教室安排成功"
        }
      };
      
      this.$axios.post("/" + map[this.type].url, json).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: map[this.type].msg,
            type: "success"
          });
          this.arrangeFormVisible = false;
          this.getClassRoomList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 删除教室
    deleteRoomById(id) {
      this.$axios.post("/deleteClassRoomByRmid", { rmid: id }).then(res => {
        if (res && res.data) {
          if (parseInt(res.data.code) === 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getClassRoomList();
          } else {
            this.$message.error(res.data.msg);
          }
        }
      });
    },
    // 获取一周教室
    getClassRoomList() {
      this.tableData = [];
      const map = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期天"
      ];
      this.$axios.post("/getClassRoomList").then(res => {
        let data;
        const timeStr = "2019-01-01";
        if (res && res.data.length) {
          res.data = res.data.sort((a, b) => {
            let returnVal = 1;
            let indexA = map.indexOf(a.weeknum);
            let indexB = map.indexOf(b.weeknum);
            if (indexA === indexB) {
              let beginTimeA = timeStr + " " + a.begintime;
              let beginTimeB = timeStr + " " + b.begintime;
              if (beginTimeA === beginTimeB) {
                let endTimeA = timeStr + " " + a.endtime;
                let endTimeB = timeStr + " " + a.endtime;
                returnVal = new Date(endTimeA) - new Date(endTimeB);
              } else {
                returnVal = new Date(beginTimeA) - new Date(beginTimeB);
              }
            } else {
              returnVal = indexA - indexB;
            }
            return returnVal;
          });

          res.data = this.getSpanArr(res.data, "weeknum");
          this.tableData = this.getSpanArr(res.data, "room");
        }
      });
    },
    // 获取教室
    getClassRoom() {
      this.$axios.post("/getRoom").then(res => {
        let data;
        if (res && res.data.length) {
          this.arrangeForm.classroomOption = res.data;
        }
      });
    },
    // 获取班级
    getClass() {
      this.arrangeForm.classOption = [];
      this.$axios.post("/getClass").then(res => {
        if (res && res.data && res.data.length) {
          this.arrangeForm.classOption = res.data;
        }
      });
    },
    // 获取老师
    getTeacherData() {
      this.teacherOption = [];
      this.$axios.post("/getTeacherSelectVul").then(res => {
        if (res && res.data.length) {
          this.arrangeForm.teacherOption = res.data;
        }
      });
    }
  },
  watch: {
    arrangeFormVisible(newVal) {
      if (newVal) {
      }
    }
  }
};
</script>

<style scope>
.tables /deep/ thead {
  background: #eee;
}
.tables /deep/ thead th,
.table /deep/ thead tr {
  background: #eee;
}
.classroom-arrange /deep/ .el-form {
  padding: 0 20px;
}
</style>
