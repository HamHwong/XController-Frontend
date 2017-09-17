//绑定input搜索栏数据源
bindInputQuery("#DemanderFK", "./test/searchDictionary/DealerCollections.json")

$("#PurchaseRequisition")
  .on("hidden.bs.modal", function () {
    if (window.__PurchaseRequisitionTable) {
      window.__PurchaseRequisitionTable.remove()
      ClearInputs("#PurchaseRequisition")
      window.__PurchaseRequisitionTable = null
    }
  })
$("#PurchaseRequisition").on("shown.bs.modal", function () {
    autoComplateInfoOfDealer()
  })

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
//检测若是aealer，则将需求方设为dealer本人
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

$("#addPRItem").on("click", function() {
    //如果没有请购单，则new一个
    if (!window.__PurchaseRequisitionTable) {
      var PurchaseRequisitionTable = new table()
      var t = {
        "tablename": "AddPR",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["delBtn"],
        "keyArr": ["id", "key", "prop", "key", "prop", "prop", "prop"]
      }
      var header = ["编号", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址"]
      PurchaseRequisitionTable.new(t, header)
        .to($("#InfomationAddArea"))
      window.__PurchaseRequisitionTable = PurchaseRequisitionTable
    }
  })
var row_counter = 0
