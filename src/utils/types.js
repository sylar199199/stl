/**
 * Created by lidy on 2019/12/30.
 */
const orderType = {
  title: "",
  actualPrice: 0, //实付
  courseType: 1, //课程类型
  coverText: "", //封面文字
  coverTextColor: "", //封面文字颜色
  coverType: 1, //封面类型
  imageUrl: "", //图片URL
  orderAmountTotal: 0, //下单汇豆金额
  orderNo: 0, //订单编号
  price: 0, //虚拟价格
  productName: "", //商品名
  subCourseCount: 0, //子课程个数
  tagCount: 0, //知识点数
  orderCurrencyAmountTotal: 0, //人民币金额
  foreignExchangeBean: 0, //汇豆金额
  chapterId: 0, //章节id
  orderCurrencyCode: "CNY", //付款货币符合
  priceCurrencyCode: "BEAN", //虚拟货币符合
  actualPriceCurrencyCode: "BEAN" //实付货币符合
};
const articleType = {
  bought: false, //是否购买
  chapterCount: 0, //分集数目
  chapterId: 0, //文章章节id，只有章节数目唯一时存在
  chapterList: [], //章节列表
  collected: false, //是否收藏
  coverText: "", //封面文字
  coverTextColor: "", //封面文字颜色
  coverType: 1, //封面类型 1 文字2 图片
  free: false, //是否免费
  gradeId: 1, //等级id 1 小学2 中学 3 大学
  id: 0, //课程id
  imageUrl: "", //封面图
  readingCount: 0, //课程阅读数目
  realBeanAmount: 0, //真实价格
  integer: 1, //文章状态:1 线上2 下架
  summary: "", //课程摘要
  tagCount: 0, //知识点数目
  tags: [], //知识点
  title: "", //课程标题
  virtualBeanAmount: 0 //虚拟价格
};

const videoType = {
  bought: false, //是否购买
  playInfoCount: 0, //分集数目
  playInfoList: [], //分集列表
  collected: false, //是否收藏
  coverText: "", //封面文字
  coverTextColor: "", //封面文字颜色
  coverType: 1, //封面类型 1 文字2 图片
  free: false, //是否免费
  gradeId: 1, //等级id 1 小学2 中学 3 大学
  id: 0, //课程id
  imageUrl: "", //封面图
  readingCount: 0, //课程阅读数目
  realBeanAmount: 0, //真实价格
  integer: 1, //文章状态:1 线上2 下架
  summary: "", //课程摘要
  tagCount: 0, //知识点数目
  tags: [], //知识点
  title: "", //课程标题
  virtualBeanAmount: 0 //虚拟价格
};
export {orderType, articleType, videoType};
