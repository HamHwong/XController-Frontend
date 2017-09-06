var contentmapper = {
  myOrder: "myorder-content.html",
  orderAdmin: "order-content.html",
  BrochureAdmin: "Brochure-content.html",
  Dealer: "Dealer-content.html",
  Supplier: "Supplier-content.html",
  Admin: ""
}

var hyperlink_init = function () {
  $(".nav .section a")
    .on('click', function () {
      // console.log(this.attr("href"));
      // var key = window.location.hash
      // var file = contentmapper[key.substring(1)]
      var file = contentmapper[$(this)
        .attr("href")
        .substring(1)]
      //
      if ("" == file || undefined == file) return
      $.ajax({
        url: "./content/" + file,
        async: false,
        success: function (Obj) {
          $("#content_wapper")
            .empty()
          console.log(Obj);
          $("#content_wapper")
            .append(Obj.trim())
          initPageByName("content")
          sideclose()
        }
      })
    })
}
