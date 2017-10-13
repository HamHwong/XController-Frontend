var PRDetail = {
  show: function() {
    $("#Detail").modal()
  },
  hide: function() {
    $("#Detail").modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#Detail",
      targetPITableArea = "#InfomationArea",
      templateOpts = tableStructures.Dealer.MyOrder.orderDetail
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea, "PRD") //将PR填充到表单
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      new table().loadFromTemplateJson(PIinfoSet, templateOpts).to(targetPITableArea)
    }

    var steps = apiConfig.prprocess.Paging(PRid, 0, 100).reverse()
    for (var i = 0; i < steps.length; i++) {
      var result = steps[i]["_result"]
      var time = steps[i]["_lastmodified"]
      var step = steps[i]["_prprocessstep"]
      var result = steps[i]["_result"]
      var mod = `<li class="glyphicon"><span>${step}</span><span class="operationtime">${time}</span></li>`
      $mod = $(mod)
      $mod.css("width", (100 / steps.length) + '%')

      if (result == Enum.enumApprovalResult.NoAction) {
        $mod.addClass('noAction')
      } else if (result == Enum.enumApprovalResult.Success) {
        $mod.addClass('approved')
      } else if (result == Enum.enumApprovalResult.Rejected) {
        $mod.addClass('rejected')
      }

      if (step == Enum.processStatus.NotifiedParty) {
        $mod.addClass('infomation')
      }

      $("#progressbar").append($mod)
    }

    var noAction = $("#progressbar").find('.noAction')
    if (noAction.length > 1) {
      var processing = $(noAction[0])
      processing.addClass('processing')
    }
  }
}
