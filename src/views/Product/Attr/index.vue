<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="isShowTable=false"
          >添加属性
        </el-button>
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
            <template slot-scope="row"
              ><el-tag
                type="success"
                v-for="attrValue in row.row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              ></template
            ></el-table-column
          >
          <el-table-column align="center" prop="prop" label="操作" width="150">
            <template slot-scope="row">
              <el-button
                type="warning"
                icon="el-icon-edit"
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
      </div>
      <!-- 添加属性或者修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名 ">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }"
              ><el-input
                size="mini"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input></template
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="row"
              ><el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></el-button></template
          ></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
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
      //控制table表格显示与隐藏
      isShowTable: false,
      //收集新增属性|修改属性
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以多个，因此需要的是数组
        ],
        categoryId: 0, //category3Id
        categoryLevel: 3,
      },
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
    //获取平台属性的数据
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
    //添加属性值回调
    addAttrValue(){
      //向属性值的数组里添加元素
      this.attrInfo.attrValueList.push({
        //是相应属性的ID，目前没有相应的属性的id，所以undefined
        attrId:undefined,
        //相应属性值的名称
        valueName:'',
      })
    }
  },
};
</script>

<style>
</style>