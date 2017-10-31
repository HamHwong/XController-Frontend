'use strict';
var sideopen = function sideopen() {
    $('.sideBtn').removeClass('nav_collapse').addClass('nav_open');
    $('.sideNav').removeClass('nav_collapse').addClass('nav_open');
    $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-open');
    $('#right_wapper').removeClass().addClass('shrunk');
};
var sideclose = function sideclose() {
    $('.sideBtn').removeClass('nav_open').addClass('nav_collapse');
    $('.sideNav').removeClass('nav_open').addClass('nav_collapse');
    $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-close');
    $('#right_wapper').removeClass().addClass('extend');
};