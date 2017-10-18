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
    blod:b,
    raw:r
  }
}
