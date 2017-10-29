var Optionlist = {
  init: function() {
    Optionlist.__proto__ = baseModalShow.view
  },
  view: {
    show1: function() {

    },
    hide2: function() {

    }
  },
  event: {

  }
}

var baseModalShow = {
  view: {
    show: function() {
      BrochureAdmin.event.init()
      $("#Add").modal()
    },
    hide: function() {
      BrochureAdmin.event.destory()
      $("#Add").modal("hide")
    }
  }
}
