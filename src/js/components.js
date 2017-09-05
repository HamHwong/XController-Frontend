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

var table = function(url, options) {
  var url = this.checkUrl(url) ? url : ""
  var options = this.checkObj(options) ? options : new Object()
  var opts = {
    hasButton: typeof(options.hasButton) !== "undefined" ? options.hasButton : "false",
  }

  this.opts = opts
  this.url = url
  this.urlTimestamp = null
  this.tableHTML = null
  this.keyArr = []
  this.responseJson = null
  this.hasButton = opts.hasButton
  this.hasHeader = false
  this.Header = null
  this.data = {}
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
    console.log("update");
    this.fetch(this.url)
      .init()
      .addInfoCard()
    this.urlTimestamp = new Date()
  }
  return this
}
table.prototype.timeDiff = function() {
  return (new Date()
    .getTime() - this.urlTimestamp.getTime()) / 1000
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
table.prototype.init = function() {
  this.hasHeader = this.responseJson.hasHeader
  this.keyArr = this.responseJson.keyArr
  var data = this.responseJson.data
  var table = $('<table class="table table-bordered table-hover table-striped"></table>')
  var tbody = $("<tbody></tbody>")
  //若有header，初始化header
  if (this.hasHeader) {
    var hr = data.reverse()
      .pop()
    this.Header = hr
    tbody.append(this.jsonToRow(hr, true, this.keyArr)) //jsonToRow将json对象中的data数据转成hr对象
    data.reverse()
  }
  //将data装载成table row
  for (var i = 0; i < data.length; i++) {
    var row = this.jsonToRow(data[i])
    this.data[data[i][this.keyArr.indexOf('id')]] = row
    // console.log(data,[this.keyArr.indexOf('id')]);
    roww=row
    tb = this
    tbody.append(row)
  }
  table.append(tbody)
  this.tableHTML = table
  return this
}
table.prototype.addInfoCard = function() {
  // 为所有子节点添加hidden-xs标签，缩放时隐藏
  this.tableHTML.find('tr')
    .children('*')
    .addClass('hidden-xs')
  $table = this.tableHTML
  var card = new table_card()
  var arr = card.tableToJsonArr($table, true) //TODO 逻辑有问题，之后再改！
  // var arr = this.tableHTML.data

  for (var i in arr) {
    var mod = card.cardTemplate(arr[i])
    mod = $(mod)
    mod.find(".card_head")
      .siblings('div')
      .hide()
    $table.find("tbody")
      .append(mod)
  }
  $table.find(".card_head")
    .on('click', function() {
      $(this)
        .siblings('div')
        .toggle()
    })
}
table.prototype.to = function($tableContainer) {
  $tableContainer = $($tableContainer)
  $tableContainer.empty()
  $tableContainer.append(this.tableHTML)
  return this
}
table.prototype.getTable = function() {
  return this.tableHTML
}
//bindModal放在这里逻辑上有问题
table.prototype.bindModal = function() {
  var t = new table("./test/order-Detail.json", {
    hasButton: false
  })
  $(this.tableHTML)
    .find('tr td:nth-child(2)')
    .on('click', {
      t: t
    }, function(e) {
      $(".goodsInfomation")
        .empty()
      var steps = $("#orderDetail")
        .find(".steps")
      var baseInfos = $("#orderDetail")
        .find(".baseInfomation")
      var comment = $("#orderDetail")
        .find(".comment")
      //此处需要一个api来获取绑定数据的json数据
      t.load()
        .to(".goodsInfomation")
      // console.log(t.responseJson);
      var j = t.responseJson
      var currStep = j.steps
      var infos = j.baseInfos
      var steplis = steps.find('li')
      steplis.removeClass("active")
      for (var c = 0; c < currStep; c++) {
        // console.log(steplis[c]);
        $(steplis[c])
          .addClass("active")
      }
      $("#orderDetail")
        .modal()
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
        th.attr("key", keyArr[i]) //HACK 之后改结构直接获取不用写到table row上
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
      var editBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info edit\" onclick=\"edit(" + 1 + ")\">EDIT</button>")
      var delBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"del(" + 1 + ")\">DELETE</button>")
      // editBtn.on('click', function() {
      //   $("#addBtn").modal()
      //   console.log($(this).parent().parent());
      // })
      // delBtn.on('click', function() {
      //   $("#delBtn").modal()
      // })
      td.append(editBtn)
        .append(delBtn)
      row.append(td)
    }
  }
  return row
}
table.prototype.rowAddCard = function(row, color) {
  // this.keyArr
  // this.Header
  var color = color ? color : "#4A8BC2"
  var headers = {}
  var props = {}
  var publishDate = ""
  for (var i in this.keyArr) {
    var tds = row.children("td") // 该行所有的tds
    props[this.Header[i]] = filterXSS($(tds[i]).html())
    //遍历keyArr,找到key对应的数据，填入
    if ("key" == this.keyArr[i]) {
      headers[this.Header[i]] = filterXSS($(tds[i]).html())
    }
    if ("publishDate" == this.keyArr[i]) {
      publishDate = filterXSS($(tds[i]).html())
    }
  }
  var r = {
    "Header": headers,
    "Bgcolor": color,
    "props": props,
    "Date": publishDate
  }
  return r
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
      headers[keys[j].cellIndex] = $(keys[j])
        .html()
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

  // var r = {
  //   "Header": headers,
  //   "Bgcolor": "#4A8BC2",
  //   "Props": {},
  //   "Date": "yyyy-mm-dd"
  // }

  // {
  //   "tablename": "agent",
  //   "hasHeader": true,
  //   "keyArr": ["prop", "key", "prop", "prop", "prop", "prop", "key", "prop", "prop"],
  //   "data": [
  //     ["序列", "姓名", "手机号", "账号", "密码", "创建时间"],
  //     [1, "李军", "18622114455","EliteSource001","EliteSource@2017","2017-04-23 23:00:00"],
  //     [2, "李军", "18622114455","EliteSource001","EliteSource@2017","2017-04-23 23:00:00"],
  //     [3, "李军", "18622114455","EliteSource001","EliteSource@2017","2017-04-23 23:00:00"],
  //     [4, "李军", "18622114455","EliteSource001","EliteSource@2017","2017-04-23 23:00:00"]
  //   ]
  // }
  this.cardTemplate = function(Obj) {
    var header = Obj.Header
    var props = Obj.Props
    var date = Obj.Date
    var bgcolor = Obj.Bgcolor
    var headertext = ""
    for (var k in header) {
      var headertextcontent = props[header[k]]
      if (headertextcontent.length > 20)
        headertextcontent = headertextcontent.substring(0, 20) + "..."
      headertext += header[k] + ":" + headertextcontent
      headertext += ",<br>"
    }
    headertext = headertext.substring(0, headertext.lastIndexOf(","))

    var row = function(propName, value) {
      var propName = propName
      var value = value
      var m =
        `
        <div class="row card_data_row">
          <div class="col-xs-4 card_data_title">
          ${propName}:
          </div>
          <div class="col-xs-8 card_data">
          ${value}
          </div>
        </div>
        `
      return m
    }
    var rows = []
    for (var key in props) {
      var k = key
      var v = props[key]
      var r = row(k, v)
      rows.push(r)
    }
    var template =
      `<tr class="info_card_row">
          <td colspan="1">
            <div class="card col-xs-12 row" style="border-color:${bgcolor}">
              <div class="card_head row" style="background-color:${bgcolor}">
                ${headertext}
              </div>
              <div class="card_body">
                ${rows.join("")}
              </div>
              <div class="card_foot row">
                <div class="date">
                  data:yyyy-mm-dd
                </div>
              </div>
            </div>
          </td>
        </tr>`
    return template
  }
}

var tableCard = function(header,color,data,date){

}
