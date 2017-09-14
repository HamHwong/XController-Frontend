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
