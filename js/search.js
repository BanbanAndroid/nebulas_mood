var page = 1;
const pageSize = 16;
var needGet = 1;

var createItem = function(text) {
  var item =
    '<div class="item"><a class="example-image-link" href=' +
    text.picCode +
    ' data-lightbox="example-set" data-title="Click the right half of the image to move forward."><img class="example-image" src=' +
    text.picCode +
    ' alt="" /> </a><div class="content-item"><div class="title-item">' +
    text.theme +
    '</div><div class="time">' +
    text.time +
    '</div> <p class="info">' +
    text.description +
    '</p><p class="time">打赏地址：' +
    text.author +
    "</div></div>";
  $("#container").append(item);
};

var get = function(page, pageSize) {
  console.log("hahaha");
  var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
  var nebPay = new NebPay();
  var dappAddress = "n1mr8YeUsFAhCn7jf484422Qq7WMsCmrtER";
  var to = dappAddress;
  var value = "0";
  var callFunction = "getByPage";
  var callArgs = [];
  showLoading(3);
  callArgs.push(page);
  callArgs.push(pageSize);
  // nebPay.simulateCall(to, value, "getTotalPages", "[8]", {
  //   listener: pageFunction
  // });
  nebPay.simulateCall(to, value, callFunction, JSON.stringify(callArgs), {
    //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
    listener: dataSearch //指定回调函数
  });
};

var search = function() {
  var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
  var nebPay = new NebPay();
  var dappAddress = "n1mr8YeUsFAhCn7jf484422Qq7WMsCmrtER";
  var to = dappAddress;
  var value = "0";
  var callFunction = "getByKeyword";
  var callArgs = [];
  var search_content = $("#search_content").val();
  if (search_content == "") {
    alert("输入内容不能为空！");
    return false;
  }
  showLoading(2);
  callArgs.push($("#search_content").val());
  callArgs.push(16);
  nebPay.simulateCall(to, value, callFunction, JSON.stringify(callArgs), {
    //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
    listener: dataSingleSearch //指定回调函数
  });
};

var dataSearch = function(resp) {
  var result = resp.result;
  if (result.indexOf("Error") > -1||result=="[]") {
    $("#mask").attr("hidden", true);
    if (needGet) {
      toast("没有更多心情了");
    }
    needGet = 0;
    return;
  }
  $("#container").empty();
  result = JSON.parse(result);
  var tests = [];
  for (var i = 0; i < result.length; i++) {
    if (result[i].moodItem != null) {
      tests.push(result[i]);
    }
  }
  $.each(tests, function(i, v) {
    createItem(v.moodItem);
  });
  window.dispatchEvent(new Event("resize"));
};

var dataSingleSearch = function(resp) {
  var result = resp.result;
  if (result.indexOf("Error") > -1||result=="[]") {
    $("#mask").attr("hidden", true);
    if (needGet) {
      toast("没有搜索到对应内容");
    }
    needGet = 0;
    return;
  }
  result = JSON.parse(result);
  var tests = [];
  for (var i = 0; i < result.length; i++) {
    if (result[i].moodItem != null) {
      tests.push(result[i]);
    }
  }
  $("#container").empty();
  $.each(tests, function(i, v) {
    createItem(v.moodItem);
  });
  window.dispatchEvent(new Event("resize"));
};

$(function() {
  get(page, pageSize);
  $("#search").click(function() {
    search();
  });

  $("body").keydown(function() {
             if (event.keyCode == "13") {//keyCode=13是回车键
                 $('#search').click();
             }
         });

  $("#search_content").change(function() {
    if (this.value == "") {
      get(1, pageSize);
    }
  });


  $(window).scroll(function() {
    //已经滚动到上面的页面高度
    var scrollTop = $(this).scrollTop();
    //页面高度
    var scrollHeight = $(document).height();
    //浏览器窗口高度
    var windowHeight = $(this).height();
    //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
    if (scrollTop + windowHeight == scrollHeight) {
      if (needGet) {
        page++;
        get(page, pageSize);
      }
    }
  });

  $("#mask").bind("click", function() {
    //屏蔽加载中点击事件
  });
});

var showLoading = function(sec) {
  $("#mask").removeAttr("hidden");
  setTimeout('$("#mask").attr("hidden", true);', sec * 1000);
};

var toast = function(msg, duration) {
  duration = isNaN(duration) ? 3000 : duration;
  var m = document.createElement("div");
  m.innerHTML = msg;
  m.style.cssText =
    "width:200px; text-align:center; padding:0 10px; height:52px; color:white; line-height:52px; border-radius:5px; position:fixed; top:0; left:0; right:0; bottom:0; margin:auto; z-index:998; background:rgba(0, 0, 0, 0.7); font-size:16px;";
  document.body.appendChild(m);
  setTimeout(function() {
    var d = 0.5;
    m.style.webkitTransition =
      "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
    m.style.opacity = "0";
    setTimeout(function() {
      document.body.removeChild(m);
    }, d * 1000);
  }, duration);
};
