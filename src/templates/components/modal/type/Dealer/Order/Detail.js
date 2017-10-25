const PRDetail = {
  show: function(PRid) {
    if (PRid) {
      PRDetail.init(PRid)
      PRDetail.autoComplate(PRid)
    }
    $("#Detail").modal()
  },
  hide: function() {
    PRDetail.destory()
    $("#Detail").modal('hide')
  },
  init: function(PRid) {
    $("#progressbar").empty()
    if (!window.target)
      window.target = {}
    if (!window.target.PR)
      window.target.PR = {}
    if (PRid) {
      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
    }
  },
  destory: function() {
    $("#progressbar").empty()
    ClearAllFields("#Detail")
    if (window.target.PR)
      window.target.PR = null
    if (window.target)
      window.target = null
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
      // var tasktitle = steps[i]["_tasktitle"]
      var result = steps[i]["_result"]
      var taskowner = steps[i]["_taskowner"]
      var prprocessstep = steps[i]["_prprocessstep"]
      var mod = `<li class="glyphicon"><span>${prprocessstep}</span><span class="small">${taskowner}<span><span class="operationtime">${time}</span></li>`
      var $mod = $(mod)
      $mod.css("width", (100 / steps.length) + '%')

      if (result == Enum.enumApprovalResult.NoAction) {
        $mod.addClass('noAction')
      } else if (result == Enum.enumApprovalResult.Ready) {
        $mod.addClass('processing')
      } else if (result == Enum.enumApprovalResult.Success || Enum.enumApprovalResult.Approved) {
        $mod.addClass('approved')
      } else if (result == Enum.enumApprovalResult.Rejected || Enum.enumApprovalResult.Failure) {
        $mod.addClass('rejected')
      }

      if (prprocessstep == Enum.processStatus.NotifiedParty) {
        $mod.addClass('infomation')
      }

      $("#progressbar").append($mod)
    }
  },
  view: {
    approve: function() {
      $("#Approve").modal()
    },
    reject: function() {
      $("#Reject").modal()
    }
  },
  event: {
    approve: function() {
      if (window.target.PR) {
        var PRid = window.target.PR["_id"]
        var comments = $("textarea#approvalComments").val()
        var c = apiConfig.prprocess.Approve(PRid, comments)
        PRDetail.hide()
      }
      table_init()
    },
    reject: function() {
      if (window.target.PR) {
        var PRid = window.target.PR["_id"]
        var comments = $("textarea#approvalComments").val()
        apiConfig.prprocess.Reject(PRid, comments)
        PRDetail.hide()
      }
      table_init()
    }
  }
}
