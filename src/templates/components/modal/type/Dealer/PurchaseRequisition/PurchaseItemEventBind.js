//绑定输入查询数据
bindInputQuery("#_brochurefk", "./test/searchDictionary/BrochureName.json")
//绑定交付时间组件
$('#_deliverydate')
  .datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    startDate: '2017-01-01',
    autoclose: true,
    startView: 2,
    minView: 2,
    forceParse: false,
    language: 'zh-CN'
  });
$("#PruchaseItem")
  .on("hidden.bs.modal", function() {
    ClearInputs("#PruchaseItem")
  })
var row_counter = 0
