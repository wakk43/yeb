<template>
  <div>
    <div>
      <el-table
          :data="emps"
          stripe
          v-loading="loading"
          element-loading-text="正在加载..."
          size="mini">
        <el-table-column
            type="selection"
            align="left"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            align="left"
            width="120">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="120">
        </el-table-column>
        <el-table-column
            prop="email"
            label="电子邮件"
            align="left"
            width="200">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            align="left"
            width="120">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="所属部门"
            align="left"
            width="120">
        </el-table-column>
        <el-table-column
            label="所属部门"
            align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{ scope.row.salary.basicSalary }}
                    </td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{ scope.row.salary.trafficSalary }}
                    </td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{ scope.row.salary.lunchSalary }}
                    </td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>{{ scope.row.salary.bonus }}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{ scope.row.salary.pensionPer }}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{ scope.row.salary.pensionBase }}
                    </td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{ scope.row.salary.medicalPer }}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{ scope.row.salary.medicalBase }}
                    </td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>
                      {{ scope.row.salary.accumulationFundPer }}
                    </td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>
                      {{ scope.row.salary.accumulationFundBase }}
                    </td>
                  </tr>
                </table>
              </div>
              <el-tag>{{ scope.row.salary.name }}</el-tag>
            </el-tooltip>
            <el-tag v-else>暂未设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center">
          <template slot-scope="scope">

            <el-popover
                placement="left"
                title="编辑工资账套"
                @show="showPop(scope.row.salary)"
                @hide="hidePop(scope.row)"
                width="200"
                trigger="click">
            <div>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in salaries"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </div>
            <el-button slot="reference" type="danger">修改工资账套</el-button>
            </el-popover>

          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: center;margin-top: 10px">
        <el-pagination
            background
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            @size-change="sizeChange"
            @current-change="currentChange"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "SalSobCfg",
  data() {
    return {
      value:'',
      salaries:[],
      emps: [],
      total: 0,
      currentPage: 1,
      currentSize: 10,
      loading:false
    }
  },
  methods: {
    hidePop(data){
      if (this.value && this.value != data.salary.id) {
        this.putRequest('/salary/sobcfg/?eid=' + data.id + '&sid=' + this.value).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }
      
    },
    showPop(data){
      if(data){
        this.value=data.id;
      }else {
        this.value = null;
      }
    },
    initSalaries() {
      this.getRequest('/salary/sobcfg/salaries').then(resp=>{
        if(resp){
          this.salaries=resp;
        }
      })
    },
    sizeChange(size) {
      this.currentSize = size;
      this.initEmps();
    },
    currentChange(page) {
      this.currentPage = page;
      this.initEmps();
    },
    initEmps() {
      this.loading=true
      this.getRequest('/salary/sobcfg/?currentPage=' + this.currentPage + '&size=' + this.currentSize ).then(resp => {
        if (resp) {
          this.loading=false
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    }
  },
  mounted() {
    this.initEmps()
    this.initSalaries()

  }
}
</script>

<style scoped>

</style>