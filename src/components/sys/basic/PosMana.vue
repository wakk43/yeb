<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addPosInput"
          placeholder="添加职位..."
          prefix-icon="el-icon-plus"
          @keydown.enter.native="addpositions"
          v-model="pos.name">
      </el-input>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="addpositions">添加</el-button>
    </div>
    <div class="posManaMain">
      <el-table
          :data="positions"
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
            label="职位"
            width="160">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
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
        title="编辑职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table class="uptetable">
          <tr>
            <td>
              <el-tag>职位名称</el-tag>
            </td>
            <td>
              <el-input v-model="upatePos.name" size="small" class="updateJlInput"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>是否启用</el-tag>
            </td>
            <td>
              <el-switch
                  style="margin-left: 6px"
                  v-model="upatePos.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="已启用"
                  inactive-text="未启用">
              </el-switch>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="doUpdate" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      upatePos: {
        name: '',
        enabled:''
      },
      positions: [],
      multipleSelection: [],
      dialogVisible: false
    }

  },
  methods: {
    //批量删除
    deleteMany() {
      this.$confirm('此操作将永久删除该 【' + this.multipleSelection.length + '】 条职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
          if (resp) {
            this.initPositions();
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
    //修改
    doUpdate() {
      this.dialogVisible = false
      this.putRequest('/system/basic/pos/', this.upatePos).then(resp => {
        if (resp) {
          this.initPositions()
        }
      })
    },
    //新增
    addpositions() {
      if (this.pos.name) {
        this.postRequest('/system/basic/pos/', this.pos).then(resp => {
          if (resp) {
            this.initPositions();
            this.pos.name = ''
          }
        })
      } else {
        this.$message.error("职位名称不能为空！");
      }

    },
    //编辑
    handleEdit(index, data) {
      Object.assign(this.upatePos, data)
      this.upatePos.createDate = '';
      this.dialogVisible = true

    },
    //删除
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除该 【' + data.name + '】 职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },

    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    }
  },
  mounted() {
    this.initPositions();
  }


}
</script>

<style>
.uptetable tr td{
  margin-bottom: 20px;
  height: 50px;
}
.addPosInput {
  width: 300px;
  margin-right: 8px
}

.posManaMain {
  margin-top: 10px;
}

.updatePosInput {
  width: 180px;
  margin-left: 8px;

}

</style>