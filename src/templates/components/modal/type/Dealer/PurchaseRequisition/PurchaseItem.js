//绑定输入查询数据
bindInputQuery("#BrochureName", "./test/searchDictionary/BrochureName.json")
//绑定交付时间组件
$('#DeliveryDate')
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

var row_counter = 0



//检测，如果所有input都为空，则直接关闭不保存
function isAllPRTypeFormFieldEmpty(form) {
  var a = $(form).find("input")
  a.append($(form).find("area")).append($(form).find("select"))
  var isAllEmpty = true
  for (var i = 0; i < a.length; i++) {
    isAllEmpty = isAllEmpty && ($(a[i]).val().length == 0 && $(a[i]).val() != "-1")
  }
  return isAllEmpty
}




$("#PruchaseItem")
  .on("hidden.bs.modal", function() {
    ClearInputs("#PruchaseItem")

  })
