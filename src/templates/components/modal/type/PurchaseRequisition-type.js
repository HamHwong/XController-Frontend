var keywordsdata = JSON.parse($.ajax({
  url: "./test/searchDictionary/BrochureType.json",
  async: false
}).responseText)
$("#BrochureType").on('keyup', function(e) {
  e.preventDefault()
  var droplist = $(".keyhint")
  droplist.empty()
  var data = queryKeyWords(this.value, keywordsdata)
  for (var i in data) {
    var li = $("<li></li>")
    var a = $("<a href=\"#\" class='keywords'></a>")
    a.html(data[i])
    li.append(a)
    droplist.append(li)
  }
  if (data.length > 0 && this.value != "") {
    $(".search_box_warp").addClass("open")
    $(".keywords").on('click', function(e) {
      $("#BrochureType").val(this.innerText)
      droplist.empty()
      $(".search_box_warp")
        .removeClass("open")
    })
  } else {
    $(".search_box_warp")
      .removeClass("open")
  }
})
$('#EstimateTime').datetimepicker({
  format: 'yyyy-mm-dd',
  weekStart: 1,
  startDate: '2017-01-01',
  autoclose: true,
  startView: 4,
  minView: 2,
  forceParse: false,
  language: 'zh-CN'
});


$("#addPR").on("click",function(){
  if(!window.__newTable){
    var t = new table()
    t.new("AddPR",["编号","申请种类","申请数量","收货人","收货电话","交付时间","收货地址"],["id","key","prop","key","prop","prop","prop"]).to($("#InfomationAddArea"))
  }
})
