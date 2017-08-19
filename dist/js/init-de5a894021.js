/**
 * @description Plugs Icheck 初始化
 */
var icheck_init = function() {
  $('input').iCheck({
    checkboxClass: 'icheckbox_flat-blue',
    radioClass: 'iradio_flat-blue'
  });
}
/**
 * @description Bootstrap popover初始化
 */
var popover_init = function() {
  $("[data-toggle='popover']").popover(); //悬浮框
}
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
 * @description Table初始化
 */
var table_init = function() {
  var $finishedTable = $('#finished table')
  var $unfinishedTable = $('#unfinished table')
  hideColunmInMobile($finishedTable)
  hideColunmInMobile($unfinishedTable)
  addAllRowsCards($finishedTable)
  addAllRowsCards($unfinishedTable)
}
/**
 * @description Bootstrap datatimepicker初始化
 */
var datatimepicker_init = function() {
  $(".form_datetime").datetimepicker({
    minView: "month", //设置只显示到月份
    format: 'yyyy-mm-dd',
    autoclose: true, //选中关闭
  }); //timepicker
}
/**
 * @description 绑定侧边栏事件
 */
var sideBtn_init = function() {
  $('.sideBtn').click(function() {
    if ($('.sideBtn').hasClass('nav_collapse')) {
      sideopen()
    } else {
      sideclose()
    }
  })
}
var init = {
  home: {},
  header: {
    popover: function() {
      popover_init()
    }
  },
  content: {
    tab: function() {
      tab_init()
    },
    table: function() {
      table_init()
    },
    icheck: function() {
      icheck_init()
    },
    datatimepicker: function() {
      datatimepicker_init()
    }
  },
  sideNav: {
    closeInMobile: function() {
      if ($(window).innerWidth() < 768) {
        sideclose()
      } //hack
    },
    sideBtn: function() {
      sideBtn_init()
    }
  }
}

var initPageByName = function(pagename) {
  for (var i in init[pagename]) {
    init[pagename][i]()
  }
}
