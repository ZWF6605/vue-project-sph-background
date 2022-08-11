<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px"
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
          <el-button type="warning" icon="el-icon-edit" size="mini"
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
      style="margin-top: 20px; textAlign: center"
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
    handleSizeChange(limit){
      //整理参数
      this.limit=limit
      this.getPageList()
    }
  },
  //组件一挂载完毕发请求
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
</style>