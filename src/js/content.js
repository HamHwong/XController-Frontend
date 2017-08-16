// $(document).ready(function() {
//   $('#myTab a:first').tab('show');
//   $('#myTab a').click(function(e) {
//     e.preventDefault();
//     $(this).tab('show');
//   })
//
//   $(".form_datetime").datetimepicker({
//     minView: "month", //设置只显示到月份
//     format: 'yyyy-mm-dd',
//     autoclose: true, //选中关闭
//   });
//
//   //插件check
//   $('input').iCheck({
//     checkboxClass: 'icheckbox_flat-blue',
//     radioClass: 'iradio_flat-blue'
//   });
//
//   hideColunmInMobile('finished')
//   hideColunmInMobile('unfinished')
//   addAllRowsCards("finished")
//   // addAllRowsCards("unfinished")
// })

var getTablesObject = function() {
  var r = $.getJSON("/test/table.json", function() {
    console.log('加载完毕')
    loadTable(r)
  });
  return r;
}
// var loadTable = function(result) {
//   var ds = result.responseJSON
//   this.tablename = ds.tablename
//   var rowsperpage = ds.rowsperpage
//   this.hasHeader = ds.hasHeader
//   this.data = ds.data
//   this.datacount = this.hasHeader ? this.data.length - 1 : data.length
//   this.pages = Math.ceil(this.datacount / rowsperpage)
//   //page应该后台做，这里只模拟
//   for (var i in this.data) {
//     if (this.hasHeader && i == 0) continue
//     console.log(this.data[i])
//   }
// }
var loadTable = function(result) {
  var ds = result.responseJSON
  this.tablename = ds.tablename
  this.rowsperpage = ds.rowsperpage
  this.hasHeader = ds.hasHeader
  this.data = ds.data
  this.datacount = this.hasHeader ? this.data.length - 1 : data.length
  this.pages = Math.ceil(this.datacount / this.rowsperpage)
  //page应该后台做，这里只模拟
  var pageGroup = {}
  for (var page = 1; page <= this.pages; page++) {
    pageGroup[page] = new page(page, sliptPageData(this.data, (page - 1) * 100, page * 100)) //不含最后一位
  }
  // var p1 = new page(1, sliptPageData(this.data, 0, 100))//不含最后一位
  // showpage(this.data, 100, 200)
  //TODO- 将page装入pageHelper然后调用helper去调用显示
}

function sliptPageData(datas, startRow, endRow) {
  var tablecontent = $(".tab-content table.table tbody")
  tablecontent.empty()

  var pagecontent = []
  var dt = this.data.slice(startRow, endRow) //不含最后一位
  if (this.hasHeader) {
    var $row = $("<tr></tr>")
    for (var h in datas[0]) {
      var $header = $("<th>" + datas[0][h] + "</th>")
      $row.append($header)
    }
    $row.append("<th>Operation</th>")
    pagecontent.push($row)
    // tablecontent.append($row)
  }
  for (var r in dt) {
    if (this.hasHeader && r == 0) {
      continue
    }
    var row = dt[r]
    var $row = $("<tr></tr>")
    for (var c in row) {
      var col = row[c]
      var $col = $("<td>" + col + "</td>")
      $row.append($col)
    }
    $row.append("<td><a href=\"#\">Del</a>&nbsp;<a href=\"#\">Edit</a></td>")
    // tablecontent.append($row)
    pagecontent.push($row)
  }
  return pagecontent
}

var pageHelper = function(paneId, pageGroup) {
  this.paneId = paneId
  this.pageGroup = pageGroup
  this.currentPage = currentPage

  function To(page) {
    var tablecontent = $(".tab-content table#" + this.paneId + " tbody")
    tablecontent.empty()
    tablecontent.append(pageGroup[page])
  }
}

var page = function(page, data) {
  return {
    page: page,
    data: data
  }
}
//
//===========================================================================================================================
//模态配置

$("#myModal").modal({
  show: false,
  backdrop: 'static'
})
//===========================================================================================================================
//隐藏列

var hideColunmInMobile = function($table) {
  var table = $($table)
  var keys = $($table).find("tr>*[key='prop']")
  var responsiveColsArr = new Set()
  for (var i = 0; i < keys.length; i++) {
    var cell = keys[i]
    var indexOfRow = cell.cellIndex
    responsiveColsArr.add(indexOfRow)
  }
  for (var j of responsiveColsArr) {
    table.find('tr:not(".info_card_row")').children('*').addClass('hidden-xs')
  }
}

//===========================================================================================================================
//搜索条
//TODO-要有个sleep
$("#search_box").on('keyup', function() {
  var droplist = $(".search_box_warp .keyhint")
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
      $("#search_box").val(this.innerText)
      droplist.empty()
      $(".search_box_warp").removeClass("open")
    })
  } else {
    $(".search_box_warp").removeClass("open")
  }
})

var queryKeyWords = function(keys, dic) {
  var r = []
  for (var i in dic) {
    if (dic[i].includes(keys)) {
      var keywords = dic[i].match(keys)
      var blodKeyWord = dic[i].replace(keywords, "<b>" + keywords + "</b>")
      r.push(blodKeyWord)
    }
  }
  return r
}

var keywordsdata = [
  "as", "asd", "zxccwr", "zxcer", "utjy", "ndftr", "啊水水水水"
]
//===========================================================================================================================
// $(".card>div:not('.card_head')").hide(100)
//===========================================================================================================================
//最笨的方法先全生成所有card
//获取所有table的row信息，除了header，包装成json
var addAllRowsCards = function($table) {
  // var trs = $(".tab-content #" + $tablename + " table tr")
  // var mod = $(".info_card_row").clone() //模板不变
  // modifyMod(mod, json)
  $table = $($table)
  var arr = tableToJsonArr($table, true)
  console.log(arr)
  for (var i in arr) {
    var mod = $($(".info_card_row").clone()[0]) //模板不变
    modifyMod(mod, arr[i])
    console.log(mod)
    mod.find(".card_head").siblings('div').hide()
    $table.find("tbody").append(mod)
  }
  // $("#finished table tbody").append(mod)
  $table.find(".card_head").on('click', function() {
    $(this).siblings('div').toggle(100)
  })
  // $(".card .card_head").on('click', function() {
  //   $(this).siblings('div').toggle(100)
  // })
}
var modifyMod = function(mod, Obj) {
  mod.removeClass("hide")
  var header = Obj.Header
  var props = Obj.Props
  var date = Obj.Date
  var bgcolor = Obj.Bgcolor
  var card = mod.find(".card")
  var head = mod.find(".card_head")
  var body = mod.find(".card_body")
  var headertext = ""
  for (var k in header) {
    // if (k > 2) {
    //   headertext += "...."
    //   continue
    // }
    var headertextcontent = props[header[k]]
    if (headertextcontent.length > 20)
      headertextcontent = headertextcontent.substring(0, 20) + "..."
    headertext += header[k] + ":" + headertextcontent
    headertext += ",<br>"
  }
  head.html(headertext.substring(0, headertext.length - 1))
  head.css("background-color", bgcolor.toString())
  card.css("border-color", bgcolor.toString())
  var row_mod = body.find(".card_data_row").clone()
  row_mod = $(row_mod[0])
  body.empty()
  for (var key in props) {
    var k = key
    var v = props[key]
    var row = row_mod.clone()
    row.find(".card_data_title").html(k)
    row.find(".card_data").html(v)
    body.append(row)
  }
}
var colorarr = [
  "#011935",
  "#00343F",
  "#1DB0B8",
  "#37C6C0",
  "#376956",
  "#199475",
  "#0B6E48",
  "#044D22",
  "#495A80",
]
var rowToJson = function($row, $headrow) {
  $row = $($row)
  $headrow = $($headrow)
  // var trs = $("#finished tr")
  // var $ths = $(trs[0])
  var $thtds = $headrow.children() //获取表头的tds
  // var $row = $(trs[1])
  var $trtds = $row.children() //获取该行的tds
  var keys = $headrow.find("*[key='key']")
  var headers = {}
  for (var j = 0; j < keys.length; j++) {
    headers[keys[j].cellIndex] = $(keys[j]).html()
  }
  var r = {
    "Header": headers,
    "Bgcolor": "#4A8BC2",
    "Props": {},
    "Date": "yyyy-mm-dd"
  }
  for (var i = 0; i < $thtds.length; i++) {
    // r["Props"][filterXSS($thtds[i].innerHTML)] = filterXSS($trtds[i].innerHTML)
    r["Props"][filterXSS($thtds[i].innerHTML)] = $trtds[i].innerHTML
    console.log(filterXSS($thtds[i].innerHTML)+","+$trtds[i].innerHTML);
    r["Bgcolor"] = colorarr[Math.floor(Math.random() * colorarr.length)]
  }
  return r
}
var tableToJsonArr = function($table, hasHeader) {
  // var $tb = $("#finished table") //$table
  $table = $($table)
  $trs = $table.find("tr:not('.info_card_row')")
  $ths = $($trs[0])
  var arr = []
  for (var i = 0; i < $trs.length; i++) {
    if (hasHeader && i == 0) {
      continue
    }
    var rowJson = rowToJson($trs[i], $ths)
    arr.push(rowJson)
  }
  return arr
}
