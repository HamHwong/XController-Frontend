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
