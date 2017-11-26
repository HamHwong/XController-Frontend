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


/**
 * @description 从字典数组中查询到
 * @param  {String} keys 输入的关键字字符串
 * @param  {StringArray} dic  Dictionary字符串字典数组
 * @return {StringArray}      返回一个装有所有搜索结果的字符数组
 */
const queryKeyWords = function(keys, dic) {
  var b = []
  var r = []
  for (var i in dic) {
    var keysRegExp = new RegExp(keys, "i")
    var c = dic[i].search(keysRegExp)
    if (c >= 0) {
      // var keywords = c
      // console.log(keywords)
      var keywords = dic[i].match(keysRegExp)
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

const bindOptionData = function({
  $select,
  datasource,
  innerTextName,
  valueName
}) {
  //给类名为queryinput的select添加上option（真正提交的部分）
  $select = $($select)
  $select.empty()
  var category = $select.data('source')
  //拿到select的data-source，去做关键字匹配
  //datasource为数据源数组
  var optionkey = null
  var optionvalue = null
  // if ("zeiss" == category) {
  //   optiontext = "nameField"
  //   optionvalue = "accountField"
  // } else if ("brochure" == category) {
  optionkey = innerTextName
  optionvalue = valueName
  // } else {
  //   optionvalue = "_id"
  //   optiontext = innerTextName
  // }
  $select.append(`<option value="-1" selected="selected">请选择</option>`)
  for (var i = 0; i < datasource.length; i++) {
    var j = datasource[i]
    var value = j[optionvalue]
    var text = j[optionkey]
    var option = `<option value="${value}">${text}</option>`
    $select.append($(option))
  }
  //Option 绑定结束
}
/**
 * 带查询功能的输入框
 * @param  {Jquery.input}   $input     要绑定到的输入框上//仅做展示，并不提交
 * @param  {string}  datasource 数据源，可以是查询的api，也可以是数据数组
 * @param  {string}   innerTextName 单个数据对象的属性字段名，用于绑定显示到option上的值
 * @param  {string}   valueName 单个数据对象的属性字段名，用于绑定option Value上的值
 * @param  {Function} callback 选择选项后执行的函数
 */
const bindInputQuery = function({
  input,
  datasourceAPI,
  searchObj,
  innerTextName,
  valueName,
  delay,
  callback
}) {
  var $input = $(input)
  $input.unbind("keyup")
  var $select = $input.siblings("select.queryinput")
  $input.after("<ul class='dropdown-menu keyhint'>")
  var delay = delay || 600
  //给input绑定上keyup事件
  $input.on('keyup', function(e) {
    e.preventDefault()
    if (window.timer) {
      clearTimeout(window.timer)
    }
    $select.empty()
    $select.append(`<option value="-1" selected="selected"></option>`)
    var that = this
    window.timer = setTimeout(function() {
      var keyword = that.value
      searchObj["keyword"] = keyword
      var datasource = datasourceAPI(searchObj)
      //BUG 搜索与droplist不同步，原因：api以条目的任意属性为搜索条件，droplist只以brochurename为搜索条件
      var nameArray = getValueArrayFromObjectArray(datasource, innerTextName)
      var set = getValueSetFromObjectArray(datasource, innerTextName, valueName)
      var objSet = arrayToSet(datasource, valueName)
      var droplist = $input.siblings(".keyhint")
      droplist.empty()

      var data = queryKeyWords(keyword, nameArray)

      //加载bootstrap下拉框
      for (var i = 0; i < data["raw"].length; i++) {
        var key = data["raw"][i]
        var value = set[key]
        var li = $("<li></li>")
        var a = $(`<a href=\"#\" class='keywords' value='${value}'></a>`)
        a.html(data["blod"][i])
        li.append(a)
        droplist.append(li)
      }
      //绑定下拉框点击事件
      if (data["raw"].length > 0 && keyword != "") {
        $input.parent(".search_box_warp").addClass("open")
        $(".keywords").on('click', function(e) {
          bindOptionData({
            $select,
            datasource,
            innerTextName,
            valueName
          })

          var val = $(this).attr("value") //获取到value值
          $select.val(val)
          $input.val(this.innerText)
          droplist.empty()
          $input.parent(".search_box_warp").removeClass("open")
          var result = objSet[val]
          if (callback) {
            callback(result)
          }
        })
      } else {
        $input.parent(".search_box_warp").removeClass("open")
      }

    }, delay)
  })
}

var Loading = {
  show: function() {
    if (!window.LoadingMarker) {
      var container = $("<div class='Loading'>")
      var loading = $('<div class="wrapper"><div class="loadingspan"><div class="help"></div></div></div>')
      container.append(loading)
      window.LoadingMarker = container
      $("body").append(window.LoadingMarker)
    } else {
      // $(".Loading").css("display", "block")
      window.LoadingMarker.show()
    }
  },
  hide: function() {
    if (window.LoadingMarker) {
      window.LoadingMarker.hide()
    }
  }
}

var MessageAlert = function(msg, status, showTime) {
  this.status = status || MessageAlert.Status.SUCCESS
  this.msg = msg || "Congratulation! Action performed!"
  this.statusCode = 0
  this.html = null
  this.dropback = null
  this.showoutTime = 600
  this.showtime = showTime || 1500
  this.hideTime = 300
  this.show(this.mse, this.status)
}

MessageAlert.prototype.new = function(msg, status) {
  this.msg = msg || this.msg
  this.status = status || this.status
  if (this.html)
    this.html.remove()
  // if (!this.html) {
  this.html = this.generateHTML(this.msg, this.status)
  this.html.css("display", "none")
  $("body").append(this.html)
  // }
  if (!this.dropback) {
    this.dropback = $('<div class="MassageAlert_dropback"></div>')
    $("body").append(this.dropback)
  }
  return this.html
}

MessageAlert.prototype.generateHTML = function(msg, status) {
  var mod =
    `
      <div class="MassageAlert_Warp">
        <div class="MassageAlert">
          <label class="MassageAlert_Title">
            <i class="Icon"></i>
            <span class="Status">${status}</span>
          </label>
          <div class="MassageAlert_Body">
            <span>${msg}</span>
          </div>
          <div class="MassageAlert_Footer"></div>
        </div>
      </div>
      `
  return $(mod)
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
  if (!this.inStatus(status))
    throw "Error Status"
  this.new(msg, status)
    .show(this.showoutTime)
  this.dropback.fadeIn(this.showoutTime)

  var self = this
  setTimeout(function() {
    self.hide()
    setTimeout(function() {
      self.destory()
    }, self.hideTime)
  }, self.showoutTime + self.showtime)

  return this
}
// MessageAlert.show = function(msg, status){
//   // this.incident
//   // if(MessageAlert){}
// }

MessageAlert.prototype.hide = function() {
  this.html.hide(this.hideTime)
  this.dropback.fadeOut(this.hideTime)
  return this
};

MessageAlert.Status = {
  SUCCESS: "SUCCESS",
  EXCEPTION: "EXCEPTION",
  ERROR: "ERROR",
}

MessageAlert.prototype.inStatus = function(status) {
  var isContain = false
  if ('string' != typeof status) {
    throw 'invalid status'
  }
  for (var i in MessageAlert.Status) {
    isContain = (status.toUpperCase() === MessageAlert.Status[i]) || isContain
  }
  return isContain
}

// var messageAlert = new MessageAlert()

//多模态HACK
var counter = 0;
$(document).unbind('hidden.bs.modal')
  .on('hidden.bs.modal', '.modal', function(e) {
    $(this).css("z-index", 1050)
    // $('.modal-backdrop')[counter].css("z-index",1049)
    counter--
  });
$(document).unbind('show.bs.modal')
  .on('show.bs.modal', '.modal', function(e) {
    $(this).css("z-index", 1050 + counter + 2)
    // if ($('.modal-backdrop').length <= 1 )
    //   return
    console.log("chufa")
    var setter = setTimeout(function() {
      console.log("finding",counter,$('.modal-backdrop').length)
      if (counter == $('.modal-backdrop').length) {
        console.log("found")
        $('.modal-backdrop:last-child').css("z-index", 1050 + counter)
        clearTimeout(setter)
        console.log("set")
      }
    }, 0)

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

const pageHelperConfig = {
  rowsPerPage: 10
}
const generateTableWithPageHelper = function(obj) {

  var target = obj.target
  var templateOpts = obj.templateOpts
  var counter = obj.counter
  var datasourceAPI = obj.datasourceAPI
  var startIndex = 0
  var endIndex = startIndex + pageHelperConfig.rowsPerPage
  //options将会传入datasourceAPI,故参数应该与api保持一致
  var options = obj.options || {
    role: getCookie("role"),
    uid: getCookie('uid'),
  }
  options.status = options.status //不一定必须
  options.startIndex = startIndex
  options.endIndex = endIndex

  var datasource = function(datasourceAPI, options) {
    return function(options) {
      return datasourceAPI.call(this, options)
    }
  }(datasourceAPI, options)

  new table().loadFromTemplateJson(datasource(options), templateOpts).to(target)
  new pageHelper({
    recordsCount: counter,
    target: target,
    callback: function(obj) {
      //obj里面只带有startIndex和endIndex信息
      //当点击分页时需要call的函数
      options.startIndex = obj.startIndex
      options.endIndex = obj.endIndex
      new table().loadFromTemplateJson(datasource(options), templateOpts).to(this.target) //target已绑定pageHelper
    }
  })
}
var pageHelper = function(options) {
  //options
  //{
  //  recordsCount 记录总数
  //  rowsPerPage 每页个数
  //  pagesCount 页总数
  //  currentPage 当前页
  //}
  this.rowsPerPage = options.rowsPerPage | pageHelperConfig.rowsPerPage //每页多少条记录 required
  this.currentPage = 1 //当前页数
  this.recordsCount = options.recordsCount | 0
  this.pagesCount = Math.ceil(this.recordsCount / this.rowsPerPage)
  this.startIndex = 0
  this.endIndex = this.startIndex + this.rowsPerPage
  this.callback = options.callback
  this.target = $(options.target)

  this.target.append(this.generate())
}
pageHelper.prototype.generate = function() {
  if (this.recordsCount / this.rowsPerPage < 1) {
    return
  }
  var paginationMark = $('<ul class="pagination">')
  var nav = $('<nav style="text-align: center">')
  nav.append(paginationMark)
  for (var i = 1; i <= this.pagesCount; i++) {
    var a = $(`<a href="#">${i}</a>`)
    var li = $(`<li></li>`)
    var that = this

    if (i == this.currentPage) {
      paginationMark.find("li").removeClass("active")
      li.addClass("active")
    }

    li.on("click", {
      page: i,
      that: that
    }, function(e) {
      paginationMark.find("li").removeClass("active")
      $(this).addClass("active")
      e.data.that.to(e.data.page)
      console.log(e.data)
    })

    var page = li.append(a)
    paginationMark.append(page)
  }
  return nav
}
pageHelper.prototype.next = function() {
  var targetPage = this.currentPage + 1
  this.to(targetPage)
}
pageHelper.prototype.last = function() {
  var targetPage = this.currentPage - 1
  this.to(targetPage)
}
pageHelper.prototype.to = function(page) {
  if (page > this.pagesCount || page <= 0) {
    console.log("ERROR PAGES")
    return
  }
  this.currentPage = page
  this.startIndex = (this.currentPage - 1) * this.rowsPerPage
  this.endIndex = this.startIndex + this.rowsPerPage - 1
  if (this.currentPage == this.pagesCount) {
    var tailCount = (this.recordsCount % this.rowsPerPage)
    if (tailCount != 0) {
      this.endIndex = this.startIndex + tailCount
    }
  }
  this.callback.apply(this, [{
    startIndex: this.startIndex,
    endIndex: this.endIndex
  }])
  this.target.append(this.generate())
}

function getProcessChartTo(PRid, target) {
  var steps = apiConfig.prprocess.Search({
    keyword: PRid
  })
  target = $(target)
  for (var i = 0; i < steps.length; i++) {
    var result = steps[i]["_result"]
    var time = steps[i]["_lastmodified"]
    // var tasktitle = steps[i]["_tasktitle"]
    var result = steps[i]["_result"]
    var taskowner = steps[i]["_taskowner"]
    var taskownername = steps[i]["_taskOwnerName"]
    var comment = steps[i]["_comments"]
    var prprocessstep = steps[i]["_prprocessstep"]
    var mod = `<li class="glyphicon"><a title="${comment}">${prprocessstep}</a><span class="small">${taskownername}<span><span class="operationtime">${time}</span></li>`
    var $mod = $(mod)
    $mod.css("width", (100 / steps.length) + '%')

    if (result == Enum.enumApprovalResult.NoAction) {
      $mod.addClass('noAction')
    } else if (result == Enum.enumApprovalResult.Ready) {
      $mod.addClass('processing')
    } else if (result == Enum.enumApprovalResult.Success || result == Enum.enumApprovalResult.Approved) {
      $mod.addClass('approved')
    } else if (result == Enum.enumApprovalResult.Rejected || result == Enum.enumApprovalResult.Failure) {
      $mod.addClass('rejected')
    }

    if (prprocessstep == Enum.processStatus.NotifiedParty) {
      $mod.addClass('infomation')
    }
    $(target).append($mod)
  }
}

function clearProcessChart() {
  $(".progressbar").empty()
}

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
  // debugger
  this.PrimaryKeyIndex = this.keyArr.indexOf("id")
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
    // debugger
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
  debugger
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
  // for (var i in data) {
  //   data[i].onClick(function() {
  //     callback.call(this, this.dataset.primarykey)
  //     // eval(callback+""+(this.dataset.primarykey))
  //   })
  //   data[i].onCardLongPress(500, function() {
  //     callback.call(this, this.dataset.primarykey)
  //     // eval(callback+""+(this.dataset.primarykey))
  //   })
  // }
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
  if (!Obj.hasHeader)
    Json["data"].pop()
  // if (Obj.hasHeader && header)
  //   Json["data"].push(header)
  this.responseJson = Json
  this.init()
  return this
} //disposable

table.prototype.addRow = function(rowJSONObj) {
  // debugger
  var tbody = $(this.tableHTML)
    .find("tbody")
  var row = new table_row(rowJSONObj, this, false, this.Header)
  // console.log(rowJSONObj,row)
  //PrimaryKeyValue 该行的主键值
  var PrimaryKeyValue = rowJSONObj[this.PrimaryKeyIndex]
  if (this.data[PrimaryKeyValue]) {
    // throw "Error! This primary key is alreay occupied , If need update , please use update function"
  }
  // this.data[PrimaryKeyValue] = row
  this.data[generateUUID()] = row
  tbody.append(row.HTMLObj)
  this.addInfoCard()
  this.isUpdated = true
}
table.prototype.editRow = function(key, row) {
  //TODO
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
  //TODO
  var set = arrayToSet(this.responseJson.data, this.PrimaryKeyIndex)
  if (row instanceof Array)
    set[rowKey] = row
  else {
    var c = setToArray(row, this.responseJson["viewOrder"])
    set[rowKey] = c
  }
  // this.init()
  // this.loadFromTemplateJson(this.responseJson.data, this.responseJson).to(this.container)
  return this
  // this.init().bindEvents()
  // this.loadFromTemplateJson().to(this.container)
  // this.isUpdated = false
}

const table_buttonPool = {
  pool: {
    editBtn: "<button type='button' name='button' class='btn btn-primary edit' onclick='edit(${PrimaryKey})'>编辑</button>",
    PIEditBtn: "<button type='button' name='button' class='btn btn-primary edit' onclick='PurchaseItem.view.edit(${PrimaryKey})'>编辑</button>",
    submitBtn: "<button type='button' name='button' class='btn btn-primary submit' onclick='submit(${PrimaryKey})'>提交</button>",
    deleteBtn: "<button type='button' name='button' class='btn btn-danger del' onclick='Delete(${PrimaryKey})'>删除</button>",
    PIdeleteBtn: "<button type='button' name='button' class='btn btn-danger del' onclick='PurchaseItem.event.delete(${PrimaryKey})'>删除</button>",
    updateBtn: "<button type='button' name='button' class='btn btn-primary update' onclick='update(${PrimaryKey})'>更新</button>",
    supplyBtn: "<button type='button' name='button' class='btn btn-success supply' onclick='supply(${PrimaryKey})'>入库</button>",
    approveBtn: "<button type='button' name='button' class='btn btn-primary approve' onclick='approve(${PrimaryKey})'>通过</button>",
    rejectBtn: "<button type='button' name='button' class='btn btn-danger reject' onclick='reject(${PrimaryKey})'>拒绝</button>",
    expressUpdateBtn: "<button type='button' name='button' class='btn btn-success expressUpdate' onclick='SupplierPRDetail.view.update(${PrimaryKey})'>更新物流</button>",
    expressViewBtn: "<button type='button' name='button' class='btn btn-success expressView' onclick='expressStatus(${PrimaryKey})'>物流状态</button>",
    finishedBtn: "<button type='button' name='button' class='btn btn-primary finish' onclick='finish(${PrimaryKey})'>完成订单</button>",
    historyBtn: "<button type='button' name='button' class='btn btn-success history' onclick='History(${PrimaryKey})'>历史纪录</button>",
    copyBtn: "<button type='button' name='button' class='btn btn-primary copy' onclick='copy(${PrimaryKey})'>复制</button>",
    deleteDraftBtn: "<button type='button' name='button' class='btn btn-danger del' onclick='deleteDraft(${PrimaryKey})'>删除</button>"
  },
  genetrate(PrimaryKey, btnName) {
    var btnString = table_buttonPool.pool[btnName].replace("${PrimaryKey}","\""+PrimaryKey+"\"")
    return eval($(btnString))
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
table_row.prototype.init = function() {
  var row = this.isHeader ? $("<tr id='header'></tr>") : $("<tr></tr>")
  var id = null;
  for (var i = 0; i < this.data.length; i++) {
    if (this.isHeader) {
      var th = $("<th></th>")
      row.append(th.html(this.Headers[i]))
    }
    //  else if ("hide" == this.keyArr[i]) {
    //   // console.log(data);
    //   continue
    // }
    else {
      var td = $("<td data-primaryKey='" + this.PrimaryKeyValue + "'></td>")
      row.append(td.html(this.data[i]))
    }
  }
  if (this.hasButton && !this.isHeader) {
    //如果是header行，则不用加button
    var td = $("<td class='operation'></td>")
    var buttonPool = []

    for (var i in this.buttonPool) {
      // var button = eval(this.buttonPool[i])
      var button = table_buttonPool.genetrate(this.PrimaryKeyValue, this.buttonPool[i])
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
  var row = this.HTMLObj
  var color = color ? color : "#6b85a4"
  var headers = {}
  var props = {}
  var publishDate = null
  for (var i in this.keyArr) {
    var tds = row.children("td") // 该行所有的tds
    props[this.Headers[i]] = $(tds[i])
      .html() //展示没有必要XSS,控制写入时就行
    //遍历keyArr,找到key对应的数据，填入
    // debugger
    //ie没有includes 只能用search
    if (this.keyArr[i].search("hide") >= 0)
      continue
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
      <div class="row card_data_row" data-primaryKey="${primaryKey}">
        <div class="col-xs-4 card_data_title" data-primaryKey="${primaryKey}">
        ${propName}:
        </div>
        <div class="col-xs-8 card_data" data-primaryKey="${primaryKey}">
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
    `<tr class="info_card_row" >
        <td colspan="1">
          <div class="card col-xs-12 row" style="border-color:${bgcolor}">
            <div class="card_head row" style="background-color:${bgcolor}">
              ${headertext}
            </div>
            <div class="card_body" data-primaryKey="${primaryKey}">
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
  var timeOutEvent = null
  console.log("longPress binded!")
  $(this.CardHTMLObj)
    .find(".card_body")
    .on({
      touchstart: function(e) {
        console.log("touch start!",e)
        e.preventDefault()
        timeOutEvent = setTimeout(callback.bind(this), time)
      },
      touchmove: function(e) {
        console.log("touch moving!",e)
        e.preventDefault()
        clearTimeout(timeOutEvent)
        timeOutEvent = 0
      },
      touchend: function(e) {
        console.log("touch end!",e)
        e.preventDefault()
        clearTimeout(timeOutEvent)
        return false
      }
    })
  // .on({
  //   touchstart: function(e) {
  //     console.log("touch start!");
  //     timeOutEvent = setTimeout(callback.bind(this), time);
  //   },
  //   touchmove: function() {
  //     console.log("touch moving!");
  //     clearTimeout(timeOutEvent);
  //     timeOutEvent = 0;
  //   },
  //   touchend: function() {
  //     console.log("touch end!");
  //     clearTimeout(timeOutEvent);
  //     return false;
  //   }
  // })
}
table_row.prototype.onClick = function(callback) {
  console.log("click binded");
  $(this.HTMLObj)
    .find("td:not('.operation')")
    .on("click", callback)
}

const regxRule = {

  string: {
    regx: function(min, max) {
      var result = min
      // if (max)
      result += "," + max
      return `^.{${result}}$`
    },
    msg: `请输入至少min,最多max位字符，不能输入带有#￥%_等特殊符号。`
  },

  account: {
    regx: "",
    msg: ""
  },

  email: {
    regx: "\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}",
    msg: "请输入正常的邮箱"
  },

  phone: {
    regx: "(13\\d|14[57]|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[0589]\\d{7}|[0-9-()（）]{7,18}",
    msg: "请输入正确的手机号码或者座机号码！"
  },

  number: {
    regx: function(min, max) {
      var msg = ""
      var regxstr = ""
      if (min != undefined) {
        var result = min
        result += "," + max
        msg = `请输入至少${min},最多不超过${max}位的数字！`
        regxstr = `^\\d{${result}}$`
      } else {
        msg = `请输入数字！`
        regxstr = `^\\d{1,}$`
      }
      regxRule.number.msg = msg
      return regxstr
    },
    msg: `请输入至少min,最多不超过max位的数字！`
  },
  notnull: {
    regx: "\\S{1,}",
    msg: "不能为空！"
  },
  select: {
    regx: "[^-1]\\d*",
    msg: "请选择！"
  },
  selectBrochure: {
    regx: "[^-1]\\d*",
    msg: "没有找到该物品！请确认后提交！"
  },
  selectEmployee:{
    regx: "[^-1]\\d*",
    msg: "没有找到该员工！请确认后查询！"
  },
  selectDealer:{
    regx: "[^-1]\\d*",
    msg: "没有找到该代理商！请确认后查询！"
  },

  password: {},

  checkbox: {
    regx: function(min, max) {
      //最少選min個，最多選max個

    }
  },

  radio: {},



}

const validator = {
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
            control.unbind("keyup")
            control.on('keyup', function(e) {
              var target = $(e.target)
              var rule = target.data('regxrule')
              var result = validator.validate(target, rule)
              validator.displayResult(target, result)
            })
            break
          case 'radio':
          case 'checkbox':
          case 'hidden':
            control.unbind("change")
            control.on('change', function(e) {
              var target = $(e.target)
              var rule = target.data('regxrule')
              var result = validator.validate(target, rule)
              validator.displayResult(target, result)
            })
            break
          default:
            break
        }
      } else if (control.is("select")) {
        control.unbind("change")
        control.on('change', function(e) {
          // console.log($(e.target).data('regxrule'), 'onchange works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          console.log(target);
          var result = validator.validate(target, rule)
          validator.displayResult(target, result)
        })
      } else if (control.is("textarea")) {
        control.unbind("keyup")
        control.on('keyup', function(e) {
          // console.log($(e.target).data('regxrule'), 'onkeyup works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          var result = validator.validate(target, rule)
          validator.displayResult(target, result)
        })
      }
      //若是input text password，则绑定onkeyup
      //若是input checkbox radio 则绑定 onchange
    }
  },
  validate: function(target, rule) {
    // && ||
    var result = {}
    var regStr = ""
    var regxResult = rule.split(/\(([^)]*)\)/) //匹配括号里的内容
    var category = regxResult[0]
    var limit = regxResult[1]
    // console.log(category, limit)
    var c = null
    if (!(c = regxRule[category])) {
      //regxRule里无值,则说明其可能为一个字符串（函数或者正则）
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
      //若在正则库中到
      if ('function' == typeof c["regx"]) {
        if (limit) {
          //若有limit 则说明需要限制长度
          var limitList = limit.split(",")
          var min = ""
          var max = ""
          var MinAndMax = ""
          if (limitList.length > 2)
            console.log('only two integers required,Max and Min')
          else if (limitList.length == 2) {
            try {
              var i1 = parseInt(limitList[0])
              var i2 = parseInt(limitList[1])
              max = i1 > i2 ? i1 : i2
              min = i1 < i2 ? i1 : i2
              // MinAndMax = min + "," + max
            } catch (e) {
              console.log(e)
            }
          } else {
            min = parseInt(limitList[0])
          }
          regStr = c["regx"](min, max)
        } else {
          regStr = c["regx"]()
        }
      } else {
        regStr = c["regx"]
      }
      // console.log(c["regx"])
      var regexp = new RegExp(regStr)
      var value = ($(target).is("input") || $(target).is("select")) ? $(target).val() : $(target).text()
      // console.log(value, regexp.test(value))
      result['result'] = regexp.test(value)
      result['msg'] = c['msg']
    }
    // return result
    return result
  },
  displayResult: function(target, result) {
    if (!result['result']) {
      validator.error(target, result)
    } else {
      validator.pass(target)
    }
  },
  error: function(target, result) {
    target = $(target)
    var RESULT = result["result"]
    var MSG = result["msg"]
    var PNode = target.parent('div')
    target.attr("validate", false)
    PNode.removeClass("has-success").addClass("has-error")
    PNode.find("i.validator_error").remove()
    PNode.append(`<i class="validator_error text-danger">${MSG}</i>`)
  },
  pass: function(target) {
    target = $(target)
    var PNode = target.parent('div')
    target.attr("validate", true)
    PNode.removeClass("has-error").addClass("has-success")
    PNode.find("i.validator_error").remove()
  },
  Restore: function() {
    var form = $("form[data-validator=true]")
    var validatelist = form.find("*[data-regxRule]")
    for (var i = 0; i < validatelist.length; i++) {
      var target = $(validatelist[i])
      var PNode = target.parent('div')
      target.attr("validate", false)
      PNode.removeClass("has-error").removeClass("has-success")
      PNode.find("i.validator_error").remove()
    }
  },
  Result: function(form) {
    var form = $(form)
    if (form.data("validator")) {
      var validatelist = form.find("*[data-regxRule]")
      var finalResult = true
      for (var i = 0; i < validatelist.length; i++) {
        var target = $(validatelist[i])
        var result = validator.validate(target, target.data("regxrule"))
        validator.displayResult(target, validator.validate(target, target.data("regxrule")))
        finalResult = result["result"] && finalResult
      }
    }
    return finalResult
  }
}

const DetailPrototype = {
  show: function(PRid) {
    console.log(this.id + " is showing!")
    if (PRid) {
      this.init(PRid)
      this.autoComplate(PRid)
    }
    var that = this
    $(this.id).unbind("hidden.bs.modal")
    $(this.id)
      .on("hidden.bs.modal", function() {
        that.destory()
        console.log(that.id + " hidden!")
      })

    $(this.id).modal()
  },
  hide: function() {
    this.destory()
    $(this.id).modal('hide')
    console.log(this.id + "hidden!")
  },
  destory: function() {
    console.log("parents' destory function")
    clearProcessChart()
    // $("#progressbar").empty()
    ClearAllFields(this.id)

    if (window.target) {
      if (window.target.PR)
        window.target.PR = null
      window.target = null
    }
  },
  autoComplate: function(PRid) {
  
  }
}

function ModalAlert(obj) {
  if (!obj)
    var obj = new Object()
  this.name = obj.name || "tempModalAlert"
  this.label = obj.label || "您确认吗？"
  this.title = obj.title || "提示信息"
  this.okLabel = obj.okLabel || "确定"
  this.ok = obj.ok || null
  this.cancelLabel = obj.cancelLabel || "取消"
  this.cancel = obj.cancel || null
  this.model = `
  <div class="modal fade" id="${this.name}">
    <div class="modal-dialog">
      <div class="modal-content message_align">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title">${this.title}</h4>
        </div>
        <div class="modal-body">
          <p>${this.label}</p>
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div>`
  this.html = $(this.model)

  var that = this
  this.html.on("hidden.bs.modal", function() {
    console.log(that)
    $(that.html).remove()
    that = null
  })

  var okbtn = $(`<button class="btn btn-danger" data-dismiss="modal">${this.okLabel}</a>`)
  var cancelbtn = $(`<button type="button" class="btn btn-default" data-dismiss="modal">${this.cancelLabel}</button>`)
  if (this.ok) {
    okbtn.on("click", function() {
      that.ok()
      // that.ok.call(that)
    })
  }
  if (this.cancel) {
    cancelbtn.on("click", function() {
      that.cancel()
    })
  }
  this.html.find(".modal-footer").append($(okbtn))
  this.html.find(".modal-footer").append($(cancelbtn))
  $("body").append(this.html)
  this.html.modal()
}

const BrochureAdmin = {
  //TODO
  view: {
    add: {
      show: function() {
        BrochureAdmin.event.init()
        $("#Add").modal()
      },
      hide: function() {
        BrochureAdmin.event.destory()
        $("#Add").modal("hide")
      },
    },
    edit: {
      show: function() {
        BrochureAdmin.event.init()
        $("#Edit").modal()
      },
      hide: function() {
        BrochureAdmin.event.destory()
        $("#Edit").modal("hide")
      },
    },
    delete: {
      show: function() {
        $("#Delete")
          .modal()
      },
      hide: function() {
        $("#Delete")
          .modal("hide")
      }
    },
    supply: {
      show: function() {
        $("#Supply")
          .modal()
      },
      hide: function() {
        $("#Supply")
          .modal("hide")
      }
    },
    history: {
      show: function(bid) {
        BrochureHistory.show(bid)
      },
      hide: function() {
        $("#History")
          .modal("hide")
      }
    }
  },
  event: {
    add: function() {
      var data = formToSet("#add_Brochure")
      data["_createtime"] = new Date()
      var brochureId = apiConfig.brochure.Add(getCookie("account"),data)
      if (brochureId > 0) {
        new MessageAlert("添加成功", MessageAlert.Status.SUCCESS)
        BrochureAdmin.view.add.hide()
      } else {
        new MessageAlert("添加失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    },
    edit: function() {
      var rawData = window.target
      var data = formToSet("#edit_Brochure")
      for (var i in data) {
        rawData[i] = data[i]
      }
      var brochureId = apiConfig.brochure.Edit(rawData['_id'], data)
      if (brochureId > 0) {
        new MessageAlert("修改成功", MessageAlert.Status.SUCCESS)
        BrochureAdmin.view.edit.hide()
        ClearInputs("#edit_Brochure")
        ClearSelection("#edit_Brochure")
        ClearTextArea("#edit_Brochure")
      } else {
        new MessageAlert("修改失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    },
    destory: function() {
      ClearAllFields("#Add")
    },
    init: function() {
      bindInputQuery({
        input: "input[name=supplierfk]",
        datasourceAPI: apiConfig.supplier.Search,
        searchObj: {},
        innerTextName: "_suppliername",
        valueName: "_id",
        callback: function(result) {}
      })
    },
  }
}

const DealerAdmin = {
  view: {
    add: {
      show: function() {
        $("#Add").modal()
      },
      hide: function() {
        $("#Add").modal("hide")
      },
    },
    edit: {
      show: function(rid) {
        window.target = apiConfig.dealer.Get(rid)
        autoComplateInfo(window.target, "#edit_Dealer")
        $("#Edit").modal()
      },
      hide: function() {
        $("#Edit").modal("hide")
      },
    },
    delete: {
      show: function(rid) {
        window.target = apiConfig.dealer.Get(rid)
        $("#Delete")
          .modal()
      },
      hide: function() {
        $("#Delete")
          .modal("hide")
      }
    }
  },
  event: {
    add: function() {
      var data = formToSet("#add_Dealer")
      var dealerId = apiConfig.dealer.Add(data)
      if (dealerId>0) {
        new MessageAlert("添加成功", MessageAlert.Status.SUCCESS)
        DealerAdmin.view.add.hide()
        ClearInputs("#add_Dealer")
        ClearSelection("#add_Dealer")
        ClearTextArea("#add_Dealer")
      }else{
        new MessageAlert("添加失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    },
    edit: function() {
      var rawData = window.target
      var data = formToSet("#edit_Dealer")
      for (var i in data) {
        rawData[i] = data[i]
      }
      var dealerId = apiConfig.dealer.Edit(rawData['_id'], data)
      if (dealerId>0) {
        DealerAdmin.view.edit.hide()
        new MessageAlert("修改成功", MessageAlert.Status.SUCCESS)
        ClearInputs("#edit_Dealer")
        ClearSelection("#edit_Dealer")
        ClearTextArea("#edit_Dealer")
      }else{
        new MessageAlert("修改失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    }
  }
}

const BrochureHistory = {
  show: function(bid) {
    BrochureHistory.init(bid)
    $("#History").modal()
  },
  hide: function() {
    $("#History").modal("hide")
  },
  init: function(bid) {
    generateTableWithPageHelper({
      target: ".infomationTable",
      templateOpts: tableStructures.Admin.Bruchure.History,
      counter: apiConfig.brochurehistory.CountById(bid),
      datasourceAPI: apiConfig.brochurehistory.Paging,
      options: {
        brochureid: bid
      }
    })
  }
}

// var Optionlist = {
//   init: function() {
//     Optionlist.__proto__ = baseModalShow.view
//   },
//   view: {
//     show1: function() {
//
//     },
//     hide2: function() {
//
//     }
//   },
//   event: {
//
//   }
// }
//
// var baseModalShow = {
//   view: {
//     show: function() {
//       BrochureAdmin.event.init()
//       $("#Add").modal()
//     },
//     hide: function() {
//       BrochureAdmin.event.destory()
//       $("#Add").modal("hide")
//     }
//   }
// }

var PRDetail = {
  id: "#Detail",
  init: function(PRid) {
    var operationArea = $("#PRD_operation")
    $("#progressbar").empty()
    operationArea.empty()
    if (!window.target)
      window.target = {}
    if (!window.target.PR)
      window.target.PR = {}
    if (PRid) {
      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
    }
    //四种情况，
    //1、当前角色为Employee，当前PR属于Progress状态，且当前PR不是该账号审批，则只显示关闭按钮。
    //2、当前角色为Employee，当前PR属于Progress状态，当前PR是该用户审批，则显示审批按钮
    //3、当前角色为ADMIN，当前PR属于Progress状态，则显示审批按钮
    //4、当前PR不属于Progress状态，显示关闭按钮
    //5、new 当前角色为Supplier，则

    if (Enum.role.EMPLOYEE == getCookie("role") || Enum.role.SYSADMIN == getCookie("role")) {
      if (Enum.prstatus.Progress == window.target.PR["_prstatus"]) {
        if ((getCookie("account").toLocaleLowerCase() == apiConfig.prprocess.getCurrentStep(PRid)["_taskowner"].toLocaleLowerCase()) || Enum.role.SYSADMIN == getCookie("role")) {
          $(".modal-infopart.Approval").show()
          $("#Detail textarea#PRD_approvalComments").attr("disabled", false)
          var approvelBtn = `<button type="submit" class="btn btn-primary col-xs-5 col-md-5" onclick="PRDetail.event.approve()">审核通过</button>`
          var rejectBtn = `<button type="submit" class="btn btn-danger col-xs-5 col-md-5" onclick="PRDetail.event.reject()">拒绝通过</button>`
          operationArea.append($(approvelBtn).addClass("col-xs-offset-1 col-md-offset-1")).append($(rejectBtn))
          return
        }
      }
    }
    $(".modal-infopart.Approval").hide()
    $("#Detail textarea#PRD_approvalComments").attr("disabled", true)
    var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-10 col-md-10" data-dismiss="modal" aria-hidden="true">关闭</button>`
    operationArea.append($(closebtnlbtn).addClass("col-xs-offset-1 col-md-offset-1"))
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#Detail",
      targetPITableArea = "#InfomationArea",
      templateOpts = tableStructures.Dealer.MyOrder.orderDetail
    if (PRid) {
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      new table().loadFromTemplateJson(PIinfoSet, templateOpts).to(targetPITableArea)
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      for (var i in PRinfoSet) {
        PRinfoSet[i] = PRinfoSet[i] || "无"
      }
      PRinfoSet["_logistics"] = PRinfoSet["_logistics"].replace(",",",\r\n") || "暂无物流信息"
      autoComplateInfo(PRinfoSet, targetPRArea, "PRD") //将PR填充到表单
      getProcessChartTo(PRid, ".progressbar")
    }
  },
  view: {
  },
  event: {
    approve: function() {
      if (window.target.PR) {
        var PRid = window.target.PR["_id"]
        var comments = $("textarea#PRD_approvalComments").val()
        var isApproved = apiConfig.prprocess.Approve(PRid, comments)
        if (isApproved) {
          new MessageAlert("审核通过！", MessageAlert.Status.SUCCESS)
          PRDetail.hide()
        } else {
          new MessageAlert("审核失败", MessageAlert.Status.EXCEPTION)
        }
      }
      table_init()
    },
    reject: function() {
      if (window.target.PR) {
        var PRid = window.target.PR["_id"]
        var comments = $("textarea#PRD_approvalComments").val()
        var isRejected = apiConfig.prprocess.Reject(PRid, comments)
        if (isRejected == true) {
          new MessageAlert("审核通过！", MessageAlert.Status.SUCCESS)
          PRDetail.hide()
        } else {
          new MessageAlert("审核失败", MessageAlert.Status.EXCEPTION)
        }
        table_init()
      }
    }
  }
}
PRDetail.__proto__ = DetailPrototype

$("#Detail")
  .on("hidden.bs.modal", function() {
      PRDetail.destory()
    }
)

const PurchaseItem = {
  show: function() {
    PurchaseItem.init()
    // $("#PruchaseItem")
    //   .on("hidden.bs.modal", function() {
    //     PurchaseItem.destory()
    //   })
    $("#PruchaseItem")
      .modal()
  },
  hide: function() {
    PurchaseItem.destory()
    $("#PruchaseItem")
      .modal('hide')
  },
  autoComplate: function(PI) {
    var targetPRArea = "#PruchaseItem_form"
    var PInfoSet = 'object' == typeof PI ? PI : apiConfig.purchaseitem.Get(PI) //查出改PI详情

    bindOptionData({
      $select: "#_brochurename",
      datasource: apiConfig.brochure.Search({
        keyword: PInfoSet["_brochurename"]
      }),
      innerTextName: "_brochurename",
      valueName: "_brochurename"
    })

    PInfoSet["brochure"] = PInfoSet["_brochurename"]
    autoComplateInfo(PInfoSet, targetPRArea) //将PR填充到表单
  },
  init: function() {
    $("#PruchaseItem").unbind("hidden.bs.modal")
    $("#PruchaseItem")
      .on("hidden.bs.modal", function(e) {
        PurchaseItem.destory()
      })
    bindInputQuery({
      input: "#brochure",
      datasourceAPI: apiConfig.brochure.Search,
      searchObj: {},
      innerTextName: "_brochurename",
      valueName: "_brochurename",
      callback: function(result) {
        console.log(result)
        // $("#_requestoremployeefk").val(result["accountField"])
      }
    })
  },
  update: function() {
    var unsavePI = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
    var prid = window.target.PR["_id"]
    for (var i = 0; i < unsavePI.length; i++) {
      var item = unsavePI[i]
      item["_purchaserequisitionfk"] = prid
    }
    console.log(unsavePI)
    var count = apiConfig.purchaseitem.Add(unsavePI)
    return count
  },
  updatePITable: function() {
    if (window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]) {
      //填充PI
      var PIinfoSet = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
      var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
      window.__PurchaseRequisitionItem_table = PItable
      PItable.to(window.targetPITableArea)
    }
  },
  destory: function() {
    ClearInputs("#PruchaseItem")
    validator.Restore()
    $("#PIOperation").empty()
    window.target.PI = null
    window._piOperation = null
    window._operation = null
  },
  view: {
    init: function() {
      if (!window.target) {
        window.target = {}
      }
      if (!window.target.PI) {
        window.target.PI = {}
      }

      var operationArea = $("#PIOperation")
      var addbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.add()"><span class="glyphicon glyphicon-ok"></span></button>`
      var appendbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.append()"><span class="glyphicon glyphicon-plus"></span></button>`
      var editbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.edit()"><span class="glyphicon glyphicon-ok"></span></button>`
      var cancelbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.hide()"><span class="glyphicon glyphicon-remove"></span></button>`

      switch (window._piOperation) {
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

      bindInputQuery("#brochure", apiConfig.brochure.Top(1000), "_brochurename", "_brochurename", function() {})

    },
    add: function() {
      window._piOperation = Enum.operation.Create
      PurchaseItem.view.init()
      PurchaseItem.show()
    },
    edit: function(PIid) {
      window._piOperation = Enum.operation.Update
      PurchaseItem.view.init()
      if (PIid.search("[unsave]") >= 0) {
        var PItems = arrayToSet(window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID], "_id")
        window.target.PI = PItems[PIid]
      } else {
        window.target.PI = apiConfig.purchaseitem.Get(PIid)
      }
      PurchaseItem.show()
      PurchaseItem.autoComplate(window.target.PI)
    }
  },
  event: {
    add: function() {
      if (PurchaseItem.event.append())
        PurchaseItem.hide()
    },
    append: function() {
      //是否fields全为空
      if (!validator.Result("#PruchaseItem_form")) {
        new MessageAlert("填写错误，请确认数据！", MessageAlert.Status.ERROR)
        return false
      }
      //
      var arr = []
      var localid = ++row_counter + '[unsave]'
      arr.push(localid)
      var set = formToSet("#PruchaseItem_form")
      set["_id"] = localid
      var order = ["_brochurename", "_quantity", "_deliverypriorityfk"]
      for (var i = 0; i < order.length; i++) {
        arr.push(set[order[i]])
      }
      if (window.__PurchaseRequisitionItem_table) {
        window.__PurchaseRequisitionItem_table.addRow(arr)
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID].push(set)
      }

      ClearInputs("#PruchaseItem_form", ["brochure", "_quantity"])
      ClearSelection("#PruchaseItem_form")
      return true
    },
    edit: function() {
      var target = window.target.PI
      var targetid = window.target.PI["_id"]
      var set = formToSet("#PruchaseItem_form")
      for (var k in set) {
        target[k] = set[k]
      }
      target["_id"] = targetid
      var EditRemoteData = true
      var re = targetid.toString().search("[unsave]")
      if (!(targetid.toString().search("[unsave]") >= 0)) {
        EditRemoteData = apiConfig.purchaseitem.Edit(targetid, target)
      } else {
        EditRemoteData = true
      }
      if (EditRemoteData) {
        var localSource = arrayToSet(window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID], "_id")
        for (var info in target) {
          localSource[targetid][info] = target[info]
        }
        new MessageAlert("修改成功", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("更新失败", MessageAlert.Status.EXCEPTION)
      }
      PurchaseItem.updatePITable()
      ClearInputs("#PruchaseItem_form")
      PurchaseItem.hide()
    },
    delete: function(PIid) {
      var DeleteRemoteData = true;
      var PItems = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      if (PIid.search("[unsave]") >= 0 || window._operation == Enum.operation.Copy) {
        DeleteRemoteData = true
      } else {
        DeleteRemoteData = apiConfig.purchaseitem.Delete(PIid)
      }
      if (DeleteRemoteData) {
        var newArray = deleteFromObjectArray(PItems, "_id", PIid)
        // var pos = -1
        // for (var i = 0; i < PItems.length; i++) {
        //   if (PItems[i]["_id"] == PIid) {
        //     pos = i
        //     break
        //   }
        // }
        // if (pos > 0)
        //   PItems.splice(pos, 1)
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = newArray
        window.__PurchaseRequisitionItem_table.data[PIid].remove()
        new MessageAlert("删除成功", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("删除失败", MessageAlert.Status.EXCEPTION)

      }
    }
  }
}

//绑定输入查询数据
//绑定交付时间组件
// $('#_deliverydate').on("hidden.bs.modal", function(e) {
//   console.log("_deliverydate",e)
//   e.stopPropagation()
// })
$("#PruchaseItem")
  .on("hidden.bs.modal", function(e) {
    PurchaseItem.destory()
  })
// $("#PruchaseItem").on("shown.bs.modal", function(e) {
//
// })
var row_counter = 0

const PurchaseRequisition = {
  id: "#PurchaseRequisition",
  show: function() {
    this.init()
    var that = this
    $(this.id)
      .unbind("hidden.bs.modal")
    $(this.id)
      .on("hidden.bs.modal", function() {
        that.destory()
      })

    $(this.id)
      .modal()
  },
  hide: function() {
    this.destory()
    $(this.id)
      .modal('hide')
  },
  init: function() {

    if (!window.__PurchaseRequisitionItem_Unsave_set)
      window.__PurchaseRequisitionItem_Unsave_set = {}
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
      })

    bindInputQuery({
      input: "#requestordealerfk",
      datasourceAPI: apiConfig.dealer.Search,
      searchObj: {},
      innerTextName: "_dealername",
      valueName: "_id",
      callback: function(result) {
        var val = $("#_requestordealerfk").val()
        var dealer = apiConfig.dealer.Get(val)
        $("#_region")
          .val(dealer["_dealerregion"])
      }
    })

    bindInputQuery({
      input: "#requestoremployeefk",
      datasourceAPI: apiConfig.employee.Search,
      searchObj: {},
      innerTextName: "eNNameField",
      valueName: "accountField",
      callback: function(result) {
        $("#_requestoremployeefk").val(result["accountField"])
        $("#_region")
          .val(result["regionField"])
      }
    })

    // $("#submitter").val(getCookie('account'))
    // $("#submitter").attr("readonly", "readonly")

    $("#_submitter").val(getCookie('account'))
    $("#_submitter").attr("readonly", "readonly")

    // //若为dealer，则自动填充名字和区域
    var role = getCookie("role")
    var user = JSON.parse(getCookie('user'))
    switch (role) {
      case Enum.role.DEALEAR:
        var dealer = user
        if (dealer) {

          $("#_requestordealerfk")
            .val(dealer["_id"])
          // $("#_submitterdealerfk")
          //   .val(dealer["_id"])

          $("#requestordealerfk").val(dealer["_dealername"])
          // $("#submitterdealerfk").val(dealer["_dealername"])

          $("#requestordealerfk")
            .attr("readonly", "readonly")
          $("#requestoremployeefk")
            .attr("readonly", "readonly")

          $("#_region")
            .val(dealer["_dealerregion"])
          $("#_region")
            .attr("readonly", "readonly")

        }
        break
      case Enum.role.EMPLOYEE:
      case Enum.role.SYSADMIN:
        // var user = JSON.parse(getCookie('user'))
        // var user = user
        //COMMON INIT
        $("#agentCheck input").on("change", function(e) {
          $(".requestorInput").hide()
          var t = $("#agentCheck input[name='agent']:checked")
          $(".requestorInput input").val("")
          $(".requestorInput input").removeAttr("data-regxRule")
          if ("forEmp" == t.data("value")) {
            //for Employee
            $("#forEmployee input").removeAttr('disabled')
            $("#forEmployee select").attr("data-regxRule", "selectEmployee")
            $("#forEmployee").show()
          } else {
            //for Dealer
            $("#forDealer input").removeAttr('disabled')
            $("#forDealer select").attr("data-regxRule", "selectDealer")
            $("#forDealer").show()
          }

          validator.init() //重新绑定validator
        })
        //COMMON INIT

        // var user = JSON.parse(getCookie('user'))
        if (user) {
          if (Enum.role.EMPLOYEE == role) {
            $("#requireAgent").on("change", function() {
              $(".requestorInput input").attr('disabled', 'true')
              if ($(this).is(":checked")) {
                $("#_requestoremployeefk").empty()
                $("#requestoremployeefk").val("")
                $("#requestoremployeefk")
                  .removeAttr("readonly")

                $("#agentCheck input").removeAttr('disabled')
                $("#agentCheck").css("visibility", "visible")
              } else {
                //若是employee将自己绑定到提交的申请人的选项input上去
                bindOptionData({
                  $select: "#_requestoremployeefk",
                  datasource: apiConfig.employee.Search({
                    keyword: getCookie("name")
                  }),
                  innerTextName: "eNNameField",
                  valueName: "accountField"
                })
                $("#_requestoremployeefk").val(user["accountField"])
                $("#_region")
                  .val(user["regionField"])

                //如果不需要代填
                $(".queryinput").val("")
                $(".requestorInput").hide()
                $("#forEmployee").show()

                ClearRadio("#agentCheck")

                $("#requestoremployeefk").val(user["eNNameField"])
                $("#_requestoremployeefk").val(user["accountField"])

                $("#requestoremployeefk")
                  .attr("readonly", "readonly")

                $("#forEmployee").attr("readonly", "readonly")
                $("#agentCheck input").attr("checked", "false")
                $("#agentCheck input").attr('disabled', 'true')
                $("#agentCheck").css("visibility", "hidden")
              }
            })
            bindOptionData({
              $select: "#_requestoremployeefk",
              datasource: apiConfig.employee.Search({
                keyword: getCookie("name")
              }),
              innerTextName: "eNNameField",
              valueName: "accountField"
            })
            //并且选上
            $("#requestoremployeefk").val(user["eNNameField"])
            $("#_requestoremployeefk").val(user["accountField"])
            $("#requestoremployeefk")
              .attr("readonly", "readonly")
            $(".requestorInput").hide() //将两个requestor输入框隐藏
            $("#forEmployee").show() //显示forEmployee的
            //填充当前employee的区域
            $("#_region")
              .val(user["regionField"])
            $("#_region")
              .attr("readonly", "readonly")
            // $("#agentCheck").hide()
            // 隐藏代填的两个选项
            $("#agentCheck").css("visibility", "hidden")
            //END
          } else {
            //若是SYSADMIN，则强制选择代填，并且禁用掉#requireAgent
            //默认选择For Employee
            $("#requireAgent").remove()
            $(".requestorInput").hide()
            $("#agentCheck input:first").prop("checked", "checked")
            $("#forEmployee").show()
          }
        }
        break
    }

  },
  autoComplate: function(PRid) {
    var targetPRArea = "#PurchaseRequisition_form"
    window.targetPITableArea = "#InfomationAddArea"
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出PR详情

      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      PurchaseRequisition.loadPITable(PRid)
    }
  },
  loadPITable: function(PRid) {
    //填充PI
    var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 1000)
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = PIinfoSet
    var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    var tmp = PIinfoSet.slice(0)
    var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
    window.__PurchaseRequisitionItem_table = PItable
    PItable.to(window.targetPITableArea)
  },
  detail: function(PRid) {
    window._operation = Enum.operation.Read
    PRDetail.show(PRid)
  },
  destory: function() {
    $("#progressbar").empty()
    $("#operation").empty()
    ClearAllFields("#PurchaseRequisition")
    if (window.__PurchaseRequisitionItem_table) {
      window.__PurchaseRequisitionItem_table.remove()
      window.__PurchaseRequisitionItem_table = null
    }
    if (window.__PurchaseRequisitionItem_Unsave_set) {
      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
      window.__PurchaseRequisition_tempID = null
      window.__PurchaseRequisitionItem_Unsave_set = null
    }

    if (window.target) {
      if (window.target.PR)
        window.target.PR = null
      window.target = null
    }
    window._operation = null
    window.targetPITableArea = null
    $("#operation").empty()
  },
  view: {
    init: function() {
      window.targetPITableArea = "#InfomationAddArea"
      window.__PurchaseRequisition_tempID = generateUUID()

      if (!window.target) {
        window.target = {}
      }
      if (!window.target.PR) {
        window.target.PR = {}
      }
      if (!window.__PurchaseRequisitionItem_Unsave_set) {
        window.__PurchaseRequisitionItem_Unsave_set = {}
      }
      if (!window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]) {
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = []
      }
      if (!window.__PurchaseRequisitionItem_table) {
        window.__PurchaseRequisitionItem_table = new table().new(tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable, ["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"])
        window.__PurchaseRequisitionItem_table.to(window.targetPITableArea)
      }
      if (!window.__PurchaseRequisitionItem_table) {
        //TODO
        // window.__PurchaseRequisitionItem_table = new table().new(tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable, ["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"])
        var PIinfoSet = []
        var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
        window.__PurchaseRequisitionItem_table = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
        window.__PurchaseRequisitionItem_table.to(window.targetPITableArea)
      }

      var operationArea = $("#operation")
      var draftbtn = `<button type="button" class="btn btn-success col-xs-3 col-md-3" onclick="PurchaseRequisition.event.draft()">草稿</button>`
      var submitbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.view.submit()">提交</button>`
      var editbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.edit()">修改</button>`
      var cancelbtn = `<button type="button" class="btn btn-danger col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">取消</button>`
      var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
      switch (window._operation) {
        case Enum.operation.Update:
          operationArea.append($(editbtn).addClass("col-xs-offset-1 col-md-offset-1")).append($(submitbtn)).append($(cancelbtn))
          break
        case Enum.operation.Create:
          operationArea.append($(draftbtn).addClass("col-xs-offset-1 col-md-offset-1")).append($(submitbtn)).append($(cancelbtn))
          break
        case Enum.operation.Copy:
          operationArea.append($(draftbtn).addClass("col-xs-offset-1 col-md-offset-1")).append($(submitbtn)).append($(cancelbtn))
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
      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
    },
    edit: function(PRid) {
      window._operation = Enum.operation.Update
      PurchaseRequisition.view.init()
      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
    },
    delete: function(PRid) {
      window._operation = Enum.operation.Delete
      PurchaseRequisition.view.init()
      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
      $("#Delete").modal()
    },
    submit:function(){
      $("#Submit").modal()
    }
  },
  event: {
    draft: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      // var submitter = $("#submitter").val()
      var submitter = $("#_submitter").val()
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_prstatus"] = Enum.prstatus.Draft

      switch (getCookie('role')) {
        case Enum.role.EMPLOYEE:
          data["_submitteremployeefk"] = getCookie('account')
          data["_requestordealerfk"] = null
          break
        case Enum.role.DEALEAR:
          data["_submitterdealerfk"] = getCookie('uid')
          data["_requestordealerfk"] = getCookie('uid')
          break
      }

      var PRid = apiConfig.purchaserequisition.Draft(data)

      if (PRid > 0) {
        for (var i = 0; i < items.length; i++) {
          items[i]["_purchaserequisitionfk"] = PRid
        }
        var successCount = apiConfig.purchaseitem.Add(items)
        new MessageAlert("该条记录已加入草稿箱！", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("未知错误，请检查数据！", MessageAlert.Status.SUCCESS)
      }

      table_init() //更新
      PurchaseRequisition.hide()
    },
    submit: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []

      if (validator.Result("#PurchaseRequisition_form")) {

        if (items.length <= 0) {
          new MessageAlert("请购单item数量不能为0", MessageAlert.Status.ERROR)
          return
          // throw "请购单item数量不能为0"
        }
        var checkPICountResult = apiConfig.purchaseitem.Check(items)
        if ("" != checkPICountResult) {
          new ModalAlert({label:checkPICountResult.replace(",","<br/>").replace("库存","<br/>库存")})
          // new MessageAlert(checkPICountResult, MessageAlert.Status.EXCEPTION,2000)
          return
        }
        // var submitter = $("#submitter").val()
        var submitter = $("#_submitter").val()
        var data = formToSet("#PurchaseRequisition_form")
        data["_prcreated"] = new Date()
        data["_prstatus"] = Enum.prstatus.Progress
        //如果是Draft转Submit
        if (window._operation == Enum.operation.Update) {
          data["_id"] = window.target.PR["_id"]
          data["_prstatus"] = window.target.PR["_prstatus"]
        } //TODO


        switch (getCookie('role')) {
          case Enum.role.EMPLOYEE:
            data["_submitteremployeefk"] = submitter
            data["_requestordealerfk"] = null
            break
          case Enum.role.DEALEAR:
            data["_submitterdealerfk"] = getCookie('uid')
            data["_requestordealerfk"] = getCookie('uid')
            break
        }
        //添加PR
        var PRid = apiConfig.purchaserequisition.Add(data)
        if (PRid > 0) {
          for (var i = 0; i < items.length; i++) {
            items[i]["_purchaserequisitionfk"] = PRid
          }
          var picount = apiConfig.purchaseitem.Add(items)

          if (picount > 0) {
            apiConfig.prprocess.GenerateAll(PRid) //获取所有steps
            new MessageAlert("提交成功！", MessageAlert.Status.SUCCESS)
            PurchaseRequisition.hide()
            validator.Restore()
          } else {
            new MessageAlert("采购物品信息有误！", MessageAlert.Status.EXCEPTION)
          }
        } else {
          new MessageAlert("提交失败!请联系管理员！", MessageAlert.Status.EXCEPTION)
        }

      } else {
        new MessageAlert("提交失败!请检查表单数据！", MessageAlert.Status.EXCEPTION)
      }
      table_init() //更新
    },
    edit: function() {
      $("#saver").val(getCookie("name"))
      var data = formToSet("#PurchaseRequisition_form")
      for (var v in data) {
        window.target.PR[v] = data[v]
      }
      var EditRemoteData = apiConfig.purchaserequisition.Edit(window.target.PR["_id"], window.target.PR)
      if (EditRemoteData) {
        var picount = PurchaseItem.update()
        new MessageAlert("修改成功！", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("修改失败！", MessageAlert.Status.EXCEPTION)
      }
      PurchaseRequisition.hide()
      table_init() //更新
    },
    delete: function() {
      if (window.target.PR) {
        var id = window.target.PR["_id"]
        var result = apiConfig.purchaserequisition.Delete(id)
        if (result) {
          new MessageAlert("成功删除该草稿！", MessageAlert.SUCCESS)
          $("#Delete").modal("hide")
        } else {
          new MessageAlert("删除草稿失败！请重试！", MessageAlert.EXCEPTION)
        }
        table_init()
      }
    }
  }
}

//绑定input搜索栏数据源
// bindInputQuery("#_demanderfk", "./test/searchDictionary/DealerCollections.json")
// $("#PurchaseRequisition")
//   .on("hidden.bs.modal", function() {
//     //操作需要获取tempID来保存set，
//     //因此将onshown的init写在PR.show()里面，
//     //show只通过call show()方式来使modal显示。
//     //而close可能会有其他事件引发，且close不是同步的，
//     //故清除写在这里
//     PurchaseRequisition.destory()
//   })
// $("#PurchaseRequisition").on("shown.bs.modal", function() {
// })

// $("#addPItem").on("click", function() {
//   //如果没有请购单，则new一个
//   if (!window.__PurchaseRequisitionItem_table) {
//     // var PurchaseRequisitionItemTable = new table()
//     var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
//     var title = {}
//     window.__PurchaseRequisitionItem_table = new table().loadFromTemplateJson(title, templateOpts).to("#InfomationAddArea")
//     // window.__PurchaseRequisitionItem_table.new(t, header).bindEvents()
//     // .to($("#InfomationAddArea"))
//   }
// })

var SupplierPRDetail = {
  id: "#SupplierPRDetail",

  autoComplate: function(PRid) {
    var targetPRArea = "#SupplierPRDetail",
      targetPITableArea = "#SupplierPRDetail .goodsInfomation",
      templateOpts = tableStructures.Supplier.MyOrder.ExpressUpdateDetail
    if (PRid) {
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      new table().loadFromTemplateJson(PIinfoSet, templateOpts).to(targetPITableArea)
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      for (var i in PRinfoSet) {
        PRinfoSet[i] = PRinfoSet[i] || "无"
      }
      PRinfoSet["_logistics"] = PRinfoSet["_logistics"].replace(",",",\r\n") || "暂无物流信息"
      autoComplateInfo(PRinfoSet, targetPRArea, "PRD") //将PR填充到表单
      getProcessChartTo(PRid, ".progressbar")
    }
    var logistics = window.target.PR["_logistics"]
    $("#_logistics").val(logistics)
    var logisticsArray = logistics.split(",")
    for (var i = 0; i < logisticsArray.length; i++) {
      SupplierPRDetail.event.Express.appendExpress(logisticsArray[i])
    }
  },
  destory: function() {
    this.__proto__.destory()
    $(".expressRow").remove()
  },
  view: {
    init: function() {
      $(".expressRow").remove()

      if (!window.target) {
        window.target = {}
      }
      if (!window.target.PR) {
        window.target.PR = {}
      }
    },
    update: function(PRid) {
      window._operation = Enum.operation.Update
      SupplierPRDetail.view.init()

      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
      SupplierPRDetail.show()
      SupplierPRDetail.autoComplate(PRid)
    },
    finish: function() {
      // var PRid = window.target.PR["_id"]
      window._operation = Enum.operation.Update
      // apiConfig.prprocess.SupplierComplete(PRid)
      // SupplierPRDetail.destory()
      SupplierPRDetail.hide()
    }
  },
  event: {
    Express: {
      appendExpress: function(str) {
        str = str || ""
        var model =
          `
            <div class="col-sm-11 col-xs-11 col-md-11 col-lg-11 mt10 mb10 expressRow">
              <label for="expressid" class="col-xs-2 col-md-2 control-label">物流单号</label>
              <div class="input-group">
                <input name="expressid" placeholder="请输入物流单号" type="text" class="form-control" onkeyup="SupplierPRDetail.event.Express.change()" value="${str}">
                <span class="input-group-btn">
                    <button class="btn btn-default" type="button" onclick="SupplierPRDetail.event.Express.reduceExpress(this)">-</button>
                </span>
              </div><!-- /input-group -->
            </div><!-- /.col-lg-6 -->
          `
        $("#Express_form").find("#ExpressAppendBtn").before($(model))
      },
      reduceExpress: function(elem) {
        elem = $(elem)
        elem.parents(".expressRow").remove()
        SupplierPRDetail.event.Express.change()
        // console.log()
      },
      change: function() {
        // var text = $(e).val()
        $("#Express_form").find("#_logistics").val("")
        var str = ""
        var arr = $("#Express_form").serializeArray()
        for (var i = 0; i < arr.length; i++) {
          if ("expressid" == arr[i]["name"]) {
            str += arr[i].value + ","
          }
        }
        while (str.lastIndexOf(',') != -1 && str.lastIndexOf(',') == str.length - 1) {
          str = str.slice(0, str.length - 1)
        }
        $("#Express_form").find("#_logistics").val(str)
      },
      save: function() {
        window.target.PR['_logistics'] = $("#Express_form").find("#_logistics").val()
        var result = apiConfig.purchaserequisition.Edit(window.target.PR["_id"], window.target.PR)
        if (result) {
          new MessageAlert("保存成功", MessageAlert.Status.SUCCESS)
          SupplierPRDetail.hide()
          console.log("Saved!")
        } else {
          new MessageAlert("保存失败", MessageAlert.Status.ERROR)
        }
      }
      // update: function() {
      //   var piid = window.target.PI["_id"]
      //   var prid = window.target.PR["_id"]
      //   SupplierPRDetail.autoComplate(prid)
      //   window.target.PI["_logistics"] = formToSet("#update_Express")["_logistics"]
      //   var isUpdate = apiConfig.purchaseitem.UpdateLogitics(piid, window.target.PI)
      //   if (isUpdate == true) {
      //     new MessageAlert("物流信息更新成功！", MessageAlert.Status.SUCCESS)
      //   }else{
      //     new MessageAlert("物流信息更新失败！", MessageAlert.Status.EXCEPTION)
      //   }
      //   SupplierPRDetail.autoComplate(prid)
      //   SupplierPRDetail.view.Express.destory()
      //   SupplierPRDetail.view.Express.hide()
      // }
    },
    finish: function() {
      var prid = window.target.PR["_id"]
      // var prprocesses = apiConfig.prprocess.Search({keyword:prid})
      // var pi = apiConfig.purchaseitem.Paging(prid, 0, 1000)
      // var isAllLogisticsFilled = true
      //
      // for (var i = 0; i < pi.length; i++) {
      //   if (isStringEmpty(pi[i]["_logistics"])) {
      //     isAllLogisticsFilled = false
      //   }
      // }

      // if (!isAllLogisticsFilled) {
      //   new MessageAlert("有订单物流信息未填写，不能完成该订单", MessageAlert.Status.EXCEPTION)
      //   return
      // }

      var isFinished = apiConfig.purchaserequisition.SupplierComplete(prid)
      if (isFinished == true) {
        new MessageAlert("您已完成该订单", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("订单完成失败", MessageAlert.Status.EXCEPTION)
      }
      // SupplierPRDetail.destory()
      SupplierPRDetail.hide()
      table_init()
    }
  }
}
SupplierPRDetail.__proto__ = DetailPrototype

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
    Add: function(actionOwner, data) {
      //POST
      var api = root + `/api/brochure/new?actionOwner=${actionOwner}`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var account = getCookie("account")
      var api = root + `/api/brochure/${id}/update?actionOwner=${account}`
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
    Search: function({
      keyword,
    }) {
      var api = root + `/api/brochure/search(${keyword})`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/brochure/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex,
      keyword
    }) {
      if (keyword) {
        var api = root + `/api/brochure/search(${keyword},${startIndex},${endIndex})`
      } else {
        var api = root + `/api/brochure/paging(${startIndex},${endIndex})`
      }
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
      var api = root + `/api/brochurehistory/count`
      return GET(api)
    },
    CountById: function(brochureid) {
      var api = root + `/api/brochurehistory/count(${brochureid})`
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
    Paging: function({
      brochureid,
      startIndex,
      endIndex
    }) {
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
      var resultset = this.Search({
        username
      })
      for (var j = 0; j < resultset.length; j++) {
        var i = resultset[j]
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/dealer/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/dealer/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    Paging: function(
      purchaseRequisitionid,
      startIndex,
      endIndex
    ) {
      var api = root + `/api/prprocess/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    },
    Search: function({
      keyword
    }) {
      var purchaseRequisitionid = keyword
      var api = root + `/api/prprocess/search(${purchaseRequisitionid})`
      return GET(api)
    },
    // Approving: function(id, processEnum) {
    //   var pr = this.Get(id)
    //   //GET /api/prprocess/paging({purchaseRequisitionid},{startIndex},{endIndex})
    //   pr["_prprocessstep"] = processEnum
    //   this.Edit(id, pr)
    // },
    Approve: function(prid, comments) {
      var currentStep = apiConfig.prprocess.getCurrentStep(prid)
      var taskOwner = currentStep["_taskowner"]
      var result = null
      if (currentStep) {
        if ((getCookie('role') == Enum.role.EMPLOYEE && getCookie("account") == taskOwner.toUpperCase()) || getCookie('role') == Enum.role.SYSADMIN) {
          var id = currentStep["_id"]
          var api = root + `/api/prprocess/${id}/Approve?comments=${comments}`
          result = PUT(api)
        }
      }
      return result
    },
    Reject: function(prid, comments) {
      var currentStep = apiConfig.prprocess.getCurrentStep(prid)
      var taskOwner = currentStep["_taskowner"]
      var result = null
      if (currentStep) {
        if ((getCookie('role') == Enum.role.EMPLOYEE && getCookie("account") == taskOwner.toUpperCase()) || getCookie('role') == Enum.role.SYSADMIN) {
          var id = currentStep["_id"]
          var api = root + `/api/prprocess/${id}/Reject?comments=${comments}`
          result = PUT(api)
        } else {
          throw `Permission Denied`
        }
      }
      return result
    },
    getCurrentStep: function(prid) {
      var steps = apiConfig.prprocess.Paging(prid, 0, 1000)
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i]
        if (Enum.enumApprovalResult.Ready == step["_result"]) {
          return step
        }
      }
      console.log("当前PR已完成！")
      return {
        "_taskowner": ""
      }

    },
    getStepByAccount: function(prid, account) {
      var steps = apiConfig.prprocess.Paging(prid, 0, 1000)
      var stepArr = []
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i]
        if (account == step["_taskowner"]) {
          stepArr.push(step)
        }
      }
      return stepArr
    },
    getPrStepCommentsByAccount: function(prid, account) {
      var array = this.getStepByAccount(prid, account)
      var comments = []
      if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
          var date = array[i]["_lastmodified"]
          var comment = array[i]["_comments"]
          var obj = {
            date: date,
            comment: comment
          }
          comments.push(obj)
        }
      }
      return comments
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
    Paging: function({
      purchaseRequisitionid,
      startIndex,
      endIndex
    }) {
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
    Check: function(data) {
      //POST
      var api = root + `/api/purchaseitem/check`
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
    Paging: function(
      purchaseRequisitionid,
      startIndex,
      endIndex
    ) {
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
    Delete: function(id) {
      //PUT
      var api = root + `/api/purchaserequisition/${id}`
      return DELETE(api)
    },
    Count: function() {
      var api = root + `/api/purchaserequisition/count`
      return GET(api)
    },
    CountByDealer: function(dealerID, status) {
      var api = root + `/api/purchaserequisition/countbydealer(${dealerID},${status})`
      return GET(api)
    },
    CountByEmployee: function(employeeAccount, status) {
      var api = root + `/api/purchaserequisition/countbyemployee(${employeeAccount},${status})`
      return GET(api)
    },
    Search: function({
      keyword
    }) {
      var api = root + `/api/purchaserequisition/search?keyWord=${keyword}`
      return GET(api)
    },
    SearchByStatus: function({
      role,
      uid,
      status,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/purchaserequisition/search(${role},${uid},${status},${startIndex},${endIndex})`
      return GET(api)
    },
    SearchByKeywordAndStatus: function({
      role,
      uid,
      status,
      keyword,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/purchaserequisition/search(${role},${uid},${status},${keyword},${startIndex},${endIndex})`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/purchaserequisition/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {

      var startIndex = startIndex
      var endIndex = endIndex
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
    SupplierComplete: function(prid) {
      //TODO
      var currentStep = apiConfig.prprocess.getCurrentStep(prid)

      if (!currentStep || Enum.processStatus.SupplierUpdate != currentStep["_prprocessstep"])
        return false

      // var taskOwner = currentStep["_taskowner"]//supplier暂时不用规定权限
      var result = false
      if (currentStep) {
        if ((getCookie('role') == Enum.role.SUPPLIER) || (getCookie('role') === Enum.role.SYSADMIN)) {
          // var id = currentStep["_id"]
          var api = root + `/api/purchaserequisition/${prid}/SupplierComplete`
          result = PUT(api)
        }
      }
      return result
    },
  },
  PRSupplierView: {
    Count: function(completed) {
      var api = root + `/api/PRSupplierView/count?completed=${completed}`
      return GET(api)
    },
    Search: function({
      isCompeleted,
      keyword,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/PRSupplierView/search(${isCompeleted},${keyword},${startIndex},${endIndex})`
      return GET(api)
    },
    Paging: function({
      isCompeleted,
      startIndex,
      endIndex
    }) {
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/supplier/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/supplier/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/systemsetting/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemsetting/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/systemuser/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemuser/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
      var api = root + `/api/systemuser/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/systemuser/login?username=${username}&password=${password}`
      return PUT(api)
    }
  },
  employee: {
    Get: function(accountName) {
      var api = root + `/api/employee/GetEmployee(${accountName})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/employee/login(${username},${password})`
      return GET(api)
    },
    Search: function({
      keyword
    }) {
      var name = keyword
      var api = root + `/api/employee/search(${name})`
      return GET(api)
    }
  },
  PRApproverView: {
    Count: function(account, status) {
      var api = root + `/api/PRApproverView/count?account=${account}&status=${status}`
      return GET(api)
    },
    Paging: function({
      account,
      completed,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/PRApproverView/paging(${account},${completed},${startIndex},${endIndex}`
      return GET(api)
    }
  },
  PRAdminView: {
    Count: function(status, keyword) {
      if (keyword) {
        var api = root + `/api/PRAdminView/count?keyword=${keyword}&status=${status}`
      } else {
        var api = root + `/api/PRAdminView/count?status=${status}`
      }
      return GET(api)
    },
    Paging: function({
      status,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/PRAdminView/paging(${status},${startIndex},${endIndex}`
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
  // idList = idList ? idList : []
  form = $(form)
  var inputs = form.find("input")
  var a = inputs
  for (var i = 0; i < a.length; i++) {
    // var c= $.inArray($(a[i]).attr("id"), idList)
    // console.log(c)
    if (idList) {
      if ($.inArray($(a[i]).attr("id"), idList) > -1)
        $(a[i])
        .val("")
    } else {
      $(a[i])
        .val("")
    }
  }
}

function ClearInputsBut(form, idList) {
  idList = idList ? idList : []
  form = $(form)
  var inputs = form.find("input")
  var a = inputs
  for (var i = 0; i < a.length; i++) {
    if (($.inArray($(a[i]).attr("id"), idList)) == -1)
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

function ClearSelection(form) {
  form = $(form)
  var selection = form.find("select")
  var a = selection
  for (var i = 0; i < a.length; i++) {
    $(a[i])
      .val("-1")
  }
}

function ClearRadio(form) {
  form = $(form)
  var radios = form.find("input:radio")
  for (var i = 0; i < radios.length; i++) {
    radios[i].checked = false
  }
}

function ClearAllFields(form) {
  ClearAllFieldsBut(form)
}

function ClearAllFieldsBut(form, idList) {
  ClearInputsBut(form, idList)
  ClearTextArea(form)
  ClearSelection(form)
  ClearRadio(form)
}

//检测，如果所有input都为空，则直接关闭不保存
function isAllPRTypeFormFieldEmpty(form) {
  // debugger
  var a = $(form).find("input")
  var b = $(form).find("textarea")
  var c = $(form).find("select")

  var isAllEmpty = true
  for (var i = 0; i < a.length; i++) {
    isAllEmpty = isAllEmpty && ($(a[i]).val().length == 0)
  }
  for (var i = 0; i < b.length; i++) {
    isAllEmpty = isAllEmpty && ($(b[i]).val().length == 0)
  }
  for (var i = 0; i < c.length; i++) {
    isAllEmpty = isAllEmpty && ($(a[i]).val() == "-1")
  }
  return isAllEmpty
}

/**
 * 将form表单包装城set对象
 * @param  {Jquery.form} form [description]
 * @return {type}      [description]
 */
function formToSet(form) {
  form = $(form).is("form") ? $(form) : $(form).find("form")
  var formArr = form
    .serializeArray()

  var set = {}
  for (var i = 0; i < formArr.length; i++) {
    var record = formArr[i]
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
  for (var j = 0; j < array.length; j++) {
    var i = array[j]
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
    // var target = form.find("#" + i)
    var target = form.find("*[name=" + i + "]")
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

function getValueArrayFromObjectArray(Array, AttributeName) {
  var resultArr = []
  for (var i = 0; i < Array.length; i++) {
    resultArr.push(Array[i][AttributeName])
  }
  return resultArr
}
/**
 * 将对象数组转化为Object[keyName]:Object[valueName] 的Set集
 * @param  {Array} Array     数据源，对象数组
 * @param  {string} keyName   单个对象，转换后作为key的属性名
 * @param  {string} valueName 单个对象，转换后作为value的属性名
 * @return {Set}           一个为Object[keyName]:Object[valueName] 的Set集
 */
function getValueSetFromObjectArray(Array, keyName, valueName) {
  var resultSet = {}
  for (var i = 0; i < Array.length; i++) {
    resultSet[Array[i][keyName]] = Array[i][valueName]
  }
  return resultSet
}

function isStringEmpty(str) {
  if ("" === str || undefined == str || null == str) {
    return true
  } else {
    return false
  }
}

function deleteFromObjectArray(Array, field, value) {
  var pos = -1
  for (var i = 0; i < Array.length; i++) {
    if (Array[i][field] == value) {
      pos = i
      break
    }
  }
  if (pos >= 0) {
    Array.splice(pos,1)
  }
  return Array
}

const Enum = {
  role: {
    /// ZEISS员工
    EMPLOYEE: "0",
    /// 代理商
    DEALEAR: "1",
    /// 供应商
    SUPPLIER: "2",
    /// 系统管理员
    SYSADMIN: "3"
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
    Approved: "Approved",
    Failure:"Failure",
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

var e = elem => document.querySelector(elem)
var log = (e) => console.log.bind(console)(e)

// $(function() {
//   var slider = new SliderUnlock("#slider", {
//     labelTip: "滑动验证",
//     successLabelTip: "验证成功"
//   }, function() {
//     login()
//   }, function() {});
//   slider.init();
// })

function formToSet(form) {
  form = $(form)
  var formArr = form
    .serializeArray()
  var set = {}
  for (var i = 0; i < formArr.length; i++) {
    var record = formArr[i]
    var key = record["name"]
    var value = record["value"]
    set[key] = value
  }
  return set
}

function login() {
  var root = ""
  var set = formToSet("#login_form")
  var username = set["username"]
  var password = set["password"]

  switch (window.role) {
    case 'admin':
    case 'Admin':
      var user = apiConfig.systemuser.Login(username, password)
      if (user) { //BUG
        window.location.href = "./admin-home.html"
        setCookie("auth", "Admin")
        setCookie("role", Enum.role.SYSADMIN)
        setCookie("name", user["_accountname"])
        setCookie("account", user["_accountname"])
        setCookie("uid", user["_id"])
        setCookie("user", JSON.stringify(user))
      } else {
        new MessageAlert("登陆失败，请检查用户名密码是否正确！", MessageAlert.Status.EXCEPTION)
      }
      break
    case 'dealer':
    case 'Dealer':
      var user = apiConfig.dealer.Login(username, password)
      if (user) {
        window.location.href = "./dealer-home.html"
        setCookie("auth", "Dealer")
        setCookie("role", Enum.role.DEALEAR)
        setCookie("name", user["_accountname"])
        setCookie("account", user["_accountname"])
        setCookie("uid", user["_id"])
        setCookie("user", JSON.stringify(user))
      } else {
        new MessageAlert("登陆失败，请检查用户名密码是否正确！", MessageAlert.Status.EXCEPTION)
      }
      break
    case 'supplier':
    case 'Supplier':
      var user = apiConfig.supplier.Login(username, password)
      if (user) {
        window.location.href = "./supplier-home.html"
        setCookie("auth", "Supplier")
        setCookie("role", Enum.role.SUPPLIER)
        setCookie("name", user["_accountname"])
        setCookie("account", user["_accountname"])
        setCookie("uid", user["_id"])
        setCookie("user", JSON.stringify(user))
      } else {
        new MessageAlert("登陆失败，请检查用户名密码是否正确！", MessageAlert.Status.EXCEPTION)
      }
      break
    case 'zeiss':
    case 'Zeiss':
      var user = apiConfig.employee.Login(username, password)
      console.log(user)
      // if ("zeiss" == username.toLowerCase()) {
      if (!user["statusField"]) {
        //BUG 这里的login API任意账号密码都能获取返回值，到底以什么来确定该用户是否正确？
        window.location.href = "./zeiss-home.html"
        /**
         *   "statusField": 0,
              "nameField": "string",
              "eNNameField": "string",
              "mobileField": "string",
              "emailField": "string",
              "accountField": "string"
         */
        setCookie("auth", "Zeiss")
        setCookie("role", Enum.role.EMPLOYEE)
        setCookie("name", user["nameField"])
        setCookie("account", user["accountField"])
        // setCookie("name", "BLManager")
        // var user = {
        //   "_id":"BLManager"
        // }
        setCookie("user", JSON.stringify(user))
      } else {
        new MessageAlert("登陆失败，请检查用户名密码是否正确！", MessageAlert.Status.EXCEPTION)
      }
      break
  }
  return false
}
$("#role").on('change', function(e) {
  window.role = $("#role").val()
})
window.role = $("#role").val()


$("#login_form").on("keydown", function(e) {
  if (e.which === 13) {
    console.log("Enter")
    e.preventDefault()
    login()
  }
})

const tableStructures = {
  Admin: {
    Bruchure: {
      History: {
        "tablename": "History",
        "hasHeader": true,
        "hasButton": false,
        "keyArr": ["id", "key", "key", "prop", "prop", "prop"],
        "viewOrder": ["_id", "_direction", "_quantity", "_operator", "_created"],
        "data": [
          ["序列", "操作", "物品数量", "操作人", "操作时间"],
        ]
      },
      Inventory: {
        "tablename": "Inventory",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["supplyBtn", "historyBtn", "editBtn", "deleteBtn"],
        "keyArr": ["id", "key", "key", "prop", "prop"],
        "viewOrder": ["_id", "_brochurecode", "_brochurename", "_quantity", "_description"],
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
        "viewOrder": ["ID", "PRNumber", "Purpose", "Submitter", "PRCreated", "Approver"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "当前审批人"],
        ]
      },
      oldOrder: {
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
        "hasButton": false,
        "viewOrder": ["ID", "PRNumber", "Purpose", "Submitter", "PRCreated", "PRCompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      oldReject: {
        "tablename": "reject",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["ID", "PRNumber", "Purpose", "Submitter", "PRCreated", "PRCompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["ID", "PRNumber", "Purpose", "Submitter", "PRCreated", "PRCompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      },
      oldSuccess: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["ID", "PRNumber", "Purpose", "Submitter", "PRCreated", "PRCompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
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
        "keyArr": ["id", "key", "key", "prop","prop", "prop", "prop"],
        "viewOrder": ["_id", "_suppliercode", "_suppliername","_supplierEmail", "_phonenumber", "_accountname", "_password"],
        "data": [
          ["序列", "供应商编码", "名称","邮箱", "手机号", "账号", "密码"],
        ]
      }
    },
    SystemAdmin: {
      SystemUser: {
        "tablename": "SystemUser",
        "hasHeader": true,
        "hasButton": true,
        "buttonPool": ["editBtn", "deleteBtn"],
        "viewOrder": ["_id", "_accountname", "_password", "_email", "_description"],
        "keyArr": ["id", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "账号", "密码", "邮箱","描述"],
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
        "viewOrder": ["_id", "_brochurename", "_quantity", "_deliverypriorityfk"],
        "keyArr": ["id", "key", "key", "prop"],
        "data": [
          ["编号", "申请种类", "申请数量", "紧急程度"]
        ]
      },
      Approving: {
        "tablename": "approving",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_prcreated"],
        "keyArr": ["id", "prop", "key", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交时间"],
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
        "viewOrder": ["_id", "_brochurename", "_quantity", "_deliverypriorityfk"],
        "keyArr": ["id", "key", "key", "prop"],
        // "buttonPool": ["expressViewBtn"],
        "data": [
          ["序列", "申请种类", "申请数量", "紧急程度"],
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
        "viewOrder": ["_id", "_prnumber", "_purpose", "_requestor", "_phonenumber"],
        "keyArr": ["id", "prop", "key", "prop", "hide"],
        "data": [
          ["序列", "订单号", "用途", "申请人", "联系电话"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["_id", "_prnumber", "_purpose", "_requestor", "_prCompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "申请人", "结束时间"],
        ]
      },
      ExpressUpdateDetail: {
        "name": "expressupdatedetail",
        "hasHeader": true,
        "hasButton": false,
        "hasDetail": false,
        "viewOrder": ["_id", "_brochurename", "_quantity"],
        "keyArr": ["id", "key", "prop"],
        // "buttonPool": ["updateBtn"],
        "data": [
          ["序列", "物品名字", "物品数量"],
        ]
      }

    },
    Brochure: {
      "tablename": "Inventory",
      "hasHeader": true,
      "hasDetail": false,
      "hasButton": true,
      "buttonPool": ["supplyBtn", "historyBtn"],
      "viewOrder": ["_id", "_brochurecode", "_brochurename", "_quantity"],
      "keyArr": ["id", "prop", "key", "prop"],
      "data": [
        ["序列", "物品编号", "物品名称", "物品数量"],
      ]
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
        "viewOrder": ["_id", "_brochurename", "_quantity", "_deliverypriorityfk"],
        "keyArr": ["id", "key", "key", "prop"],
        "data": [
          ["编号", "申请种类", "申请数量", "紧急程度"]
        ]
      },
      // PurchaseRequisitionItemTable: {
      //   "tablename": "PurchaseRequisitionItemTable",
      //   "hasHeader": true,
      //   "hasButton": true,
      //   "hasDetail": false,
      //   "buttonPool": ["PIEditBtn", "PIdeleteBtn"],
      //   "viewOrder": ["_id", "_brochurename", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"],
      //   "keyArr": ["id", "key", "prop", "key", "prop", "prop", "prop"],
      //   "data": [
      //     ["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"]
      //   ]
      // },
      Approving: {
        "tablename": "approving",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_prcreated"],
        "keyArr": ["id", "prop", "key", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交时间"],
        ]
      },
      Rejected: {
        "tablename": "rejected",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交时间", "结束时间"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": true,
        "buttonPool": ["copyBtn"],
        "viewOrder": ["_id", "_prnumber", "_purposefk", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交时间", "结束时间"],
        ]
      },
      orderDetail: {
        "name": "orderDetail",
        "hasHeader": true,
        "hasButton": false,
        "viewOrder": ["_id", "_brochurename", "_quantity", "_deliverypriorityfk"],
        "keyArr": ["id", "key", "key", "prop"],
        // "buttonPool": ["expressViewBtn"],
        "data": [
          ["序列", "申请种类", "申请数量", "紧急程度"],
        ]
      }
      // orderDetail: {
      //   "name": "orderDetail",
      //   "hasHeader": true,
      //   "hasButton": false,
      //   "viewOrder": ["_id", "_brochurename", "_quantity", "_consignee", "_contactnumber", "_deliverydate", "_deliveryaddress", "_deliverypriorityfk", "_logistics"],
      //   "keyArr": ["id", "key", "prop", "prop", "prop", "prop", "prop", "prop", "key"],
      //   // "buttonPool": ["expressViewBtn"],
      //   "data": [
      //     ["序列", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址", "紧急程度", "物流信息"],
      //   ]
      // }
    },
    Approval: {
      Applying: {
        "tablename": "order",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["_id", "_prnumber", "_purpose", "_submitter", "_prcreated"],
        "keyArr": ["id", "prop", "key", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间"],
        ]
      },
      Success: {
        "tablename": "success",
        "hasHeader": true,
        "hasDetail": true,
        "hasButton": false,
        "viewOrder": ["_id", "_prnumber", "_purpose", "_submitter", "_prcreated", "_prcompleted"],
        "keyArr": ["id", "prop", "key", "prop", "prop", "prop"],
        "data": [
          ["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"],
        ]
      }
    }
  }
}
