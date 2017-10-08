var PRDetail = {
  show: function() {
    $("#Detail").modal()
  },
  hide: function() {
    $("#Detail").modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#Detail",
      targetPRITableArea = "#InfomationArea",
      templateOpts = tableStructures.Dealer.MyOrder.orderDetail
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea,"PRD") //将PR填充到表单
      //填充PRI
      var PRIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      new table().loadFromTemplateJson(PRIinfoSet, templateOpts).to(targetPRITableArea)
    }

    var steps = apiConfig.prprocess.Paging(PRid, 0, 100).reverse()
    for (var i = 0; i < steps.length; i++) {
      var result = steps[i]["_result"]
      var time = steps[i]["_lastmodified"]
      var step = steps[i]["_prprocessstep"]
      var mod = `<li class="glyphicon"><span>${step}</span><span class="operationtime">${time}</span></li>`
      $mod = $(mod)
      $mod.css("width", (100 / steps.length) + '%')
      if (i == steps.length - 1 && steps[i]["_result"] == "") {
        $mod.addClass('validating')
      } else {
        $mod.addClass('complated')
      }
      $("#progressbar").append($mod)
    }
  }
}
