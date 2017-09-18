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

var bindInputQuery = function ($input, url) {
  $input = $($input)
  $input
    .on('keyup', function (e) {
      e.preventDefault()
      var keywordsdata = JSON.parse($.ajax({
          url: url,
          async: false
        })
        .responseText)
      var droplist = $input
        .siblings(".keyhint")
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
        $input
          .parent(".search_box_warp")
          .addClass("open")
        $(".keywords")
          .on('click', function (e) {
            $input
              .val(this.innerText)
            droplist.empty()
            $input
              .parent(".search_box_warp")
              .removeClass("open")
          })
      } else {
        $input
          .parent(".search_box_warp")
          .removeClass("open")
      }
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

//多模态HACK
var couter = 0;
$(document)
  .on('hidden.bs.modal', '.modal', function (e) {
    $(this)
      .css("z-index", 1050)
    couter--
  });
$(document)
  .on('show.bs.modal', '.modal', function (e) {
    $(this)
      .css("z-index", 1050 + couter)
    couter++
  });

// window.currentPos = "myOrder"

var contentmapper = {
  MyOrder: "MyOrder.html",
  OrderAdmin: "OrderAdmin.html",
  BrochureAdmin: "BrochureAdmin.html",
  DealerAdmin: "DealerAdmin.html",
  SupplierAdmin: "SupplierAdmin.html",
  Inventory: "Inventory.html",
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

          window.currentPos = getCookie("auth") + "." + position //HACK Button

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

var table_init = function(tableList) {
  for (var i in CurrentTableList) {
    var $tablecontainer = $(i)
    var t = new table(CurrentTableList[i])
    t.load().to($tablecontainer)
  }
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
  this.keyArr = this.responseJson.keyArr
  this.PrimaryKeyIndex = this.keyArr.indexOf('id')
  var data = this.responseJson.data
  var table = $('<table class="table table-bordered table-hover table-striped"></table>')
  var tbody = $("<tbody></tbody>")
  table.append(tbody)
  this.tableHTML = table
  //若有header，初始化header
  //添加header
  if (this.hasHeader && !this.Header) {
    var hr = data.reverse()
      .pop()
    this.Header = hr
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

table.prototype.bindEvents = function() {
  if (!this.hasDetail)
    return
  var data = this.data
  for (var i in data) {
    data[i].onClick(function() {
      Detail(this.dataset.primarykey)
    })
    data[i].onCardLongPress(500, function() {
      Detail(this.dataset.primarykey)
    })
  }
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
}
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
    var submitBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info submit\" onclick=\"submit('" + this.PrimaryKeyValue + "')\">Submit</button>")
    var delBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"del('" + this.PrimaryKeyValue + "')\">Delete</button>")
    var updateBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-primary update\" onclick=\"update('" + this.PrimaryKeyValue + "')\">Update</button>")
    var supplyBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success supply\" onclick=\"supply('" + this.PrimaryKeyValue + "')\">Supply</button>")
    var approveBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info approve\" onclick=\"approve('" + this.PrimaryKeyValue + "')\">Approve</button>")
    var rejectBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger reject\" onclick=\"reject('" + this.PrimaryKeyValue + "')\">Reject</button>")
    var expressUpdateBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success expressUpdate\" onclick=\"expressUpdate('" + this.PrimaryKeyValue + "')\">Express Update</button>")
    var expressViewBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success expressView\" onclick=\"expressStatus('" + this.PrimaryKeyValue + "')\">Express Status</button>")
    var finishedBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-primary finish\" onclick=\"finish('" + this.PrimaryKeyValue + "')\">Finish</button>")
    var historyBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success history\" onclick=\"histroy('" + this.PrimaryKeyValue + "')\">History</button>")
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

function ClearInputs(form) {
  form = $(form)
  var inputs = form.find("input")
  var a = inputs
  for (var i = 0; i < a.length; i++) {
    $(a[i])
      .val("")
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

function autoComplateInfo(infoSet, form) {
  form = $(form)
  var set = formToSet(form)
  for (var i in set) {
    form.find("#"+i).val(infoSet[i])
  }
}

//绑定input搜索栏数据源
bindInputQuery("#SupplierName", "./test/searchDictionary/SupplierCollections.json")

//绑定输入查询数据
bindInputQuery("#BrochureName", "./test/searchDictionary/BrochureName.json")
//绑定交付时间组件
$('#DeliveryDate')
  .datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    startDate: '2017-01-01',
    autoclose: true,
    startView: 4,
    minView: 2,
    forceParse: false,
    language: 'zh-CN'
  });

var row_counter = 0



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




$("#PruchaseItem")
  .on("hidden.bs.modal", function() {
    ClearInputs("#PruchaseItem")

  })

//绑定input搜索栏数据源
bindInputQuery("#DemanderFK", "./test/searchDictionary/DealerCollections.json")

$("#PurchaseRequisition")
  .on("hidden.bs.modal", function () {
    if (window.__PurchaseRequisitionTable) {
      window.__PurchaseRequisitionTable.remove()
      ClearInputs("#PurchaseRequisition")
      window.__PurchaseRequisitionTable = null
    }
  })
$("#PurchaseRequisition").on("shown.bs.modal", function () {
    autoComplateInfoOfDealer()
  })

//获取用户信息
function getPrototypies(uid, pname) {
  var c = $.ajax({
    url: './test/userInfo.json', // api统一接口不同参数获取用户信息
    type: "GET",
    async: false
  })
  var j = JSON.parse(c.responseText)
  var r = j[uid][pname]
  return r
}
//检测若是aealer，则将需求方设为dealer本人
function autoComplateInfoOfDealer() {
  if ("dealer" == (getCookie("auth")
      .toLowerCase())) {
    $("#DemanderFK")
      .val("dealer")
    $("#DemanderFK")
      .attr("readonly", "readonly")
    $("#area")
      .val(getPrototypies("dealer", "area"))
    $("#area")
      .attr("disabled", "true")
  }
}

$("#addPRItem").on("click", function() {
    //如果没有请购单，则new一个
    if (!window.__PurchaseRequisitionTable) {
      var PurchaseRequisitionTable = new table()
      var t = {
        "tablename": "AddPR",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["delBtn"],
        "keyArr": ["id", "key", "prop", "key", "prop", "prop", "prop"]
      }
      var header = ["编号", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址"]
      PurchaseRequisitionTable.new(t, header)
        .to($("#InfomationAddArea"))
      window.__PurchaseRequisitionTable = PurchaseRequisitionTable
    }
  })
var row_counter = 0

var fetchNewestExpressStatus = function(primaryKey) {
  // "2017.9.16 09:44 - 物流站已接收"
  var j = $.ajax({
    url: "/test/supplier/MyOrder/newestExpressStatus.json",
    type: "GET",
    async: false
  }).responseJson

  console.log(j);
}


$("#ExpressUpdate")
  .on("hidden.bs.modal", function() {
    ClearTextArea("#ExpressUpdate form")
  })
