<template>
  <div class="mutil-cascader" :class="isLast &&  'last-child'" >
    <div class="panel">
      <ul>
        <li v-for="(item, index) in treeData" :key="index + item.label"
          class="menu-fa"
          :class="nextShow.pIndex === index && 'li-active'"
          @mouseenter="showNextChild(index)"
        >
          <div class="fa-label el-cascader-menu__item" :class="item.child && item.child.length && 'el-cascader-menu__item--extensible'">
            <!-- {{item.label}} -->
              <span v-if="!(item.child && item.child.length || isLast)">{{item.label}}</span>
              <el-checkbox :label="item.label" :checked="item.checked && !item.indeterminate" @change.native="changeCheck(index)"  :indeterminate="item.indeterminate" v-else></el-checkbox>
         
          </div>
          <mutil-cascader :tree="item.child"
            ref="child"
            @updateData = "updateData"
            v-if="item.child && item.child.length"
            :isLast ="!(item.child && item.child.length)"
            :showState ="nextShow"
            v-show="nextShow.pIndex === index && nextShow.show" 
           >
          </mutil-cascader>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mutilCascader',
  mounted () {
    if (this.tree) {
      // 校验当前状态
     this.$nextTick(() => {
        this.checkState()
     })
    }
  },
  props: {
    tree: {
      type: Array
    },
    showState: {
      type: Object
    }
  },
  data() {
    return {
      menuIndex: 0,
      showNext: false,
      nextShow: {
        pIndex: 0,
        show: false
      }
    }
  },
  computed: {
    isLast () {
      return this.tree && !this.tree.some((item) => {
        return item.child && item.child.length !== 0
      })
    },
    treeData () {
      return this.tree
    },
    allChildChecked() {
      return false
    }
  },
  methods: {
    showNextChild(index) {
      this.nextShow = {
        pIndex: index,
        show: true
      }
    },
    hideNextChild(index) {
      this.nextShow = {
        pIndex: index,
        show: false
      }
    },
    changeCheck(index) {
      try {
        let data = JSON.parse(JSON.stringify(this.treeData[index]))
        let allCheck = true
        let currentCheck = data.checked || false
        if (data.child && data.child.length) {
          data.indeterminate = false
          data.child.map((items) => {
            items.checked = !currentCheck
          })
          this.treeData[index].child = []
          this.$nextTick(() => {
            data.checked = (data.child && data.child[0] && data.child[0].checked) || false
            this.$set(this.treeData, index ,data)
            this.$emit('updateData', {
              data: this.treeData,
              index: this.showState.pIndex,
              checked: allCheck
            })
          })
          
          this.$forceUpdate()
        } else {
          this.treeData[index].checked = !this.treeData[index].checked
        }
        
      } catch(e) {

      }
      
    },
    // 更新数据
    updateData(item) {
      this.$emit('updateData', {
        data: this.treeData,
        index: (this.showState && this.showState.pIndex) || 0
      })
      // this.treeData[item.index].checked = item.checked
      this.treeData[item.index].child = item.data
      this.$forceUpdate()
    },
    checkState () {
      let data = JSON.parse(JSON.stringify(this.treeData))
      this.treeData.forEach((item, index) => {
        let type = this.checkType(item.child)
        if (type === 0) {
          this.$set(item, 'checked', true)
          // item.checked = true
          this.$set(item, 'indeterminate', false)
          // item.indeterminate = false
        } else if (type === 1) {
          this.$set(item, 'checked', false)
          this.$set(item, 'indeterminate', true)
          // item.checked = false
          // item.indeterminate = true
        }
      })
      // this.$set(this, 'treeData', data)
    },
    checkType(child) {
      const mapType = {
        all: 0,
        indeterminate: 1,
        none: 2
      }
      if (child && child.length) {
        let all = child.every((item) => {
          return item.checked
        })
        let none = child.every((item) => {
          return !item.checked
        })
        if (all) {
          return mapType.all
        } else if (none) {
          return mapType.none
        } else {
          return mapType.indeterminate
        }
      } else {
        return mapType.none
      }
    }
  },
  watch: {
  }
}
</script>

<style scope>
ul,li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.mutil-cascader {
  display: inline-block;
  vertical-align: top;
  height: 204px;
  /* overflow: hidden; */
  border-right: 1px solid #e4e7ed;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0;
  min-width: 160px;
  position: absolute;
  left: 161px;
}
.mutil-cascader .menu-fa {
  display: flex;
  /* position: relative; */
}
.mutil-cascader>.panel>ul {
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}
.mutil-cascader .menu-fa .fa-label{
  width: 160px;
  overflow: hidden;
}
.mutil-cascader .menu-fa .fa-label label {
  width: 100%;
}
.mutil-cascader .menu-fa .fa-label span{
  -moz-user-select:none;/*火狐*/
  -webkit-user-select:none;/*webkit浏览器*/
  -ms-user-select:none;/*IE10*/
  -khtml-user-select:none;/*早期浏览器*/
  user-select:none;
}
.last-child {
  top: 0;
}
</style>
