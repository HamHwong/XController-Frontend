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
  for (var i of array) {
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
