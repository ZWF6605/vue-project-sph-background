<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 
      表格组件 
      data:表格组件将来需要展示的数据---数组类型
      border：是给表格添加边框

      column属性
      label：显示的标题---string
      width：对应列的宽度
      align：标题的对齐方式
      prop:对应列内容的字段名

      注意1：elementUI当中的table组件，展示的数据是以一列一列进行展示数据
    -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="row"
          ><img :src="row.logoUrl" alt="" style="width: 100px; height: 100px"
        /></template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="row"
          ><img :src="row.logoUrl" />
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTrademark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"

      当前第几页、数据总条数、每一页展示的条数、代表可以设置每一页展示多少条数据、连续页码数(按顺序对应以下配置)
      layout：可以实现分页器布局
      -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      layout="prev, pager, next,jumper,->,sizes, total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 
      对话框
      :visible.sync:控制对话框显示与隐藏用的
       -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 展示表单元素 model属性：把表单的数据收集到data上，将来表单验证也需要这个属性-->
      <el-form :model="tmForm" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称：" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO：" label-width="100px" prop="logoUrl">
          <!-- 
            这里收集数据不能使用v-model，因为不是表单元素
            action：设置图片上传的地址
            :on-success:可以检测到图片上传成功，当图片上传成功会执行一次
            :before-upload:可以在上传图片之前，会执行一次
             -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      //代表分页器第几页
      page: 1,
      //当前页数展示数据的条数
      limit: 3,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //对话框控制显示否
      dialogFormVisible: false,
      //收集品牌信息：对象身上的属性不能随意写，需要看接口文档
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证的规则
      //require:必须要校验字段（跟前面的五角星有关系） message 提示信息  trigger：用户行为设置（时间的设置blur、change）
      rules: {
        //品牌名称的验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //品牌名称长度2-10 文本变化时就会触发
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        //品牌logo的验证规则
        logoUrl: [{ required: true, message: "请选择品牌logo" }],
      },
    };
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      //解构出参数
      const { page, limit } = this;
      //获取品牌列表的数据
      //向服务器发请求的时候，函数需要携带参数，因此在data中初始化两个字段，代表要带给服务器传递的参数
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //当分页器的某一页需要展示数据条数发生变化时会触发
    handleSizeChange(limit) {
      //整理参数
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌按钮
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      //清空数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改品牌
    updateTrademark(row) {
      this.dialogFormVisible = true;
      //row:当前用户选中这个品牌的信息
      //将已有的品牌信息赋值给tmForm进行展示
      //也就是tmForm存储即为服务器返回品牌信息
      this.tmForm = { ...row.row };
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res是上传成功之后返回的前端数据
      //file是上传你成功之后服务器返回的前端数据
      //收集品牌图片的数据，因为将来要带给服务器
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加或者修改
    addOrUpdateTrademark() {
      //当全部验证手段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          //关闭对话框
          this.dialogFormVisible = false;
          //发请求（添加|修改品牌）
          let result = await this.$API.trademark.reqAddOrUpdateTrademark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出信息：添加成功||修改成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            //添加或者修改品牌成功之后，需要再次获取品牌列表进行展示
            //如果添加品牌：停留在第一页 反之当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        }else{
          console.log("error submit！！");
          return false
        }
      });
    },
  },
  //组件一挂载完毕发请求
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>