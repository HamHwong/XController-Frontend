"use strict";

var table = function (url, options) {
  var url = this.checkUrl(url) ? url : ""
  var options = this.checkObj(options) ? options : new Object()
  var opts = {
    hasButton: typeof (options.hasButton) !== "undefined" ? options.hasButton : "false",
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
  this.container = null
  this.PrimaryKeyIndex = null;
  this.data = {}
}

table.prototype.checkObj = function (obj) {
  if (typeof obj === "object") {
    return true
  } else {
    // throw "the params is not a object."
    return false
  }
}
table.prototype.checkUrl = function (url) {
  if (typeof url === "string" && url.length > 0) {
    return true
  } else {
    throw "the params is not a url."
  }
}

table.prototype.load = function (url) {
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
  this.hasHeader = this.responseJson.hasHeader
  this.keyArr = this.responseJson.keyArr
  this.PrimaryKeyIndex = this.keyArr.indexOf('id')
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
    var PrimaryKeyValue = data[i][this.PrimaryKeyIndex]
    this.data[PrimaryKeyValue] = {
      "HTMLObj": row,
      "JSONObj": data[i]
    } //将主键和row绑定在一起形成键值对
    tbody.append(row)
  }
  table.append(tbody)
  this.tableHTML = table
  return this
}
table.prototype.addInfoCard = function () {
  // 为所有子节点添加hidden-xs标签，缩放时隐藏
  this.tableHTML.find('tr')
    .children('*')
    .addClass('hidden-xs')
  $table = this.tableHTML
  var trs = $table.find("tr")
  for (var i = 0; i < trs.length; i++) {
    if (this.hasHeader && i == 0)
      continue
    var cardinfo = this.rowAddCard(trs[i])
    var mod = $(new table_card()
      .build(cardinfo))
    mod.find(".card_head")
      .siblings('div')
      .hide()
    mod.find(".card_head")
      .on('click', function () {
        $(this)
          .siblings('div')
          .toggle()
      })
    $(trs[i])
      .after(mod)
  }
}
table.prototype.to = function ($tableContainer) {
  $tableContainer = $($tableContainer)
  this.container = $tableContainer
  $tableContainer.empty()
  $tableContainer.append(this.tableHTML)
  return this
}
//bindModal放在这里逻辑上有问题
table.prototype.bindModal = function () {
  var t = new table("./test/order-Detail.json", {
    hasButton: false
  })
  $(this.tableHTML)
    .find('tr td:nth-child(2)')
    .on('click', {
      t: t
    }, function (e) {
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
 * @param  {JsonArr}  cellArr  数据数组，数据信息
 * @param  {Boolean} isHeader 是否为标题行
 * @param  {strArr}  keyArr   'prop','key','operation'
 * @return {JQueryTableRow}   Table的row
 */
table.prototype.jsonToRow = function (cellArr, isHeader, keyArr) {
  var row = $("<tr></tr>")
  var id = null;
  for (var i = 0; i < cellArr.length; i++) {
    if (isHeader) {
      var th = $("<th></th>")
      row.append(th.html(cellArr[i]))
    } else {
      var td = $("<td></td>")
      row.append(td.html(cellArr[i]))
    }
  }
  if (this.hasButton) {
    if (isHeader) {
      row.append($("<th key='operation'>操作</th>"))
    } else {
      var td = $("<td></td>")
      var PrimaryKeyValue = $(row.find("td")[this.PrimaryKeyIndex])
        .html() //HACK
      var editBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info edit\" onclick=\"edit(" + PrimaryKeyValue + ")\">EDIT</button>")
      var delBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"del(" + PrimaryKeyValue + ")\">DELETE</button>")
      td.append(editBtn)
        .append(delBtn)
      row.append(td)
    }
  }
  return row
}
table.prototype.rowAddCard = function (row, color) {
  row = $(row)
  var color = color ? color : "#4A8BC2"
  var headers = {}
  var props = {}
  var publishDate = null
  for (var i in this.keyArr) {
    var tds = row.children("td") // 该行所有的tds
    props[this.Header[i]] = filterXSS($(tds[i])
      .html())
    //遍历keyArr,找到key对应的数据，填入
    if ("key" == this.keyArr[i] || "id" == this.keyArr[i]) {
      headers[this.Header[i]] = filterXSS($(tds[i])
        .html())
    }
    if ("publishDate" == this.keyArr[i]) {
      publishDate = filterXSS($(tds[i])
        .html())
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

var table_card = function () {
  this.build = function (Obj) {
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

    var row = function (propName, value) {
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
