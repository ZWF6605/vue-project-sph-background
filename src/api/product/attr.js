//平台属性管理模块的请求文件
import request from '@/utils/request'

//获取一级分类数据的接口
// /admin/product/getCategory1  get
export const reqCategory1List = () => request({
  url: "/admin/product/getCategory1",
  method: 'get'
})

//获取二级分类数据的接口
// /admin/product/getCategory2/{category1id} get
export const reqCategory2List = (category1id) => request({
  url: `/admin/product/getCategory2/${category1id}`,
  method: "get"
})

//获取三级分类数据的接口
// /admin/product/getCategory3/{category2id} get
export const reqCategory3List = (category2id) => request({
  url: `/admin/product/getCategory3/${category2id}`,
  method: "get"
})

//获取平台基础属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

//添加属性与属性值接口
// /admin/product/saveAttrInfo post
export const reqAddOrUpdateAttr = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'post',
  data
})
/*
    {
        "attrName":"string",//属性名
        "attrValueList":[   //属性值，因为属性值可以多个，因此需要的是数组
            {
                "attrId":0, //属性ID
                "valueName":"" //属性值
            }
        ],
        "categoryId":0,  //category3Id
        "categoryLevel":3
    }
*/
