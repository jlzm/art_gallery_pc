let indexMeta = [{
  title: '首页',
  path: '/home/index'
}];
// 人员管理
let personal = {
  personal: [{
    title: '人员管理管理',
      path: '/home/personal1/student',
  }],
  student : [{
    title: '会员管理',
      path: '/home/personal1/student',
  }],
  teacher : [{
    title: '教师管理',
      path: '/home/personal1/teacher',
  }],
  testMember : [{
    title: '试听人员',
      path: '/home/personal1/testMember',
  }]
};


// 学生详情
let detailMeta = [{
  title: '学生详情',
  path: '/home/detail/students',
  type: 'students'
},
  {
    title: '教师详情',
    path: '/home/detail/teachers',
    type: 'teachers'
  }
];
// 上课管理
let classMeta = [{
  title: '上课管理',
  path: '/home/class/classRecords'
}];
// 上课记录
let classMetaRecordMeta = [{
  title: '上课记录',
  path: '/home/class/classRecords'
}];
//上课记录详情
let recordsDetailMeta = [{
  title: '记录详情',
  path: '/home/recordsDetail'
}];
// 上课排班
let classMetaClassAssignMeta = [{
  title: '上课排班'
}];
let classMetaClassLeaveNotes = [{
  title: '请假记录'
}];

let classMetaClassTestNotes = [{
  title: '试听记录'
}];

// 活动管理
let activeMeta = [{
  title: '活动课程管理',
  path: '/home/active'
},
  {
    title: '活动课程',
    path: '/home/active'
  }
];
// 活动详情
let activeDetailMeta = [{
  title: '活动详情'
}];

// 考勤管理
let attenceMeta = [{
  title: '考勤管理',
  path: '/home/attence/record'
}];
// 考勤记录
let attenceRecordMeta = [{
  title: '考勤记录',
  path: '/home/attence/record'
}];
// 考勤排班
let attenceAssignMeta = [{
  title: '考勤排班'
}];
// 排班设置
let classSettingMeta = [{
  title: '排班设置'
}];
// 新增排班
let newResort = [{
  title: '新增排班'
}];

// 系统管理
let systemMeta = [{
  title: '系统管理',
  path: '/home/system/account'
}];
// 教室设置
let classSetting = [{
  title: '教室设置',
  path: '/home/system/classroomSetting'
}];
// 班级设置
let systemClassSettingMeta = [{
  title: '班级设置',
  path: '/home/system/systemClassSetting'
}];
let accountMeta = [{
  title: '账号设置',
  path: '/home/system/account'
}];
let oprMeta = [{
  title: '操作记录',
  path: '/home/system/oprRecord'
}];


let personalMeta =  {};
personalMeta.personal = indexMeta.concat(personal.personal);
let _personalMeta = [];
_personalMeta = personalMeta.personal;
personalMeta.student = _personalMeta.concat(personal.student);
personalMeta.teacher = _personalMeta.concat(personal.teacher);
personalMeta.testMember = _personalMeta.concat(personal.testMember);

classMeta = indexMeta.concat(classMeta);
activeMeta = indexMeta.concat(activeMeta);
attenceMeta = indexMeta.concat(attenceMeta);
systemMeta = indexMeta.concat(systemMeta);

detailMeta = personal.student.concat(detailMeta);

classMetaRecordMeta = classMeta.concat(classMetaRecordMeta);
classMetaClassAssignMeta = classMeta.concat(classMetaClassAssignMeta);
classMetaClassLeaveNotes = classMeta.concat(classMetaClassLeaveNotes);
classMetaClassTestNotes = classMeta.concat(classMetaClassTestNotes);

recordsDetailMeta = classMeta.concat(recordsDetailMeta);
activeDetailMeta = activeMeta.concat(activeDetailMeta);

attenceRecordMeta = attenceMeta.concat(attenceRecordMeta);
attenceAssignMeta = attenceMeta.concat(attenceAssignMeta);
classSettingMeta = attenceMeta.concat(classSettingMeta);
newResort = classSettingMeta.concat(newResort);

systemClassSettingMeta = systemMeta.concat(systemClassSettingMeta);
classSetting = systemMeta.concat(classSetting);
accountMeta = systemMeta.concat(accountMeta);
oprMeta = systemMeta.concat(oprMeta);
export default {
  indexMeta,
  personalMeta,
  classMeta,
  activeMeta,
  attenceMeta,
  systemMeta,
  classSetting,
  accountMeta,
  oprMeta,
  detailMeta,
  classMetaRecordMeta,
  classMetaClassAssignMeta,
  classMetaClassLeaveNotes,
  classMetaClassTestNotes,
  recordsDetailMeta,
  activeDetailMeta,
  attenceRecordMeta,
  classSettingMeta,
  newResort,
  systemClassSettingMeta,
  attenceAssignMeta
};
