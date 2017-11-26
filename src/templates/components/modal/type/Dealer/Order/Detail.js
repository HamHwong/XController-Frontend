var PRDetail = {
  id: "#Detail",
  init: function(PRid) {
    var operationArea = $("#PRD_operation")
    $("#progressbar").empty()
    operationArea.empty()
    if (!window.target)
      window.target = {}
    if (!window.target.PR)
      window.target.PR = {}
    if (PRid) {
      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
    }
    //四种情况，
    //1、当前角色为Employee，当前PR属于Progress状态，且当前PR不是该账号审批，则只显示关闭按钮。
    //2、当前角色为Employee，当前PR属于Progress状态，当前PR是该用户审批，则显示审批按钮
    //3、当前角色为ADMIN，当前PR属于Progress状态，则显示审批按钮
    //4、当前PR不属于Progress状态，显示关闭按钮
    //5、new 当前角色为Supplier，则

    if (Enum.role.EMPLOYEE == getCookie("role") || Enum.role.SYSADMIN == getCookie("role")) {
      if (Enum.prstatus.Progress == window.target.PR["_prstatus"]) {
        if ((getCookie("account").toLocaleLowerCase() == apiConfig.prprocess.getCurrentStep(PRid)["_taskowner"].toLocaleLowerCase()) || Enum.role.SYSADMIN == getCookie("role")) {
          $(".modal-infopart.Approval").show()
          $("#Detail textarea#PRD_approvalComments").attr("disabled", false)
          var approvelBtn = `<button type="submit" class="btn btn-primary col-xs-5 col-md-5" onclick="PRDetail.event.approve()">审核通过</button>`
          var rejectBtn = `<button type="submit" class="btn btn-danger col-xs-5 col-md-5" onclick="PRDetail.event.reject()">拒绝通过</button>`
          operationArea.append($(approvelBtn).addClass("col-xs-offset-1 col-md-offset-1")).append($(rejectBtn))
          return
        }
      }
    }
    $(".modal-infopart.Approval").hide()
    $("#Detail textarea#PRD_approvalComments").attr("disabled", true)
    var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-10 col-md-10" data-dismiss="modal" aria-hidden="true">关闭</button>`
    operationArea.append($(closebtnlbtn).addClass("col-xs-offset-1 col-md-offset-1"))
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#Detail",
      targetPITableArea = "#InfomationArea",
      templateOpts = tableStructures.Dealer.MyOrder.orderDetail
    if (PRid) {
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      new table().loadFromTemplateJson(PIinfoSet, templateOpts).to(targetPITableArea)
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      for (var i in PRinfoSet) {
        PRinfoSet[i] = PRinfoSet[i] || "无"
      }
      PRinfoSet["_logistics"] = PRinfoSet["_logistics"].replace(",",",\r\n") || "暂无物流信息"
      autoComplateInfo(PRinfoSet, targetPRArea, "PRD") //将PR填充到表单
      getProcessChartTo(PRid, ".progressbar")
    }
  },
  view: {
  },
  event: {
    approve: function() {
      if (window.target.PR) {
        var PRid = window.target.PR["_id"]
        var comments = $("textarea#PRD_approvalComments").val()
        var isApproved = apiConfig.prprocess.Approve(PRid, comments)
        if (isApproved) {
          new MessageAlert("审核通过！", MessageAlert.Status.SUCCESS)
          PRDetail.hide()
        } else {
          new MessageAlert("审核失败", MessageAlert.Status.EXCEPTION)
        }
      }
      table_init()
    },
    reject: function() {
      if (window.target.PR) {
        var PRid = window.target.PR["_id"]
        var comments = $("textarea#PRD_approvalComments").val()
        var isRejected = apiConfig.prprocess.Reject(PRid, comments)
        if (isRejected == true) {
          new MessageAlert("审核通过！", MessageAlert.Status.SUCCESS)
          PRDetail.hide()
        } else {
          new MessageAlert("审核失败", MessageAlert.Status.EXCEPTION)
        }
        table_init()
      }
    }
  }
}
PRDetail.__proto__ = DetailPrototype
