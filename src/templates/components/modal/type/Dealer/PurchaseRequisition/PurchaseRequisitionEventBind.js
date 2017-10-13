//绑定input搜索栏数据源
bindInputQuery("#_demanderfk", "./test/searchDictionary/DealerCollections.json")

$("#PurchaseRequisition")
  .on("hidden.bs.modal", function() {
    //操作需要获取tempID来保存set，
    //因此将onshown的init写在PR.show()里面，
    //show只通过call show()方式来使modal显示。
    //而close可能会有其他事件引发，且close不是同步的，
    //故清除写在这里
    PurchaseRequisition.destory()
  })
$("#PurchaseRequisition").on("shown.bs.modal", function() {
  var operationArea = $("#operation")
  var draftbtn = `<button type="button" class="btn btn-success col-xs-3 col-md-3 col-xs-offset-1">Draft</button>`
  var submitbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="submitPR()">提交</button>`
  var editbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="editPR()">修改</button>`
  var cancelbtn = `<button type="button" class="btn btn-danger col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">取消</button>`
  var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`

  switch (window._operation) {
    case Enum.operation.Update:
      operationArea.append($(editbtn)).append($(cancelbtn))
      break
    case Enum.operation.Create:
      operationArea.append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
      break
    case Enum.operation.Copy:
      operationArea.append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
      break
    default:
      operationArea.append($(closebtnlbtn))
      break
  }
})

$("#addPItem").on("click", function() {
  //如果没有请购单，则new一个
  if (!window.__PurchaseRequisitionItem_table) {
    // var PurchaseRequisitionItemTable = new table()
    var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    var title = {}
    window.__PurchaseRequisitionItem_table = new table().loadFromTemplateJson(title, templateOpts).to("#InfomationAddArea")
    // window.__PurchaseRequisitionItem_table.new(t, header).bindEvents()
    // .to($("#InfomationAddArea"))
  }
})
