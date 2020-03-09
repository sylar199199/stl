import request from "@/utils/axios";

const getAliOSSCreds = params => {
  return request({
    url: "/media/getOssToken",
    method: "get",
    params
  });
};
const beforeAvatarUpload = file => {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt1M = file.size / 1024 / 1024 <= 1;
  if (!isLt1M) {
    this.$message.error("上传头像图片大小不能超过 1MB!");
  }
  if (!isJPG && !isPNG) {
    this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
  }
  return isLt1M && (isPNG || isJPG);
};

const generateUUID = () => {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = "xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

export const upLoad = {
  uploader: (item, fileType) => {
    let params = {};
    params.type = fileType;
    if (!beforeAvatarUpload(item)) {
      return;
    }
    return getAliOSSCreds(params).then(res => {
      let oss = require("ali-oss");
      let client = new oss({
        region: res.region,
        secure: true,
        accessKeyId: res.accessKeyId,
        accessKeySecret: res.accessKeySecret,
        stsToken: res.securityToken,
        bucket: res.bucket,
        endpoint: res.endpoint
      });
      let suxfile = item.name.split(".");
      let key = res.dir + "/" + generateUUID() + "." + suxfile[1];
      return client.put(key, item);
    });
  }
};

export default {
  upLoad
};
