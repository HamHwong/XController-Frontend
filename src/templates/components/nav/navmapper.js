// window.currentPos = "myOrder"

var contentmapper = {
  myOrder: "myorder-content.html",
  myOrderDealer: "myorder-content-dealer.html",
  myOrderSupplier: "myorder-content-supplier.html",
  orderAdmin: "order-content.html",
  Brochure: "Brochure-content.html",
  BrochureAdmin: "Brochure-content-admin.html",
  Dealer: "Dealer-content.html",
  Supplier: "Supplier-content.html",
  Admin: ""
}

var hyperlink_init = function () {
  $(".nav .section a")
    .on('click', function () {
      var position = $(this)
        .attr("href")
        .substring(1)
      var file = contentmapper[position]
      if ("" == file || undefined == file) return
      $.ajax({
        url: "./content/" + file,
        async: false,
        success: function (Obj) {
          $("#content_wapper")
            .empty()
          $("#content_wapper")
            .append(Obj.trim())

          window.currentPos = position//HACK Button

          initPageByName("content")
          sideclose()
        }
      })
    })
}
