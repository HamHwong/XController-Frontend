//绑定输入查询数据
//绑定交付时间组件
// $('#_deliverydate').on("hidden.bs.modal", function(e) {
//   console.log("_deliverydate",e)
//   e.stopPropagation()
// })
$("#PruchaseItem")
  .on("hidden.bs.modal", function(e) {
    PurchaseItem.destory()
  })
// $("#PruchaseItem").on("shown.bs.modal", function(e) {
//
// })
var row_counter = 0
