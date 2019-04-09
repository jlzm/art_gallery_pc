<template>
  <div class="class-assign">
    <div class="search" v-if="!isIndex">
      <el-form ref="search">
        <el-form-item label="选择日期" prop="date">
          <el-date-picker
            v-model="form.week"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            size="small"
            :inline-message="true"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-tooltip class="item" effect="dark" :content="tips" placement="top-start">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div class="right">
        <!-- <el-button type="primary" icon="el-icon-refresh" size="small" :disabled="!canAutoAssign" @click="autoAssign">
          自动排课
        </el-button>-->
        <el-button type="primary" icon="el-icon-plus" size="small" @click="eidtOrAdd(1,1)">新增</el-button>
      </div>
    </div>
    <!-- <cascader :tree="treeData"></cascader> -->
    <div class="tables">
      <el-table :data="tableData" :span-method="arraySpanMethod" border>
        <el-table-column label="crid" align="center" v-if="false"></el-table-column>
        <el-table-column prop="cdate" label="日期" align="center"></el-table-column>
        <el-table-column prop="weeknum" label="星期" align="center"></el-table-column>

        <el-table-column prop="room" label="上课教室" align="center"></el-table-column>
        <el-table-column prop="cname" label="课程名" align="center"></el-table-column>
        <el-table-column prop="time" label="上课时间" align="center" :formatter="timeformatter"></el-table-column>
        <el-table-column prop="tname" label="上课老师" align="center"></el-table-column>
        <el-table-column prop="sname" label="上课学生" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="period_need" label="所需课时" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editClass(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteClass(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="dialog.assignFormVisible" class="dialog">
      <el-dialog
        :title="dialog.dialogTitle"
        :visible.sync="dialog.assignFormVisible"
        :close-on-click-modal="false"
        width="500px"
      >
        <el-form
          :model="assignForm"
          class="form-inline"
          ref="assignForm"
          :label-position="'left'"
          label-width="95px"
          :rules="rule"
        >
          <el-form-item label="课程名" prop="cname">
            <el-input v-model="assignForm.cname" size="small"></el-input>
          </el-form-item>
          <el-form-item label="选择日期" prop="date">
            <el-date-picker
              v-model="assignForm.date"
              type="date"
              placeholder="选择日期"
              size="small"
              :picker-options="{
                          disabledDate(time) {
                            return dialog.type === 'new' && time.getTime() < Date.now() - 8.64e7;
                          }
                        }"
            ></el-date-picker>
          </el-form-item>
          {{assignForm.startTime}}
          <el-form-item label="起始时间段" required>
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-time-select
                  placeholder="开始时间"
                  v-model="assignForm.startTime"
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
                  v-model="assignForm.endTime"
                  :picker-options="{
                          start: '06:00',
                          step: '00:10',
                          end: '22:00',
                          minTime: assignForm.startTime
                        }"
                ></el-time-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="上课老师" prop="teacher">
            <el-select v-model="assignForm.teacher" filterable placeholder="请选择上课老师" size="small">
              <el-option
                v-for="item in assignForm.teacherOption"
                :key="item.value"
                :label="item.tname"
                :value="item.tid + ',' + item.tname"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课学员" prop="treeValue">
            <treeselect
              placeholder="请选择上课学员"
              v-model="assignForm.treeValue"
              :multiple="true"
              :options="assignForm.studentOption"
              :value-consists-of="'LEAF_PRIORITY'"
              size="small"
            />
          </el-form-item>
          <el-form-item label="上课教室" prop="room">
            <el-select v-model="assignForm.room" filterable placeholder="请选择上课教室" size="small">
              <el-option
                v-for="item in assignForm.classroomOption"
                :key="item.rid"
                :label="item.rname"
                :value="item.rname"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所需课时" prop="classNumber">
            <el-input-number v-model="assignForm.classNumber" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="课程预热" prop="preview">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="assignForm.preview"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm">取 消</el-button>
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
import util from "@/util/util";

import publicFn from "../../mixins/pubilc.vue";
export default {
  mixins: [publicFn],
  name: "classAssign",
  // 用于首页展示
  props: ["isIndex"],
  components: {
    Treeselect
  },
  mounted() {
    // 页面加载获取学生
    this.getStudentByCstep();
    this.getClassRoom();
    // 获取老师
    this.getTeacherData();
    this.getIndexData();
  },
  data() {
    // 时间校验
    const timeVaildate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择排课时间"));
      }
    };
    return {
      form: {
        week: ""
      },
      /**const */
      // 提示
      tips: "请选择日期查询一周排课,如果该周尚未排课请手动增加或选择自动排课",
      weekmap: [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ],
      // 是否可以自动排课
      canAutoAssign: false,
      // 表格
      tableData: [],
      spanObj: {
        weeknum: [],
        weekPos: 0,
        classnum: [],
        classPos: 0
      },
      pos: 0,
      dialog: {
        dialogTitle: "新增排课",
        assignFormVisible: false,
        type: "new"
      },

      // 新建数据
      assignForm: {
        startTime: "",
        endTime: "",
        cname: "",
        week: "",
        date: "",
        times: "",
        teacher: "",
        teacherOption: [
          {
            label: "张老师",
            value: 1
          }
        ],
        classNumber: "",
        preview: "",
        treeValue: [],
        classOption: [
          {
            label: "大班",
            value: 2
          },
          {
            label: "中班",
            value: 1
          },
          {
            label: "小班",
            value: 0
          }
        ],
        studentOption: [],
        room: "",
        classroomOption: []
      },
      visible: false,
      tree: null,
      // 校验规则
      rule: {
        cname: [
          {
            trigger: "blur",
            message: "请填写课程名称",
            required: true
          }
        ],
        date: [
          {
            trigger: "blur",
            message: "请选择排课日期",
            required: true
          }
        ],
        startTime: [
          {
            trigger: "blur",
            message: "开始时间必选",
            required: true
          }
        ],
        endTime: [
          {
            trigger: "blur",
            message: "结束时间必选",
            required: true
          }
        ],
        teacher: [
          {
            trigger: "blur",
            message: "请选择上课老师",
            required: true
          }
        ],
        treeValue: [
          {
            trigger: "blur",
            message: "请选择上课学生",
            required: true
          }
        ],
        preview: [
          {
            trigger: "change",
            message: "请输入课堂预热",
            required: true
          }
        ],
        room: [
          {
            trigger: "change",
            message: "请选择上课教室",
            required: true
          }
        ],
        classNumber: [
          {
            trigger: "change",
            message: "请选择所需课时",
            required: true
          }
        ]
      }
    };
  },
  methods: {
    // 合并表格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let type = ["cdate", "weeknum", "room"];
      let _row;
      let _col;
      if (columnIndex === 0) {
        _row = this.spanObj.cdate[rowIndex];
        _col = _row > 0 ? 1 : 0;
      } else if (columnIndex === 1) {
        _row = this.spanObj.weeknum[rowIndex];
        _col = _row > 0 ? 1 : 0;
      } else if (columnIndex === 2) {
        _row = this.spanObj.room[rowIndex];
        _col = _row > 0 ? 1 : 0;
      } else {
        _row = 1;
        _col = 1;
      }
      return {
        rowspan: _row,
        colspan: _col
      };
    },
    // 合并表格
    getSpanArr(arr, type) {
      this.spanObj[type] = [];
      this.pos = 0;
      // 排序
      let timeStr = "2019-01-01";
      arr = arr.sort((a, b) => {
        let returnVal = 1;
        let indexA = this.weekmap.indexOf(a.weeknum);
        let indexB = this.weekmap.indexOf(b.weeknum);
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

    // 规整表格
    formatData(data) {
      data = this.getSpanArr(data, "cdate");
      data = this.getSpanArr(data, "weeknum");
      this.tableData = this.getSpanArr(data, "room");
    },
    timeformatter(val) {
      return val.begintime + "-" + val.endtime;
    },
    changeDate(val) {
      // this.$refs.search.validate()
      const weekTime = 1000 * 60 * 60 * 24 * 6;
      const clearTime = msg => {
        this.$message.error(msg);
        this.form.week = "";
      };
      if (val) {
        const time0 = new Date(val[0]);
        const time1 = new Date(val[1]);
        if (time1.getTime() - time0.getTime() > weekTime) {
          clearTime("选择跨度请不要超过一周");
        } else {
          this.getCourseRecordByWeek(this.form.week);
        }
      }
    },
    eidtOrAdd(data, type) {
      this.dialog.assignFormVisible = true;
      // 新增
      if (type == 1) {
        this.dialog.dialogTitle = "新建排课";
        this.dialog.type = "new";
        if (this.$refs.assignForm) {
          console.log(1);
          this.$refs.assignForm.resetFields();
        }
        this.resetNewForm();
      } else {
        // 修改
        this.dialog.dialogTitle = "编辑排课";
        this.dialog.type = "edit";
      }
    },

    /**
     * 重置新增数据表单
     */
    resetNewForm() {
      this.assignForm.startTime = "";
      this.assignForm.endTime = "";
      this.assignForm.room = "";
      this.assignForm.cname = "";
      this.assignForm.week = "";
      this.assignForm.date = "";
      this.assignForm.times = "";
      this.assignForm.teacher = "";
      this.assignForm.classNumber = "";
      this.assignForm.preview = "";
    },

    // 编辑单个教室
    editClass(row) {
      console.log(row);
      this.assignForm.treeValue = row.sid.split(",").filter(item => {
        return item;
      });
      this.assignForm.room = row.room;
      this.assignForm.teacher = row.tid + "," + row.tname;
      this.assignForm.preview = row.cdesc;
      this.assignForm.startTime = row.begintime;
      this.assignForm.endTime = row.endtime;
      this.assignForm.classNumber = parseInt(row.period_need);
      this.assignForm.cname = row.cname;
      this.assignForm.crid = row.crid;
      this.assignForm.date = row.cdate;
      this.eidtOrAdd(null, 2);
    },
    // 删除单个排课
    deleteClass(row) {
      this.$confirm("该操作会删除此次排课，是否确认", "确认删除排课", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        this.deleteCourseRecord(row.crid);
      });
    },
    // 提交表单
    submit() {
      // 提交表单

      this.$refs.assignForm.validate(validate => {
        if (validate) {
          if (
            this.compareDate(this.assignForm.startTime, this.assignForm.endTime)
          ) {
            return false;
          }
          let dateJson = util.getTime(this.assignForm.date);
          let json = {
            cname: this.assignForm.cname,
            cdesc: this.assignForm.preview,
            begintime: this.assignForm.startTime,
            endtime: this.assignForm.endTime,
            room: this.assignForm.room,
            tid: this.assignForm.teacher.split(",")[0],
            tname: this.assignForm.teacher.split(",")[1],
            sid: this.assignForm.treeValue.join(","),
            period_need: this.assignForm.classNumber,
            cdate: dateJson.year + "-" + dateJson.month + "-" + dateJson.day,
            weeknum: dateJson.weekLabel,
            crid: this.assignForm.crid
          };
          if (this.dialog.type === "new") {
            this.insertCourseRecord(json);
          } else {
            this.updateCourseRecord(json);
          }
        }
      });
    },
    // 清空弹出框内表格
    resetForm() {
      this.$refs.assignForm.resetFields();
      this.assignForm.treeValue = [];
      this.assignForm.room = "";
      this.assignForm.teacher = "";
      this.assignForm.preview = "";
      this.assignForm.times = "";
      this.assignForm.classNumber = 0;
      this.dialog.assignFormVisible = false;
    },
    // 选择班级
    changeClass(newVal) {
      this.visible = true;
    },
    // 鼠标移入选择器事件
    overMenu(e) {},
    // 点击自动排课
    autoAssign() {
      if (!this.form.week.length) {
        this.$message.error("请选择开始与结束时间");
        this.canAutoAssign = false;
        return;
      }
      let json = {
        begindate: this.form.week[0],
        enddate: this.form.week[1]
      };
      this.getClassRoomByWeek(json);
    },
    // 首页获取表格数据
    getIndexData() {
      const ONEDAYTIME = 1 * 1000 * 60 * 60 * 24;
      let today = util.getTime(new Date());
      let [minusTime, plusTime] = [0, 0];
      // 重新组装日期,保证不出现时分秒影响
      let todayTime = new Date(
        today.year + "-" + today.month + "-" + today.day
      ).getTime();
      let weekStart, weekEnd;
      let formatStr = dateJson => {
        return dateJson.year + "-" + dateJson.month + "-" + dateJson.day;
      };
      // 计算一周剩余时间
      minusTime = ((6 + today.weeknum) % 7) * ONEDAYTIME;
      plusTime = ((7 - today.weeknum) % 7) * ONEDAYTIME;
      // 周一和周日的时间戳
      weekStart = new Date(todayTime - minusTime);
      weekEnd = new Date(todayTime + plusTime);
      // 周一和周日的日期
      let startDateJson = util.getTime(weekStart);
      let endDateJson = util.getTime(weekEnd);
      let date = [formatStr(startDateJson), formatStr(endDateJson)];
      this.form.week = date;
      this.getCourseRecordByWeek(date);
    },
    /** API */
    getCourseRecordByWeek(data) {
      let json = {
        begindate: data[0],
        enddate: data[1]
      };
      // 结束时间在今天之前
      const isBeforeTody = new Date(json.enddate) - new Date() < 0;
      let message = "该段时间没有排课记录,请手动添加";
      this.$axios.post("/getCourseRecordByWeek", json).then(res => {
        if (res.data.length) {
          this.formatData(res.data);
          this.canAutoAssign = false;
        } else {
          isBeforeTody && (message = "该段时间没有排课记录");
          this.tableData = [];
          this.$message({
            message: message,
            type: "warning",
            duration: 3500,
            showClose: true
          });
          this.canAutoAssign = !isBeforeTody;
        }
      });
    },
    getClassRoomByWeek(data) {
      this.$axios.post("/getClassRoomByWeek", data).then(res => {
        if (res && res.data.length) {
          let data = res.data;
          data = this.getSpanArr(data, "cdate");
          data = this.getSpanArr(data, "weeknum");
          this.tableData = this.getSpanArr(data, "room");
        }
      });
    },
    // 获取学生二级下拉
    getStudentByCstep() {
      this.$axios.post("/getStudentByClasz").then(res => {
        if (res && res.data) {
          let arr = [];
          for (let key in res.data) {
            let item = res.data[key];
            for (let i = 0; i < item.length; i++) {
              item[i].id = item[i].sid;
              item[i].label = item[i].sname;
            }
            arr.push({
              id: key,
              label: key,
              children: item
            });
          }
          this.assignForm.studentOption = arr;
        }
      });
    },
    // 获取教室
    getClassRoom() {
      this.$axios.post("/getRoom").then(res => {
        let data;
        if (res && res.data.length) {
          this.assignForm.classroomOption = res.data;
        }
      });
    },
    // 获取老师
    getTeacherData() {
      this.teacherOption = [];
      this.$axios.post("/getTeacherSelectVul").then(res => {
        if (res && res.data.length) {
          this.assignForm.teacherOption = res.data;
        }
      });
    },
    // 新增上课排班
    insertCourseRecord(json) {
      this.$axios.post("/insertCourseRecord", json).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "新增排课成功",
            type: "success"
          });
          this.getCourseRecordByWeek(this.form.week);
          this.dialog.assignFormVisible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 修改
    updateCourseRecord(json) {
      if (this.dialog.assignFormVisible) {
        this.$axios.post("/updateCourseRecord", json).then(res => {
          if (res && parseInt(res.data.code) === 1) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getCourseRecordByWeek(this.form.week);
            this.resetForm();
            this.dialog.assignFormVisible = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    deleteCourseRecord(id) {
      this.dialog.assignFormVisible = false;
      this.$axios
        .post("/deleteCourseRecord", {
          crid: id
        })
        .then(res => {
          if (res && parseInt(res.data.code) === 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getCourseRecordByWeek(this.form.week);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
  },
  watch: {
    "assignForm.class"(newVal) {
      console.log(newVal);
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

.class-assign {
  padding: 15px;
  background-color: #fff;
}

.class-assign .search {
  position: relative;
}

.class-assign .search .right {
  position: absolute;
  top: 0;
  right: 0;
}

.dialog /deep/ .vue-treeselect__multi-value {
  line-height: initial;
}

.class-assign /deep/ .vue-treeselect {
  line-height: initial;
}
</style>
