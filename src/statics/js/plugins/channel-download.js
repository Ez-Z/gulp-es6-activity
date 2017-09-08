function chaDownload(fromType,webUrl){

  //判断手机系统
  var phoneSystem = "";
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    phoneSystem = "ios";
  }else if (/(Android)/i.test(navigator.userAgent)) {
    phoneSystem = "Android";
  }else{
    phoneSystem = "other";
  }

  if (phoneSystem == "ios") {
    location.href= webUrl +"/applink.html";
  }else {
      location.href= "http://down.qbm360.com/tuiguang/qbm_" + fromType + ".apk";
  }
}
