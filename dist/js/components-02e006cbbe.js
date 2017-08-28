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

/**
 * @description 从字典数组中查询到
 * @param  {String} keys 输入的关键字字符串
 * @param  {StringArray} dic  Dictionary字符串字典数组
 * @return {StringArray}      返回一个装有所有搜索结果的字符数组
 */
var queryKeyWords = function(keys, dic) {
  var r = []
  for (var i in dic) {
    if (dic[i].search(keys)>-1) {
      var keywords = dic[i].match(keys)
      var blodKeyWord = dic[i].replace(keywords, "<b>" + keywords + "</b>")
      r.push(blodKeyWord)
    }
  }
  return r
}
/**
 * 搜索框字典数组
 * @type {Array}
 */
var keywordsdata = [
  "as", "asd", "zxccwr", "zxcer", "utjy", "ndftr", "啊水水水水"
]



/**
 * 修改模板
 * @param  {JQuery.mod} mod 传入模板
 * @param  {json} Obj 传入需要修改成的json对象
 */
var modifyMod = function(mod, Obj) {
  mod.removeClass("hide")
  var header = Obj.Header
  var props = Obj.Props
  var date = Obj.Date
  var bgcolor = Obj.Bgcolor
  var card = mod.find(".card")
  var head = mod.find(".card_head")
  var body = mod.find(".card_body")
  var headertext = ""
  for (var k in header) {
    var headertextcontent = props[header[k]]
    if (headertextcontent.length > 20)
      headertextcontent = headertextcontent.substring(0, 20) + "..."
    headertext += header[k] + ":" + headertextcontent
    headertext += ",<br>"
  }
  head.html(headertext.substring(0, headertext.length - 1))
  head.css("background-color", bgcolor.toString())
  card.css("border-color", bgcolor.toString())
  var row_mod = body.find(".card_data_row").clone()
  row_mod = $(row_mod[0])
  body.empty()
  for (var key in props) {
    var k = key
    var v = props[key]
    var row = row_mod.clone()
    row.find(".card_data_title").html(k)
    row.find(".card_data").html(v)
    body.append(row)
  }
}

var table = function(hasButton) {
  this.table = null;
  this.responseJson = null;
  this.tableJson = null;
  this.hasButton = hasButton;
  this.tableHeader = null;
  this.load = function(url) {
    this.fetch(url)
    // this.parse(this.responseJson)
    this.addInfoCard()
    return this
  }
  this.fetch = function(url) {
    var tableJsonResponse = $.ajax({
      url: url,
      async: false
    })
    this.responseJson = JSON.parse(tableJsonResponse.responseText)
    this.table = this.parse(this.responseJson)
    return this.table
  }
  /**
   * 将JsonArr转成table
   * @param  {[type]} jsonArrs [description]
   * @return {[type]}          [description]
   */
  this.parse = function(jsonArrs) {
    var hasHeader = jsonArrs.hasHeader
    var data = jsonArrs.data
    var keyArr = jsonArrs.keyArr
    var table = $('<table class="table table-bordered table-hover"></table>')
    var tbody = $("<tbody></tbody>")
    if (hasHeader) {
      var hr = data.reverse().pop()
      tbody.append(this.jsonToRow(hr, true, keyArr))//jsonToRow将json对象中的data数据转成hr对象
      data.reverse()
    }
    for (var i = 0; i < data.length; i++) {
      tbody.append(this.jsonToRow(data[i], false))
    }
    table.append(tbody)
    return table
  }
  this.addInfoCard = function() {
    this.table.find('tr:not(".info_card_row")').children('*').addClass('hidden-xs')
    $table = this.table
    var card = new table_card()
    var arr = card.tableToJsonArr($table, true) //TODO 逻辑有问题，之后再改！
    for (var i in arr) {
      var mod = $($(".info_card_row").clone()[0]) //模板不变
      modifyMod(mod, arr[i])
      mod.find(".card_head").siblings('div').hide()
      $table.find("tbody").append(mod)
    }
    $table.find(".card_head").on('click', function() {
      $(this).siblings('div').toggle(100)
    })
  }
  this.to = function($tableContainer) {
    $tableContainer = $($tableContainer)
    $tableContainer.empty()
    $tableContainer.append(this.table)
    return this
  }
  this.jsonToRow = function(jsonArr, isHeader, keyArr) {
    var row = $("<tr></tr>")
    for (var i = 0; i < jsonArr.length; i++) {
      if (isHeader) {
        var th = $("<th></th>")
        if (keyArr) {
          th.attr("key", keyArr[i])
        }
        row.append(th.html(jsonArr[i]))
      } else {
        var td = $("<td></td>")
        row.append(td.html(jsonArr[i]))
      }
    }
    if(hasButton){
    if (isHeader) {
      row.append($("<th key='operation'>操作</th>"))
    } else {
      row.append($("<td><button type=\"button\" name=\"button\" class=\"btn btn-info\">EDIT</button>&nbsp;<button type=\"button\" name=\"button\" class=\"btn btn-danger\">DELETE</button></td>"))
    }}
    return row
  }
  this.bindModal = function(){
    $(this.table).find('tr td:nth-child(2)').on('click',function(){
      var t = new table()

      var steps = $("#orderDetail").find(".steps")
      var baseInfos = $("#orderDetail").find(".baseInfomation")
      var comment = $("#orderDetail").find(".comment")

      t.load("./test/order-Detail.json").to(".goodsInfomation")
      console.log(t.responseJson);
      var j = t.responseJson

      var currStep =j.steps
      var infos = j.baseInfos

      steps.find('li').removeClass("avtice")

      $("#orderDetail").modal()
    })
  }
  return this.table
}
var table_card = function() {
  /**
   * 卡片title的背景色数组
   * @type {Array}
   */
  this.colorarr = [
    "#011935",
    "#00343F",
    "#1DB0B8",
    "#37C6C0",
    "#376956",
    "#199475",
    "#0B6E48",
    "#044D22",
    "#495A80",
  ]
  /**
   * 将行对象转换成Json对象
   * @param  {JQuery.rowObject} $row    传入一个Jquery的row对象
   * @param  {JQuery.rowObject} $headrow 传入一个的Jquery的HeaderRow对象
   * @return {json}          返回一个Json对象，结构为r变量
   */
  this.rowToJson = function($row, $headrow) {
    $row = $($row)
    $headrow = $($headrow)
    var $thtds = $headrow.children() //获取表头的tds
    var $trtds = $row.children() //获取该行的tds
    var keys = $headrow.find("*[key='key']")
    var headers = {}
    for (var j = 0; j < keys.length; j++) {
      headers[keys[j].cellIndex] = $(keys[j]).html()
    }
    var r = {
      "Header": headers,
      "Bgcolor": "#4A8BC2",
      "Props": {},
      "Date": "yyyy-mm-dd"
    }
    for (var i = 0; i < $thtds.length; i++) {
      r["Props"][filterXSS($thtds[i].innerHTML)] = $trtds[i].innerHTML
      r["Bgcolor"] = this.colorarr[Math.floor(Math.random() * this.colorarr.length)]
    }
    return r
  }
  /**
   * 将Table对象转换为Json数组
   * @param  {Jquery.Table}  $table    传入一个table对象
   * @param  {Boolean} hasHeader 是否带头标签th
   * @return {JsonArr}            返回一个带有Json对象的数组
   */
  this.tableToJsonArr = function($table, hasHeader) {
    $table = $($table)
    $trs = $table.find("tr:not('.info_card_row')")
    $ths = $($trs[0])
    var arr = []
    for (var i = 0; i < $trs.length; i++) {
      if (hasHeader && i == 0) {
        continue
      }
      var rowJson = this.rowToJson($trs[i], $ths)
      arr.push(rowJson)
    }
    return arr
  }
}
