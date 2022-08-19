<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus ">添加属性 </el-button>
      <!-- 表格：展示平台属性 -->
      <el-table style="width: 100%" border :data="attrList">
        <el-table-column
          prop="prop"
          label="序号"
          width="80"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="prop" label="属性值列表" width="width">
          <template slot-scope="row"><el-tag type="success" v-for="attrValue in row.row.attrValueList" :key="attrValue.id" style="margin:0px 10px">{{attrValue.valueName}}</el-tag></template
        ></el-table-column>
        <el-table-column align="center" prop="prop" label="操作" width="150">
          <template slot-scope="row">
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性的字段
      attrList: [],
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
        this.getAttrList();
      }
    },
    async getAttrList() {
      //当用户确定了三级数据的时候，可以向服务器发请求获取平台属性进行展示
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

<style>
</style>