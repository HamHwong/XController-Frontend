var fetchNewestExpressStatus = function(primaryKey) {
  // "2017.9.16 09:44 - 物流站已接收"
  var j = $.ajax({
    url: "/test/supplier/MyOrder/newestExpressStatus.json",
    type: "GET",
    async: false
  }).responseJson

  console.log(j);
}


$("#ExpressUpdate")
  .on("hidden.bs.modal", function() {
    ClearTextArea("#ExpressUpdate form")
  })
