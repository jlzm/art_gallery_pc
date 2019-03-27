<template>
  <div class="main">
    <div class="cells">
      <div class="cell">
        <div class="cell-title">
          总销课量
        </div>
        <div class="cell-number">
         {{format(topData.allperiod)}}
        </div>
      </div>
      <div class="cell">
        <div class="cell-title">
          本周销课量
        </div>
        <div class="cell-number">
           {{format(topData.weekperiod)}}
        </div>
      </div>
      <div class="cell">
        <div class="cell-title">
          总会员数
        </div>
        <div class="cell-number">
            {{format(topData.allMember)}}
        </div>
      </div>
      <div class="cell">
        <div class="cell-title">
          本月新增会员数
        </div>
        <div class="cell-number">
          {{format(topData.monthMember)}}
        </div>
      </div>
    </div>
    <div class="charts">
      <div class="charts-title-ctn title-ctn">
        <div class="charts-title title">
          销课量
        </div>
        <div class="picker">
          <div class="date-choose" @click="redraw">
            <div data-type="week">本周</div>
            <div data-type="month">本月</div>
            <div data-type="year">本年</div>
          </div>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="searchTeacherSale"
            size="small">
          </el-date-picker>
        </div>
      </div>
      <div class="charts-ctn">
        <el-row>
          <el-col :xl="20" :md="18" :sm="14"><div class="charts-el" ref="chartsEl"></div></el-col>
          <el-col :xl="4" :md="6" :sm="10">
            <div class="rank">
              <div class="rank-title">老师销售量排名</div>
              <div class="list-ctn">
                <div class="list" v-for="(item, index) in rankList" :key="index">
                  <div class="index">
                    <div class="index-ctn" :class="index  < 3 && 'top'">
                      {{index + 1 + PAGENUM * (currentPage - 1)}}
                    </div>
                    <div class="name">
                      {{item.tname}}
                    </div>
                  </div>
                  <div class="account">
                    {{item.sale_total}}
                  </div>
                </div>
              </div>
              <div class="page">
                <el-pagination
                  layout="prev, pager, next"
                  :total="copyRank.length"
                  :page-size="7"
                  :current-page.sync="currentPage"
                  small>
                </el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="timetable">
       <div class="title-ctn">
        <div class="title">
          本周课程安排
        </div>
      </div>
      <classAssign isIndex='true'></classAssign>
      
    </div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import classAssign from '@/pages/class/classAssign'
export default {
  name: 'index',
  components: {
    classAssign
  },
  mounted () {
    // 获取顶部数据
    this.getTopData()
    // 获取echarts
    this.getChartsData()
    // 获取老师销课量
    this.getTeacherRanking()
  },
  data () {
    return {
      // 老师销课量一页显示个数
      PAGENUM: 7,
      date: '',
      charts: {
        instance: {},
        week: {},
        month: {},
        year:{}
      },
      rankList: [],
      topData: {
        allperiod: 0,
        weekperiod: 0,
        allMember: 0,
        monthMember: 0
      },
      currentPage: 1,
      copyRank: []
    }
  },
  methods: {
    format (num) {
      let tempNum = num
      let arr = []
      while (tempNum) {
        arr.push(tempNum % 1000)
        tempNum = parseInt(tempNum / 1000)
        if (tempNum) {
          arr.push(',')
        }
      }
      return arr.reverse().join('') || 0
    },
    initCharts (type) {
      let el = this.$refs.chartsEl
      let myCharts = {}
      this.charts.instance =  myCharts  = echarts.init(el)
      this.setChartsData(type)
      window.onresize = () => {
        myCharts.resize()
      }
    },
    setChartsData(type) {
      let option = {
        title: {
          text: '销课量趋势',
          textStyle: {
            fontSize: 16,
            color: 'rgba(74, 185, 194, 1)'
          },
          x: 15,
          y: 15
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['最高销量']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
          }
        ],
        yAxis: [
          {
            type : 'value',
            axisLabel : {
              formatter: '{value} 课时'
            }
          }
        ],
        series: [
          {
            name:'最高授课量',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            markPoint : {
              data : [
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {
              data : [
                  {type : 'average', name: '平均值'}
              ]
            },
            lineStyle: {
                normal: {
                    color: 'rgba(74, 185, 194, 1)',
                    width: 2,
                    type: 'solid'
                }
            },
            itemStyle: {
                normal: {
                    color: "rgba(74, 185, 194, 1)",
                    width: 2
                }
            },
          }
        ]
      }
      const dataMap = {
        'week' : this.charts.week,
        'month' : this.charts.month,
        'year' : this.charts.year
      }
      const data = dataMap[type]
      if (type !== 'week') {
        option.xAxis[0].data = data.xdate
      }
      option.series[0].data = data.ydate
      this.charts.instance.setOption(option)
    },
    // 重新绘制echarts
    redraw(e) {
      let target = e.target || e.srcElement
      if (target.dataset && target.dataset.type) {
        this.setChartsData(target.dataset.type)
      }
    },
    // 根据时间查老师销课
    searchTeacherSale(date) {
      this.getTeacherRanking(date)
    },
    /** API  */
    getTopData() {
      this.$axios.post('/getCountInfo')
        .then((res) => {
          let obj = {
            allperiod: 0,
            weekperiod: 0,
            allMember: 0,
            monthMember: 0
          }
          this.topData = Object.assign(obj, res.data)
        })
    },
    getChartsData() {
      this.$axios.post('/homePageEcharts')
        .then((res) => {
          this.charts.week = res.data.week
          this.charts.month = res.data.month
          this.charts.year = res.data.year
          this.$nextTick(() => {
            this.initCharts('week')
          })
        })
    },
    getTeacherRanking(date) {
      let json
      if (date) {
        json = {
          begindate: date[0],
          enddate: date[1]
        }
      }
      this.currentPage = 1
      this.$axios.post('/getTeacherRanking',json)
        .then((res) => {
          if (res && res.data.length) {
            // 一页七条
            this.copyRank = res.data
            this.rankList = this.copyRank.slice((this.currentPage - 1) * this.PAGENUM , this.currentPage * this.PAGENUM)
          }
        })
    }
  },
  watch: {
    // 分页改变改变数据
    currentPage: {
      immediate: true,
      deep: true,
      handler(val) {
        // 一页七条
        this.rankList = this.copyRank.slice((this.currentPage - 1) * this.PAGENUM , this.currentPage * this.PAGENUM)
      }
    }
  },
  beforeDestroy() {
    window.onresize = null
    if (this.charts && this.charts.instance && this.charts.instance.dispose) {
      this.charts.instance.dispose()
    }
  }
}
</script>

<style scope>
  .main .cells {
    display: flex;
    justify-content: space-between;
  }
  .main .cells .cell {
    background: #fff;
    width: 300px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 15px;
  }
  .main .cells .cell:first-child,.main .cells .cell:last-child{
    margin: 0;
  }
  .main .cells .cell .cell-title {
    color: #aaa;
    font-size: 14px;
  }
  .main .cells .cell .cell-number {
    font-size: 30px;
    margin-top: 10px;
    /* font-weight: bold; */
  }
  .main .charts {
    background-color: #fff;
    margin-top: 15px;
  }
  .main .charts .charts-title-ctn {
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
  }
  .main .charts .charts-title-ctn .picker {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .main .charts .charts-title-ctn .picker /deep/ .el-date-editor {
    width: 280px;
  }
  .main .charts .charts-title-ctn .charts-title {
    padding: 20px;
    border-bottom: 2px solid rgba(74, 185, 194, 1);
    color: rgba(74, 185, 194, 1);
  }
  .main .charts .charts-title-ctn .date-choose {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .main .charts .charts-title-ctn .date-choose div {
    cursor: pointer;
    color: rgba(74, 185, 194, 1);
    margin:0 15px;
  }
  .main .charts-ctn {
    /* display: flex; */
    height: 350px;
    width: 100%;
  }
  .main .charts-ctn .charts-el {
    /* flex: 8; */
    height: 350px;
  }
  .main .charts-ctn .rank {
    /* flex: 3; */
  }
  .main .charts-ctn .rank /deep/ .el-pagination--small .el-pager li{
    font-size: 14px;
  }
  .main .charts-ctn .rank-title{
    margin: 15px 0;
    color: rgba(74, 185, 194, 1);
    font-weight: bold;
  }
  .main .charts-ctn .list-ctn {
    height: 230px;
  }
  .main .charts-ctn .rank .list{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }
  .main .charts-ctn .rank .list .index {
    display: flex;
    align-items: center;
    flex: 4;
  }
  .main .charts-ctn .rank .list .index-ctn {
    border-radius: 50%;
    background-color: #eee;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color:rgba(74, 185, 194, 1);
    max-height: 230px;
  }
  .main .charts-ctn .rank .list .index-ctn.top {
    background-color: #666;
  }
  .main .charts-ctn .rank .list .name {
    margin-left: 15px;
  }
  .main .charts-ctn .rank .list .account {
    color:rgba(74, 185, 194, 1);
    flex: 2;
    text-align: center;
  }
  .main .timetable {
    background-color: #fff;
    margin-top: 15px;
  }
   .main  .title-ctn {
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
  }
  .main .title-ctn .title {
    padding: 20px;
    border-bottom: 2px solid rgba(74, 185, 194, 1);
    color: rgba(74, 185, 194, 1);
  }
  .main .timetable-ctn {
    padding: 15px;
  }
  .main .timetable-ctn .table-header{
    display: flex;
    justify-content: space-between;
  }
  .main .timetable-ctn .location{
    border: 1px dashed #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 150px;
    padding: 20px 0 ;
  }
  .main .timetable-ctn .week{
    border: 1px dashed #eee;
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: rgba(74, 185, 194, 1);
  }
  .main .table-body .item {
  display: flex;
  }
  .main .table-body .classes {
    width: 100%;
  }
  .main .table-body .class-info{
    width: 100%;
    display: flex;
  }
  .main .table-body .class-info .info-item{
    border: 1px dashed #eee;
    width: 100%;
    height: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    cursor: pointer;
  }
  .main .table-body .class-info .classtime{
    background-color: rgba(74, 185, 194, .2);
    font-size: 14px;
    color: #555;
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
  }
  .main .table-body .class-info div:not(.classtime){
    padding-bottom: 5px;
  }
  .tables /deep/ thead {
    background: #eee;
  }
  .tables /deep/ thead th,.table /deep/ thead tr{
    background: #eee;
  }
</style>
