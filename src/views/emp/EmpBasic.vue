<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input prefix-icon="el-icon-search"
                  placeholder="请输入员工名进行搜索..."
                  v-model="empName"
                  @keydown.enter.native="initEmps"
                  clearable
                  size="small"
                  @clear="initEmps"
                  :disabled="showAdvanceSearchVisible"
                  style="width: 300px;margin-right: 10px"></el-input>
        <el-button size="small" type="primary" icon="el-icon-search"
                   @click="initEmps" :disabled="showAdvanceSearchVisible">搜索
        </el-button>

        <el-button type="primary" size="small"
                   @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
          <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
             aria-hidden="true"></i>
          高级搜索
        </el-button>
      </div>
      <div>
        <el-upload
            style="display: inline-flex;margin-right: 10px"
            :show-file-list="false"
            :headers="headers"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="importDataDisabled"
            action="/employee/basic/import">
          <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled" size="small">
            {{ importDataBtnText }}
          </el-button>
        </el-upload>

        <el-button @click="exportsData" type="success" size="small" icon="el-icon-download">
          导出数据
        </el-button>
        <el-button @click="showAddEmpView" size="small" type="primary" icon="el-icon-plus">
          添加用户
        </el-button>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px">
        <el-row>
          <el-col :span="5">
            政治面貌:
            <el-select v-model="searchValue.politicId"
                       placeholder="政治面貌" size="mini"
                       style="width: 130px">
              <el-option
                  v-for="item in politicsstatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            民族:
            <el-select v-model="searchValue.nationId"
                       placeholder="民族" size="mini" style="width: 130px">
              <el-option
                  v-for="item in nations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职位:
            <el-select v-model="searchValue.posId" placeholder="职位" size="mini" style="width: 130px">
              <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职称:
            <el-select v-model="searchValue.jobLevelId"
                       placeholder="职称" size="mini"
                       style="width: 130px">
              <el-option
                  v-for="item in joblevels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            聘用形式:
            <el-radio-group v-model="searchValue.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同">劳务合同</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="5">
            所属部门:
            <el-popover
                placement="bottom"
                title="请选择部门"
                width="200"
                trigger="manual"
                v-model="popVisible2">
              <el-tree :data="allDeps"
                       :props="defaultProps" default-expand-all
                       @node-click="searchHandleNodeClick"></el-tree>
              <div slot="reference"
                   style="width: 130px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 24px;
                         border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                   @click="showDepView2">
                {{ inputDepName }}
              </div>
            </el-popover>

          </el-col>
          <el-col :span="10">
            入职日期:
            <el-date-picker
                v-model="searchValue.beginDateScope"
                size="mini"
                type="daterange"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="small" @click="EmpResets">清空</el-button>
            <el-button size="small" type="primary" icon="el-icon-search"
                       @click="initEmps('advanced')">搜索
            </el-button>
          </el-col>
        </el-row>

      </div>
    </transition>

    <div style="margin-top: 10px">
      <el-table
          :data="emps"
          stripe
          v-loading="loading"
          element-loading-text="正在加载..."
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="88">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="75">
        </el-table-column>
        <el-table-column
            prop="birthday"
            align="left"
            width="100"
            label="出生日期">
        </el-table-column>
        <el-table-column
            prop="idCard"
            align="left"
            width="175"
            label="身份证号码">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            width="80"
            label="婚姻状况">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            width="50"
            label="民族">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            width="80"
            label="籍贯">
        </el-table-column>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            width="130px">
        </el-table-column>
        <el-table-column
            prop="email"
            align="left"
            width="185"
            label="电子邮件">
        </el-table-column>
        <el-table-column
            prop="phone"
            align="left"
            width="120"
            label="电话号码">
        </el-table-column>
        <el-table-column
            prop="address"
            align="left"
            width="280"
            label="联系地址">
        </el-table-column>
        <el-table-column
            prop="department.name"
            align="left"
            width="100"
            label="所属部门">
        </el-table-column>
        <el-table-column
            prop="position.name"
            width="100"
            label="职位">
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            width="110"
            label="职称">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            align="left"
            width="100"
            label="聘用形式">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            label="最高学历">
        </el-table-column>
        <el-table-column
            prop="school"
            align="left"
            width="150"
            label="毕业院校">
        </el-table-column>
        <el-table-column
            prop="specialty"
            align="left"
            width="150"
            label="专业">
        </el-table-column>
        <el-table-column
            prop="workState"
            align="left"
            width="70"
            label="在职状态">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            align="left"
            width="110"
            label="入职日期">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            align="left"
            width="110"
            label="转正日期">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            align="left"
            width="110"
            label="合同起始日期">
        </el-table-column>
        <el-table-column
            prop="endContract"
            align="left"
            width="110"
            label="合同截止日期">
        </el-table-column>
        <el-table-column
            align="left"
            width="110"
            label="合同期限">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            width="200"
            label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditView(scope.row)" style="padding: 5px" size="mini">编辑</el-button>

            <el-button style="padding: 5px" size="mini"
                       type="primary">查看高级资料
            </el-button>
            <el-button @click="deleteEmp(scope.row)" style="padding: 5px" size="mini"
                       type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页-->
      <div style="display: flex;justify-content: center;margin-top: 10px">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <!--    添加员工-->
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <el-form :model="emp" :rules="rules" ref="empForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名：" prop="name">
                <el-input size="mini" style="width: 150px" v-model="emp.name" placeholder="请输入员工姓名"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别：" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                    v-model="emp.birthday"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px"
                    placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌：" prop="politicId">
                <el-select v-model="emp.politicId"
                           placeholder="政治面貌" size="mini" style="width: 200px">
                  <el-option
                      v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族：" prop="nationId">
                <el-select v-model="emp.nationId"
                           placeholder="民族" size="mini" style="width: 150px">
                  <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯：" prop="nativePlace">
                <el-input size="mini" style="width: 120px" v-model="emp.nativePlace" placeholder="请输入籍贯"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱：" prop="email">
                <el-input size="mini" style="width: 150px" v-model="emp.email" placeholder="请输入电子邮箱"
                          prefix-icon="el-icon-message"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址：" prop="address">
                <el-input size="mini" style="width: 200px" v-model="emp.address" placeholder="请输入联系地址"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位：" prop="posId">
                <el-select v-model="emp.posId" placeholder="职位"
                           size="mini" style="width: 150px">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称：" prop="jobLevelId">
                <el-select v-model="emp.jobLevelId"
                           placeholder="职称" size="mini" style="width: 150px">
                  <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门：" prop="departmentId">
                <el-popover
                    placement="right"
                    title="请选择部门"
                    width="200"
                    trigger="manual"
                    v-model="popVisible">
                  <el-tree :data="allDeps"
                           :props="defaultProps" default-expand-all
                           @node-click="handleNodeClick"></el-tree>
                  <div slot="reference"
                       style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 24px;
                         border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                       @click="showDepView">
                    {{ inputDepName }}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码：" prop="phone">
                <el-input size="mini" style="width: 200px" v-model="emp.phone" placeholder="请输入电话号码"
                          prefix-icon="el-icon-phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号：" prop="workID">
                <el-input size="mini" style="width: 150px" v-model="emp.workID" placeholder="请输入工号"
                          prefix-icon="el-icon-edit" disabled>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历：" prop="tiptopDegree">
                <el-select v-model="emp.tiptopDegree"
                           placeholder="学历" size="mini" style="width: 150px">
                  <el-option
                      v-for="item in tiptopDegrees"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校：" prop="school">
                <el-input size="mini" style="width: 150px" v-model="emp.school" placeholder="请输入毕业院校"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称：" prop="specialty">
                <el-input size="mini" style="width: 200px" v-model="emp.specialty" placeholder="请输入专业名称"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期：" prop="beginDate">
                <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转正日期："
                            prop="conversionTime">
                <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期："
                            prop="beginContract">
                <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同截止日期："
                            prop="endContract">
                <el-date-picker
                    v-model="emp.endContract"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="合同截止日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码：" prop="idCard">
                <el-input size="mini" style="width: 180px" v-model="emp.idCard" placeholder="请输入身份证号码"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式：" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况：" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="doAddEmp" size="small">确 定</el-button>
          </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      searchValue: {
        politicId: null,
        nationId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        departmentId: null,
        beginDateScope: null
      },
      showAdvanceSearchVisible: false,

      headers: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,
      title: '',
      emps: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: '',
      dialogVisible: false,
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      popVisible: false,
      popVisible2: false,
      allDeps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      inputDepName: '',
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      emp: {
        id: null,
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '在职',
        workID: '',
        contractTerm: null,
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: null
      },
      rules: {
        name: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          message: '身份证号码格式不正确',
          trigger: 'blur'
        }],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请输入民族', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        politicId: [{
          required: true, message: '请输入政治面貌',
          trigger: 'blur'
        }],
        email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
        departmentId: [{
          required: true, message: '请输入部门名称',
          trigger: 'blur'
        }],
        jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
        posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
        engageForm: [{
          required: true, message: '请输入聘用形式',
          trigger: 'blur'
        }],
        tiptopDegree: [{
          required: true, message: '请输入学历',
          trigger: 'blur'
        }],
        specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
        beginDate: [{
          required: true, message: '请输入入职日期',
          trigger: 'blur'
        }],
        workState: [{
          required: true, message: '请输入工作状态',
          trigger: 'blur'
        }],
        workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
        contractTerm: [{
          required: true, message: '请输入合同期限',
          trigger: 'blur'
        }],
        conversionTime: [{
          required: true, message: '请输入转正日期',
          trigger: 'blur'
        }],
        notWorkDate: [{
          required: true, message: '请输入离职日期',
          trigger: 'blur'
        }],
        beginContract: [{
          required: true, message: '请输入合同起始日期',
          trigger: 'blur'
        }],
        endContract: [{
          required: true, message: '请输入合同结束日期',
          trigger: 'blur'
        }],
        workAge: [{
          required: true, message: '请输入工龄', trigger:
              'blur'
        }],
      }
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions()
  },
  methods: {
    EmpResets(){
      this.searchValue=[]
      this.inputDepName = '';
    },
    showDepView2(){
      this.popVisible2 = !this.popVisible2;
    },
    searchHandleNodeClick(data) {
      this.inputDepName = data.name;
      this.searchValue.departmentId = data.id;
      this.popVisible2 = !this.popVisible2;
    },

    handleNodeClick(data) {
      this.inputDepName = data.name;
      this.emp.departmentId = data.id;
      this.popVisible = !this.popVisible;
    },
    showDepView() {
      this.popVisible = !this.popVisible;
    },

    onSuccess() {
      this.importDataBtnIcon = 'el-icon-upload2'
      this.importDataBtnText = '导入数据';
      this.initEmps();
      this.importDataDisabled = false;

    },
    onError() {
      this.importDataBtnIcon = 'el-icon-upload2'
      this.importDataBtnText = '导入数据';
      this.importDataDisabled = false;
    },
    beforeUpload() {
      this.importDataBtnIcon = 'el-icon-loading'
      this.importDataBtnText = '正在导入';
      this.importDataDisabled = true;
    },
    exportsData() {
      this.downloadRequest('/employee/basic/export');
    },
    showEditView(data) {
      this.title = '编辑员工';
      this.inputDepName = data.department.name
      this.initPositions()
      this.emp = data;
      this.dialogVisible = true;

    },
    deleteEmp(data) {
      this.$confirm('此操作将永久删除 ' + data.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/employee/basic/' + data.id).then(resp => {
          if (resp) {
            this.initEmps()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    doAddEmp() {
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.putRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        })
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.postRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        })
      }
    },

    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    getMaxWorkID() {
      this.getRequest('/employee/basic/maxWorkID').then(resp => {
        if (resp) {
          this.emp.workID = resp.obj;
        }
      })
    },
    initData() {
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem("nations", JSON.stringify(resp));
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"))
      }
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
          }
        })
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"))
      }
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"))
      }
      if (!window.sessionStorage.getItem("allDeps")) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("allDeps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("allDeps"))
      }
    },

    showAddEmpView() {
      this.emp = [];
      this.inputDepName = ''
      this.title = '添加员工'
      this.dialogVisible = true;
      this.getMaxWorkID();
      this.initPositions();
    },


    //首页
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps();
    },
    initEmps(type) {
      this.loading = true;
      let url = '/employee/basic/?currentPage=' + this.currentPage + '&size=' + this.size;
      if(type && type=='advanced'){
        if (this.searchValue.politicId) {
          url += '&politicId=' + this.searchValue.politicId;
        }
        if (this.searchValue.nationId) {
          url += '&nationId=' + this.searchValue.nationId;
        }
        if (this.searchValue.jobLevelId) {
          url += '&jobLevelId=' + this.searchValue.jobLevelId;
        }
        if (this.searchValue.posId) {
          url += '&posId=' + this.searchValue.posId
        }
        if (this.searchValue.engageForm) {
          url += '&engageForm=' + this.searchValue.engageForm;
        }
        if (this.searchValue.departmentId) {
          url += '&departmentId=' + this.searchValue.departmentId;
        }
        if (this.searchValue.beginDateScope) {
          url += '&beginDateScope=' + this.searchValue.beginDateScope;
        }
      } else {
        url += '&name=' + this.empName;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    }
  }

}
</script>

<style>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}

</style>