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
