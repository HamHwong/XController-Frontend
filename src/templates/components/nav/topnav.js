var sideopen = function() {
  $('.sideBtn').removeClass('nav_collapse').addClass('nav_open');
  $('.topNav').removeClass('nav_collapse').addClass('nav_open');
  $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-open')
}

var sideclose = function() {
  $('.sideBtn').removeClass('nav_open').addClass('nav_collapse');
  $('.topNav').removeClass('nav_open').addClass('nav_collapse');
  $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-close')
}
