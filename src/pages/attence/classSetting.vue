<template>
  <div class="class-setting">
    <div class="search">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addNewSetting">新增班次</el-button>
    </div>
    <div class="tables">
      <tables :tableOption="tableOption" :tableData="tableData"></tables>
    </div>
    <div class="dialog">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form
          :model="addClassForm"
          class="form-inline"
          ref="addClassForm"
          label-position="left"
          label-width="80px"
          :rules="rule"
        >
          <el-form-item label="班次名称" prop="className">
            <el-input v-model="addClassForm.className" placeholder="请填写班次名称" size="small"></el-input>
          </el-form-item>
          <el-form-item label="上班时间" prop="dutyTime">
            <el-time-select
              v-model="addClassForm.dutyTime"
              size="small"
              format="HH时mm分"
              placeholder="上班时间"
              :picker-options="{
                  step: '00:05',
                  start: '06:00',
                  end: '21:00'
                  }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="下班时间" prop="offDutyTime">
            <el-time-select
              v-model="addClassForm.offDutyTime"
              size="small"
              format="HH时mm分"
              placeholder="下班时间"
              :picker-options="{
                    step: '00:05',
                    start: '06:00',
                    end: '21:00',
                    minTime: addClassForm.dutyTime
                  }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="启用时间" prop="wakeTime">
            <el-date-picker
              type="date"
              v-model="addClassForm.wakeTime"
              placeholder="选择启用时间"
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="地点范围" prop="range">
            <el-input-number v-model="addClassForm.range" size="small" :min="0" :step="10"></el-input-number>
            <span class="tip">(米)</span>
          </el-form-item> -->
          <!-- <el-form-item label="打卡地点" prop="locationName">
            <el-input v-model="addClassForm.locationName" size="small" disabled></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="selectLocation"
            >选择打卡地点
            </el-button>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideForm">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
        <el-dialog
          title="选择地点"
          :visible.sync="innerVisible"
          append-to-body
          ref="dialogMap"
          class="appendLocationDialog"
          :close-on-click-modal="false"
        >
          <el-form inline>
            <el-form-item label="搜索地址">
              <el-select
                v-model="addClassForm.point"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                @change="selectPos"
                :loading="loading"
                :remote-method="remoteMethod"
              >
                <el-option
                  v-for="(item, index) in map.searchArr"
                  :key="index"
                  :label="item.label"
                  :value="JSON.stringify(item.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <baidu-map class="map" :center="map.center" :zoom="15" :scroll-wheel-zoom="true">
            <!-- 定位组件 -->
            <bm-geolocation
              anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
              :showAddressBar="true"
              :autoLocation="true"
            ></bm-geolocation>
            <!-- 放大缩小 -->
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <!-- 搜索组件 -->
            <bm-local-search
              :keyword="addClassForm.keyword"
              :auto-viewport="true"
              :pageCapacity="100"
              @searchcomplete="searchcomplete"
              :panel="false"
            ></bm-local-search>
            <!-- 定位组件 -->
            <bm-marker
              :position="addClassForm.point && JSON.parse(addClassForm.point).point"
              :dragging="true"
              animation="BMAP_ANIMATION_BOUNCE"
            >
              <!-- <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen">我爱北京天安门</bm-info-window> -->
            </bm-marker>
          </baidu-map>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="innerVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import mixin from "../../mixins/tableMixin";
  import global from "../../global/global";

  export default {
    name: "setting",
    mixins: [mixin],
    mounted() {
      this.initTable();
      // 初始化地图
      this.initMap();
    },
    data() {
      // 下班校验
      const offDutyValidate = (rule, value, callback) => {
        if (!this.addClassForm.dutyTime) {
          callback(new Error("请先选择上班时间"));
          this.addClassForm.offDutyTime = "";
        } else if (!value) {
          callback(new Error("请选择下班时间"));
        } else {
          callback();
        }
      };
      return {
        tableOption: {},
        tableData: [],
        dialogTitle: "新增班次",
        // 操做方式
        editType: "new",
        // 远端搜索loading
        loading: false,
        // 表单
        addClassForm: {
          className: "",
          classNameOptions: [
            {
              label: "小班",
              value: 0
            },
            {
              label: "中班",
              value: 1
            },
            {
              label: "大班",
              value: 2
            }
          ],
          dutyTime: "",
          fitPeopleOptions: [
            {
              label: "小李",
              value: 0
            },
            {
              label: "小李1",
              value: 1
            },
            {
              label: "小李2",
              value: 2
            },
            {
              label: "小李3",
              value: 3
            },
            {
              label: "小李4",
              value: 4
            },
            {
              label: "小李5",
              value: 5
            },
            {
              label: "小李6",
              value: 6
            }
          ],
          offDutyTime: "",
          wakeTime: "",
          keyword: "",
          point: "",
          locationName: "",
          range: 0,
          currentRow: {} //当前操作列
        },
        dialogFormVisible: false,
        // 地图弹窗可见
        innerVisible: false,
        map: {
          center: "长沙",
          zoom: 3,
          searchArr: []
        },
        customData: [],
        // 表单校验
        rule: {
          className: [
            {
              required: true,
              message: "请填写班次名称",
              trigger: "blur"
            }
          ],
          dutyTime: [
            {
              required: true,
              message: "请选择上班时间",
              trigger: "blur"
            }
          ],
          offDutyTime: [
            {
              validator: offDutyValidate,
              trigger: "blur"
            },
            {
              required: true,
              trigger: "blur"
            }
          ],
          wakeTime: [
            {
              required: true,
              trigger: "blur",
              message: "请选择启用时间"
            }
          ],
          // locationName: [
          //   {
          //     required: true,
          //     trigger: "blur",
          //     message: "请选择打卡地点"
          //   }
          // ],
          // range: [
          //   {
          //     required: true,
          //     trigger: "blur",
          //     message: "地点范围必填"
          //   }
          // ]
        }
      };
    },
    methods: {
      /**MAP && Location */
      initMap() {
      },
      searchcomplete(LocalResult) {
        if (LocalResult) {
          this.map.searchArr = LocalResult.Ar.map(item => {
            return {
              value: {
                title: item.title,
                point: item.point
              },
              label: item.title
            };
          });
          this.loading = false;
        }
      },
      // 联网查询
      remoteMethod(query) {
        if (query !== "") {
          this.addClassForm.keyword = query;
          this.loading = true;
        }
      },
      selectLocation() {
        this.innerVisible = true;
      },

      /** dialog */
      // 显示新增弹窗
      addNewSetting() {
        this.addClassForm.className = '';
        this.addClassForm.dutyTime = '';
        this.addClassForm.offDutyTime = '';
        this.addClassForm.wakeTime = '';
        this.addClassForm.range = 0;
        this.addClassForm.locationName = '';
        this.dialogTitle = "新增班次";
        this.editType = "new";
        this.dialogFormVisible = true;
      },
      
      // 修改弹窗
      editDetail(scope) {
        this.dialogFormVisible = true;
        this.dialogTitle = "修改班次";
        this.editType = "edit";
        let row = scope.row;
        let json = {
          className: row.wname,
          dutyTime: row.ontime,
          offDutyTime: row.offtime,
          wakeTime: row.start,
          locationName: row.sign_place,
          keyword: row.sign_place,
          range: row.ranges,
          currentRow: row
        };
        Object.assign(this.addClassForm, json);
      },

      // 确认提交修改
      confirm() {
        this.$refs.addClassForm.validate(validate => {
          if (validate) {
            // let point = JSON.parse(this.addCClassForm.point);
            let json = {
              wname: this.addClassForm.className,
              ontime: this.addClassForm.dutyTime,
              offtime: this.addClassForm.offDutyTime,
              start: this.addClassForm.wakeTime,
              // sign_place: point.title,
              // lnglat: point.point.lng + "," + point.point.lat,
              sign_place: '',
              lnglat: '',
              range: this.addClassForm.range
            };
            if (this.editType === "new") {
              this.$axios.post("/insertWorkTimeConfig", json).then(res => {
                if (res.data && parseInt(res.data.code) === 1) {
                  this.$message.success("新增班次成功");
                  this.getTableData();
                } else {
                  this.$message.error(res.data.msg);
                }
                this.dialogFormVisible = false;
              });
            } else {
              json.wid = this.addClassForm.currentRow.wid;
              this.$axios.post("/updateWorkTimeConfig", json).then(res => {
                this.dialogFormVisible = false;
                if (res.data && parseInt(res.data.code) === 1) {
                  this.$message.success("修改班次成功");
                  this.getTableData();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            }
          }
        });
      },
      // 隐藏弹窗并重置表单
      hideForm() {
        this.$refs.addClassForm.resetFields();
        this.dialogFormVisible = false;
      },
      // 确认位置
      selectPos(val) {
      },
      /** table */
      // 初始化表格
      initTable() {
        this.tableOption = {
          isMutiple: false,
          showIndex: true,
          showOpr: true,
          showEditBtn: true,
          showDelBtn: true,
          column: [
            {
              prop: "wid",
              label: "排班id",
              hidden: "hidden"
            },
            {
              prop: "wname",
              label: "班次名称",
              width: 150
            },
            {
              prop: "ontime",
              label: "上班时间"
            },
            {
              prop: "offtime",
              label: "下班时间"
            },
            {
              prop: "start",
              label: "启用时间"
            },
            // {
            //   prop: "sign_place",
            //   label: "打卡地点",
            //   tooltip: true,
            //   width: 350
            // },
            // {
            //   prop: "ranges",
            //   label: "地点范围",
            //   formatter(row, column, cellValue, index) {
            //     return cellValue + "米";
            //   }
            // }
          ],
          editDetail: scope => {
            this.editDetail(scope);
          },
          delete: scope => {
            this.$confirm("此操作将删除该班次, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            }).then(() => {
              this.deleteTabelData(scope.row.wid);
            });
          }
        };
        this.getTableData();
      },
      // 获取表格数据
      getTableData() {
        this.tableData = [];
        this.$axios.post("/getWorkTimeConfigList").then(res => {
          if (res && res.data && res.data.length) {
            this.tableData = res.data;
          }
        });
      },
      deleteTabelData(wid) {
        this.$axios.post("/deleteWorkTime", {wid}).then(res => {
          if (res && res.data && parseInt(res.data.code) === 1) {
            this.$message.success("删除成功");
            this.getTableData();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      // 获取班次名称及id
      getResort() {
        this.addClassForm.classNameOptions = [];
        this.$axios.post("/getWorkTimeConfigList").then(res => {
          if (res && res.data && res.data.length) {
            this.addClassForm.classNameOptions = res.data;
          }
        });
      }
    },
    watch: {
      "addClassForm.point"() {
        try {
          // this.map.center = JSON.parse(this.addClassForm.point).point
          this.addClassForm.locationName = JSON.parse(
            this.addClassForm.point
          ).title;
        } catch (e) {
          this.map.center = "长沙";
          this.addClassForm.locationName = "";
        }
      }
    }
  };
</script>

<style scope>
  .class-setting .dialog /deep/ .el-dialog {
    width: 450px;
  }

  .class-setting .dialog /deep/ .el-select,
  .class-setting .dialog /deep/ .el-date-editor {
    width: 100%;
  }

  .map {
    width: 600px;
    height: 450px;
  }
</style>
