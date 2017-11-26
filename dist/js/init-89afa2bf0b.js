// /**
//  * @description Table初始化
//  */
// var table_init = function() {
//   var $finishedTable = $('#finished')
//   var $unfinishedTable = $('#unfinished')
//   var t = new table()
//   t.load('./test/table.json').to($finishedTable)
// }
/**
 * @description Bootstrap datatimepicker初始化
 */
var datatimepicker_init = function() {
  $(".form_datetime")
    .datetimepicker({
      minView: "month", //设置只显示到月份
      format: 'yyyy-mm-dd',
      autoclose: true, //选中关闭
    }); //timepicker
}
/**
 * @description 绑定侧边栏事件
 */
var sideBtn_init = function() {
  $('.sideBtn')
    .click(function() {
      if ($('.sideBtn')
        .hasClass('nav_collapse')) {
        sideopen()
      } else {
        sideclose()
      }
    })
}

var logout_init = function() {
  $(".logout").on("click", function() {
    delCookie("auth")
    delCookie("name")
    delCookie("user")
    window.location.href = "./login.html"
  })
}

var name_init = function() {
  var name = getCookie("name")
  if (name) {
    $(".uname").text(name)
  }
}

var optionlist_init = function() {
  var optionlist = $("select.optionlist")
  for (var i = 0; i < optionlist.length; i++) {
    // $(optionlist[i]).empty()
    var category = $(optionlist[i]).data('category')
    // var optionArray = apiConfig.optionlist.GetByCategory(category)
    // for (var k = 0; k < optionArray.length; k++) {
    //   var j = optionArray[k]
    //   var optionname = j["_optionname"]
    //   var optionvalue = j["_optionvalue"]
    //   var optionsequence = j["_sequence"]
    //   var option = `<option value="${optionvalue}">${optionname}</option>`
    //   $(optionlist[i]).append($(option))
    // }
    bindOptionData({
      $select: optionlist[i],
      datasource: apiConfig.optionlist.GetByCategory(category),
      innerTextName: "_optionname",
      valueName: "_optionvalue"
    })
  }
}

//给搜索按钮绑定搜索函数
var searchbox_init = function() {
  var input = $("input.searchBox")
  var btn = $("button.searchBtn")
  btn.on("click", function() {
    search()
  })
  // var datasource = input.data('targetdata')
  // new table().loadFromTemplateJson(`/api/${datasource}/search(100)`, templateOpts, dataOrder).to("#Dealer-table-container")
}
var validator_init = function() {
  validator.init()
}

var init = {
  home: {},
  header: {
    logout: function() {
      logout_init()
    },
    name: function() {
      name_init()
    }
  },
  content: {
    tab: function() {
      tab_init()
    },
    table: function() {
      if (!CurrentTableList)
        var CurrentTableList = []
      table_init(CurrentTableList)
    },
    datatimepicker: function() {
      datatimepicker_init()
    },
    optionlist: function() {
      optionlist_init()
    },
    searchbox: function() {
      searchbox_init()
    },
    validator: function() {
      validator_init()
    }
  },
  sideNav: {
    closeInMobile: function() {
      if ($(window)
        .innerWidth() < 768) {
        sideclose()
      } //hack
    },
    sideBtn: function() {
      sideBtn_init()
    },
    hyperlink: function() {
      hyperlink_init()
    }
  }
}

var initPageByName = function(pagename) {
  for (var i in init[pagename]) {
    init[pagename][i]()
  }
}