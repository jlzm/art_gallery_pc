import Vue from 'vue';
import Router from 'vue-router';
import meta from './routerMeta';
import store from '../store/index';

Vue.use(Router);
const router = new Router({
  routes: [{
    path: '*',
    redirect: {
      name: 'login'
    }
  },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../pages/login'], resolve)
    },
    {
      path: '/',
      redirect: {
        name: 'home'
      }
    },
    {
      name: 'home',
      meta: {
        requireLogin: true
      },
      path: '/home',
      redirect: {
        path: '/home/index'
      },
      component: resolve => require(['../pages/home'], resolve),
      children: [{
        name: 'main',
        path: 'index',
        component: resolve => require(['../pages/main/index'], resolve),
        meta: {
          // title: 面包屑名称
          // path: 面包屑路径
          // type用于判断当前类型,不写就一定会渲染
          breadList: meta.indexMeta
        }
      },
        {
          name: 'personal1',
          path: 'personal1',
          component: resolve => require(['../pages/personal/Personal1'], resolve),
          children: [
            {
              name: 'student',
              path: 'student',
              component: resolve => require(['../pages/personal/Student'], resolve),
              meta: {
                // title: 面包屑名称
                // path: 面包屑路径
                // type用于判断当前类型,不写就一定会渲染
                breadList: meta.personalMeta.student
              }
            },
            {
              name: 'student',
              path: 'teacher',
              component: resolve => require(['../pages/personal/Teacher'], resolve),
              meta: {
                // title: 面包屑名称
                // path: 面包屑路径
                // type用于判断当前类型,不写就一定会渲染
                breadList: meta.personalMeta.teacher
              }
            },
            {
              name: 'testMember',
              path: 'testMember',
              component: resolve => require(['../pages/personal/TestMember'], resolve),
              meta: {
                // title: 面包屑名称
                // path: 面包屑路径
                // type用于判断当前类型,不写就一定会渲染
                breadList: meta.personalMeta.testMember
              }
            },
          ],
        },
        {
          name: 'detail',
          path: 'detail/:type/:id',
          component: resolve => require(['../pages/detail/detail'], resolve),
          meta: {
            breadList: meta.detailMeta
          },
        },
        // 上课管理
        {
          name: 'class',
          path: 'class',
          component: resolve => require(['../pages/class/class'], resolve),
          children: [{
            name: 'records',
            path: 'classRecords',
            component: resolve => require(['../pages/class/records'], resolve),
            meta: {
              breadList: meta.classMetaRecordMeta
            },
          },
            {
              name: 'assign',
              path: 'classAssign',
              component: resolve => require(['../pages/class/classAssign'], resolve),
              meta: {
                breadList: meta.classMetaClassAssignMeta
              },
            },
            {
              name: 'leaveNotes',
              path: 'classLeaveNotes',
              component: resolve => require(['../pages/class/leaveNotes'], resolve),
              meta: {
                breadList: meta.classMetaClassLeaveNotes
              },
            },
          ]
        },
        {
          name: 'recordsDetail',
          path: 'recordsDetail',
          component: resolve => require(['../pages/class/recordsDetail/recordsDetail'], resolve),
          meta: {
            breadList: meta.recordsDetailMeta
          }
        },
        // 活动日程管理
        {
          name: 'active',
          path: 'active',
          component: resolve => require(['../pages/active/active'], resolve),
          meta: {
            breadList: meta.activeMeta
          }
        },
        // 活动详情
        {
          name: 'activeDetail',
          path: 'activeDetail',
          component: resolve => require(['../pages/active/detail/detail'], resolve),
          children: [
            // 已结束活动与正在进行活动
            {
              name: 'wating',
              path: 'wating/:id',
              component: resolve => require(['../pages/active/detail/watingActive'], resolve),
              meta: {
                breadList: meta.activeDetailMeta
              }
            },
            {
              name: 'done',
              path: 'done/:id',
              component: resolve => require(['../pages/active/detail/doneActive'], resolve),
              meta: {
                breadList: meta.activeDetailMeta
              }
            }
          ],
          meta: {
            breadList: meta.activeMeta
          }
        },
        // 考勤记录
        {
          name: 'attence',
          path: 'attence/record',
          component: resolve => require(['../pages/attence/attenceRecord'], resolve),
          meta: {
            breadList: meta.attenceRecordMeta
          }
        },
        // 考勤排班
        {
          name: 'resort',
          path: 'attence/resort',
          component: resolve => require(['../pages/attence/attenceResort'], resolve),
          children: [
            //考勤排班
            {
              name: 'resortHome',
              path: 'resorthome',
              component: resolve => require(['../pages/attence/resorthome'], resolve),
              meta: {
                breadList: meta.attenceAssignMeta
              }
            },
            // 排班设置
            {
              name: 'classSetting',
              path: 'classSetting',
              component: resolve => require(['../pages/attence/classSetting'], resolve),
              meta: {
                breadList: meta.classSettingMeta
              },
            },
            // // 新增排班
            // {
            //   name: 'addNewResort',
            //   path: 'addNewResort',
            //   component: resolve => require(['../pages/attence/addNewResort'], resolve),
            //   meta: {
            //     breadList: meta.newResort
            //   },
            // }
          ]
        },
        // 系统设置
        {
          name: 'system',
          path: 'system',
          component: resolve => require(['../pages/system/system'], resolve),
          children: [{
            name: 'systemClassSetting',
            path: 'systemClassSetting',
            component: resolve => require(['../pages/system/classSetting'], resolve),
            meta: {
              breadList: meta.systemClassSettingMeta
            }
          },
            {
              name: 'classroomSetting',
              path: 'classroomSetting',
              component: resolve => require(['../pages/system/classroomSetting'], resolve),
              meta: {
                breadList: meta.classSetting
              },
              redirect: {
                path: '/home/system/classroomSetting/setup'
              },
              children: [{
                name: 'classroomArrange',
                path: 'classroomArrange',
                component: resolve => require(['../pages/system/classroomSetting/classroomArrange'], resolve),
                meta: {
                  breadList: meta.classSetting
                }
              },
                {
                  name: 'setup',
                  path: 'setup',
                  component: resolve => require(['../pages/system/classroomSetting/setup'], resolve),
                  meta: {
                    breadList: meta.classSetting
                  }
                }
              ]
            },
            {
              name: 'account',
              path: 'account',
              component: resolve => require(['../pages/system/account'], resolve),
              meta: {
                breadList: meta.accountMeta
              },
            },
            {
              name: 'oprRecord',
              path: 'oprRecord',
              component: resolve => require(['../pages/system/oprRecord'], resolve),
              meta: {
                breadList: meta.oprMeta
              },
            }
          ]
        }
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  let path = to.path;
  const isLogin = store.state.userInfo && store.state.userInfo.uid;
  if (path === '/login') {
    if (isLogin) {
      next({
        name: 'home'
      });
    } else {
      next();
      return;
    }
  } else {
    if (isLogin) {
      next();
    } else {
      next({
        name: 'login'
      });
    }
  }

});
export default router;
