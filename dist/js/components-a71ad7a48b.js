/**
 * @description Bootstrap tab初始化
 */
var tab_init = function() {
  $('#myTab a:first').tab('show'); //切换栏
  $('#myTab a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
  })
}


/**
 * @description 从字典数组中查询到
 * @param  {String} keys 输入的关键字字符串
 * @param  {StringArray} dic  Dictionary字符串字典数组
 * @return {StringArray}      返回一个装有所有搜索结果的字符数组
 */
var queryKeyWords = function(keys, dic) {
  var r = []
  for (var i in dic) {
    if (dic[i].search(keys)>-1) {
      var keywords = dic[i].match(keys)
      var blodKeyWord = dic[i].replace(keywords, "<b>" + keywords + "</b>")
      r.push(blodKeyWord)
    }
  }
  return r
}
/**
 * 搜索框字典数组
 * @type {Array}
 */
var keywordsdata = [
  "as", "asd", "zxccwr", "zxcer", "utjy", "ndftr", "啊水水水水"
]

// 
// $('#orderDetail').on('hide.bs.modal', function() {
//    $(this).removeData("bs.modal")
//    $(this).find(".modal-content").children().remove()
// })
// $("#orderDetail").modal({
//   remote: "./test/order-Detail.json"
// })

var contentmapper = {
  myOrder: "myorder-content.html",
  orderAdmin: "order-content.html",
  goodsAdmin: "goods-content.html",
  agent: "agent-content.html",
  supplier: "supplier-content.html",
  Admin: ""
}

var hyperlink_init = function() {
  $(".nav .section a").on('click', function() {
    // console.log(this.attr("href"));
    // var key = window.location.hash
    // var file = contentmapper[key.substring(1)]
    var file = contentmapper[$(this).attr("href").substring(1)]
    //
    if ("" == file || undefined == file) return
    $.ajax({
      url: "./content/" + file,
      async: false,
      success: function(Obj) {
        $("#content_wapper").empty()
        console.log(Obj);
        $("#content_wapper").append(Obj.trim())
        initPageByName("content")
        sideclose()
      }
    })
  })
}

// var sideopen = function() {
//   $('.sideBtn').removeClass('nav_collapse').addClass('nav_open');
//   $('.sideNav').removeClass('nav_collapse').addClass('nav_open');
//   $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-open')
//   $('#right_wapper').removeClass().addClass('shrunk')
// }
//
// var sideclose = function() {
//   $('.sideBtn').removeClass('nav_open').addClass('nav_collapse');
//   $('.sideNav').removeClass('nav_open').addClass('nav_collapse');
//   $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-close')
//   $('#right_wapper').removeClass().addClass('extend')
// }
//
// var contentmapper = {
//   myOrder:"",
//   orderAdmin:"order-content.html",
//   goodsAdmin:"",
//   userAdmin:"agent-content.html",
//   Admin:""
// }
//
// var hyperlink_init = function() {
//   $(".navbar .nav .section a").on('click', function() {
//     // console.log(this.attr("href"));
//     // var key = window.location.hash
//     // var file = contentmapper[key.substring(1)]
//     var file = contentmapper[$(this).attr("href").substring(1)]
//     if(""==file)return
//     $.ajax({
//       url: "./content/"+file,
//       async: false,
//       success: function(Obj) {
//         $("#content_wapper").empty()
//         $("#content_wapper").append(Obj)
//         // table_init()
//         initPageByName("content")
//       }
//     })
//   })
// }

var sideopen = function() {
  $('.sideBtn').removeClass('nav_collapse').addClass('nav_open');
  $('.topNav').removeClass('nav_collapse').addClass('nav_open');
  $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-open')
}

var sideclose = function() {
  $('.sideBtn').removeClass('nav_open').addClass('nav_collapse');
  $('.topNav').removeClass('nav_open').addClass('nav_collapse');
  $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-close')
}

"use strict";
/**
 * 修改模板
 * @param  {JQuery.mod} mod 传入模板
 * @param  {json} Obj 传入需要修改成的json对象
 */
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

var table = function(url, options) {
  var url = this.checkUrl(url) ? url : ""
  var options = this.checkObj(options) ? options : new Object()
  var opts = {
    hasButton: typeof(options.hasButton) !== "undefined" ? options.hasButton : "false",
  }

  this.opts = opts
  this.url = url
  this.urlTimestamp = null;
  this.table = null
  this.responseJson = null
  this.tableJson = null
  this.hasButton = opts.hasButton
  this.hasHeader = false;
  this.Header = null
}

table.prototype.checkObj = function(obj) {
  if (typeof obj === "object") {
    return true
  } else {
    // throw "the params is not a object."
    return false
  }
}
table.prototype.checkUrl = function(url) {
  if (typeof url === "string" && url.length > 0) {
    return true
  } else {
    throw "the params is not a url."
  }
}

table.prototype.load = function(url) {
  //若参数带url，更新url
  if (!(url === undefined || "" === url)) {
    console.log("new");
    this.url = url
  }
  //第一次load 或者 大于60s没更新，就去获取一波
  if (this.urlTimestamp == null || this.timeDiff() > 60) {
    console.log("update");
    this.fetch(this.url).parse().addInfoCard()
    this.urlTimestamp = new Date()
  }
  return this
}
table.prototype.timeDiff = function() {
  return (new Date().getTime() - this.urlTimestamp.getTime()) / 1000
}
table.prototype.fetch = function(url) {
  var tableJsonResponse = $.ajax({
    url: url,
    async: false
  })
  // console.log(tableJsonResponse.responseText);
  this.responseJson = JSON.parse(tableJsonResponse.responseText)
  return this
}
table.prototype.parse = function() {
  this.hasHeader = this.responseJson.hasHeader
  var data = this.responseJson.data
  var keyArr = this.responseJson.keyArr
  var table = $('<table class="table table-bordered table-hover table-striped"></table>')
  var tbody = $("<tbody></tbody>")
  //若有header，初始化header
  if (this.hasHeader) {
    var hr = data.reverse().pop()
    this.Header = hr
    tbody.append(this.jsonToRow(hr, true, keyArr)) //jsonToRow将json对象中的data数据转成hr对象
    data.reverse()
  }
  //将data装载成table row
  for (var i = 0; i < data.length; i++) {
    tbody.append(this.jsonToRow(data[i]))
  }
  table.append(tbody)
  this.table = table
  return this
}
table.prototype.addInfoCard = function() {
  // 为所有子节点添加hidden-xs标签，缩放时隐藏
  this.table.find('tr:not(".info_card_row")').children('*').addClass('hidden-xs')
  $table = this.table
  var card = new table_card()
  var arr = card.tableToJsonArr($table, true) //TODO 逻辑有问题，之后再改！
  // var arr = this.table.data
  var model =$( $(".info_card_row")[0] ) //BUG
  for (var i in arr) {
    console.log(i);
    var mod = $(model.clone()) //模板不变
    modifyMod(mod, arr[i])
    mod.find(".card_head").siblings('div').hide()
    $table.find("tbody").append(mod)
  }
  $table.find(".card_head").on('click', function() {
    $(this).siblings('div').toggle()
  })
}
table.prototype.to = function($tableContainer) {
  $tableContainer = $($tableContainer)
  $tableContainer.empty()
  $tableContainer.append(this.table)
  return this
}
table.prototype.getTable = function() {
  return this.table
}
//bindModal放在这里逻辑上有问题
table.prototype.bindModal = function() {
  var t = new table("./test/order-Detail.json", {
    hasButton: false
  })
  $(this.table).find('tr td:nth-child(2)').on('click',{t:t}, function(e) {
    $(".goodsInfomation").empty()
    var steps = $("#orderDetail").find(".steps")
    var baseInfos = $("#orderDetail").find(".baseInfomation")
    var comment = $("#orderDetail").find(".comment")
    //此处需要一个api来获取绑定数据的json数据
    t.load().to(".goodsInfomation")
    // console.log(t.responseJson);
    var j = t.responseJson
    var currStep = j.steps
    var infos = j.baseInfos
    var steplis = steps.find('li')
    steplis.removeClass("active")
    for (var c = 0; c < currStep; c++) {
      // console.log(steplis[c]);
      $(steplis[c]).addClass("active")
    }
    $("#orderDetail").modal()
  })
}
/**
 * @param  {JsonArr}  cellArr  字符串数组，数据行信息
 * @param  {Boolean} isHeader 是否为标题行
 * @param  {strArr}  keyArr   'prop','key','operation'
 * @return {JQueryTableRow}   Table的row
 */
table.prototype.jsonToRow = function(cellArr, isHeader, keyArr) {
  var row = $("<tr></tr>")
  for (var i = 0; i < cellArr.length; i++) {
    if (isHeader) {
      var th = $("<th></th>")
      if (keyArr) {
        th.attr("key", keyArr[i])
      }
      row.append(th.html(cellArr[i]))
    } else {
      var td = $("<td></td>")
      row.append(td.html(cellArr[i]))
    }
  }
  if (this.opts.hasButton) {
    if (isHeader) {
      row.append($("<th key='operation'>操作</th>"))
    } else {
      var td = $("<td></td>")
      var editBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info edit\">EDIT</button>")
      var delBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\">DELETE</button>")
      editBtn.on('click', function() {
        $("#addBtn").modal()
        console.log($(this).parent().parent());
      })
      delBtn.on('click', function() {
        $("#delBtn").modal()
      })

      td.append(editBtn).append(delBtn)
      row.append(td)
    }
  }
  return row
}
table.prototype.rowAddCard = function(row, mod, Obj) {
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
var table_card = function() {
  /**
   * 卡片title的背景色数组
   * @type {Array}
   */
  this.colorarr = [
    "#7D8892",
    "#cdcdcd",
  ]
  /**
   * 将行对象转换成Json对象
   * @param  {JQuery.rowObject} $row    传入一个Jquery的row对象
   * @param  {JQuery.rowObject} $headrow 传入一个的Jquery的HeaderRow对象
   * @return {json}          返回一个Json对象，结构为r变量
   */
  this.rowToJson = function($row, $headrow) {
    $row = $($row)
    $headrow = $($headrow)
    var $thtds = $headrow.children() //获取表头的tds
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
      r["Props"][filterXSS($thtds[i].innerHTML)] = $trtds[i].innerHTML
    }
    var c = this.colorarr.pop()
    r["Bgcolor"] = c
    this.colorarr.reverse()
    this.colorarr.push(c)
    this.colorarr.reverse()
    return r
  }
  /**
   * 将Table对象转换为Json数组
   * @param  {Jquery.Table}  $table    传入一个table对象
   * @param  {Boolean} hasHeader 是否带头标签th
   * @return {JsonArr}            返回一个带有Json对象的数组
   */
  this.tableToJsonArr = function($table, hasHeader) {
    $table = $($table)
    $trs = $table.find("tr:not('.info_card_row')")
    $ths = $($trs[0])
    var arr = []
    for (var i = 0; i < $trs.length; i++) {
      if (hasHeader && i == 0) {
        continue
      }
      var rowJson = this.rowToJson($trs[i], $ths)
      arr.push(rowJson)
    }
    return arr
  }
}

var tableCard = function(header,color,data,date){

}
