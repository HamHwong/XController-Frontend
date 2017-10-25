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

const bindOptionData = function($select, datasource, innerTextName, valueName) {
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
    optiontext = innerTextName
    optionvalue = valueName
  // } else {
  //   optionvalue = "_id"
  //   optiontext = innerTextName
  // }


  for (var j of datasource) {
    var value = j[optionvalue]
    var text = j[optiontext]
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
const bindInputQuery = function($input, datasource, innerTextName, valueName, callback) {
  $input = $($input)
  $input.unbind("keyup")
  var $select = $input.siblings("select.queryinput")
  bindOptionData($select, datasource, innerTextName, valueName)
  //给input绑定上keyup事件
  $input.on('keyup', function(e) {
    e.preventDefault()
    if ("string" == typeof datasource) {
      datasource = GET(datasource)
    } else {
      datasource = datasource
    }

    var nameArray = getValueArrayFromObjectArray(datasource, innerTextName)
    var set = getValueSetFromObjectArray(datasource, innerTextName, valueName)

    var droplist = $input.siblings(".keyhint")
    droplist.empty()

    var data = queryKeyWords(this.value, nameArray)
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
    if (data["raw"].length > 0 && this.value != "") {
      $input.parent(".search_box_warp").addClass("open")
      $(".keywords").on('click', function(e) {
        var val = $(this).attr("value") //获取到value值
        $select.val(val)
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
    //
  })
}
