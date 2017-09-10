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

//===========================================================================================================================
//搜索条
//TODO-要有个sleep,函数执行太快
/**
 * @description 为搜索框绑定keyup事件，调用queryKeyWords动态地查询关键字，然后添加到下拉列表中
 */
$(".search_box")
  .on('keyup', function (e) {
    // console.log(e);
    e.preventDefault()
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
      $(".search_box_warp")
        .addClass("open")
      $(".keywords")
        .on('click', function (e) {
          $("#search_box")
            .val(this.innerText)
          droplist.empty()
          $(".search_box_warp")
            .removeClass("open")
        })
    } else {
      $(".search_box_warp")
        .removeClass("open")
    }
  })
/**
 * @description 从字典数组中查询到
 * @param  {String} keys 输入的关键字字符串
 * @param  {StringArray} dic  Dictionary字符串字典数组
 * @return {StringArray}      返回一个装有所有搜索结果的字符数组
 */
var queryKeyWords = function (keys, dic) {
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
/**
 * 搜索框字典数组
 * @type {Array}
 */
var keywordsdata = [
  "as", "asd", "zxccwr", "zxcer", "utjy", "ndftr", "啊水水水水"
]
//===========================================================================================================================
// $(".card>div:not('.card_head')").hide(100)
//===========================================================================================================================


// window.currentPos = "myOrder"

var contentmapper = {
  myOrder: "myorder-content.html",
  myOrderDealer: "myorder-content-dealer.html",
  myOrderSupplier: "myorder-content-supplier.html",
  orderAdmin: "order-content.html",
  Brochure: "Brochure-content.html",
  BrochureAdmin: "Brochure-content-admin.html",
  Dealer: "Dealer-content.html",
  Supplier: "Supplier-content.html",
  Admin: ""
}

var hyperlink_init = function () {
  $(".nav .section a")
    .on('click', function () {
      var position = $(this)
        .attr("href")
        .substring(1)
      var file = contentmapper[position]
      if ("" == file || undefined == file) return
      $.ajax({
        url: "./content/" + file,
        async: false,
        success: function (Obj) {
          $("#content_wapper")
            .empty()
          $("#content_wapper")
            .append(Obj.trim())

          window.currentPos = position//HACK Button

          initPageByName("content")
          sideclose()
        }
      })
    })
}

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
  this.url = url
  this.urlTimestamp = null
  this.tableHTML = null
  this.keyArr = []
  this.responseJson = null
  this.hasButton = false
  this.hasHeader = false
  this.Header = null
  this.container = null
  this.PrimaryKeyIndex = null;
  this.data = {}
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
  this.hasButton = this.responseJson.hasButton ? this.responseJson.hasButton : false
  console.log("hasButton", this.hasButton);
  this.keyArr = this.responseJson.keyArr
  this.PrimaryKeyIndex = this.keyArr.indexOf('id')
  var data = this.responseJson.data
  var table = $('<table class="table table-bordered table-hover table-striped"></table>')
  var tbody = $("<tbody></tbody>")
  //若有header，初始化header
  if (this.hasHeader) {
    var hr = data.reverse().pop()
    this.Header = hr
    if (this.hasButton) {
      this.Header.push("操作")
      this.keyArr.push("operation")
    }
    var headRow = new table_row(this.Header, this, true)
    this.data["header"] = headRow
    tbody.append(headRow.HTMLObj) //jsonToHTMLRow将json对象中的data数据转成hr对象
    data.reverse()
    c = this.data
  }
  //将data装载成table row
  for (var i = 0; i < data.length; i++) {
    // var row = this.jsonToHTMLRow(data[i])
    var row = new table_row(data[i], this, false, this.Header)
    //PrimaryKeyValue 该行的主键值
    var PrimaryKeyValue = data[i][this.PrimaryKeyIndex]
    this.data[PrimaryKeyValue] = row
    tbody.append(row.HTMLObj)
  }
  table.append(tbody)
  this.tableHTML = table
  return this
}
table.prototype.to = function($tableContainer) {
  $tableContainer = $($tableContainer)
  this.container = $tableContainer
  $tableContainer.empty()
  $tableContainer.append(this.tableHTML)
  return this
}
//bindModal放在这里逻辑上有问题
table.prototype.bindModal = function() {
  var t = new table("./test/order-Detail.json")
  $(this.tableHTML)
    .find('tr td:nth-child(2)')
    .on('click', {
      t: t
    }, function(e) {
      $("#orderDetail .goodsInfomation")
        .empty()
      var steps = $("#orderDetail")
        .find(".steps")
      var baseInfos = $("#orderDetail")
        .find(".baseInfomation")
      var comment = $("#orderDetail")
        .find(".comment")
      //此处需要一个api来获取绑定数据的json数据
      t.load()
        .to("#orderDetail .goodsInfomation")
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
table.prototype.addInfoCard = function() {
  // 为所有子节点添加hidden-xs标签，缩放时隐藏
  this.tableHTML.find('tr')
    .children('*')
    .addClass('hidden-xs')
  var colorArr = ["#6b85a4", "#86909e", "#b3b2cd"]
  var i = 0;
  for (var k in this.data) {
    if ("header" == k)
      continue
    var table_row = this.data[k]
    table_row.rowAddCard(colorArr[i % colorArr.length]) //包装成r对象
    var mod = $(table_row.buildCard()) //build成card
    mod.find(".card_head")
      .siblings('div')
      .hide()
    mod.find(".card_head")
      .on('click', function() {
        $(this)
          .siblings('div')
          .toggle()
      })
    $(table_row.HTMLObj)
      .after(mod)
    i++
  }
}

var table_row = function(data, ParentTable, isHeader, Headers) {
  this.ParentTable = ParentTable
  this.hasButton = ParentTable.hasButton
  this.keyArr = ParentTable.keyArr
  this.isHeader = isHeader
  this.Headers = this.isHeader ? data : Headers
  this.HTMLObj = this.init(data, this.keyArr, this.hasButton, this.isHeader)
  this.JSONObj = data
  this.CardJSONObj = null
  this.CardHTMLObj = null
}
table_row.prototype.init = function(data, keyArr, hasButton, isHeader) {
  var row = $("<tr></tr>")
  var id = null;
  for (var i = 0; i < data.length; i++) {
    if (isHeader) {
      var th = $("<th></th>")
      row.append(th.html(this.Headers[i]))
    } else {
      var td = $("<td></td>")
      row.append(td.html(data[i]))
    }
  }
  if (hasButton && !isHeader) {
    //如果是header行，则不用加button
    var td = $("<td></td>")
    var PrimaryKeyValue = $(row.find("td")[this.PrimaryKeyIndex])
      .html() //HACK
    var buttonPool = []
    var editBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info edit\" onclick=\"edit(" + PrimaryKeyValue + ")\">编辑</button>")
    var delBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"del(" + PrimaryKeyValue + ")\">删除</button>")
    var supplyBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success del\" onclick=\"supply(" + PrimaryKeyValue + ")\">补充</button>")
    var approveBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info del\" onclick=\"approve(" + PrimaryKeyValue + ")\">通过</button>")
    var rejectBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"reject(" + PrimaryKeyValue + ")\">拒绝</button>")
    var expressBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success del\" onclick=\"expressUpdate(" + PrimaryKeyValue + ")\">物流更新</button>")

    //HACK button
    switch (window.currentPos) {
      case "myOrder":
      case "myOrderDealer":
        buttonPool.push(expressBtn)
        break
      case "orderAdmin":
        buttonPool.push(approveBtn)
        buttonPool.push(rejectBtn)
        break
      case "BrochureAdmin":
        buttonPool.push(supplyBtn)
        buttonPool.push(editBtn)
        buttonPool.push(delBtn)
        break
      case "Dealer":
        buttonPool.push(editBtn)
        buttonPool.push(delBtn)
        break
      case "Supplier":
        buttonPool.push(editBtn)
        buttonPool.push(delBtn)
        break
      case "Admin":
        break
    }

    for (var i = 0; i < buttonPool.length; i++) {
      td.append(buttonPool[i])
    }
    // HACK END
    row.append(td)
  }
  return row
}
table_row.prototype.rowAddCard = function(color) {
  row = this.HTMLObj
  var color = color ? color : "#6b85a4"
  var headers = {}
  var props = {}
  var publishDate = null
  for (var i in this.keyArr) {
    var tds = row.children("td") // 该行所有的tds
    props[this.Headers[i]] = $(tds[i])
      .html() //展示没有必要XSS,控制写入时就行
    //遍历keyArr,找到key对应的数据，填入
    if ("key" == this.keyArr[i] || "id" == this.keyArr[i]) {
      headers[this.Headers[i]] = $(tds[i])
        .html()
    }
    if ("publishDate" == this.keyArr[i]) {
      publishDate = $(tds[i])
        .html()
    }
  }
  var r = {
    "Header": headers,
    "Bgcolor": color,
    "Props": props,
    "Date": publishDate ? publishDate : ""
  }
  this.CardJSONObj = r
  return r
}
table_row.prototype.buildCard = function() {
  var cardHeader = this.CardJSONObj.Header
  // var header = this.Header
  var props = this.CardJSONObj.Props
  var date = this.CardJSONObj.Date
  var bgcolor = this.CardJSONObj.Bgcolor
  var headertext = ""
  for (var headertitle in cardHeader) {
    var headertextcontent = props[headertitle]
    if (headertextcontent.length > 20)
      headertextcontent = headertextcontent.substring(0, 20) + "..."
    headertext += headertitle + ":" + headertextcontent
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
  this.CardHTMLObj = $(template)
  return this.CardHTMLObj
}
table_row.prototype.remove = function() {
  this.HTMLObj.remove()
  this.JSONObj.remove()
  this.CardJSONObj.remove()
  this.CardHTMLObj.remove()
}
table_row.prototype.add = function(){

}
