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
    var PRIEditBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info edit\" onclick=\"PRIEdit('" + this.PrimaryKeyValue + "')\">Edit</button>")
    var submitBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info submit\" onclick=\"submit('" + this.PrimaryKeyValue + "')\">Submit</button>")
    var deleteBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"delete('" + this.PrimaryKeyValue + "')\">Delete</button>")
    var PRIdeleteBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger del\" onclick=\"PRIDelete('" + this.PrimaryKeyValue + "')\">Delete</button>")
    var updateBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-primary update\" onclick=\"update('" + this.PrimaryKeyValue + "')\">Update</button>")
    var supplyBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success supply\" onclick=\"supply('" + this.PrimaryKeyValue + "')\">Supply</button>")
    var approveBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-info approve\" onclick=\"approve('" + this.PrimaryKeyValue + "')\">Approve</button>")
    var rejectBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-danger reject\" onclick=\"reject('" + this.PrimaryKeyValue + "')\">Reject</button>")
    var expressUpdateBtn = $("<button type=\"button\" name=\"button\" class=\"btn btn-success expressUpdate\" onclick=\"expressUpdate('" + this.PrimaryKeyValue + "')\">Express Update</button>")
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


var PRDetail = {
  show: function() {
    $("#Detail").modal()
  },
  hide: function() {
    $("#Detail").modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#Detail",
      targetPRITableArea = "#InfomationArea",
      templateOpts = tableStructures.Dealer.MyOrder.orderDetail
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea,"PRD") //将PR填充到表单
      //填充PRI
      var PRIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      new table().loadFromTemplateJson(PRIinfoSet, templateOpts).to(targetPRITableArea)
    }

    var steps = apiConfig.prprocess.Paging(PRid, 0, 100).reverse()
    for (var i = 0; i < steps.length; i++) {
      var result = steps[i]["_result"]
      var time = steps[i]["_lastmodified"]
      var step = steps[i]["_prprocessstep"]
      var mod = `<li class="glyphicon"><span>${step}</span><span class="operationtime">${time}</span></li>`
      $mod = $(mod)
      $mod.css("width", (100 / steps.length) + '%')
      if (i == steps.length - 1 && steps[i]["_result"] == "") {
        $mod.addClass('validating')
      } else {
        $mod.addClass('complated')
      }
      $("#progressbar").append($mod)
    }
  }
}

$("#Detail")
  .on("hidden.bs.modal", function() {
      $("#progressbar").empty()
    }
)

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
      //填充PRI
      var PRIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      new table().loadFromTemplateJson(PRIinfoSet, templateOpts).to(targetPRITableArea)
    }
  }
}

$("#ExpressUpdate")
  .on("hidden.bs.modal", function() {
    ClearTextArea("#ExpressUpdate form")
  })

var PurchaseItem = {
  show: function() {
    $("#PruchaseItem")
      .modal()
  },
  hide: function() {
    $("#PruchaseItem")
      .modal('hide')
  },
  add: function() {
    //是否fields全为空
    if (isAllPRTypeFormFieldEmpty("#PruchaseItem_form"))
      return
    //
    var arr = []
    arr.push(++row_counter)
    var set = formToSet("#PruchaseItem_form")
    var order = ["_brochurefk", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"]
    for (var i of order) {
      arr.push(set[i])
    }
    if (window.__PurchaseRequisitionItem_table) {
      window.__PurchaseRequisitionItem_table.addRow(arr)
      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID].push(set)
    }
    ClearInputs("#PruchaseItem_form", ["#_brochurefk", "#_quantity"])
  },
  update() {
    var PRIArr = apiConfig.purchaseitem.Paging(window._target["_id"], 0, 100)
    var unsavePRI = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
    var remotePRI = arrayToSet(PRIArr, "_id")
    if (unsavePRI && unsavePRI.length > 0) {
      var PRid = window._target["_id"]
      for (var i = 0; i < unsavePRI.length; i++) {
        //若有新的，则添加，若为老的，则修改
        var nativePRIid = unsavePRI[i]["_id"]
        if (remotePRI[nativePRIid]) {
          var itemID = apiConfig.purchaseitem.Edit(nativePRIid, unsavePRI[i])
        } else {
          unsavePRI[i]["_purchaserequisitionfk"] = PRid
          var itemID = apiConfig.purchaseitem.Add(unsavePRI[i])
        }
      }
      //如果删除PRI
      //更新一下
      PRIArr = apiConfig.purchaseitem.Paging(window._target["_id"], 0, 100)
      nativePRI = arrayToSet(unsavePRI, "_id")
      for (var j = 0; j < PRIArr.length; j++) {
        var remotePRIid = PRIArr[j]["_id"]
        debugger
        if (!nativePRI[remotePRIid]) {
          apiConfig.purchaseitem.Delete(remotePRIid)
        }
      }
    }
  }
}

//绑定输入查询数据
bindInputQuery("#_brochurefk", "./test/searchDictionary/BrochureName.json")
//绑定交付时间组件
$('#_deliverydate')
  .datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    startDate: '2017-01-01',
    autoclose: true,
    startView: 2,
    minView: 2,
    forceParse: false,
    language: 'zh-CN'
  });
$("#PruchaseItem")
  .on("hidden.bs.modal", function() {
    ClearInputs("#PruchaseItem")
  })
var row_counter = 0

var PurchaseRequisition = {
  show: function() {
    this.init()
    $("#PurchaseRequisition")
      .modal()
  },
  hide: function() {
    $("#PurchaseRequisition")
      .modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#PurchaseRequisition_form"
    targetPRITableArea = "#InfomationAddArea"
    templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      //填充PRI
      var PRIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)

      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = PRIinfoSet
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      var PRItable = new table().loadFromTemplateJson(PRIinfoSet, templateOpts)
      window.__PurchaseRequisitionItem_table = PRItable
      PRItable.to(targetPRITableArea)
    }

    //若为dealer，则自动填充名字和区域
    if ("dealer" == (getCookie("auth")
        .toLowerCase())) {
      $("#_demanderfk")
        .val("dealer")
      $("#_demanderfk")
        .attr("readonly", "readonly")
      $("#_dealerregion")
        .val(apiConfig.dealer.GetByUserName(getCookie("name"))["_dealerregion"])
      $("#_dealerregion")
        .attr("disabled", "true")
    }
  },
  detail: function(PRid) {
    PRDetail.autoComplate(PRid)
    PRDetail.show()
  },
  init: function() {
    window.__PurchaseRequisition_tempID = generateUUID()
    window.__PurchaseRequisitionItem_Unsave_set = {}
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = []
  },
  destory: function() {
    ClearAllFields("#PurchaseRequisition")
    if (window.__PurchaseRequisitionItem_table) {
      window.__PurchaseRequisitionItem_table.remove()
      window.__PurchaseRequisitionItem_table = null
    }
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
    window.__PurchaseRequisition_tempID = null
    window.__PurchaseRequisitionItem_Unsave_set = null
    window._target = null
    window._operation = null
    $("#operation").empty()
  }
}

//绑定input搜索栏数据源
bindInputQuery("#_demanderfk", "./test/searchDictionary/DealerCollections.json")

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
  var draftbtn = `<button type="button" class="btn btn-success col-xs-3 col-md-3 col-xs-offset-1" onclick="Draft()">Draft</button>`
  var submitbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="submitPR()">提交</button>`
  var editbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="editPR()">修改</button>`
  var cancelbtn = `<button type="button" class="btn btn-danger col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">取消</button>`
  var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`

  switch (window._operation) {
    case Enum.operation.Update:
      $("#operation").append($(editbtn)).append($(cancelbtn))
      break
    case Enum.operation.Create:
      $("#operation").append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
      break
    case Enum.operation.Copy:
      $("#operation").append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
      break
    default:
      $("#operation").append($(closebtnlbtn))
      break
  }
})

$("#addPRItem").on("click", function() {
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
    Approving: function(id,processEnum) {
        var pr = this.Get(id)
        //GET /api/prprocess/paging({purchaseRequisitionid},{startIndex},{endIndex})
        pr["_prprocessstep"] = processEnum
        this.Edit(id,pr)
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
      var api = root + `/api/purchaserequisition/new`
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
      //TODO
    },
    SearchByKeywordAndStatus: function(role, userID, status, keyword, startIndex, endIndex) {
      //TODO
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
    Search: function() {
      var api = root + `/api/PRSupplierView/search`
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

function arrayToSet(array, key) {
  var set = {}
  for (i of array) {
    set[i[key]] = i
  }
  return set
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
    EMPLOYEE: "EMPLOYEE",
    /// 代理商
    DEALERL: "DEALERL",
    /// 供应商
    SUPPLIER: "SUPPLIER",
    /// 系统管理员
    SYSADMIN: "SYSADMIN"
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
    /// 已交付状态
    Delivered: "Delivered"
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
        "viewOrder": ["_id", "_dealername", "_dealerregion", "_dealerproduct", "_phonenumber", "_email", "_accountname", "_password"],
        "keyArr": ["id", "key", "prop", "prop", "prop", "prop", "key", "prop"],
        "data": [
          ["序列", "代理商名称", "区域", "代理产品", "手机号", "邮箱", "账号", "密码"],
        ]
      }
    },
    SupplierAdmin: {
      Supplier: {
        "tablename": "supplier",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["editBtn", "deleteBtn"],
        "keyArr": ["id", "key", "prop", "prop", "prop"],
        "viewOrder": ["_id", "_suppliername", "_phonenumber", "_accountname", "_password"],
        "data": [
          ["序列", "名称", "手机号", "账号", "密码"],
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
        "buttonPool": ["PRIEditBtn", "PRIdeleteBtn"],
        "viewOrder": ["_id", "_brochurefk", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"],
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
        "hasButton": true,
        "viewOrder": ["_id", "_brochurefk", "_quantity", "_consignee", "_contactnumber", "_deliverydate", "_deliveryaddress", "_deliverypriorityfk"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop", "prop", "prop"],
        "buttonPool": ["expressViewBtn"],
        "data": [
          ["序列", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址", "紧急程度"],
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
        "keyArr": ["prop", "id", "key", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "申请人", "联系电话","状态"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": false,
        "hasButton": false,
        "keyArr": ["prop", "id", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "申请时间", "结束时间"],
        ]
      },
      ExpressUpdateDetail: {
        "name": "expressupdatedetail",
        "hasHeader": true,
        "hasButton": true,
        "hasDetail": false,
        "viewOrder":["_id","_brochurefk", "_quantity", "_purchaserequisitionfk","_consignee", "_deliverydate"],
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
  }
}
