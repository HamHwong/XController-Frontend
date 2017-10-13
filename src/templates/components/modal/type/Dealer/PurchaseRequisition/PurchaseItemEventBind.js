//绑定输入查询数据
bindInputQuery("#_brochurename", "./test/searchDictionary/BrochureName.json")
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
  .on("hidden.bs.modal", function () {
    PurchaseItem.destory()
  })
$("#PruchaseItem").on("shown.bs.modal", function () {
  var operationArea = $("#PIOperation")
  var addbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.add()"><span class="glyphicon glyphicon-ok"></span></button>`
  var appendbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.append()"><span class="glyphicon glyphicon-plus"></span></button>`
  var editbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.edit()"><span class="glyphicon glyphicon-ok"></span></button>`
  var cancelbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.hide()"><span class="glyphicon glyphicon-remove"></span></button>`

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
