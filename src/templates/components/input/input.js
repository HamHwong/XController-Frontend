var bindInputQuery = function($input, datasource, callback) {

  $input = $($input)
  $($input).unbind("keyup")
  $input
    .on('keyup', function(e) {
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
      var result = arrayToSet(keywordsdata, "_dealername")
      var nameArray = []
      for (var i in result) {
        nameArray.push(i)
        set[i] = result[i]["_id"]
      }


      var droplist = $input
        .siblings(".keyhint")
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
        $input
          .parent(".search_box_warp")
          .addClass("open")
        $(".keywords")
          .on('click', function(e) {
            var select = $input.siblings("select.queryinput")
            // $select
            var val = $(this).attr("value")
            select.val(val)
            $input.val(this.innerText)
            droplist.empty()
            $input
              .parent(".search_box_warp")
              .removeClass("open")
            if (callback) {
              callback()
            }
          })
      } else {
        $input
          .parent(".search_box_warp")
          .removeClass("open")
      }
    })

}
