"use strict";

var table = function (url) {
  this.tableName = ""
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
table.prototype.load = function (url) {
  //若参数带url，更新url
  if (!(url === undefined || "" === url)) {
    this.url = url
  }
  //第一次load 或者 大于60s没更新，就去获取一波
  if (this.urlTimestamp == null || this.timeDiff() > 60) {
    this.fetch(this.url)
      .init()
      .addInfoCard()
      .bindEvents()
    this.urlTimestamp = new Date()
  }
  return this
}
table.prototype.timeDiff = function () {
  return (new Date()
    .getTime() - this.urlTimestamp.getTime()) / 1000
}
table.prototype.fetch = function (url) {
  var tableJsonResponse = $.ajax({
    url: url,
    async: false
  })
  // console.log(tableJsonResponse.responseText);
  this.responseJson = JSON.parse(tableJsonResponse.responseText)
  return this
}
table.prototype.init = function () {
  this.tableName = this.responseJson.tablename
  this.hasHeader = this.responseJson.hasHeader
  this.hasButton = this.responseJson.hasButton ? this.responseJson.hasButton : false
  // console.log("hasButton", this.hasButton);
  this.keyArr = this.responseJson.keyArr
  this.PrimaryKeyIndex = this.keyArr.indexOf('id')
  var data = this.responseJson.data
  var table = $('<table class="table table-bordered table-hover table-striped"></table>')
  var tbody = $("<tbody></tbody>")
  table.append(tbody)
  this.tableHTML = table
  //若有header，初始化header
  if (this.hasHeader && !this.Header) {
    var hr = data.reverse()
      .pop()
    this.Header = hr
    if (this.hasButton) {
      this.Header.push("Operation")
      this.keyArr.push("operation")
    }
    var headRow = new table_row(this.Header, this, true)
    // this.data["header"] = headRow
    tbody.append(headRow.HTMLObj) //jsonToHTMLRow将json对象中的data数据转成hr对象
    data.reverse()
  }
  //将data装载成table row
  for (var i = 0; i < data.length; i++) {
    this.addRow(data[i])
  }
  return this
}
table.prototype.to = function ($tableContainer) {
  $tableContainer = $($tableContainer)
  this.container = $tableContainer
  $tableContainer.empty()
  $tableContainer.append(this.tableHTML)
  return this
}
//bindModal放在这里逻辑上有问题
// table.prototype.bindModal = function () {
//   var t = new table("./test/order-Detail.json")
//   debugger
//   $(this.tableHTML)
//     .find('tr:not(.info_card_row) td:not(.operation)')
//     .on('click', {
//       t: t
//     }, function (e) {
//       $("#orderDetail .goodsInfomation")
//         .empty()
//       var steps = $("#orderDetail")
//         .find(".steps")
//       var baseInfos = $("#orderDetail")
//         .find(".baseInfomation")
//       var comment = $("#orderDetail")
//         .find(".comment")
//       //此处需要一个api来获取绑定数据的json数据
//       t.load()
//         .to("#orderDetail .goodsInfomation")
//       // console.log(t.responseJson);
//       var j = t.responseJson
//       var currStep = j.steps
//       var infos = j.baseInfos
//       var steplis = steps.find('li')
//       steplis.removeClass("active")
//       for (var c = 0; c < currStep; c++) {
//         $(steplis[c])
//           .addClass("active")
//       }
//       $("#orderDetail")
//         .modal()
//     })
// }

table.prototype.bindEvents = function () {
  var data = this.data
  // for (var i in data) {
  //   data[i].onCardLongPress(function () {
  //     orderDetail(this.dataset.primarykey)
  //   })
  // }
  // this.onCardLongPress(function (e) {
  //   console.log("long press");
  //   orderDetail(this.dataset.primarykey)
  // })
  // this.onClick(function (e) {})
  //为每一行绑定事件

  for (var i in data) {
    data[i].onClick(function () {
      orderDetail(this.dataset.primarykey)
    })
    data[i].onCardLongPress(500, function () {
      orderDetail(this.dataset.primarykey)
    })
  }

}
table.prototype.addInfoCard = function () {
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
    table_row.buildCard() //build成card
    table_row.CardHTMLObj.find(".card_head")
      .siblings('div')
      .hide()
    table_row.CardHTMLObj.find(".card_head")
      .on('click', function () {
        $(this)
          .siblings('div')
          .toggle()
      })
    $(table_row.HTMLObj)
      .after(table_row.CardHTMLObj)
    i++
  }
  return this
}
table.prototype.new = function (Obj, header) {
  var tablename = Obj.tablname ? Obj.tablename : ""
  var hasHeader = Obj.hasHeader ? Obj.hasHeader : false
  var hasButton = Obj.hasButton ? Obj.hasButton : false
  var keyArr = Obj.keyArr ? Obj.keyArr : []
  var Json = {
    "tablename": tablename,
    "hasHeader": hasHeader,
    "hasButton": hasButton,
    "keyArr": keyArr,
    "data": []
  }
  if (hasHeader && header)
    Json["data"].push(header)
  this.responseJson = Json
  this.init()
  return this
}
table.prototype.addRow = function (rowJSONObj) {
  var tbody = $(this.tableHTML)
    .find("tbody")
  var row = new table_row(rowJSONObj, this, false, this.Header)
  //PrimaryKeyValue 该行的主键值
  var PrimaryKeyValue = rowJSONObj[this.PrimaryKeyIndex]
  if (this.data[PrimaryKeyValue]) {
    debugger
    throw "Error! This primary key is alreay occupied , If need update , please use update function"
  }
  this.data[PrimaryKeyValue] = row
  tbody.append(row.HTMLObj)
}

table.prototype.onCardLongPress = function (callback) {
  for (var item in this.data) {
    this.data[item].onCardLongPress(500, callback)
  }
}
table.prototype.onClick = function (callback) {
  for (var item in this.data) {
    this.data[item].onClick(callback)
  }
}
