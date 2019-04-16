<template>
  <div class="recordsDetail">
    <div class="ctn">
      <div class="title">基本信息</div>
      <div class="detail-inline">
        <div class="info-ctn">
          <div class="info">
            <div class="inline-label">课程名称:</div>
            <div>
              <span>{{detail.cname}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">上课时间:</div>
            <div>
              <span>{{detail.cdate + ' ' + detail.begintime + ' ~ ' + detail.endtime + ' ('+ detail.weeknum + ')'}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">所需课时:</div>
            <div>
              <span>{{detail.period_need}}</span>
            </div>
          </div>
        </div>
        <div class="info-ctn">
          <div class="info">
            <div class="inline-label">主教老师:</div>
            <div>
              <span>{{detail.tname}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">助教老师:</div>
            <div>
              <span>{{detail.atname}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">上课教室:</div>
            <div>
              <span>{{detail.room}}</span>
            </div>
          </div>
        </div>
        <div class="info-ctn">
          <div class="info">
            <div class="inline-label">应到人数:</div>
            <div>
              <span>{{detail.allarrive}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">签到人数:</div>
            <div>
              <span>{{detail.realarrive}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">签到时间:</div>
            <div>
              <span>{{detail.signtime || '尚未签到'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ctn">
      <div class="title">课程预热</div>
      <div class="ctn-text">{{detail.cdesc}}</div>
    </div>
    <div class="ctn">
      <div class="title">课堂动态(图片)</div>
      <div class="ctn-img">
        <div class="img-item" v-for="(item, index) in trend.imgList" :key="index">
          <img :src="imgUrl + item.src" alt :preview="index">
        </div>
      </div>
      <!-- <div class="title">课堂动态(视频)</div>
      <div class="ctn-img video">
        <div class="img-item" v-for="(item, index) in trend.videoList" :key="index">
          <video autoplay :src="videoUrl + item.src" controls preload>
            您的浏览器不支持H5播放器，你可以
            <a :href="videoUrl + item.src">下载</a>
            并用你喜欢的播放器观看!
          </video>
        </div>
      </div> -->
    </div>
    <div class="ctn">
      <div class="title">学生列表</div>
      <div class="ctn-table">
        <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column property="sname" label="学生姓名" width="120"></el-table-column>
          <el-table-column width="300" property="teacherComment" label="老师评价" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.t_eva.remark || '暂无'}}</template>
          </el-table-column>
          <el-table-column
            width="300"
            property="houseHolderComment"
            label="家长评价"
            show-overflow-tooltip
          >
            <template slot-scope="scope" v-if="scope.row.p_eva">{{scope.row.p_eva.remark || '暂无'}}</template>
          </el-table-column>
          <el-table-column property="address" label="作品图">
            <template slot-scope="scope" v-if="scope.row.t_eva && scope.row.t_eva.photoUrl">
              <div v-for="(item, index) in scope.row.t_eva.photoUrl.split(',')" :key="index" class="imgs dib">
                <img
                  :src="imgUrl + item"
                  :preview="index"
                >
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="showStudentDetal(scope.row)" type="text" size="small">查看详情</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <div class="dialog">
      <el-dialog title="学生详情" :visible.sync="studentDialog" width="30%">
        <div class="dialog-tname">
          <span>姓名：{{studentDialogData.name}}</span>
        </div>
        <div class="dialog-tname">
          <span>老师评价：{{studentDialogData.tRemark || '暂无评价'}}</span>
        </div>
        <div class="dialog-tname">
          <span>家长评价：{{studentDialogData.pRemark || '暂无评价'}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <div class="imgs">
                <img
                  :src="imgUrl + item"
                  :preview="index"
                  v-for="(item, index) in studentDialogData.imgs"
                  :key="index"
                >
              </div>
          <el-button @click="studentDialog = false">取 消</el-button>
          <el-button type="primary" @click="studentDialog = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import global from "@/global/global";
export default {
  name: "recordsDetail",
  mounted() {
    this.imgUrl = global.IMGURL;
    this.videoUrl = global.VIDEOURL;
    this.getClassDetail();
    this.getTrend(); // 获取课程动态
  },
  data() {
    return {
      studentDialogData: {
        name: '',
        imgs: [],
        tRemark: '',
        pRemark: '',
        
      },
      studentDialog: false,
      detail: {
        cname: "",
        classTime: "",
        period_need: 0,
        tname: "",
        room: "",
        allarrive: 0,
        realarrive: 0,
        signtime: "",
        cdesc: ""
      },
      tableData: [],
      trend: {
        // 活动动态
        imgList: [],
        videoList: []
      },
      crid: "",
      imgUrl: "",
      videoUrl: ""
    };
  },
  methods: {
    showStudentDetal(row) {
      console.log(row);
      this.studentDialogData.name = row.sname
      this.studentDialogData.imgs = row.t_eva.photoUrl && row.t_eva.photoUrl.split(',');
      this.studentDialogData.tRemark = row.t_eva.remark;
      this.studentDialogData.pRemark = row.p_eva.remark;
      this.studentDialog = true;
    },

  /**
   * 获取学生列表
   */
    getClassDetail() {
      this.$axios
        .post("/getCourseRecordDetails", {
          crid: this.$route.query.crid
        })
        .then(res => {
          console.log("res", res.data);
          if (res && res.data) {
            this.detail = res.data.course;
            this.tableData = res.data.evaluation;
            this.$previewRefresh();
          }
        });
    },
    getTrend() {
      this.trend = {
        // 活动动态
        imgList: [],
        videoList: []
      };
      this.$axios
        .post("/getCourseDynamic", {
          crid: this.$route.query.crid,
          ftype: ""
        })
        .then(res => {
          if (res && res.data && res.data.length) {
            res.data.forEach(item => {
              if (item.url) {
                item.url.split(",").forEach(url => {
                  if (item.ftype === "photo") {
                    this.trend.imgList.push({
                      src: url,
                      crid: item.crid
                    });
                  } else {
                    this.trend.videoList.push({
                      src: url,
                      crid: item.crid
                    });
                  }
                });
              }
            });
            this.$previewRefresh();
          }
        });
    }
  }
};
</script>

<style lang="less" scope>
.recordsDetail {
  padding: 15px;
  background-color: #fff;
}
.recordsDetail .title {
  font-weight: bold;
  margin-top: 15px;
}
.recordsDetail .ctn {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.recordsDetail .detail-inline {
  margin-top: 15px;
  /* display: flex; */
  text-align: left;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 35px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
.recordsDetail .detail-inline .info-ctn {
  display: flex;
}
.recordsDetail .detail-inline .info {
  display: flex;
  align-items: center;
  width: 33.3%;
}
.recordsDetail .detail-inline .inline-label {
  margin-right: 15px;
  width: 75px;
}
.recordsDetail .ctn-text {
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}
.ctn-img {
  display: flex;
  margin: 15px 0;
  flex-wrap: wrap;
  /* justify-content: space-between; */
}
.ctn-img .img-item {
  display: flex;
  margin: 0 15px 15px 0;
}
.ctn-img .img-item:first-child {
  margin-left: 0;
}
.ctn-img .img-item img {
  width: 100px;
  height: 100px;
}
.video .img-item {
  width: 500px;
  height: 300px;
}
.video .img-item video {
  width: 100%;
  height: 100%;
  /* object-fit: fill;  */
}
.ctn-table {
  margin-top: 15px;
}
.recordsDetail /deep/ .el-table .imgs {
  max-width: 50px;
  max-height: 50px;
  margin: 0 20px;
}

.dialog {
  .dialog-tname {
    margin-bottom: 5px;
  }
  .imgs {
    width: 200px;
    height: 200px;
  }
}

.testi {
  width: 50px;
}
</style>
