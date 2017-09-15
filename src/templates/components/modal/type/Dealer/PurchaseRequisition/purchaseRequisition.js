//
$("#purchaseRequisition")
  .on("hidden.bs.modal", function () {
    if (window.__purchaseRequisitionTable) {
      window.__purchaseRequisitionTable.remove()
      ClearInputs("#purchaseRequisition")
      window.__purchaseRequisitionTable = null
    }
  })
$("#purchaseRequisition")
  .on("shown.bs.modal", function () {
    autoComplateInfoOfDealer()
  })
//绑定input搜索栏数据源
bindInputQuery("#dealerId", "./test/searchDictionary/DealerCollections.json")
//获取用户信息
function getPrototypies(uid, pname) {
  var c = $.ajax({
    url: './test/userInfo.json', // api统一接口不同参数获取用户信息
    type: "GET",
    async: false
  })
  var j = JSON.parse(c.responseText)
  var r = j[uid][pname]
  return r
}
//检测若是aealer，则将需求方设为本人
function autoComplateInfoOfDealer() {
  if ("dealer" == (getCookie("auth")
      .toLowerCase())) {
    $("#DemanderFK")
      .val("dealer")
    $("#DemanderFK")
      .attr("readonly", "readonly")
    $("#area")
      .val(getPrototypies("dealer", "area"))
    $("#area")
      .attr("disabled", "true")
  }
}

function autoComplateInfo(infoSet, form) {
  var tableSet = $.ajax({
      url: "/test/dealer/MyOrder/Copy/OrderInfo.json",
      type: "GET",
      async: false
    })
    .responseJson
  ta = tableSet
}
var row_counter = 0
