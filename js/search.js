var createItem = function(text) {
  var item =
    '<div class="item"><a class="example-image-link" href=' +
    text.picCode +
    ' data-lightbox="example-set" data-title="Click the right half of the image to move forward."><img class="example-image" src=' +
    text.picCode +
    ' alt="" /> </a><div class="content-item"><h3 class="title-item">' +
    text.theme +
    '</h3><div class="time">' +
    text.time +
    '</div> <p class="info">' +
    text.description +
    '</p><p class="time">打赏地址：' +
    text.author +
    "</div></div>";
  $("#container").append(item);
};

var init = function() {
  var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
  var nebPay = new NebPay();
  var dappAddress = "n1oRx5TUgvXx6kPGa9BYKqu2etL5h5eijLi";
  var to = dappAddress;
  var value = "0";
  var callFunction = "getByPage";
  var callArgs = [];
  callArgs.push(1);
  callArgs.push(8);
  // nebPay.simulateCall(to, value, "getTotalPages", "[8]", {
  //   listener: pageFunction
  // });
  nebPay.simulateCall(to, value, callFunction, JSON.stringify(callArgs), {
    //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
    listener: dataSearch //指定回调函数
  });

  function dataSearch(resp) {
    var result = resp.result;
    // console.log(result);
    // console.log("return of rpc call: " + JSON.stringify(result));
    result = JSON.parse(result);
    // console.log(result);
    // console.log(result.length);
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
  }
};

$(function() {
  init();
  $("#page").jqPagination(10);
});
