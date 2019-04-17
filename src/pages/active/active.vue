<template>
  <div class="activity">
    <div class="title-ctn" @click="changeNav">
      <div class="title" :class="activeNav === 'wating' && 'active'" data-nav="wating">未开始</div>
      <div class="title" :class="activeNav === 'done' && 'active'" data-nav="done">已结束</div>
    </div>
    <div class="content">
      <div class="table-ctn">
        <div class="wating" v-if="activeNav === 'wating'">
          <div class="search">
            <el-form :inline="true" :model="watingCourseForm" class="form-inline" ref>
              <el-form-item label="选择日期">
                <el-date-picker
                  v-model="watingCourseForm.date"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  size="small"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="课程名称">
                <el-input
                  v-model="watingCourseForm.courseName"
                  placeholder="输入课程名称"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="getActiveData"
                >查询</el-button>
              </el-form-item>
            </el-form>
            <el-form :inline="true">
              <el-form-item class="oprator">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  @click="newActiveCourse()"
                >新建</el-button>
                <!--<el-button type="primary" icon="el-icon-document" size="small">导入</el-button>-->
                <el-button
                  class="delete-btn"
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteAll()"
                >批量删除</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="tables">
            <tables
              :tableOption="watingOption"
              :tableData="watingTableData"
              :backData="watingTableData"
              @pageChange="pageChange()"
              pageType="back"
              :loading="loading"
              @handleSelectionChange="selectChange"
            ></tables>
          </div>
        </div>
        <div class="done" v-else>
          <div class="search">
            <el-form :inline="true" :model="doneCourseForm" class="form-inline" ref>
              <el-form-item label="课程名称">
                <el-input
                  v-model="doneCourseForm.courseName"
                  placeholder="输入课程名称"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="getActiveData(1)"
                >查询</el-button>
              </el-form-item>
            </el-form>
            <el-form :inline="true">
              <el-form-item class="oprator">
                <el-button
                  class="delete-btn"
                  type="primary"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteAll()"
                >批量删除</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="tables">
            <tables
              :tableOption="doneOption"
              :tableData="doneTableData"
              :backData="doneTableData"
              @pageChange="donePageChange"
              @handleSelectionChange="selectChange"
              :total="total"
              pageType="back"
            ></tables>
          </div>
        </div>
      </div>
    </div>
    <div class="dialogs">
      <div v-if="dialog.visible" class="activeDialog">
        <el-dialog
          :title="dialog.title"
          :visible.sync="dialog.visible"
          top="4vh"
          :close-on-click-modal="false"
          width="500px"
        >
          <el-form
            :model="activeForm"
            class="form-inline"
            ref="activeForm"
            :label-position="'left'"
            label-width="95px"
            :rules="rule"
          >
            <el-form-item label="课程名称" prop="cname">
              <el-input size="small" v-model="activeForm.cname"></el-input>
            </el-form-item>
            <el-form-item label="主教老师" prop="mainTheater">
              <el-select v-model="activeForm.mainTheater" filterable placeholder="请选择上课老师" size="small">
                <el-option
                  v-for="item in activeForm.mainTheaterOption"
                  :key="item.tid"
                  :label="item.tname"
                  :value="item.tid + ',' + item.tname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="助教老师" prop="assistantTheater">
              <el-select v-model="activeForm.assistantTheater" filterable placeholder="请选择上课老师" size="small">
                <el-option
                  v-for="item in activeForm.assistantTheaterOption"
                  :key="item.tid"
                  :label="item.tname"
                  :value="item.tid + ',' + item.tname"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上课日期" prop="date">
              <el-date-picker
                v-model="activeForm.date"
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
            <el-form-item label="上课时间段" required>
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-time-select
                    placeholder="开始时间"
                    v-model="activeForm.startTime"
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
                    v-model="activeForm.endTime"
                    :picker-options="{
                start: '06:00',
                step: '00:10',
                end: '22:00',
                minTime: activeForm.startTime
              }"
                  ></el-time-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="上课地点" prop="room">
              <el-input v-model="activeForm.room" size="small"></el-input>
            </el-form-item>
            <el-form-item label="所需课时" prop="period_need">
              <el-input-number v-model="activeForm.period_need" size="small" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="活动人数" prop="maxnum">
              <el-input-number v-model="activeForm.maxnum" size="small" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="课程预热" prop="preview">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="activeForm.preview"></el-input>
            </el-form-item>
            <el-form-item label="活动图片" prop="cpicture">
              <el-upload
                :action="global.BASEURL + 'uploadPicture'"
                class="avatar-uploader"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="activeForm.previewImgUrl" :src="activeForm.previewImgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "../../mixins/tableMixin";
import util from "@/util/util";
import global from "@/global/global";
import publicFn from "../../mixins/pubilc";
export default {
  name: "activity",
  mixins: [mixin, publicFn],
  mounted() {
    // this.getTeacherData(this.activeForm)
    this.initWatingTable();
  },
  data() {
    return {
      global: global,
      activeNav: "wating",
      watingCourseForm: {
        courseName: "",
        date: ""
      },
      doneCourseForm: {
        courseName: "",
        date: ""
      },
      watingOption: {},
      watingTableData: [],
      doneTableData: [],
      // dialogs
      dialog: {
        title: "新建活动课程",
        type: "new",
        visible: false
      },
      // form
      activeForm: {
        previewImgUrl: "",
        imageUrl: "",
        room: "",
        date: "",
        startTime: "",
        endTime: "",
        cname: "",
        maxnum: 0,
        period_need: 0,
        preview: "",
        crid: "",
        mainTheater: "",
        assistantTheater: '',
        mainTheaterOption: [],
        assistantTheaterOption: [],
      },
      // 批量删除数据
      deleteStr: "",
      options: {
        classroomOption: []
      },
      rule: {
        cname: [
          {
            message: "课程名称必填",
            required: true,
            trigger: "blur"
          }
        ],
        mainTheater: [
          {
            message: "请选择主教老师",
            required: true,
            trigger: "blur"
          }
        ],
        assistantTheater: [
          {
            message: "请选择助教老师",
            required: true,
            trigger: "blur"
          }
        ],
        date: [
          {
            message: "上课日期必选",
            required: true,
            trigger: "blur"
          }
        ],
        startTime: [
          {
            message: "开始时间必选",
            required: true,
            trigger: "blur"
          }
        ],
        endTime: [
          {
            message: "结束时间必选",
            required: true,
            trigger: "blur"
          }
        ],
        room: [
          {
            message: "上课地点必填",
            required: true,
            trigger: "blur"
          }
        ],
        period_need: [
          {
            message: "所需课时必填",
            required: true,
            trigger: "blur"
          }
        ],
        maxnum: [
          {
            message: "所需课时必填",
            required: true,
            trigger: "blur"
          }
        ],
        preview: [
          {
            message: "课程预热必填",
            required: true,
            trigger: "blur"
          }
        ]
      },
      // 分页属性
      pageJSON: {
        currentPage: 1,
        pageSize: 10
      },
      donePageJSON: {
        currentPage: 1,
        pageSize: 10
      },
      total: 10,
      loading: false
    };
  },
  methods: {
    /** 图片相关 start*/
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      console.log("res", res);
      console.log("file", file);
      this.activeForm.previewImgUrl = URL.createObjectURL(file.raw);
      this.activeForm.imageUrl = file.response;
    },
    /** 图片相关 end*/

    changeNav(e) {
      var target = e.target || e.srcElement;
      if (target.dataset && target.dataset.nav) {
        this.activeNav = target.dataset.nav;
        if (this.activeNav === "wating") {
          this.initWatingTable();
        } else {
          this.initDoneTable();
        }
      }
    },

    // 批量删除
    selectChange(val) {
      console.log("deleteId", val);
      this.deleteStr = "";
      if (val && val.length) {
        val.forEach(item => {
          this.deleteStr += `${item.crid},`;
        });
        if (val.length > 0) {
          this.deleteStr = this.deleteStr.substr(0, this.deleteStr.length - 1);
        }
      }
      console.log(this.deleteStr);
    },

    deleteAll() {
      if (!this.deleteStr) {
        this.$message.info("请至少选择一项");
      } else {
        this.$confirm("此操作将删除该批次活动课程, 是否确认?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.deleteActive(this.deleteStr);
        });
      }
    },

    // 表格分页
    pageChange(val) {
      this.pageJSON = val;
      this.getActiveData(0);
    },

    donePageChange(val) {
      this.donePageJSON = val;
      this.getActiveData(1);
    },

    // 初始化未开始活动表格
    initWatingTable() {
      this.watingOption = {
        isMutiple: true,
        showOpr: true,
        showDetailBtn: true,
        showDelBtn: true,
        showEditBtn: true,
        column: [
          {
            prop: "cdate",
            label: "上课日期"
          },
          {
            prop: "weeknum",
            label: "星期"
          },
          {
            prop: "cname",
            label: "课程名称"
          },
          {
            prop: "tname",
            label: "主教老师"
          },
          {
            prop: "atname",
            label: "助教老师"
          },
          {
            prop: "time",
            label: "上课时间",
            formatter: row => {
              return row.begintime + "-" + row.endtime;
            }
          },
          {
            prop: "period_need",
            label: "所需课时"
          },
          {
            prop: "room",
            label: "上课地点"
          },
          {
            prop: "status",
            label: "活动状态",
            formatter(val) {
              return parseInt(val.status) === 0 ? "未开始" : "已结束";
            }
          },
          {
            prop: "allarrive",
            label: "报名人数"
          }
        ],
        showDetail: scope => {
          this.$router.push({
            path: "/home/activeDetail/wating/" + scope.row.crid
          });
        },

        editDetail: scope => {
          let row = scope.row;
          console.log(row);
            this.editDetailData(row);
            this.eidtActiveCourse();
        },

        delete: scope => {
          let row = scope.row;
          this.$confirm("此操作将删除该活动课程, 是否确认?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.deleteActive(row.crid, 0);
          });
        }
      };

      this.getTeacherData(this.activeForm).then(res=> {
        console.log('aaaaaaaaaaaa', res);
      });
      this.watingTableData = [];
      this.getActiveData();
    },

    /**
     * 填充编辑数据
     */
    editDetailData(row) {
      this.activeForm.room = row.room,
      this.activeForm.mainTheater = row.tid + "," + row.tname,
      this.activeForm.assistantTheater = row.atid + "," + row.atname,
      this.activeForm.date = row.cdate,
      this.activeForm.startTime = row.begintime,
      this.activeForm.endTime = row.endtime,
      this.activeForm.cname = row.cname,
      this.activeForm.maxnum = row.maxnum,
      this.activeForm.period_need = row.period_need,
      this.activeForm.preview = row.cdesc,
      this.activeForm.crid = row.crid,
      this.activeForm.previewImgUrl = row.cpicture,
      this.activeForm.imageUrl = row.cpicture
    },

    initDoneTable() {
      this.doneOption = {
        isMutiple: true,
        showOpr: true,
        showDetailBtn: true,
        column: [
          {
            prop: "cname",
            label: "课程名称"
          },
          {
            prop: "tname",
            label: "主教老师"
          },
          {
            prop: "atname",
            label: "助教老师"
          },
          {
            prop: "cdate",
            label: "上课日期"
          },
          {
            prop: "weeknum",
            label: "星期"
          },
          {
            prop: "time",
            label: "时间段",
            formatter: row => {
              return row.begintime + "-" + row.endtime;
            }
          },
          {
            prop: "period_need",
            label: "所需课时"
          },
          {
            prop: "room",
            label: "上课地点"
          },
          {
            prop: "status",
            label: "活动状态",
            formatter(val) {
              return parseInt(val.status) === 0 ? "未开始" : "已结束";
            }
          },
          {
            prop: "allarrive",
            label: "已报人数"
          }
        ],
        showDetail: scope => {
          this.$router.push({
            path: "/home/activeDetail/done/" + scope.row.crid
          });
        }
      };
      this.doneTableData = [];
      this.getActiveData(1);
    },

    // 新建活动课程
    newActiveCourse() {
      this.dialog.title = "新建活动课程";
      this.dialog.type = "new";
      if (this.$refs.activeForm) {
        this.$refs.activeForm.resetFields();
      }
      this.resetNewForm();
      this.dialog.visible = true;
    },

    /**
     * 重置新建表单数据
     */
    resetNewForm() {
      this.activeForm.previewImgUrl = "";
      this.activeForm.imageUrl = "";
      this.activeForm.room = "";
      this.activeForm.mainTheater = "";
      this.activeForm.assistantTheater = "";
      this.activeForm.date = "";
      this.activeForm.startTime = "";
      this.activeForm.endTime = "";
      this.activeForm.cname = "";
      this.activeForm.maxnum = "";
      this.activeForm.period_need = "";
      this.activeForm.preview = "";
      this.activeForm.crid = "";
    },

    // 编辑活动课程
    eidtActiveCourse() {
      this.dialog.visible = true;
      this.dialog.title = "编辑活动课程";
      this.dialog.type = "edit";
    },

    /** dialogs */
    cancelDialog() {
      this.$refs.activeForm.resetFields();
      this.dialog.visible = false;
    },

    /**
     * 提交新建
     */
    submit() {
      const weekmap = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      this.$refs.activeForm.validate(validate => {
        if (validate) {
          //比较时间段
          if (
            this.compareDate(this.activeForm.startTime, this.activeForm.endTime)
          ) {
            return false;
          }

          let dateJson = util.getTime(this.activeForm.date);
          let json = {
            cpicture: this.activeForm.imageUrl,
            cname: this.activeForm.cname,
            weeknum: dateJson.weekLabel,
            cdate: dateJson.year + "-" + dateJson.month + "-" + dateJson.day,
            room: this.activeForm.room,
            cdesc: this.activeForm.preview,
            begintime: this.activeForm.startTime,
            endtime: this.activeForm.endTime,
            tid: this.activeForm.mainTheater.split(",")[0],
            tname: this.activeForm.mainTheater.split(",")[1],
            atid: this.activeForm.assistantTheater.split(",")[0],
            atname: this.activeForm.assistantTheater.split(",")[1],
            period_need: this.activeForm.period_need,
            maxnum: this.activeForm.maxnum,
            ctype: 2,
            status: 0
          };

          console.log("json", json);
          if (this.dialog.type === "new") {
            this.insertActive(json);
          } else {
            this.updateActive(json);
          }
        }
      });
    },

    // 清空弹出框内表格
    resetForm() {
      this.$refs.activeForm.resetFields();
      (this.activeForm = {
        room: "",
        teacher: "",
        date: "",
        time: "",
        cname: "",
        maxnum: 0,
        period_need: 0,
        preview: "",
        crid: ""
      }),
        (this.dialog.visible = false);
    },

    /** API */
    deleteActive(id, status) {
      console.log("id", id);
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

            this.getActiveData(status, 1);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 添加课程
    insertActive(data) {
      this.$axios.post("/insertCourseRecord", data).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "新增活动课程成功",
            type: "success"
          });
          this.pageJSON.page = 1;
          this.getActiveData();
          this.dialog.visible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    updateActive(json) {
      json.crid = this.activeForm.crid;
      this.$axios.post("/updateCourseRecord", json).then(res => {
        if (res && parseInt(res.data.code) === 1) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getActiveData();
          this.resetForm();
          this.dialog.visible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 获取活动课程
    getActiveData(status) {
      let json;
      this.watingTableData = [];
      if (parseInt(status) !== 1) {
        json = {
          page: this.pageJSON.currentPage,
          rows: this.pageJSON.pageSize,
          cname: this.watingCourseForm.courseName,
          status: status || 0,
          ctype: 2
        };
        if (!this.watingCourseForm.date) {
          json.begindate = "";
          json.enddate = "";
        } else {
          json.begindate = this.watingCourseForm.date[0];
          json.enddate = this.watingCourseForm.date[1];
        }
        this.$axios.post("/getCourseByPage", json).then(res => {
          console.log("res.data", res.data);
          if (res.data && res.data.total > 0) {
            this.watingTableData = res.data.rows;
            this.total = res.data.total;
          }
        });
      } else {
        json = {
          page: this.donePageJSON.currentPage,
          rows: this.donePageJSON.pageSize,
          cname: this.doneCourseForm.courseName,
          status: status || 0,
          ctype: 2
        };
        if (!this.doneCourseForm.date) {
          json.begindate = "";
          json.enddate = "";
        } else {
          json.begindate = this.doneCourseForm.date[0];
          json.enddate = this.doneCourseForm.date[1];
        }
        this.$axios.post("/getCourseByPage", json).then(res => {
          if (res.data && res.data.total > 0) {
            this.doneTableData = res.data.rows;
            this.total = res.data.total;
          }
        });
      }
    }
  }
};
</script>

<style scope>
.dialogs /deep/ .el-dialog .el-select {
  width: 100%;
}

.dialogs /deep/ .el-dialog .el-input-number,
.dialogs /deep/ .el-dialog .el-date-editor {
  width: 100%;
}

.activity {
  padding: 15px;
  background-color: #fff;
}

.title-ctn {
  border-bottom: 1px solid #ddd;
  display: flex;
}

.activity .title-ctn .title {
  padding: 20px;
  padding-top: 5px;
  cursor: pointer;
}

.title.active {
  border-bottom: 2px solid rgba(74, 185, 194, 1);
  color: rgba(74, 185, 194, 1);
}

.content .table-ctn {
  margin-top: 15px;
}

/*图片上传*/
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
