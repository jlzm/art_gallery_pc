<template>
  <!-- 废弃 -->
  <div class="addNewResort">
    <el-form :inline="true" :model="addForm" class="form-inline" ref="">
      <el-form-item label="班次名称">
        <el-select v-model="addForm.className" placeholder="请选择" size="small">
          <el-option
            v-for="item in addForm.classNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="addForm.classes" placeholder="请选择" size="small">
          <el-option
            v-for="item in addForm.classesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small">查询</el-button>
        <el-button type="primary" icon="el-icon-delete" size="small" plain>重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="teacherForm" class="form-inline" ref="">
      <el-form-item label="老师姓名">
        <el-input v-model="addForm.teacherName" placeholder="请输入" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small">查询</el-button>
        <el-button type="primary" icon="el-icon-delete" size="small" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'addNewResort',
    mounted() {
      this.getResort();
    },
    data() {
      return {
        addForm: {
          className: '',
          classNameOptions: []
        }
      };
    },
    methods: {
      // 获取班次名称及id
      getResort() {
        this.classNameOptions = [];
        this.$axios.post('/getWorkTimeConfigList')
          .then(res => {
            if (res && res.data && res.data.length) {
              this.classNameOptions = res.data;
            }
          });
      },
    }
  };
</script>

<style scope>

</style>
