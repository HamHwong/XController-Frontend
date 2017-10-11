//绑定输入查询数据
bindInputQuery("#_brochurefk", "./test/searchDictionary/BrochureName.json")
//绑定交付时间组件
$('#_deliverydate')
  .datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    startDate: new Date(),
    autoclose: true,
    startView: 2,
    minView: 2,
    forceParse: false,
    language: 'zh-CN'
  });
$("#PruchaseItem")
  .on("hidden.bs.modal", function() {
    ClearInputs("#PruchaseItem")
    $("#PRIOperation").empty()
  })
$("#PruchaseItem").on("shown.bs.modal", function() {
  var operationArea = $("#PRIOperation")
  var addbtn = `<button type="submit" class="btn btn-primary" onclick="AddPurchaseItem()"><span class="glyphicon glyphicon-ok"></span></button>`
  var appendbtn = `<button type="submit" class="btn btn-primary" onclick="AppendPurchaseItem()"><span class="glyphicon glyphicon-plus"></span></button>`
  var editbtn = `<button type="submit" class="btn btn-primary" onclick="EditPurchaseItem()"><span class="glyphicon glyphicon-ok"></span></button>`
  var cancelbtn = `<button type="submit" class="btn btn-primary" onclick="Cancel()"><span class="glyphicon glyphicon-remove"></span></button>`

  switch (window._operation) {
    case Enum.operation.Update:
      operationArea.append($(cancelbtn)).append($(editbtn))
      break
    case Enum.operation.Create:
      operationArea.append($(addbtn)).append($(cancelbtn)).append($(appendbtn))
      break
    default:
      operationArea.append($(cancelbtn))
      break
  }
})
var row_counter = 0
