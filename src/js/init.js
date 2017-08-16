var icheck_init = function() {
    $('input').iCheck({
      checkboxClass: 'icheckbox_flat-blue',
      radioClass: 'iradio_flat-blue'
    });
  },
  popover_init = function() {
    $("[data-toggle='popover']").popover(); //悬浮框
  },
  tab_init = function() {
    $('#myTab a:first').tab('show'); //切换栏
    $('#myTab a').click(function(e) {
      e.preventDefault()
      $(this).tab('show')
    })
  },
  table_init = function() {
    var $finishedTable = $('#finished table')
    var $unfinishedTable = $('#unfinished table')
    hideColunmInMobile($finishedTable)
    hideColunmInMobile($unfinishedTable)
    addAllRowsCards($finishedTable)
    addAllRowsCards($unfinishedTable)
  },
  datatimepicker_init = function() {
    $(".form_datetime").datetimepicker({
      minView: "month", //设置只显示到月份
      format: 'yyyy-mm-dd',
      autoclose: true, //选中关闭
    }); //timepicker
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
  sidenav: {
    closeInMobile: function() {
      if ($(window).innerWidth() < 768) {
        sideclose()
      } //hack
    }
  }
}

var initPageByName = function(pagename) {
  for (var i in init[pagename]) {
    init[pagename][i]()
  }
}
