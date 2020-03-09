/**
 * Created by lidy on 2020/1/16.
 */
/*
函数，加法函数，用来得到精确的加法结果  
说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
调用：accAdd(arg1,arg2,d)  
返回值：两数相加的结果
*/
export function accAdd(arg1, arg2) {
  (arg1 = arg1.toString()), (arg2 = arg2.toString());
  var arg1Arr = arg1.split("."),
    arg2Arr = arg2.split("."),
    d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
    d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
  var maxLen = Math.max(d1.length, d2.length);
  var m = Math.pow(10, maxLen);
  var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
  var d = arguments[2];
  return typeof d === "number" ? Number(result.toFixed(d)) : result;
}
/*
函数：减法函数，用来得到精确的减法结果  
说明：函数返回较为精确的减法结果。 
参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
调用：accSub(arg1,arg2)  
返回值：两数相减的结果
*/
export function accSub(arg1, arg2) {
  return accAdd(arg1, -Number(arg2), arguments[2]);
}

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
export function accDiv(num1, num2) {
  var t1, t2, r1, r2;
  try {
    t1 = num1.toString().split(".")[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split(".")[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(num1.toString().replace(".", ""));
  r2 = Number(num2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以 arg2的精确结果
export function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  m += s1.split(".")[1].length;
  m += s2.split(".")[1].length;
  return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
}
