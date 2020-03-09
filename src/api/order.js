import request from "@/utils/axios";

//获取汇豆购买列表
export function getBuyHuidouList(params) {
  return request({
    url: "/buyBeanAmount/list",
    method: "get",
    params
  });
}

//获取订单信息
export function getOrderDetail(data) {
  return request({
    url: "/order/save",
    method: "post",
    data
  });
}

//获取支付返回订单信息
export function getOrderFrom(data) {
  return request({
    url: "/order/pay",
    method: "post",
    data
  });
}

// 查询订单支付结果
export function getPayResult(params) {
  return request({
    url: "/order/alipay/getPayResult",
    method: "get",
    params
  });
}

// 查询订单模型
export function getOrderType(params) {
  return request({
    url: "/order/getPayOrder",
    method: "get",
    params
  });
}

// 查询订单列表
export function getOrderList(params) {
  return request({
    url: "/order/list",
    method: "get",
    params
  });
}

// 获取已购课程列表
export function getAlreadyBoughtCourse(params) {
  return request({
    url: "/alreadyBoughtCourse/list",
    method: "get",
    params
  });
}

// 取消订单
export function cancelOrder(data) {
  return request({
    url: "/order/cancel",
    method: "put",
    data
  });
}

// 删除订单
export function deleteOrder(params) {
  return request({
    url: "/order/delete",
    method: "delete",
    params
  });
}

// 获取订单详情
export function getDetail(params) {
  return request({
    url: "/order/getOrderDetail",
    method: "get",
    params
  });
}

// 获取待支付订单数量
export function getUnPayCount(params) {
  return request({
    url: "/order/getWaitPayOrderCount",
    method: "get",
    params
  });
}

//监听微信订单状态
export function getWeixinOrderStatus(params) {
  return request({
    url: "/order/listenOrderState",
    method: "get",
    timeout: 2000, //2秒
    params
  });
}

//捕获paypal订单
export function getPaypalOrderStatus(params) {
  return request({
    url: "/order/paypal/capture",
    method: "get",
    params
  });
}

//验证paypal订单
export function verifyOrderStatus(params) {
  return request({
    url: "/order/paypal/verify",
    method: "get",
    params
  });
}
