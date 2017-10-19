/**
 * @description Bootstrap tab初始化
 */
var tab_init = function() {
  $('#myTab a:first').tab('show'); //切换栏
  $('#myTab a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
    var currentTab = $(this).attr("href")
    //获取到当前tab,
  })
}

var MessageAlert = function(msg,status) {
  this.status = status || "success"
  this.msg = msg || "Congratulation! Action performed!"
  this.statusCode = 0
  this.html = null
  this.dropback = null
  this.showoutTime = 600
  this.showtime = 1000
  this.hideTime = 300
  this.mod =
  `
  <div class="MassageAlert_Warp">
    <div class="MassageAlert">
      <label class="MassageAlert_Title">
        <i class="Icon"></i>
        <span class="Status">${this.status}</span>
      </label>
      <div class="MassageAlert_Body">
        <span>${this.msg}</span>
      </div>
      <div class="MassageAlert_Footer"></div>
    </div>
  </div>
  `
  // this.show()
}

MessageAlert.prototype.new = function() {
  if (!this.html) {
    this.html = $(this.mod)
    this.html.css("display", "none")
    $("body").append(this.html)
  }
  if (!this.dropback) {
    this.dropback = $('<div class="MassageAlert_dropback"></div>')
    $("body").append(this.dropback)
  }
  return this
}

MessageAlert.prototype.destory = function() {
  if (this.html) {
    this.html.remove()
  }
  if (this.dropback) {
    this.dropback.remove()
  }
}

MessageAlert.prototype.show = function(msg, status) {

  this.new(msg, status).html
    .show(this.showoutTime)
  this.dropback.fadeIn(this.showoutTime)

  var self = this
  setTimeout(function() {
    self.hide()
  }, this.showoutTime + this.showtime)

  return this

};
// MessageAlert.show = function(msg, status){
//   // this.incident
//   // if(MessageAlert){}
// }

MessageAlert.prototype.hide = function() {
  this.html.hide(this.hideTime)
  this.dropback.fadeOut(this.hideTime)
};

MessageAlert.Status = {
  SUCCESS: "SUCCESS",
  EXCEPTION: "EXCEPTION",
  ERROR: "ERROR",
}

MessageAlert.prototype.inStatus = function(status) {
  var isContain = true
  if ('string' != typeof status) {
    throw 'invalid status'
  }
  for (var i in this.Status) {
    isContain = isContain && (status.toUpperCase == this.Status[i])
  }
  return isContain
}

var messageAlert = new MessageAlert()


//===========================================================================================================================
//搜索条
//TODO-要有个sleep,函数执行太快
/**
 * @description 为搜索框绑定keyup事件，调用queryKeyWords动态地查询关键字，然后添加到下拉列表中
 */
// $(".search_box")
//   .on('keyup', function (e) {
//     // console.log(e);
//     e.preventDefault()
//     var droplist = $(".search_box_warp .keyhint")
//     droplist.empty()
//     var data = queryKeyWords(this.value, keywordsdata)
//     for (var i in data) {
//       var li = $("<li></li>")
//       var a = $("<a href=\"#\" class='keywords'></a>")
//       a.html(data[i])
//       li.append(a)
//       droplist.append(li)
//     }
//     if (data.length > 0 && this.value != "") {
//       $(".search_box_warp")
//         .addClass("open")
//       $(".keywords")
//         .on('click', function (e) {
//           $("#search_box")
//             .val(this.innerText)
//           droplist.empty()
//           $(".search_box_warp")
//             .removeClass("open")
//         })
//     } else {
//       $(".search_box_warp")
//         .removeClass("open")
//     }
//   })
/**
 * @description 从字典数组中查询到
 * @param  {String} keys 输入的关键字字符串
 * @param  {StringArray} dic  Dictionary字符串字典数组
 * @return {StringArray}      返回一个装有所有搜索结果的字符数组
 */
var queryKeyWords = function(keys, dic) {
  var b = []
  var r = []
  for (var i in dic) {
    if (dic[i].includes(keys)) {
      var keywords = dic[i].match(keys)
      r.push(dic[i])
      var blodKeyWord = dic[i].replace(keywords, "<b>" + keywords + "</b>")
      b.push(blodKeyWord)
    }
  }
  return {
    blod: b,
    raw: r
  }
}

var bindInputQuery = function($input, datasource, keywordKey, callback) {
  $input = $($input)
  $($input).unbind("keyup")

  //给select添加上option（真正提交的部分）
  var optionlist = $input.siblings("select.queryinput")
  $(optionlist).empty()
  var category = $(optionlist).data('source')
  for (var j of datasource) {
    var id = ""
    var name = ""
    if ("ziess" == category) {
      id = j["eNNameField"]
      name = j["nameField"]
    } else {
      id = j["_id"]
      name = j[keywordKey]
    }
    var option = `<option value="${id}">${name}</option>`
    $(optionlist).append($(option))
  }

  //给input绑定上keyup事件
  $input.on('keyup', function(e) {
    e.preventDefault()
    var keywordsdata = null
    if ("string" == typeof datasource) {
      keywordsdata = JSON.parse($.ajax({
          url: datasource,
          async: false
        })
        .responseText)
    } else {
      keywordsdata = datasource // 以name为主键
    }

    //HACK
    var set = {}
    var result = arrayToSet(keywordsdata, keywordKey)
    var nameArray = []
    for (var i in result) {
      nameArray.push(i)
      //dealername-dealerid
      set[i] = result[i]["_id"]
    }

    var droplist = $input.siblings(".keyhint")
    droplist.empty()

    var data = queryKeyWords(this.value, nameArray)
    for (var i = 0; i < data["raw"].length; i++) {
      var key = data["raw"][i]
      var value = set[key]
      var li = $("<li></li>")
      var a = $(`<a href=\"#\" class='keywords' value='${value}'></a>`)
      a.html(data["blod"][i])
      li.append(a)
      droplist.append(li)
    }

    if (data["raw"].length > 0 && this.value != "") {
      $input.parent(".search_box_warp").addClass("open")
      $(".keywords").on('click', function(e) {
        var select = $input.siblings("select.queryinput")
        var val = $(this).attr("value")
        select.val(val)
        $input.val(this.innerText)
        droplist.empty()
        $input.parent(".search_box_warp").removeClass("open")
        if (callback) {
          callback()
        }
      })
    } else {
      $input.parent(".search_box_warp").removeClass("open")
    }
  })
}

//多模态HACK
var counter = 0;
$(document).unbind('hidden.bs.modal')
  .on('hidden.bs.modal', '.modal', function(e) {
    $(this)
      .css("z-index", 1050)
    // $('.modal-backdrop')[counter].css("z-index",1049)
    counter--
  });
$(document).unbind('show.bs.modal')
  .on('show.bs.modal', '.modal', function(e) {
    $(this)
      .css("z-index", 1050 + counter)
    // if ($('.modal-backdrop').length <= 1 )
    //   return
    // $('.modal-backdrop')[counter].css("z-index", 1049 + counter)
    counter++
  });

// window.currentPos = "myOrder"

var contentmapper = {
  MyOrder: "MyOrder.html",
  OrderAdmin: "OrderAdmin.html",
  BrochureAdmin: "BrochureAdmin.html",
  DealerAdmin: "DealerAdmin.html",
  SupplierAdmin: "SupplierAdmin.html",
  SystemAdmin: "SystemAdmin.html",
  Inventory: "Inventory.html",
  Dictionary: "Dictionary.html",
  Approval: "Approval.html",
  Workflow: "Workflow.html",
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
        url: "./content/" + getCookie("auth") + "/" + file,
        async: false,
        success: function (Obj) {
          $("#content_wapper")
            .empty()
          $("#content_wapper")
            .append(Obj.trim())
          // window.currentPos = getCookie("auth") + "." + position //HACK Button
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

table.prototype.loadFromTemplateJson = function(DataSource, Options) {
  if (typeof DataSource == "string") {
    //若参数带url，更新url
    if (!(DataSource === undefined || "" === DataSource)) {
      this.url = DataSource
    }
    var c = DataSource.split('.')
    if (c.length - 1 == c.lastIndexOf('json'))
      return this.load(DataSource)
  }
  var template = {
    "tablename": "template",
    "hasHeader": false,
    "hasDetail": false,
    "hasButton": false,
    "viewOrder": [],
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
  template["viewOrder"] = Options["viewOrder"] ? Options["viewOrder"] : undefined
  //第一次load 或者 大于60s没更新，就去获取一波
  if (this.urlTimestamp == null || this.timeDiff() > 60 || this.isUpdated) {
    var datasource = (typeof DataSource == "object") ? DataSource : GET(DataSource)
    var data = Adapter(datasource, template["viewOrder"])
    template["data"] = template["data"].concat(data)
    this.responseJson = template
    this.init().bindEvents()
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
      this.Header.push("操作")
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
} //disposable

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
table.prototype.editRow = function(key, row) {

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

table.prototype.update = function(rowKey, row) {
  var set = arrayToSet(this.responseJson.data, this.PrimaryKeyIndex)
  if (row instanceof Array)
    set[rowKey] = row
  else {
    var c  = setToArray(row,this.responseJson["viewOrder"])
    set[rowKey] = c
  }
  // this.init()
  // this.loadFromTemplateJson(this.responseJson.data, this.responseJson).to(this.container)
  return this
  // this.init().bindEvents()
  // this.loadFromTemplateJson().to(this.container)
  // this.isUpdated = false
}

var table_row = function(data, ParentTable, isHeader, Headers) {
  this.ParentTable = ParentTable
  this.hasButton = ParentTable.hasButton
  this.buttonPool = ParentTable.buttonPool
  this.keyArr = ParentTable.keyArr
  this.PrimaryKeyIndex = ParentTable.PrimaryKeyIndex
  this.PrimaryKeyValue = data[this.PrimaryKeyIndex]
  this.isHeader = isHeader
  this.Headers = this.isHeader ? data : Headers
  this.data = data
  this.JSONObj = data
  this.HTMLObj = this.init()
  this.CardJSONObj = null
  this.CardHTMLObj = null
}
table_row.prototype.init = function(data, keyArr, hasButton, isHeader) {
  var row = this.isHeader ? $("<tr id='header'></tr>") : $("<tr></tr>")
  var id = null;
  for (var i = 0; i < this.data.length; i++) {
    if (this.isHeader) {
      var th = $("<th></th>")
      row.append(th.html(this.Headers[i]))
    } else {
      var td = $("<td data-primaryKey='" + this.PrimaryKeyValue + "'></td>")
      row.append(td.html(this.data[i]))
    }
  }
  if (this.hasButton && !this.isHeader) {
    //如果是header行，则不用加button
    var td = $("<td class='operation'></td>")
    var buttonPool = []
    var editBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info edit\" onclick=\"edit('" + this.PrimaryKeyValue + "')\">Edit</button>")
    var PIEditBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info edit\" onclick=\"PurchaseItem.view.edit('" + this.PrimaryKeyValue + "')\">Edit</button>")
    var submitBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info submit\" onclick=\"submit('" + this.PrimaryKeyValue + "')\">Submit</button>")
    var deleteBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"delete('" + this.PrimaryKeyValue + "')\">Delete</button>")
    var PIdeleteBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"PurchaseItem.event.delete('" + this.PrimaryKeyValue + "')\">Delete</button>")
    var updateBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-primary update\" onclick=\"update('" + this.PrimaryKeyValue + "')\">Update</button>")
    var supplyBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success supply\" onclick=\"supply('" + this.PrimaryKeyValue + "')\">Supply</button>")
    var approveBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info approve\" onclick=\"approve('" + this.PrimaryKeyValue + "')\">Approve</button>")
    var rejectBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger reject\" onclick=\"reject('" + this.PrimaryKeyValue + "')\">Reject</button>")
    var expressUpdateBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success expressUpdate\" onclick=\"SupplierPRDetail.view.update('" + this.PrimaryKeyValue + "')\">Express Update</button>")
    var expressViewBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success expressView\" onclick=\"expressStatus('" + this.PrimaryKeyValue + "')\">Express Status</button>")
    var finishedBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-primary finish\" onclick=\"finish('" + this.PrimaryKeyValue + "')\">Finish</button>")
    var historyBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success history\" onclick=\"History('" + this.PrimaryKeyValue + "')\">History</button>")
    var copyBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info copy\" onclick=\"copy('" + this.PrimaryKeyValue + "')\">Copy</button>")
    var deleteDraftBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"deleteDraft('" + this.PrimaryKeyValue + "')\">Delete</button>")

    for (var i in this.buttonPool) {
      var button = eval(this.buttonPool[i])
      button.prop("parentTable", this.ParentTable)
      button.prop("parentRow", this)
      buttonPool.push(button)
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
  var primaryKey = this.PrimaryKeyValue
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
    `<tr class="info_card_row" data-primaryKey="${primaryKey}">
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
  this.CardHTMLObj.find(".card_head")
    .siblings('div')
    .hide()
  this.CardHTMLObj.find(".card_head")
    .on('click', function() {
      $(this)
        .siblings('div')
        .toggle()
    })
  return this.CardHTMLObj
}
table_row.prototype.remove = function() {
  if (this.HTMLObj) {
    this.HTMLObj.remove()
    this.JSONObj = ""
  }
  if (this.CardHTMLObj) {
    this.CardHTMLObj.remove()
    this.CardJSONObj = ""
  }
}
table_row.prototype.add = function() {

}
table_row.prototype.onCardLongPress = function(time, callback) {
  console.log("longPress");
  $(this.CardHTMLObj)
    .find(".card_body")
    .on({
      touchstart: function(e) {
        timeOutEvent = setTimeout(callback, time);
      },
      touchmove: function() {
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
      },
      touchend: function() {
        clearTimeout(timeOutEvent);
        return false;
      }
    })
}
table_row.prototype.onClick = function(callback) {
  console.log("click");
  $(this.HTMLObj)
    .find("td:not('.operation')")
    .on("click", callback)
}

const regxRule = {
  account: "",
  email: {
    regx: "\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}",
    warning: "请输入正常的邮箱"
  },
  mobile: {
    regx: "(13\\d|14[57]|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[0589]\\d{7}",
    warning: ""
  },
  number: {
    regx: function(min, max) {
      var result = min
      if (max)
        result += "," + max
      return `^\\d{${result}}$`
    },
    warning: ""
  }
}

var validator = {
  init: function() {
    var form = $("form[data-validator=true]")
    var validatelist = form.find("*[data-regxRule]")
    for (var i = 0; i < validatelist.length; i++) {
      var control = $(validatelist[i])
      // debugger
      if (control.is("input")) {
        var type = control.attr('type') || 'text'
        switch (type) {
          case 'password':
          case 'text':
          case 'email':
          case 'tel':
          case 'url':
          case 'search':
            control.on('keyup', function(e) {
              console.log($(e.target).data('regxrule'), 'onkeyup works')
              var target = $(e.target)
              var rule = target.data('regxrule')
              validator.validate(target, rule)
            })
            break
          case 'radio':
          case 'checkbox':
          case 'hidden':
            control.on('change', function(e) {
              console.log($(e.target).data('regxrule'), 'onchange works')
              var target = $(e.target)
              var rule = target.data('regxrule')
              validator.validate(target, rule)
            })
            break
          default:
            break
        }
      } else if (control.is("select")) {
        control.on('change', function(e) {
          console.log($(e.target).data('regxrule'), 'onchange works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          validator.validate(target, rule)
        })
      } else if (control.is("textarea")) {
        control.on('keyup', function(e) {
          console.log($(e.target).data('regxrule'), 'onkeyup works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          validator.validate(target, rule)
        })
      }

      // console.log(control,control.data('regxrule'))
      //若是input text password，则绑定onkeyup
      //若是input checkbox radio 则绑定 onchange
    }
  },
  validate: function(target, rule) {
    var result = {}
    var regStr = ""
    var regxResult = rule.split(/\(([^)]*)\)/) //匹配括号里的内容
    var category = regxResult[0]
    var limit = regxResult[1]
    console.log(category, limit)
    var c = null
    if (!(c = regxRule[category])) {
      //无值
      var str = category
      try {
        c = eval(str)
      } catch (e) {
        c = str
      }

      if ('function' == typeof c) {
        //若为函数,则将target传入进行判断,返回true或者false
        result['result'] = c(target)
        result['warning'] = result['result'] ? "OK" : "ERROR"
      } else if ('string' == typeof c) {
        //若为字符串，则为正则
        regStr = c
        var regexp = new RegExp(regStr)
        var value = $(target).is("input") ? $(target).val() : $(target).text()
        result['result'] = regexp.test(value)
        result['warning'] = result['result'] ? "OK" : "ERROR"
      }
    } else if (c = regxRule[category]) {
      //若在正则库中到，则说明为正则
      if ('function' == typeof c["regx"]) {
        if (limit) {
          //若有limit 则说明需要限制长度
          var limitList = limit.split(",")
          var min = ""
          var max = ""
          var MinAndMax = ""
          if (limitList.length > 2)
            throw ('only two integers required,Max and Min')
          else if (limitList.length == 2) {
            try {
              var i1 = parseInt(limitList[0])
              var i2 = parseInt(limitList[1])
              max = i1 > i2 ? i1 : i2
              min = i1 < i2 ? i1 : i2
              // MinAndMax = min + "," + max
            } catch (e) {
              throw e
            }
          } else {
            min = parseInt(limitList[0])
          }
          regStr = c["regx"](min, max)
        } else {
          regStr = c["regx"]()
        }
      }else{
        regStr = c["regx"]
      }
      console.log(c["regx"])
      var regexp = new RegExp(regStr)
      var value = $(target).is("input") ? $(target).val() : $(target).text()
      console.log(value, regexp.test(value))
      result['result'] = regexp.test(value)
      result['warning'] = c['warning']
    }
    return result
  }
}


var PRDetail = {
  show: function() {
    $("#Detail").modal()
  },
  hide: function() {
    $("#Detail").modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#Detail",
      targetPITableArea = "#InfomationArea",
      templateOpts = tableStructures.Dealer.MyOrder.orderDetail
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea, "PRD") //将PR填充到表单
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      new table().loadFromTemplateJson(PIinfoSet, templateOpts).to(targetPITableArea)
    }

    var steps = apiConfig.prprocess.Paging(PRid, 0, 100).reverse()
    for (var i = 0; i < steps.length; i++) {
      var result = steps[i]["_result"]
      var time = steps[i]["_lastmodified"]
      var step = steps[i]["_prprocessstep"]
      var result = steps[i]["_result"]
      var mod = `<li class="glyphicon"><span>${step}</span><span class="operationtime">${time}</span></li>`
      $mod = $(mod)
      $mod.css("width", (100 / steps.length) + '%')

      if (result == Enum.enumApprovalResult.NoAction) {
        $mod.addClass('noAction')
      } else if (result == Enum.enumApprovalResult.Ready) {
        $mod.addClass('processing')
      } else if (result == Enum.enumApprovalResult.Success) {
        $mod.addClass('approved')
      } else if (result == Enum.enumApprovalResult.Rejected || Enum.enumApprovalResult.Failure) {
        $mod.addClass('rejected')
      }

      if (step == Enum.processStatus.NotifiedParty) {
        $mod.addClass('infomation')
      }

      $("#progressbar").append($mod)
    }
    //
    // var noAction = $("#progressbar").find('.noAction')
    // if (noAction.length > 1) {
    //   var processing = $(noAction[0])
    //   processing.addClass('processing')
    // }
  }
}

$("#Detail")
  .on("hidden.bs.modal", function() {
      $("#progressbar").empty()
    }
)

var PurchaseItem = {
  show: function() {
    $("#PruchaseItem")
      .modal()
  },
  hide: function() {
    $("#PruchaseItem")
      .modal('hide')
  },
  autoComplate: function(PI) {
    var targetPRArea = "#PruchaseItem_form"
    var PInfoSet = 'object' == typeof PI ? PI : apiConfig.purchaseitem.Get(PI) //查出改PI详情
    autoComplateInfo(PInfoSet, targetPRArea) //将PR填充到表单
  },
  update: function() {
    // var PIArr = apiConfig.purchaseitem.Paging(window._target.PI["_id"], 0, 100)
    var unsavePI = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
    var count = apiConfig.purchaseitem.Add(unsavePI)
    if (count <= 0) {
      // new messageAlert().show("Error",)
    }
    // var remotePI = arrayToSet(PIArr, "_id")
    // if (remotePI != unsavePI.length) { //bug
    //   var PId = window._target.PI["_id"]
    //   for (var i = 0; i < unsavePI.length; i++) {
    //     //若有新的，则添加，若为老的，则修改
    //     var nativePIid = unsavePI[i]["_id"]
    //     if (remotePI[nativePIid]) {
    //       var itemID = apiConfig.purchaseitem.Edit(nativePIid, unsavePI[i])
    //     } else {
    //       unsavePI[i]["_purchaserequisitionfk"] = PId
    //       var itemID = apiConfig.purchaseitem.Add(unsavePI[i])
    //       unsavePI[i]["_id"] = itemID
    //     }
    //   }
    //   //如果删除PI
    //   //更新后重新获取一下
    //   PIArr = apiConfig.purchaseitem.Paging(window._target.PI["_id"], 0, 100)
    //   nativePI = arrayToSet(unsavePI, "_id")
    //   for (var j = 0; j < PIArr.length; j++) {
    //     var remotePIid = PIArr[j]["_id"]
    //     if (!nativePI[remotePIid]) {
    //       apiConfig.purchaseitem.Delete(remotePIid)
    //     }
    //   }
    // }
  },
  updatePITable: function() {
    if (window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]) {
      //填充PI
      var PIinfoSet = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
      var tmp = PIinfoSet.slice(0)
      var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
      window.__PurchaseRequisitionItem_table = PItable
      PItable.to(window._targetPITableArea)
    }
  },
  destory: function() {
    ClearInputs("#PruchaseItem")
    $("#PIOperation").empty()
    window._target.PI = null
    window._operation = null
  },
  view: {
    init: function() {
      if (!window._target) {
        window._target = {}
      }
      if (!window._target.PI) {
        window._target.PI = {}
      }

      var operationArea = $("#PIOperation")
      var addbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.add()"><span class="glyphicon glyphicon-ok"></span></button>`
      var appendbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.append()"><span class="glyphicon glyphicon-plus"></span></button>`
      var editbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.edit()"><span class="glyphicon glyphicon-ok"></span></button>`
      var cancelbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.hide()"><span class="glyphicon glyphicon-remove"></span></button>`

      switch (window._operation) {
        case Enum.operation.Update:
          operationArea.append($(cancelbtn)).append($(editbtn))
          break
        case Enum.operation.Create:
          operationArea.append($(addbtn)).append($(cancelbtn)).append($(appendbtn))
          break
        default:
          operationArea.append($(cancelbtn))
          break
      }

    },
    add: function() {
      window._operation = Enum.operation.Create
      PurchaseItem.view.init()
      PurchaseItem.show()
    },
    edit: function(PIid) {
      window._operation = Enum.operation.Update
      PurchaseItem.view.init()
      if (PIid.includes("[unsave]")) {
        var PItems = arrayToSet(window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID], "_id")
        window._target.PI = PItems[PIid]
      } else {
        window._target.PI = apiConfig.purchaseitem.Get(PIid)
      }
      PurchaseItem.show()
      PurchaseItem.autoComplate(window._target.PI)
    }
  },
  event: {
    add: function() {
      PurchaseItem.event.append()
      PurchaseItem.hide()
    },
    append: function() {
      //是否fields全为空
      if (isAllPRTypeFormFieldEmpty("#PruchaseItem_form"))
        return
      //
      var arr = []
      var localid = ++row_counter + '[unsave]'
      arr.push(localid)
      var set = formToSet("#PruchaseItem_form")
      set["_id"] = localid
      var order = ["_brochurename", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"]
      for (var i of order) {
        arr.push(set[i])
      }
      if (window.__PurchaseRequisitionItem_table) {
        window.__PurchaseRequisitionItem_table.addRow(arr)
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID].push(set)
      }
      ClearInputs("#PruchaseItem_form", ["#_brochurename", "#_quantity"])
    },
    edit: function() {
      var target = window._target.PI
      var targetid = window._target.PI["_id"]
      var set = formToSet("#PruchaseItem_form")
      for (var k in set) {
        target[k] = set[k]
      }
      target["_id"] = targetid
      if (!targetid.toString().includes("[unsave]")) {
        apiConfig.purchaseitem.Edit(targetid, target)
      }
      var localSource = arrayToSet(window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID],"_id")
      for(var info in target){
        localSource[targetid][info] = target[info]
      }
      // window.__PurchaseRequisitionItem_table.update(target['_id'], target)
      PurchaseItem.updatePITable()
      ClearInputs("#PruchaseItem_form")
      PurchaseItem.hide()
    },
    delete: function(PIid) {
      // window.__PurchaseRequisitionItem_table.data[PIid].remove()
      var result = null;
      var PItems = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      if (!PIid.includes("[unsave]")) {
        result = apiConfig.purchaseitem.delete(PIid)
      }
      window.__PurchaseRequisitionItem_table.data[PIid].remove()
      // for (var i = 0; i < PItems.length; i++) {
      //   if (PIid == PItems[i]["_id"]) {
      //     var tempArr = PItems.splice(0, i - 1)
      //     PItems.reverse()
      //     PItems.pop()
      //     PItems.reverse()
      //     PItems = tempArr.concat(PItems)
      //   }
      // }
      alertMessage.show()
    }
  }
}

//绑定输入查询数据

// bindInputQuery("#_brochurename", "./test/searchDictionary/BrochureName.json")
//绑定交付时间组件
$('#_deliverydate')
  .datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    startDate: new Date(),
    autoclose: true,
    startView: 2,
    minView: 2,
    forceParse: false,
    language: 'zh-CN'
  });
$("#PruchaseItem")
  .on("hidden.bs.modal", function() {
    PurchaseItem.destory()
  })
$("#PruchaseItem").on("shown.bs.modal", function() {

})
var row_counter = 0

const PurchaseRequisition = {
  new: function(obj) {
    var PR = new Object()
    //TODO PR的model
    return PR
  },
  show: function() {
    PurchaseRequisition.init()
    $("#PurchaseRequisition")
      .modal()
  },
  hide: function() {
    $("#PurchaseRequisition")
      .modal('hide')
  },
  init: function() {
    //
    bindInputQuery("#requestordealerfk", apiConfig.dealer.Top(1000), "_dealername", function() {
      var val = $("#_requestordealerfk").val()
      var dealer = apiConfig.dealer.Get(val)
      $("#_dealerregion")
        .val(dealer["_dealerregion"])
      $("#_dealerregion")
        .attr("disabled", "true")
    })

    $("#requestoremployeefk").on("keyup", function(e) {
      bindInputQuery("#requestoremployeefk", apiConfig.employee.Search(e.target.value), "eNNameField", function() {
        var val = $("#_requestoremployeefk").val()
        var employee = apiConfig.employee.Search(val)
        $("#_dealerregion") //字段不见了
          .val(employee["_dealerregion"])
        $("#_dealerregion")
          .attr("disabled", "true")
      })
    })

    $("#submitter").val(getCookie('name'))
    $("#submitter").attr("disabled", "true")
    // PurchaseRequisition.view.init()

    // //若为dealer，则自动填充名字和区域
    if ("dealer" == (getCookie("auth").toLowerCase())) {
      var dealer = JSON.parse(getCookie('user'))
      if (dealer) {
        $("#_requestordealerfk")
          .val(dealer["_id"])
        $("#requestordealerfk").val(dealer["_dealername"])
        $("#requestoremployeefk").val(dealer["_dealername"])
        $("#requestordealerfk")
          .attr("readonly", "readonly")
        $("#requestoremployeefk")
          .attr("readonly", "readonly")
        $("#_dealerregion")
          .val(dealer["_dealerregion"])
        $("#_dealerregion")
          .attr("disabled", "true")
      }
      // autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
    } else if ("zeiss" == (getCookie("auth").toLowerCase())) {
      $("#requestoremployeefk").val(getCookie('name'))
      $("#requestoremployeefk")
        .attr("readonly", "readonly")
      var employee = JSON.parse(getCookie('user'))
      if (employee) {
        $(".requestorInput").hide()
        $("#forEmployee").show()
        $("#agentCheck").hide()
        $("#requireAgent").on("click", function() {
          if ($(this).is(":checked")) {
            $("#requestoremployeefk").val("")
            $("#requestoremployeefk")
              .removeAttr("readonly")

            $("#agentCheck input").removeAttr('disabled')
            $("#agentCheck").show()
          } else {
            $(".queryinput").val("")
            $(".requestorInput").hide()
            $("#forEmployee").show()

            var radio = $("#agentCheck input")
            for (var a = 0; a < radio.length; a++) {
              radio[a].checked = false
            }

            $("#requestoremployeefk").val(getCookie('name'))
            $("#requestoremployeefk")
              .attr("readonly", "readonly")

            $("#forEmployee").attr("readonly", "readonly")
            $("#agentCheck input").attr("checked", "false")
            $("#agentCheck input").attr('disabled', 'true')
            $("#agentCheck").hide()
          }
        })
        $("#agentCheck input").on("click", function(e) {
          var t = $(e.target)
          console.log(t.val());
          if (t.is(':checked')) {
            if (0 == t.val()) {
              $(".requestorInput").attr('disabled', 'true')
              $(".requestorInput").hide()
              $("#forEmployee").removeAttr('disabled')
              $("#forEmployee").show()
            } else {
              //for Dealer
              $(".requestorInput").attr('disabled', 'true')
              $(".requestorInput").hide()
              $("#forDealer").removeAttr('disabled')
              $("#forDealer").show()
            }
          }
        })
      }
    }

  },
  autoComplate: function(PRid) {
    var targetPRArea = "#PurchaseRequisition_form"
    window._targetPITableArea = "#InfomationAddArea"

    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      PurchaseRequisition.loadPITable(PRid)
    }

  },
  loadPITable: function(PRid) {
    //填充PI
    var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = PIinfoSet
    var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    var tmp = PIinfoSet.slice(0)
    // console.log(1, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
    // console.log(2, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    window.__PurchaseRequisitionItem_table = PItable
    // console.log(3, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    PItable.to(window._targetPITableArea)
    // console.log(4, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
  },
  detail: function(PRid) {
    $("#progressbar").empty()
    window._operation = Enum.operation.Read
    PRDetail.autoComplate(PRid)
    PRDetail.show()
  },
  destory: function() {
    ClearAllFields("#PurchaseRequisition")
    $("#progressbar").empty()
    if (window.__PurchaseRequisitionItem_table) {
      window.__PurchaseRequisitionItem_table.remove()
      window.__PurchaseRequisitionItem_table = null
    }
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
    window.__PurchaseRequisition_tempID = null
    window.__PurchaseRequisitionItem_Unsave_set = null
    window._target.PR = null
    window._operation = null
    window._targetPITableArea = null
    $("#operation").empty()
  },
  view: {
    init: function() {
      window.__PurchaseRequisition_tempID = generateUUID()

      if (!window._target) {
        window._target = {}
      }
      if (!window._target.PR) {
        window._target.PR = {}
      }
      if (!window.__PurchaseRequisitionItem_Unsave_set) {
        window.__PurchaseRequisitionItem_Unsave_set = {}
      }
      if (!window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]) {
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = []
      }

      var operationArea = $("#operation")
      var draftbtn = `<button type="button" class="btn btn-success col-xs-3 col-md-3 col-xs-offset-1" onclick="PurchaseRequisition.event.draft()">Draft</button>`
      var submitbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.submit()">提交</button>`
      var editbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.edit()">修改</button>`
      var cancelbtn = `<button type="button" class="btn btn-danger col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">取消</button>`
      var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
      switch (window._operation) {
        case Enum.operation.Update:
          operationArea.append($(editbtn)).append($(cancelbtn))
          break
        case Enum.operation.Create:
          operationArea.append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
          break
        case Enum.operation.Copy:
          operationArea.append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
          break
        default:
          operationArea.append($(closebtnlbtn))
          break
      }
    },
    create: function() {
      window._operation = Enum.operation.Create
      PurchaseRequisition.view.init()
      PurchaseRequisition.show()
      PurchaseRequisition.autoComplate()
    },
    copy: function(PRid) {
      window._operation = Enum.operation.Copy
      PurchaseRequisition.view.init()
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
    },
    edit: function(PRid) {
      window._operation = Enum.operation.Update
      PurchaseRequisition.view.init()
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
      // console.log(5, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    },
    delete: function(PRid) {
      window._operation = Enum.operation.Delete
      PurchaseRequisition.view.init()
      $("#Delete").modal()
    }
  },
  event: {
    draft: function() {
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_processstatus"] = Enum.prstatus.Draft
      data["_prnumber"] = generateUUID()
      var PRid = apiConfig.purchaserequisition.Draft(data)
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      for (var i = 0; i < items.length; i++) {
        items[i]["_purchaserequisitionfk"] = PRid
        var itemID = apiConfig.purchaseitem.Add(items[i])
      }
      ClearAllFields("#PurchaseRequisition")
      PurchaseRequisition.hide()
      table_init()
    },
    submit: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      // if (items.length <= 0) {
      //   throw "请购单item数量不能为0"
      // }
      debugger
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_prstatus"] = Enum.prstatus.Progress
      var submitter = $("#submitter").val()
      switch (getCookie('auth').toLowerCase()) {
        case 'zeiss':
          data["_submitteremployeefk"] = submitter
          // if ("" != $("#_requestordealerfk").val()) {
          //   if ($("#_requestoremployeefk").val() == submitter)
          //     data["_submitteremployeefk"] = submitter
          //   else
          //     data["_submitteremployeefk"] = $("#_requestoremployeefk").val()
          // } else if ("" != $("#_requestordealerfk").val()) {
          //   data["_submitteremployeefk"] = submitter
          // }
          // data["_submitteremployee"] = submitter
          break
        case 'dealer':
          data["_submitterdealerfk"] = submitter
          break
      }
      var PRid = apiConfig.purchaserequisition.Add(data)

      for (var i = 0; i < items.length; i++) {
        items[i]["_purchaserequisitionfk"] = PRid
        // var itemID = apiConfig.purchaseitem.Add(items[i])
      }
      apiConfig.purchaseitem.Add(items)

      apiConfig.prprocess.GenerateAll(PRid) //获取所有steps
      table_init() //更新
      PurchaseRequisition.hide()
    },
    edit: function() {
      $("#saver").val(getCookie("name"))
      var data = formToSet("#PurchaseRequisition_form")
      for (var v in data) {
        window._target.PR[v] = data[v]
      }
      apiConfig.purchaserequisition.Edit(window._target.PR["_id"], window._target.PR)
      PurchaseItem.update()
      PurchaseRequisition.hide()
      table_init() //更新
    }
  }
}

//绑定input搜索栏数据源
// bindInputQuery("#_demanderfk", "./test/searchDictionary/DealerCollections.json")
$("#PurchaseRequisition")
  .on("hidden.bs.modal", function() {
    //操作需要获取tempID来保存set，
    //因此将onshown的init写在PR.show()里面，
    //show只通过call show()方式来使modal显示。
    //而close可能会有其他事件引发，且close不是同步的，
    //故清除写在这里
    PurchaseRequisition.destory()
  })
$("#PurchaseRequisition").on("shown.bs.modal", function() {
})

$("#addPItem").on("click", function() {
  //如果没有请购单，则new一个
  if (!window.__PurchaseRequisitionItem_table) {
    // var PurchaseRequisitionItemTable = new table()
    var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    var title = {}
    window.__PurchaseRequisitionItem_table = new table().loadFromTemplateJson(title, templateOpts).to("#InfomationAddArea")
    // window.__PurchaseRequisitionItem_table.new(t, header).bindEvents()
    // .to($("#InfomationAddArea"))
  }
})

var SupplierPRDetail = {
  show: function() {
    $("#Detail").modal()
  },
  hide: function() {
    $("#Detail").modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRITableArea = "#Detail .goodsInfomation",
      templateOpts = tableStructures.Supplier.MyOrder.ExpressUpdateDetail
    if (PRid) {
      var PRIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      new table().loadFromTemplateJson(PRIinfoSet, templateOpts).to(targetPRITableArea)
    }
  },
  destory: function() {
    window._target.PR = null

    window._target = null
  },
  view: {
    init: function() {
      if (!window._target) {
        window._target = {}
      }
      if (!window._target.PR) {
        window._target.PR = {}
      }
      if (!window._target.PI) {
        window._target.PI = {}
      }
    },
    destory: function() {
      ClearTextArea("#Update")
      window._target.PI = null
    },
    update: function(PRid) {
      window._operation = Enum.operation.Read
      SupplierPRDetail.view.init()
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      SupplierPRDetail.autoComplate(PRid)
      SupplierPRDetail.show()
    },
    finish: function(PRid) {
      window._operation = Enum.operation.Update

      SupplierPRDetail.destory()
      SupplierPRDetail.hide()
    },
    Express: {
      show: function() {
        $("#Update").modal()
      },
      hide: function() {
        $("#Update").modal('hide')
      },
      update: function(PIid) {
        window._target.PI = apiConfig.purchaseitem.Get(PIid)
        SupplierPRDetail.view.Express.show()
      }
    }
  },
  event: {
    Express: {
      update: function() {
        window._target.PI["_logistics"] = formToSet("#update_Express")["_logistics"]
        apiConfig.purchaseitem.UpdateLogitics(window._target.PI["_id"], window._target.PI)
        SupplierPRDetail.view.Express.destory()
        SupplierPRDetail.view.Express.hide()
      }
    },
    finish:function(){
      window._target.PR["_prstatus"] = Enum.prstatus.Delivered
      apiConfig.purchaserequisition.Edit(window._target.PR["_id"],window._target.PR)
      SupplierPRDetail.destory()
      SupplierPRDetail.hide()
      table_init()
    }
  }
}


function Adapter(data, orderArray) {
  //HACK 将后台数据转化到前台table结构 -- 最好之后统一数据结构！
  //orderArray 显示的属性和顺序
  var order = orderArray
  if (!orderArray) {
    //若没有orderArray，则将所有的数据都显示出来
    order = []
    for (var key in data[0]) {
      order.push(key)
      // console.log(i); 
    }
  }
  var result = []
  for (var i = 0; i < data.length; i++) {
    var row = []
    for (var j = 0; j < order.length; j++) {
      row.push(data[i][order[j]])
    }
    result.push(row)
  }
  return result
}

// var root = "http://192.168.1.101:8082"
// var root = "http://192.168.1.101:7856"
var root = ""
const apiConfig = {
  brochure: {
    Get: function(id) {
      var api = root + `/api/brochure/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/brochure/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/brochure/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/brochure/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/brochure/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/brochure/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/brochure/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/brochure/paging(${startIndex},${endIndex})`
      return GET(api)
    }
  },
  brochurehistory: {
    Get: function(id) {
      var api = root + `/api/brochurehistory/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/brochurehistory/new`
      return POST(api, data)
    },
    Count: function() {
      var api = root + `/api/brochure/count`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/brochurehistory/top(${topcount})`
      return GET(api)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/brochurehistory/${id}/update`
      return PUT(api, data)
    },
    Paging: function(brochureid, startIndex, endIndex) {
      var api = root + `/api/brochurehistory/paging(${brochureid},${startIndex},${endIndex})`
      return GET(api)
    }
  },
  dealer: {
    Get: function(id) {
      var api = root + `/api/dealer/${id}`
      return GET(api)
    },
    GetByUserName: function(username) {
      var resultset = this.Search(username)
      for (var i of resultset) {
        if (i["_dealername"] == username)
          return i
      }
      return null
    },
    Add: function(data) {
      //POST
      var api = root + `/api/dealer/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/dealer/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/dealer/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/dealer/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/dealer/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/dealer/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/dealer/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/dealer/login?username=${username}&password=${password}`
      return PUT(api)
    }

  },
  optionlist: {
    Get: function(id) {
      var api = root + `/api/optionlist/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/optionlist/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/optionlist/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/optionlist/${id}`
      return DELETE(api)
    },
    Count: function() {
      var api = root + `/api/optionlist/count`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/optionlist/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/optionlist/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    GetByCategory: function(category) {
      var api = root + `/api/optionlist/category(${category})`
      return GET(api)
    }
  },
  prprocess: {
    Get: function(id) {
      var api = root + `/api/prprocess/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/prprocess/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/prprocess/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/prprocess/${id}`
      return DELETE(api)
    },
    GenerateAll: function(prid) {
      var api = root + `/api/prprocess/generateall?prID=${prid}`
      return POST(api)
    },
    Count: function() {
      var api = root + `/api/prprocess/count`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/prprocess/top(${topcount})`
      return GET(api)
    },
    Paging: function(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + `/api/prprocess/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    },
    Approving: function(id, processEnum) {
      var pr = this.Get(id)
      //GET /api/prprocess/paging({purchaseRequisitionid},{startIndex},{endIndex})
      pr["_prprocessstep"] = processEnum
      this.Edit(id, pr)
    },
    Approve: function() {

    },
    Reject: function() {

    },
    SupplierComplete: function() {

    }
  },
  prprocesssetting: {
    Get: function(id) {
      var api = root + `/api/prprocesssetting/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/prprocesssetting/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/prprocesssetting/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/prprocesssetting/${id}`
      return DELETE(api)
    },
    Top: function(topcount) {
      var api = root + `/api/prprocesssetting/top(${topcount})`
      return GET(api)
    },
    Paging: function(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + `/api/prprocesssetting/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    }
  },
  purchaseitem: {
    Get: function(id) {
      var api = root + `/api/purchaseitem/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/purchaseitem/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/purchaseitem/${id}/update`
      return PUT(api, data)
    },
    UpdateLogitics(id, data) {
      //PUT
      var api = root + `/api/purchaseitem/${id}/updatelogistics`
      return PUT(api, data)
    },
    Delete: function(id) {
      //PUT
      var api = root + `/api/purchaseitem/${id}`
      return DELETE(api)
    },
    Top: function(topcount) {
      var api = root + `/api/purchaseitem/top(${topcount})`
      return GET(api)
    },
    Paging: function(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + `/api/purchaseitem/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    }
  },
  purchaserequisition: {
    Get: function(id) {
      var api = root + `/api/purchaserequisition/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/purchaserequisition/submit`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/purchaserequisition/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/purchaserequisition/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/purchaserequisition/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/purchaserequisition/search?keyWord=${keyword}`
      return GET(api)
    },
    SearchByStatus: function(role, userID, Status, startIndex, endIndex) {
      var api = root + `/api/purchaserequisition/search(${role},${userID},${Status},${startIndex},${endIndex})`
      return GET(api)
    },
    SearchByKeywordAndStatus: function(role, userID, status, keyword, startIndex, endIndex) {
      var api = root + `/api/purchaserequisition/search(${role},${userID},${status},${keyword},${startIndex},${endIndex})`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/purchaserequisition/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/purchaserequisition/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Approve: function(prid) {
      //TODO
      var pr = this.Get(prid)
      // pr["_"]
    },
    Reject: function(prid) {
      //TODO
    },
    Draft: function(data) {
      //POST
      var api = root + `/api/purchaserequisition/draft`
      return POST(api, data)
    },
    Submit: function(data) {
      //POST
      var api = root + `/api/purchaserequisition/submit`
      return POST(api, data)
    },
    Finish: function() {

    }
  },
  PRSupplierView: {
    Count: function() {
      var api = root + `/api/PRSupplierView/count`
      return GET(api)
    },
    Search: function(isCompeleted, keyword, startIndex, endIndex) {
      var api = root + `/api/PRSupplierView/search(${isCompeleted},${keyword},${startIndex},${endIndex})`
      return GET(api)
    },
    Paging: function(isCompeleted, startIndex, endIndex) {
      var api = root + `/api/PRSupplierView/search(${isCompeleted},${startIndex},${endIndex})`
      return GET(api)
    }
  },
  supplier: {
    Get: function(id) {
      var api = root + `/api/supplier/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/supplier/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/supplier/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/supplier/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/supplier/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/supplier/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/supplier/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/supplier/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/supplier/login?username=${username}&password=${password}`
      return PUT(api)
    }
  },
  systemsetting: {
    Get: function(id) {
      var api = root + `/api/systemsetting/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/systemsetting/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/systemsetting/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/systemsetting/${id}`
      return DETELE(api)
    },
    Count: function() {
      var api = root + `/api/systemsetting/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/systemsetting/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemsetting/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/systemsetting/paging(${startIndex},${endIndex})`
      return GET(api)
    }
  },
  systemuser: {
    Get: function(id) {
      var api = root + `/api/systemuser/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/systemuser/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/systemuser/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/systemuser/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/systemuser/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/systemuser/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemuser/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/systemuser/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/systemuser/login?username=${username}&password=${password}`
      return PUT(api)
    }
  },
  employee: {
    Login: function(username, password) {
      var api = root + `/api/employee/login(${username},${password})`
      return GET(api)
    },
    Search: function(accountName){
      var api = root +`/api/employee/search(${accountName})`
      return GET(api)
    }
  },
  PRApproverView: {
    Count: function() {
      var api = root + `/api/PRApproverView/count`
      return GET(api)
    },
    Paging: function(account, completed, startIndex, endIndex) {
      var api = root + `/api/PRApproverView/paging(${account},${completed},${startIndex},${endIndex}`
      return GET(api)
    }
  }
}

//PUT GET PUT DELETE

function POST(url, data) {
  var data = JSON.stringify(data)
  var c = $.ajax({
    "url": url,
    "contentType": "application/json; charset=utf-8",
    "type": "POST",
    "data": data,
    "dataType": "json",
    "async": false
  })
  return c.responseJSON

} //增
function DELETE(url) {
  var c = $.ajax({
    "url": url,
    "contentType": "application/json; charset=utf-8",
    "type": "DELETE",
    "dataType": "json",
    "async": false
  })
  return c.responseJSON
} //删
function PUT(url, data) {
  var data = data?JSON.stringify(data):""
  var c = $.ajax({
    "url": url,
    "contentType": "application/json; charset=utf-8",
    "type": "PUT",
    "data": data,
    "dataType": "json",
    "async": false
  })
  return c.responseJSON
} //改
function GET(url) {
  var c = $.ajax({
    "url": url,
    "contentType": "application/json; charset=utf-8",
    "type": "GET",
    "dataType": "json",
    "async": false
  })
  return c.responseJSON
} //查

function ClearInputs(form, idList) {
  form = $(form)
  var inputs = form.find("input")
  var a = inputs
  for (var i = 0; i < a.length; i++) {
    if (!idList)
      $(a[i])
      .val("")
    else if (idList && idList.includes(("#" + a[i].id))) {
      $(a[i])
        .val("")
    } else {
      continue
    }
  }
}

function ClearTextArea(form) {
  form = $(form)
  var textarea = form.find("textarea")
  var a = textarea
  for (var i = 0; i < a.length; i++) {
    $(a[i])
      .val("")
  }
}

function ClearSelecton(form) {
  form = $(form)
  var selection = form.find("select")
  var a = selection
  for (var i = 0; i < a.length; i++) {
    $(a[i])
      .val("-1")
  }
}

function ClearAllFields(form) {
  ClearAllFieldsBut(form)
}

function ClearAllFieldsBut(form, idList) {
  ClearInputs(form, idList)
  ClearTextArea(form)
  ClearSelecton(form)
}

//检测，如果所有input都为空，则直接关闭不保存
function isAllPRTypeFormFieldEmpty(form) {
  var a = $(form).find("input")
  a.append($(form).find("area")).append($(form).find("select"))
  var isAllEmpty = true
  for (var i = 0; i < a.length; i++) {
    isAllEmpty = isAllEmpty && ($(a[i]).val().length == 0 && $(a[i]).val() != "-1")
  }
  return isAllEmpty
}

/**
 * 将form表单包装城set对象
 * @param  {Jquery.form} form [description]
 * @return {type}      [description]
 */
function formToSet(form) {
  form = $(form)
  var formArr = form
    .serializeArray()

  var set = {}
  for (var record of formArr) {
    var key = record["name"]
    var value = record["value"]
    set[key] = value
  }
  return set
}
/**
 * 按照key字段将array转变成{key:array}的对象
 * @param  Array array [description]
 * @param  string key   [description]
 * @return set       [description]
 */
function arrayToSet(array, key) {
  var set = {}
  for (i of array) {
    set[i[key]] = i
  }
  return set
}

function setToArray(set, arrOrder) {
  var arr = []
  if (arrOrder)
    for (var i = 0; i < arrOrder.length; i++) {
      arr.push(set[arrOrder[i]])
    }
  else {
    for (var i in set) {
      arr.push(set[i])
    }
  }
  return arr
}
/**
 * 传入一个form，和infomation Set（键值对应），将form表单里对应id的val值自动填写
 * @param  {set} infoSet 数据和信息键值对
 * @param  {form} form    [description]
 * @param  {string} prefix   若该参数有值，则为id为prefix+id的字段填值
 */
function autoComplateInfo(infoSet, form, prefix) {
  form = $(form)
  // debugger
  // var set = formToSet(form)
  for (var i in infoSet) {
    var val = infoSet[i]
    if ("" != prefix && undefined != prefix)
      i = prefix + i
    var target = form.find("#" + i)
    if (target.is('input') || target.is('select') || target.is('option') || target.is('textarea')) {
      target.val(val)
    } else {
      target.text(val)
    }
  }
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  })
  return uuid;
}

const Enum = {
  role: {
    /// ZEISS员工
    EMPLOYEE: 0,
    /// 代理商
    DEALEAR: 1,
    /// 供应商
    SUPPLIER: 2,
    /// 系统管理员
    SYSADMIN: 3
  },
  prstatus: {
    /// 草稿状态
    Draft: "Draft",
    /// 申请中
    Progress: "Progress",
    /// 结束状态：已通过审核
    Approved: "Approved",
    /// 结束状态：审核已拒绝
    Rejected: "Rejected",
    Failure: "Failure",
    /// 已交付状态
    Delivered: "Delivered",
    /// 完成状态
    Completed: "Completed"
  },
  processStatus: {
    /// 提交进入流程状态
    Submitted: "Submitted",
    /// 等待直线经理审批状态
    LineManagerApproval: "LineManagerApproval",
    /// 等待BU经理审批状态
    BUManagerApproval: "BUManagerApproval",
    /// 等待市场经理审批
    MarketingManagerApproval: "MarketingManagerApproval",
    /// 等待市场总监审批
    MarketingDirectorApproval: "MarketingDirectorApproval",
    /// 被通知人
    NotifiedParty: "NotifiedParty",
    /// 等待供应商更新物流信息
    SupplierUpdate: "SupplierUpdate",
    /// 完成
    End: "End"
  },
  enumApprovalResult: {
    /// <summary>
    /// 未操作
    /// </summary>
    NoAction: "NoAction",
    Ready: "Ready",
    /// <summary>
    /// 审批通过
    /// </summary>
    Success: "Success",
    /// <summary>
    /// 审批拒绝
    /// </summary>
    Rejected: "Rejected"

  },
  operation: {
    Create: "Create",
    Update: "Update",
    Read: "Read",
    Delete: "Delete",
    Copy: "Copy"
  }
}

const tableStructures = {
  Admin: {
    Bruchure: {
      History: {
        "tablename": "History",
        "hasHeader": true,
        "hasButton": true,
        "keyArr": ["id", "key", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "物品编号", "物品名称", "物品数量", "创建人", "创建时间"],
        ]
      },
      Inventory: {
        "tablename": "Inventory",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["supplyBtn", "historyBtn", "editBtn", "deleteBtn"],
        "keyArr": ["id", "key", "key", "prop", "prop"],
        "viewOrder": ["_id", "_brochurenumber", "_brochurename", "_quantity", "_description"],
        "data": [
          ["序列", "版本号", "物品名称", "物品数量", "描述"],
        ]
      }

    },
    OrderAdmin: {
      Order: {
        "tablename": "order",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_processstatus"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "当前审批人"],
        ]
      },
      Reject: {
        "tablename": "reject",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "keyArr": ["prop", "id", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "keyArr": ["prop", "id", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      }

    },
    DealerAdmin: {
      Dealer: {
        "tablename": "dealer",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["editBtn", "deleteBtn"],
        "viewOrder": ["_id", "_dealercode", "_dealername", "_dealerregion", "_dealerproduct", "_phonenumber", "_email", "_accountname", "_password"],
        "keyArr": ["id", "key", "key", "prop", "prop", "prop", "prop", "key", "prop"],
        "data": [
          ["序列", "代理商编码", "代理商名称", "区域", "代理产品", "手机号", "邮箱", "账号", "密码"],
        ]
      }
    },
    SupplierAdmin: {
      Supplier: {
        "tablename": "supplier",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["editBtn", "deleteBtn"],
        "keyArr": ["id", "key", "key", "prop", "prop", "prop"],
        "viewOrder": ["_id", "_suppliercode", "_suppliername", "_phonenumber", "_accountname", "_password"],
        "data": [
          ["序列", "供应商编码", "名称", "手机号", "账号", "密码"],
        ]
      }
    },
    SystemAdmin: {
      SystemUser: {
        "tablename": "SystemUser",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["editBtn", "deleteBtn"],
        "viewOrder": ["_id", "_accountname", "_password", "_email"],
        "keyArr": ["id", "key", "prop", "prop"],
        "data": [
          ["序列", "账号", "密码", "邮箱"],
        ]
      }
    },
    Dictionary: {
      "tablename": "Dictionary",
      "hasHeader": true,
      "hasButton": true,
      "buttonPool": ["editBtn", "deleteBtn"],
      "viewOrder": ["_id", "_optionname", "_optionvalue", "_sequence", "_description", "_category"],
      "keyArr": ["id", "key", "prop", "prop", "prop", "prop"],
      "data": [
        ["ID", "选项名", "选项值", "排序值", "描述", "分类"],
      ]
    },

  },
  Dealer: {
    MyOrder: {
      Draft: {
        "tablename": "draft",
        "hasHeader": true,
        "hasDetail": false,
        "hasButton": true,
        "buttonPool": ["copyBtn", "editBtn", "deleteDraftBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_prcreated"],
        "keyArr": ["id", "prop", "key", "prop"],
        "data": [
          ["序列", "草稿号", "用途", "保存时间"],
        ]
      },
      PurchaseRequisitionItemTable: {
        "tablename": "PurchaseRequisitionItemTable",
        "hasHeader": true,
        "hasButton": true,
        "hasDetail": false,
        "buttonPool": ["PIEditBtn", "PIdeleteBtn"],
        "viewOrder": ["_id", "_brochurename", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"],
        "keyArr": ["id", "key", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"]
        ]
      },
      Approving: {
        "tablename": "approving",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_processstatus"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "当前审批人"],
        ]
      },
      Rejected: {
        "tablename": "rejected",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      orderDetail: {
        "name": "orderDetail",
        "hasHeader": true,
        "hasButton": false,
        "viewOrder": ["_id", "_brochurename", "_quantity", "_consignee", "_contactnumber", "_deliverydate", "_deliveryaddress", "_deliverypriorityfk", "_logistics"],
        "keyArr": ["id", "key", "prop", "prop", "prop", "prop", "prop", "prop", "key"],
        // "buttonPool": ["expressViewBtn"],
        "data": [
          ["序列", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址", "紧急程度", "物流信息"],
        ]
      }
    }
  },
  Supplier: {
    MyOrder: {
      Approving: {
        "tablename": "approving",
        "hasHeader": true,
        "hasDetail": false,
        "hasButton": true,
        "buttonPool": ["expressUpdateBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestor", "_phonenumber", "_prstatus"],
        "keyArr": ["id", "prop", "key", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "申请人", "联系电话", "状态"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": false,
        "hasButton": false,
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestor", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "申请时间", "结束时间"],
        ]
      },
      ExpressUpdateDetail: {
        "name": "expressupdatedetail",
        "hasHeader": true,
        "hasButton": true,
        "hasDetail": false,
        "viewOrder": ["_id", "_brochurename", "_quantity", "_purchaserequisitionfk", "_logistics", "_deliverydate"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "buttonPool": ["updateBtn"],
        "data": [
          ["序列", "物品名字", "物品数量", "PurchaseItemID(不显示)", "物流信息", "交付时间"],
        ]
      }

    },
    Brochure: {
      Inventory: {
        "tablename": "Inventory",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["supplyBtn"],
        "keyArr": ["prop", "id", "key", "prop"],
        "data": [
          ["序列", "物品编号", "物品名称", "物品数量"],
        ]
      }
    }
  },
  Employee: {
    MyOrder: {
      Draft: {
        "tablename": "draft",
        "hasHeader": true,
        "hasDetail": false,
        "hasButton": true,
        "buttonPool": ["copyBtn", "editBtn", "deleteDraftBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_prcreated"],
        "keyArr": ["id", "prop", "key", "prop"],
        "data": [
          ["序列", "草稿号", "用途", "保存时间"],
        ]
      },
      PurchaseRequisitionItemTable: {
        "tablename": "PurchaseRequisitionItemTable",
        "hasHeader": true,
        "hasButton": true,
        "hasDetail": false,
        "buttonPool": ["PIEditBtn", "PIdeleteBtn"],
        "viewOrder": ["_id", "_brochurename", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"],
        "keyArr": ["id", "key", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"]
        ]
      },
      Approving: {
        "tablename": "approving",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_processstatus"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "当前审批人"],
        ]
      },
      Rejected: {
        "tablename": "rejected",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      orderDetail: {
        "name": "orderDetail",
        "hasHeader": true,
        "hasButton": false,
        "viewOrder": ["_id", "_brochurename", "_quantity", "_consignee", "_contactnumber", "_deliverydate", "_deliveryaddress", "_deliverypriorityfk", "_logistics"],
        "keyArr": ["id", "key", "prop", "prop", "prop", "prop", "prop", "prop", "key"],
        // "buttonPool": ["expressViewBtn"],
        "data": [
          ["序列", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址", "紧急程度", "物流信息"],
        ]
      }
    }
  }
}
