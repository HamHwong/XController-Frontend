var Loading = {
  show: function() {
    if (!window.LoadingMarker) {
      var container = $("<div class='Loading'>")
      var loading = $('<div class="wrapper"><div class="loadingspan"><div class="help"></div></div></div>')
      container.append(loading)
      window.LoadingMarker = container
      $("body").append(window.LoadingMarker)
    } else {
      // $(".Loading").css("display", "block")
      window.LoadingMarker.show()
    }
  },
  hide: function() {
    if (window.LoadingMarker) {
      window.LoadingMarker.hide()
    }
  }
}
