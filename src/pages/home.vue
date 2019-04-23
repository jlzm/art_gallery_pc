<template>
  <div class="home">
    <el-row type="flex">
      <el-col :span="3">
        <left-nav :leftData='leftData' :activeIndex='activeIndex'></left-nav>
      </el-col>
      <el-col :span="21">
        <right :activeIndex='activeIndex' :pathInfo='pathInfo'></right>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import leftNav from '../components/leftNav';
  import right from '../components/right';

  export default {
    data() {
      return {
        leftData: [
          {
            icon: 'el-icon-menu',
            name: '首页',
            id: '1',
            path: '/home/index'
          },
          {
            icon: 'el-icon-personal',
            name: '人员管理',
            id: '2',
            path: '/home/personal1',
            childData: [
              {
                name: '会员管理',
                id: '2-1',
                path: '/home/personal1/student'
              },
              {
                name: '教师管理',
                id: '2-2',
                path: '/home/personal1/teacher'
              },
              {
                name: '试听会员',
                id: '2-3',
                path: '/home/personal1/testMember'
              },
            ]
          },
          {
            icon: 'el-icon-class',
            name: '上课管理',
            id: '3',
            path: '/home/class',
            childData: [
              {
                name: '上课记录',
                id: '3-1',
                path: '/home/class/classRecords'
              },
              {
                name: '试听记录',
                id: '3-2',
                path: '/home/class/classTestNotes'
              },
              {
                name: '上课排班',
                id: '3-3',
                path: '/home/class/classAssign'
              },
              {
                name: '请假记录',
                id: '3-4',
                path: '/home/class/classLeaveNotes'
              },
            ]
          },
          {
            icon: 'el-icon-active',
            name: '活动课程管理',
            id: '4',
            path: '/home/active',
            childData: [
              {
                name: '活动课程',
                id: '4-1',
                path: '/home/active'
              }
            ]
          },
          {
            icon: 'el-icon-record',
            name: '考勤管理',
            id: '5',
            path: '/home/attence/record',
            childData: [
              // {
              //   name: '考勤记录',
              //   id: '5-1',
              //   path: '/home/attence/record'
              // },
              {
                name: '考勤排班',
                id: '5-2',
                path: '/home/attence/resort/resorthome'
              }
            ]
          },
          {
            icon: 'el-icon-system',
            name: '系统设置',
            id: '6',
            path: '/home/system',
            childData: [
              {
                name: '班级设置',
                id: '6-1',
                path: '/home/system/systemClassSetting'
              },
              {
                name: '教室设置',
                id: '6-2',
                path: '/home/system/classroomSetting'
              },
              {
                name: '账号设置',
                id: '6-3',
                path: '/home/system/account'
              },
              {
                name: '操作记录',
                id: '6-4',
                path: '/home/system/oprRecord'
              }
            ]
          }
        ],
        // 当前路由
        activeIndex: '',
        // 路由信息
        pathInfo: {}
      };
    },
    components: {
      leftNav,
      right
    },
    watch: {
      '$route': {
        deep: true,
        immediate: true,
        handler(route) {
          this.activeIndex = route.path;
          this.pathInfo = {
            meta: route.meta,
            params: route.params
          };
        }
      }
    }
  };
</script>

<style scope>

</style>
