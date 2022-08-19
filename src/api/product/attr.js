//平台属性管理模块的请求文件
import request from '@/utils/request'

//获取一级分类数据的接口
// /admin/product/getCategory1  get
export const reqCategory1List = ()=>request({
    url:"/admin/product/getCategory1",
    method:'get'
})

//获取二级分类数据的接口
// /admin/product/getCategory2/{category1id} get
export const reqCategory2List =(category1id)=>request({
    url:`/admin/product/getCategory2/${category1id}`,
    method:"get"
})

//获取三级分类数据的接口
// /admin/product/getCategory3/{category2id} get
export const reqCategory3List =(category2id)=>request({
    url:`/admin/product/getCategory3/${category2id}`,
    method:"get"
})

//获取平台基础属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrList = (category1Id,category2Id,category3Id)=>request({
    url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method:'get'
})