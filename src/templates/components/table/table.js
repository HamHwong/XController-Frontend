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
    var headRow = new table_row(this.Header, true, this)
    this.data["header"] = headRow
    tbody.append(headRow.HTMLObj) //jsonToHTMLRow将json对象中的data数据转成hr对象
    data.reverse()
    c = this.data
  }
  //将data装载成table row
  for (var i = 0; i < data.length; i++) {
    // var row = this.jsonToHTMLRow(data[i])
    var row = new table_row(data[i], false, this)
    //PrimaryKeyValue 该行的主键值
    var PrimaryKeyValue = data[i][this.PrimaryKeyIndex]
    this.data[PrimaryKeyValue] = row
    tbody.append(row.HTMLObj)
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
  var trs = $table.find("tr")
  var colorArr = ["#6b85a4","#86909e","#b3b2cd"]
  for (var i = 0; i < trs.length; i++) {
    if (this.hasHeader && i == 0)
      continue
    var cardinfo = this.rowAddCard(trs[i],colorArr[i%colorArr.length]) //包装成r对象
    var mod = $(this
      .buildCard(cardinfo)) //build成card
    mod.find(".card_head")
      .siblings('div')
      .hide()
    mod.find(".card_head")
      .on('click', function() {
        $(this)
          .siblings('div')
          .toggle()
      })
    $(trs[i])
      .after(mod)
  }
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
table.prototype.rowAddCard = function(row, color) {
  row = $(row)
  var color = color ? color : "#6b85a4"
  var headers = {}
  var props = {}
  var publishDate = null
  for (var i in this.keyArr) {
    var tds = row.children("td") // 该行所有的tds
    props[this.Header[i]] = $(tds[i])
      .html() //展示没有必要XSS,控制写入时就行
    //遍历keyArr,找到key对应的数据，填入
    if ("key" == this.keyArr[i] || "id" == this.keyArr[i]) {
      headers[this.Header[i]] = $(tds[i])
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
  return r
}
table.prototype.buildCard = function(Obj) {
  var header = Obj.Header
  var props = Obj.Props
  var date = Obj.Date
  var bgcolor = Obj.Bgcolor
  var headertext = ""
  for (var headertitle in header) {
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

  return template
}
