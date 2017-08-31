var contentmapper = {
  myOrder:"",
  orderAdmin:"order-content.html",
  goodsAdmin:"",
  userAdmin:"agent-content.html",
  Admin:""
}

var hyperlink_init = function() {
  $(".navbar .nav .section a").on('click', function() {
    // console.log(this.attr("href"));
    // var key = window.location.hash
    // var file = contentmapper[key.substring(1)]
    var file = contentmapper[$(this).attr("href").substring(1)]
    if(""==file)return
    $.ajax({
      url: "./content/"+file,
      async: false,
      success: function(Obj) {
        $("#content_wapper").empty()
        $("#content_wapper").append(Obj)
        // table_init()
        initPageByName("content")
      }
    })
  })
}
