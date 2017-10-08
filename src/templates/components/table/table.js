"use strict";

var table = function(url) {
  this.tableName = ""
  this.url = url
  this.urlTimestamp = null
  this.tableHTML = null
  this.keyArr = []
  this.responseJson = null
  this.hasButton = false
  this.buttonPool = []
  this.hasHeader = false
  this.hasDetail = false
  this.Header = null
  this.container = null
  this.PrimaryKeyIndex = null
  this.data = {}
  this.isUpdated = false
}
table.prototype.load = function(url) {
  //若参数带url，更新url
  if (!(url === undefined || "" === url)) {
    this.url = url
  }
  //第一次load 或者 大于60s没更新，就去获取一波
  if (this.urlTimestamp == null || this.timeDiff() > 60 || this.isUpdated) {
    this.fetch(this.url)
      .init()
      .bindEvents()
    this.urlTimestamp = new Date()
  }
  return this
}

table.prototype.loadFromTemplateJson = function(url, Options) {
  if (typeof url == "string") {
    //若参数带url，更新url
    if (!(url === undefined || "" === url)) {
      this.url = url
    }
    var c = url.split('.')
    if (c.length - 1 == c.lastIndexOf('json'))
      return this.load(url)
  }
  var template = {
    "tablename": "template",
    "hasHeader": false,
    "hasDetail": false,
    "hasButton": false,
    "viewOrder":[],
    "keyArr": [],
    "data": [
      [""]
    ]
  }

  template["tablename"] = Options["tablename"] ? Options["tablename"] : "table"
  template["hasHeader"] = Options["hasHeader"] ? Options["hasHeader"] : false
  template["hasDetail"] = Options["hasDetail"] ? Options["hasDetail"] : false
  template["hasButton"] = Options["hasButton"] ? Options["hasButton"] : false
  template["buttonPool"] = Options["buttonPool"] ? Options["buttonPool"] : []
  template["keyArr"] = Options["keyArr"] ? Options["keyArr"].slice(0) : []
  template["data"] = Options["data"] ? Options["data"].slice(0) : []
  template["viewOrder"] = Options["viewOrder"] ? Options["viewOrder"]: undefined
  //第一次load 或者 大于60s没更新，就去获取一波
  if (this.urlTimestamp == null || this.timeDiff() > 60 || this.isUpdated) {
    var datasource = (typeof url == "object") ? url : GET(url)
    var data = Adapter(datasource, template["viewOrder"])
    template["data"] = template["data"].concat(data)
    this.responseJson = template
    this.init()
      .bindEvents()
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
    type: "GET",
    cache: false,
    async: false
  })
  // console.log(tableJsonResponse.responseText);
  this.responseJson = JSON.parse(tableJsonResponse.responseText)
  return this
}

table.prototype.init = function() {
  this.tableName = this.responseJson.tablename
  this.hasHeader = this.responseJson.hasHeader
  this.hasDetail = this.responseJson.hasDetail
  this.buttonPool = this.responseJson.buttonPool
  this.hasButton = this.responseJson.hasButton ? this.responseJson.buttonPool : false
  this.keyArr = this.responseJson.keyArr.slice(0)
  this.PrimaryKeyIndex = this.keyArr.indexOf('id')
  var data = this.responseJson.data.slice(0)
  var table = $('<table class="table table-bordered table-hover table-striped"></table>')
  var tbody = $("<tbody></tbody>")
  table.append(tbody)
  this.tableHTML = table
  //若有header，初始化header
  //添加header
  if (this.hasHeader && !this.Header) {
    var hr = data.reverse()
      .pop()
    this.Header = hr.slice(0)
    if (this.hasButton) {
      this.Header.push("Operation")
      this.keyArr.push("operation")
    }
    var headRow = new table_row(this.Header, this, true)
    tbody.append(headRow.HTMLObj) //jsonToHTMLRow将json对象中的data数据转成hr对象
    data.reverse()
  }
  //将data装载成table row
  for (var i = 0; i < data.length; i++) {
    this.addRow(data[i])
  }
  this.addInfoCard()
  return this
}

table.prototype.to = function($tableContainer) {
  $tableContainer = $($tableContainer)
  this.container = $tableContainer
  $tableContainer.empty()
  $tableContainer.append(this.tableHTML)
  return this
}

table.prototype.bindEvents = function(callback) {
  if (!this.hasDetail)
    return
  callback = callback ? callback : Detail
  var data = this.data
  for (var i in data) {
    data[i].onClick(function() {
      callback.call(this, this.dataset.primarykey)
      // eval(callback+""+(this.dataset.primarykey))
    })
    data[i].onCardLongPress(500, function() {
      callback.call(this, this.dataset.primarykey)
      // eval(callback+""+(this.dataset.primarykey))
    })
  }
  return this
}

table.prototype.addInfoCard = function() {
  // 为所有子节点添加hidden-xs标签，缩放时隐藏
  this.tableHTML.find('tr:not(.info_card_row)')
    .children('*')
    .addClass('hidden-xs')
  var colorArr = ["#6b85a4", "#86909e", "#b3b2cd"]
  var i = 0;
  for (var k in this.data) {
    if ("header" == k)
      continue
    var table_row = this.data[k]
    if (table_row.CardHTMLObj) {
      table_row.CardHTMLObj.remove()
    }
    table_row.rowAddCard(colorArr[i % colorArr.length]) //包装成r对象
    table_row.buildCard() //build成card
    $(table_row.HTMLObj)
      .before(table_row.CardHTMLObj)
    i++
  }
  return this
}

table.prototype.new = function(Obj, header) {
  Obj["data"] = Obj["data"] ? Obj["data"] : []
  var Json = Obj
  if (Obj.hasHeader && header)
    Json["data"].push(header)
  this.responseJson = Json
  this.init()
  return this
}//disposable

table.prototype.addRow = function(rowJSONObj) {
  var tbody = $(this.tableHTML)
    .find("tbody")
  var row = new table_row(rowJSONObj, this, false, this.Header)
  //PrimaryKeyValue 该行的主键值
  var PrimaryKeyValue = rowJSONObj[this.PrimaryKeyIndex]
  if (this.data[PrimaryKeyValue]) {
    // throw "Error! This primary key is alreay occupied , If need update , please use update function"
  }
  this.data[PrimaryKeyValue] = row
  tbody.append(row.HTMLObj)
  this.addInfoCard()
  this.isUpdated = true
}

table.prototype.onCardLongPress = function(callback) {
  for (var item in this.data) {
    this.data[item].onCardLongPress(500, callback)
  }
}

table.prototype.onClick = function(callback) {
  for (var item in this.data) {
    this.data[item].onClick(callback)
  }
}

table.prototype.remove = function() {
  for (var i in this.data) {
    this.data[i].remove()
  }
}

table.prototype.update = function() {
  this.loadFromTemplateJson().to(this.container)
  this.isUpdated = false
}
