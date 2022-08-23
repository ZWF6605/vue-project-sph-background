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
          @click="addAttr"
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
                @click="updateAttr(row)"
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
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
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要用到span和input进行来回的切换 -->
              <el-input
                size="mini"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span v-else @click="row.flag = true" style="display: block">{{
                row.valueName
              }}</span>
            </template></el-table-column
          >
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
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
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
      isShowTable: true,
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
    addAttrValue() {
      //向属性值的数组里添加元素
      this.attrInfo.attrValueList.push({
        //是相应属性的ID，目前没有相应的属性的id，所以undefined
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础指上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        //相应属性值的名称
        valueName: "",
        //flag竖向：给每一个属性添加一个标记flag，用户切换查看模式与编辑模式，好处是每一个属性值可以控制自己的模式切换
        //当前flag属性：响应式数据（数据变化视图跟着变化）
        flag: true,
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table显示与隐藏
      this.isShowTable = false;
      //清除数据
      //收集三级分类的ID
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以多个，因此需要的是数组
        ],
        categoryId: this.category3Id, //category3Id
        categoryLevel: 3,
      };
    },
    //修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面套数组，数组里面又套对象，因此需要使用深拷贝解决这类问题
      //深拷贝，浅拷贝在面试的时候出现频率很高，切记打到手写深拷贝与浅拷贝
      this.attrInfo = cloneDeep(row.row);
      //在修改某一个属性的时候，将相应的属性值元素添加上flag标记
      this.attrInfo.attrValueList.forEach(item=>{
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增property，这样书写的属性并非响应式属性
        //第一个参数：哪个对象 第二个参数：添加新的响应式属性 第三个参数：新的属性的属性值
        this.$set(item,'flag',false)
      })
    },
    //失去焦点的回调
    toLook(row) {
      //如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //需要将row从数组里面判断的时候去除
        //row为最新新增的属性值【数组的最新一个元素】
        //判断的时候需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      //row：形参是当前用户添加的最新的属性值
      //当前的编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
  },
};
</script>

<style>
</style>