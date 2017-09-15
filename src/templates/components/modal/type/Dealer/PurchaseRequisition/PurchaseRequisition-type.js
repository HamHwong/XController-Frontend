bindInputQuery("#BrochureType", "./test/searchDictionary/BrochureType.json")
$('#EstimateTime')
  .datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    startDate: '2017-01-01',
    autoclose: true,
    startView: 4,
    minView: 2,
    forceParse: false,
    language: 'zh-CN'
  });


$("#addPR")
  .on("click", function () {
    if (!window.__purchaseRequisitionTable) {
      var purchaseRequisitionTable = new table()
      var t = {
        "tablename": "AddPR",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["delBtn"],
        "keyArr": ["id", "key", "prop", "key", "prop", "prop", "prop"]
      }
      purchaseRequisitionTable.new(t, ["编号", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址"])
        .to($("#InfomationAddArea"))
      window.__purchaseRequisitionTable = purchaseRequisitionTable
    }
  })


var row_counter = 0

function AppendPR() {
  if (isAllPRTypeFormFieldEmpty())
    return
  var arr = []
  arr.push(++row_counter)
  var a = $("#AddBrochureType input")
  for (var i = 0; i < a.length; i++) {
    arr.push($(a[i])
      .val())
  }
  if (window.__purchaseRequisitionTable) {
    window.__purchaseRequisitionTable.addRow(arr)
  }
  ClearInputs(a)
}

//检测，如果所有input都为空，则直接关闭不保存
function isAllPRTypeFormFieldEmpty() {
  var a = $("#AddBrochureType input")
  var isAllEmpty = true
  for (var i = 0; i < a.length; i++) {
    isAllEmpty = isAllEmpty && ($(a[i])
      .val()
      .length == 0)
  }
  return isAllEmpty
}

function AddPR() {
  AppendPR()
  $("#AddBrochureType")
    .modal('hide')
}


$("#AddBrochureType")
  .on("hidden.bs.modal", function () {
    ClearInputs("#AddBrochureType")

  })

function Cancel() {
  $("#AddBrochureType")
    .modal('hide')
}
