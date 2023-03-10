<template>
  <div>
    <div>
      <el-input size="small" v-model="jl.name" style="width: 300px"
                prefix-icon="el-icon-plus" placeholder="添加职称..."></el-input>
      <el-select v-model="jl.titleLevel" placeholder="职称等级"
                 size="small" style="margin-left: 6px;margin-right: 6px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addJobLevel">添加</el-button>
    </div>

    <div style="margin-top: 10px">
      <el-table
          :data="jls"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="70">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称名称"
            width="160">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称等级"
            width="180px">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建日期"
            width="180px">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用"
            width="120px">
          <template slot-scope="scope">
          <el-switch
              v-model="scope.row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled>
          </el-switch>

          </template>
        </el-table-column>

        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button style="margin-top: 10px" type="danger" size="small"
               :disabled="this.multipleSelection.length==0" @click="deleteMany">批量删除
    </el-button>

    <el-dialog
        title="编辑职称"
        :visible.sync="dialogVisible"
        width="30%" >
      <table class="uptetable">
        <tr>
          <td>
            <el-tag>职称名称</el-tag>
          </td>
          <td>
            <el-input v-model="updatejl.name" size="small" class="updateJlInput"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag>职称等级</el-tag>
          </td>
          <td>
            <el-select v-model="updatejl.titleLevel" placeholder="职称等级"
                       size="small" style="margin-left: 8px;margin-right: 6px">
              <el-option
                  v-for="item in titleLevels"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag>是否启用</el-tag>
          </td>
          <td>
            <el-switch
                style="margin-left: 6px"
                v-model="updatejl.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="已启用"
                inactive-text="未启用">
            </el-switch>
          </td>
        </tr>


      </table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="doUpdate"  size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JoblebelMana",
  data(){
    return{
      dialogVisible:false,
      multipleSelection:'',
      updatejl:{
        name:'',
        titleLevel:'',
        enabled:''
      },
      jl:{
        name:'',
        titleLevel:''
      },
      jls:[],
      titleLevels:[
        '正高级',
        '副高级',
        '初级',
        '中级',
        '高级',
      ]
    }
  },
  methods:{
    //修改
    doUpdate(){
      this.putRequest('/system/basic/joblevel/',this.updatejl).then(resp=>{
        if(resp){
          this.initJls();
          this.dialogVisible=false;
        }
      })
    },
    //编辑
    handleEdit(index, data) {
      Object.assign(this.updatejl, data)
      this.updatejl.createDate = '';
      this.dialogVisible=true;
    },
    //新增
    addJobLevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest('/system/basic/joblevel/',this.jl).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      } else {
        this.$message.error("字段不能为空！");
      }
    },
    //批量删除
    deleteMany() {
      this.$confirm('此操作将永久删除该 【' + this.multipleSelection.length + '】 条职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/basic/joblevel/' + ids).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    //批量删除获取
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除该 【' + data.name + '】 职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/joblevel/' + data.id).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    //首页查询
    initJls(){
      this.getRequest('/system/basic/joblevel/').then(resp=>{
        this.jls=resp;
        this.jl.name='';
        this.jl.titleLevel='';
      })
    }
  },
  mounted() {
    this.initJls()
  }

}
</script>

<style>

.uptetable tr td{
  margin-bottom: 20px;
  height: 50px;
}
.updateJlInput{
  width: 180px;
  margin-left: 8px;
}

</style>