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
  var p1 = new page(1, sliptPageData(this.data, 0, 100))
  // showpage(this.data, 100, 200)
  //TODO- 将page装入pageHelper然后调用helper去调用显示
}

function sliptPageData(datas, startRow, endRow) {
  var tablecontent = $(".tab-content table.table tbody")
  tablecontent.empty()

  var pagecontent = []
  var dt = this.data.slice(startRow, endRow)
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
var hideColunmInMobile = function($tableId) {
  var table = $("#" + $tableId + " table")
  var keys = $("#" + $tableId + " table>tbody>tr>*[key='prop']")
  var responsiveColsArr = new Set()
  for (var i = 0; i < keys.length; i++) {
    var cell = keys[i]
    var indexOfRow = cell.cellIndex
    responsiveColsArr.add(indexOfRow)
  }
  for (var j of responsiveColsArr) {
    // table.find('tr:not(".info_card_row")').find('*:nth(' + j + ')').addClass('hidden-xs')
    table.find('tr:not(".info_card_row")').find('*').addClass('hidden-xs')
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
      $("#search_box").val(this.innerHTML)
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
      r.push(dic[i])
    }
  }
  return r
}

var keywordsdata = [
  "as", "asd", "zxccwr", "zxcer", "utjy", "ndftr"
]
//===========================================================================================================================

// $(".card>div:not('.card_head')").hide(100)
//===========================================================================================================================
//最笨的方法先全生成所有card
//获取所有table的row信息，除了header，包装成json
var addAllRowsCards = function($tablename) {
  // var trs = $(".tab-content #" + $tablename + " table tr")
  // var mod = $(".info_card_row").clone() //模板不变
  // modifyMod(mod, json)
  var arr = tableToJsonArr($("#finished table"))
  for (var i in arr) {
    // console.log(i);
    var mod = $($(".info_card_row").clone()[0]) //模板不变
    modifyMod(mod, arr[i])
    mod.find(".card_head").siblings('div').hide()
    $("#finished table tbody").append(mod)
  }
  // console.log(arr.length);
  // $("#finished table tbody").append(mod)
  $(".card .card_head").on('click', function() {
    $(this).siblings('div').toggle(100)
  })
}

var json = {
  "Header": "bb",
  "props": {
    "aa": "bb",
    "ccc": "dd"
  },
  "Date": "yyyy-mm-dd"
}

var modifyMod = function(mod, Obj) {
  var header = Obj.Header
  var props = Obj.props
  var date = Obj.Date
  var head = mod.find(".card_head")
  var body = mod.find(".card_body")
  head.html(header)
  var row_mod = body.find(".card_data_row").clone()
  row_mod = $(row_mod[0])
  console.log(row_mod);
  body.empty()
  console.log(body.html());
  for (var key in props) {
    var k = key
    var v = props[key]
    console.log(k + "," + "v");
    var row = row_mod.clone()
    row.find(".card_data_title").html(k)
    row.find(".card_data").html(v)
    body.append(row)
  }
}

var rowToJson = function($row, $headrow) {
  $row = $($row)
  $headrow = $($headrow)
  // var trs = $("#finished tr")
  // var $ths = $(trs[0])
  var $thtds = $headrow.children()
  // var $row = $(trs[1])
  var $trtds = $row.children()
  var r = {
    "Header": "header",
    "props": {},
    "Date": "yyyy-mm-dd"
  }
  // console.log($thtds.length)
  for (var i = 0; i < $thtds.length; i++) {
    r["props"][$thtds[i].innerHTML] = $trtds[i].innerHTML
  }
  return r
}

var tableToJsonArr = function($table) {
  // var $tb = $("#finished table") //$table
  $trs = $table.find("tr:not('.info_card_row')")
  $ths = $($trs[0])
  var arr = []
  for (var i = 0; i < $trs.length; i++) {
    var rowJson = rowToJson($trs[i], $ths)
    arr.push(rowJson)
  }
  return arr
}
