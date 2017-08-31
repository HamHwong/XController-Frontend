// var sideopen = function() {
//   $('.sideBtn').removeClass('nav_collapse').addClass('nav_open');
//   $('.sideNav').removeClass('nav_collapse').addClass('nav_open');
//   $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-open')
//   $('#right_wapper').removeClass().addClass('shrunk')
// }
//
// var sideclose = function() {
//   $('.sideBtn').removeClass('nav_open').addClass('nav_collapse');
//   $('.sideNav').removeClass('nav_open').addClass('nav_collapse');
//   $('.sideBtn .glyphicon').removeClass().addClass('glyphicon').addClass('sideBtnIcon-close')
//   $('#right_wapper').removeClass().addClass('extend')
// }
//
// var contentmapper = {
//   myOrder:"",
//   orderAdmin:"order-content.html",
//   goodsAdmin:"",
//   userAdmin:"agent-content.html",
//   Admin:""
// }
//
// var hyperlink_init = function() {
//   $(".navbar .nav .section a").on('click', function() {
//     // console.log(this.attr("href"));
//     // var key = window.location.hash
//     // var file = contentmapper[key.substring(1)]
//     var file = contentmapper[$(this).attr("href").substring(1)]
//     if(""==file)return
//     $.ajax({
//       url: "./content/"+file,
//       async: false,
//       success: function(Obj) {
//         $("#content_wapper").empty()
//         $("#content_wapper").append(Obj)
//         // table_init()
//         initPageByName("content")
//       }
//     })
//   })
// }
