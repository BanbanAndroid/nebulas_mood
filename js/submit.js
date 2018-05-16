window.onload = function() {
  var input = document.getElementById("img_input");
  var img_area = document.getElementById("img_area");
  if (typeof FileReader === "undefined") {
    input.setAttribute("disabled", "disabled");
  } else {
    input.addEventListener("change", readFile);
  }
  if (typeof webExtensionWallet === "undefined") {
    $("#noExtension").attr("style", "display:block;");
  } else {
    $("#message").attr("disabled", false);
    $("#uniquelabel").attr("disabled", false);
    $("#submitbutton").attr("disabled", false);
  }
};

function readFile() {
  var max_size = 3 * 1024;
  var file = this.files[0];
  var size = file.size;
  if (!/image\/\w+/.test(file.type)) {
    alert("image only please.");
    return false;
  }
  if (size > max_size * 1024) {
    alert("图片大小不能超过3M!");
    return false;
  }
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    var img = new Image();

    img.src = this.result;
    img_area.innerHTML = "";
    img_area.innerHTML =
      '<div class="sitetip">预览：</div><img id="pre_picture" src="' +
      img.src +
      '" alt=""/>';
  };
}

function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour=date.getHours();
  var minutes=date.getMinutes();
  var second=date.getSeconds();

  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate+ " "+hour+seperator2+minutes+seperator2+second;
  return currentdate;
}

function submitToBlockchain() {
  var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
  var nebPay = new NebPay();
  var dappAddress = "n1mr8YeUsFAhCn7jf484422Qq7WMsCmrtER";
  var img = new Image();
  img.src = $("#pre_picture")[0].src;
  (width = 640), //image resize
    (quality = 0.5); //image quality
  (canvas = document.createElement("canvas")),
    (drawer = canvas.getContext("2d"));
  canvas.width = width;
  canvas.height = width * (img.height / img.width);
  drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
  img.src = canvas.toDataURL("image/jpeg", quality);
  var message = $("#message").val();
  var theme = $("#uniquelabel").val();
  if (getByteLen(theme) == 0) {
    alert("标签不能为空");
    return;
  }
  if (getByteLen(message) == 0) {
    alert("内容不能为空");
    return;
  }
  var to = dappAddress;
  var value = "0";
  var callFunction = "save";
  var callArgs = [];
  callArgs.push(theme);
  callArgs.push(getNowFormatDate());
  callArgs.push(img.src);
  callArgs.push(message);
  console.log(callArgs);
  $("#submitbutton").val("发布中...");
  $("#submitbutton").attr("disabled", true);
  nebPay.call(to, value, callFunction, JSON.stringify(callArgs), {
    //使用nebpay的call接口去调用合约,
    listener: cbPush
  });
}
function cbPush(resp) {
  console.log("response of push: " + resp);
  $("#submitbutton").val("发布");
  $("#submitbutton").attr("disabled", false);
}
