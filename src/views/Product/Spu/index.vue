<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!show"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div>
        <el-button type="primary" icon="el-icon-plus">添加Spu</el-button>
        <el-table border>
          <el-table-column
            prop="index"
            align="center"
            width="80"
            label="序号"
          ></el-table-column>
          <el-table-column
            prop="prop"
            width="width"
            label="Spu名称"
          ></el-table-column>
          <el-table-column
            prop="prop"
            width="width"
            label="Spu描述"
          ></el-table-column>
          <el-table-column prop="prop" width="width" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮将来用hintbutton替换 -->
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange"
          @current-change="handleCurrentChange" -->
        <el-pagination
        style="text-align:center;"
          :current-page="6"
          :page-sizes="[3, 5, 10]"
          :page-size="3"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="20"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      show: true,
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的ID，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else if (level == 3) {
        this.category3Id = categoryId;
        //发请求获取平台属性的数据
        this.getSpuList();
      }
    },
    //获取spu列表数据的方法
    getSpuList() {},
  },
};
</script>

<style>
</style>