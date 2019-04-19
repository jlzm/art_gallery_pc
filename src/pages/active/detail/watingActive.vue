<template>
  <div class="wating-active">
    <div class="ctn">
      <div class="title">
        基本信息
      </div>
      <div class="detail-inline">
        <div class="info-ctn">
          <div class="info">
            <div class="inline-label">
              课程名称:
            </div>
            <div>
              <span>{{detail.cname}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">
              上课时间:
            </div>
            <div>
              <span>{{detail.cdate + ' ' + detail.begintime + ' ~ ' + detail.endtime}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">
              所需课时:
            </div>
            <div>
              <span>{{detail.period_need + '课时'}}</span>
            </div>
          </div>
        </div>
        <div class="info-ctn">
          <div class="info">
            <div class="inline-label">
              主教老师:
            </div>
            <div>
              <span>{{detail.tname}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">
              助教老师:
            </div>
            <div>
              <span>{{detail.atname}}</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">
              上课地点:
            </div>
            <div>
              <span>{{detail.room}}</span>
            </div>
          </div>

        </div>
        <div class="info-ctn">
          <div class="info">
            <div class="inline-label">
              报名人数:
            </div>
            <div>
              <span>{{detail.allarrive}}人</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">
              活动人数:
            </div>
            <div>
              <span>{{detail.maxnum}}人</span>
            </div>
          </div>
          <div class="info">
            <div class="inline-label">
              活动状态:
            </div>
            <div>
              <span>{{parseInt(detail.status) === 0 ? '未开始' : '已结束'}}</span>
            </div>
          </div>
        </div>
        <div class="all-student info">
          <div class="inline-label">
              活动人员:
            </div>
            <div>
              <span>{{detail.sname}}</span>
            </div>
        </div>
        <div class="activity-img-wrap">
          <span class="dib vat">活动图片：</span>
          <div class="dib vat activity-img">
            <img :src="detail.cpicture" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="ctn">
      <div class="title">
        学生列表
      </div>
      <div class="ctn-table">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            property="sname"
            label="学生姓名"
            width="120">
          </el-table-column>
          <el-table-column
            property="teacherComment"
            label="老师评价"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.t_eva.remark || '暂无'}}
            </template>
          </el-table-column>
          <el-table-column
            property="address"
            label="作品图">
            <template slot-scope="scope" v-if="scope.row.t_eva && scope.row.t_eva.photoUrl">
              <div class="imgs">
                <img :src="imgUrl + item" alt="" :preview="scope.row.sid"
                     v-for="(item, index) in scope.row.t_eva.photoUrl.split(',')" :key="index">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            property="houseHolderComment"
            label="家长评价"
            show-overflow-tooltip>
            <template slot-scope="scope" v-if="scope.row.p_eva">
              {{scope.row.p_eva.remark}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../../../mixins/tableMixin';

  import global from '../../../global/global.js'

  export default {
    name: 'watingActive',
    mixins: [mixin],
    mounted() {
      this.getData();
      this.initTable();
    },
    data() {
      return {
        crid: '',
        detail: {
          cpicture: '',
          course: '',
          room: "",
          allarrive: 0,
          arriveid: "",
          begintime: "",
          cdate: "",
          cdesc: "",
          clasz: "",
          cname: "",
          crid: "",
          ctype: "",
          endtime: "",
          period_need: 12,
          realarrive: 0,
          room: "",
          sid: "",
          sname: "",
          status: 0,
          tid: "",
          tname: "",
          weeknum: "",
        },
        tableOption: {},
        tableData: []
      };
    },
    methods: {

      initTable() {

      },
      /** API */
      getData() {
        this.$axios.post('/getCourseRecordDetails', {
          crid: this.crid
        })
          .then((res) => {
            console.log('res', res.data);
            this.detail = res.data.course;
            this.tableData = res.data.evaluation;
            this.detail.cpicture = global.IMGURL + this.detail.cpicture;
          });
      }
    },
    watch: {
      $route: {
        deep: true,
        immediate: true,
        handler(val) {
          this.crid = val.params.id;
        }
      }
    }
  };
</script>

<style scope>
  .wating-active {
    padding: 15px;
    background-color: #fff;
  }

  .wating-active .title {
    font-weight: bold;
    margin-top: 15px;
  }

  .wating-active .ctn {
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .wating-active .detail-inline {
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

  .wating-active .detail-inline .info-ctn {
    display: flex;
  }

  .wating-active .detail-inline .info {
    display: flex;
    align-items: center;
    width: 33.3%;
  }

  .wating-active .detail-inline .inline-label {
    margin-right: 15px;
    width: 75px;
  }

  .ctn-table {
    margin: 0 0 20px 0;
  }

  .activity-img {
    width: 200px;
    height: 150px;
  }
</style>
