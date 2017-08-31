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
  this.tableHeader = null
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
    this.url = url
  }
  //第一次load 或者 大于60s没更新，就去获取一波
  if (this.urlTimestamp == null || this.timeDiff() > 60) {
    this.fetch(this.url)
    this.addInfoCard()
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
  console.log(tableJsonResponse.responseText);
  this.responseJson = JSON.parse(tableJsonResponse.responseText)
  this.table = this.parse(this.responseJson)
  return this.table
}
/**
 * 将JsonArr转成table
 * @param  {[type]} jsonArrs [description]
 * @return {[type]}          [description]
 */
table.prototype.parse = function(jsonArrs) {
  var hasHeader = jsonArrs.hasHeader
  var data = jsonArrs.data
  var keyArr = jsonArrs.keyArr
  var table = $('<table class="table table-bordered table-hover table-striped"></table>')
  var tbody = $("<tbody></tbody>")
  if (hasHeader) {
    var hr = data.reverse().pop()
    tbody.append(this.jsonToRow(hr, true, keyArr)) //jsonToRow将json对象中的data数据转成hr对象
    data.reverse()
  }
  for (var i = 0; i < data.length; i++) {
    tbody.append(this.jsonToRow(data[i], false))
  }
  table.append(tbody)
  return table
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
  $(this.table).find('tr td:nth-child(2)').on('click', function(e) {
    var t = new table("./test/order-Detail.json", {
      hasButton: false
    })
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
      console.log(steplis[c]);
      $(steplis[c]).addClass("active")
    }
    $("#orderDetail").modal()
  })
}
table.prototype.jsonToRow = function(jsonArr, isHeader, keyArr) {
  var row = $("<tr></tr>")
  for (var i = 0; i < jsonArr.length; i++) {
    if (isHeader) {
      var th = $("<th></th>")
      if (keyArr) {
        th.attr("key", keyArr[i])
      }
      row.append(th.html(jsonArr[i]))
    } else {
      var td = $("<td></td>")
      row.append(td.html(jsonArr[i]))
    }
  }
  if (this.opts.hasButton) {
    if (isHeader) {
      row.append($("<th key='operation'>操作</th>"))
    } else {
      row.append($("<td><button type=\"button\" name=\"button\" class=\"btn btn-info\">EDIT</button>&nbsp;<button type=\"button\" name=\"button\" class=\"btn btn-danger\">DELETE</button></td>"))
    }
  }
  return row
}
table.prototype.addInfoCard = function() {
  this.table.find('tr:not(".info_card_row")').children('*').addClass('hidden-xs')
  $table = this.table
  var card = new table_card()
  var arr = card.tableToJsonArr($table, true) //TODO 逻辑有问题，之后再改！
  for (var i in arr) {
    var mod = $($(".info_card_row").clone()[0]) //模板不变
    modifyMod(mod, arr[i])
    mod.find(".card_head").siblings('div').hide()
    $table.find("tbody").append(mod)
  }
  $table.find(".card_head").on('click', function() {
    $(this).siblings('div').toggle()
  })
}
var table_card = function() {
  /**
   * 卡片title的背景色数组
   * @type {Array}
   */
  this.colorarr = [
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
      r["Bgcolor"] = this.colorarr[Math.floor(Math.random() * this.colorarr.length)]
    }
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
