var table_row = function(data, isHeader, ParentTable ) {
  this.ParentTable = ParentTable
  this.hasButton = ParentTable.hasButton
  this.keyArr = ParentTable.keyArr
  this.isHeader = isHeader
  this.HTMLObj = this.init(data, this.keyArr, this.hasButton, this.isHeader)
  this.JSONObj = data
}
table_row.prototype.init = function(data, keyArr, hasButton, isHeader) {
  var row = $("<tr></tr>")
  var id = null;
  for (var i = 0; i < data.length; i++) {
    if (isHeader) {
      var th = $("<th></th>")
      row.append(th.html(data[i]))
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
table_row.prototype.remove = function() {
  this.HTMLObj.remove()
  this.JSONObj.remove()
}
//
// var table_col = function(data) {
//   this.HTMLObj = col
//   this.JSONObj = data
//   this.remove = function() {
//     this.HTMLObj.remove()
//     this.JSONObj.remove()
//   }
// }
