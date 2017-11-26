var PRDetail = {
  id: "#Detail",
  // show: function(PRid) {
  //   if (PRid) {
  //     PRDetail.init(PRid)
  //     PRDetail.autoComplate(PRid)
  //   }
  //
  //   $(this.id)
  //     .on("hidden.bs.modal", function() {
  //       PRDetail.destory()
  //     })
  //
  //   $(this.id).modal()
  // },
  // hide: function() {
  //   PRDetail.destory()
  //   $(this.id).modal('hide')
  // },
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
        // if (apiConfig.prprocess.getStepByAccount(PRid, getCookie("account")).length != 0 || Enum.role.SYSADMIN == getCookie("role")) {
        if ((getCookie("account").toLocaleLowerCase() == apiConfig.prprocess.getCurrentStep(PRid)["_taskowner"].toLocaleLowerCase()) || Enum.role.SYSADMIN == getCookie("role")) {
          $(".modal-infopart.Approval").show()
          $("#Detail textarea#PRD_approvalComments").attr("disabled", false)
          var approvelBtn = `<button type="submit" class="btn btn-primary col-md-5" onclick="PRDetail.view.approve()">审核通过</button>`
          var rejectBtn = `<button type="submit" class="btn btn-danger col-md-5" onclick="PRDetail.view.reject()">拒绝通过</button>`
          operationArea.append(approvelBtn).append(rejectBtn)
          return
        }
      }
    }
    $(".modal-infopart.Approval").hide()
    $("#Detail textarea#PRD_approvalComments").attr("disabled", true)
    var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-12 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
    operationArea.append(closebtnlbtn)


    // if (Enum.role.EMPLOYEE == getCookie("role") || Enum.role.SYSADMIN == getCookie("role")) {
    //   if (Enum.prstatus.Progress == window.target.PR["_prstatus"]) {
    //     // if (apiConfig.prprocess.getStepByAccount(PRid, getCookie("account")).length != 0 || Enum.role.SYSADMIN == getCookie("role")) {
    //     if ((getCookie("account").toLocaleLowerCase() == apiConfig.prprocess.getCurrentStep(PRid)["_taskowner"].toLocaleLowerCase()) || Enum.role.SYSADMIN == getCookie("role")) {
    //       $("#Detail textarea#PRD_approvalComments").attr("disabled", false)
    //       var approvelBtn = `<button type="submit" class="btn btn-primary col-md-5" onclick="PRDetail.view.approve()">审核通过</button>`
    //       var rejectBtn = `<button type="submit" class="btn btn-danger col-md-5" onclick="PRDetail.view.reject()">拒绝通过</button>`
    //       operationArea.append(approvelBtn).append(rejectBtn)
    //     } else {
    //       //TODO
    //       //当前PR若不属于审核状态，或者当前PR审核人中没有该用户，则不给加审核按钮和审核评论框
    //       // console.log("您没有对该PR审查的许可。")
    //       $(".modal-infopart.Approval").hide()
    //       $("#Detail textarea#PRD_approvalComments").attr("disabled", true)
    //       var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-12 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
    //       operationArea.append(closebtnlbtn)
    //     }
    //   } else {
    //     $(".modal-infopart.Approval").hide()
    //     $("#Detail textarea#PRD_approvalComments").attr("disabled", true)
    //     var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-12 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
    //     operationArea.append(closebtnlbtn)
    //   }
    // } else {
    //   $(".modal-infopart.Approval").hide()
    //   $("#Detail textarea#PRD_approvalComments").attr("disabled", true)
    //   var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-12 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
    //   operationArea.append(closebtnlbtn)
    // }

  },
  destory: function() {
    clearProcessChart()
    // $("#progressbar").empty()
    ClearAllFields("#Detail")

    if (window.target) {
      if (window.target.PR)
        window.target.PR = null
      window.target = null
    }
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#Detail",
      targetPITableArea = "#InfomationArea",
      templateOpts = tableStructures.Dealer.MyOrder.orderDetail
    if (PRid) {
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      new table().loadFromTemplateJson(PIinfoSet, templateOpts).to(targetPITableArea)

      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      for (var i in PRinfoSet) {
        PRinfoSet[i] = PRinfoSet[i] || "无"
      }
      PRinfoSet["_logistics"] = PRinfoSet["_logistics"] || "暂无物流信息"
      var targetUser = null
      if (PRinfoSet["_requestoremployeefk"]) {
        targetUser = apiConfig.employee.Get(PRinfoSet["_requestoremployeefk"])[0]
        //requestor Employee
        var employee = targetUser
        PRinfoSet["_phonenumber"] = employee["mobileField"] || "无"
        PRinfoSet["_email"] = employee["emailField"] || "无"
        PRinfoSet["_region"] = employee["regionField"] || "无"
      } else if (PRinfoSet["_requestordealerfk"]) {
        targetUser = apiConfig.dealer.Get(PRinfoSet["_requestordealerfk"])
        //requestor Dealer
        var dealer = targetUser
        PRinfoSet["_phonenumber"] = dealer["_phonenumber"] || "无"
        PRinfoSet["_email"] = dealer["_email"] || "无"
        PRinfoSet["_region"] = dealer["_dealerregion"] || "无"
      }
      autoComplateInfo(PRinfoSet, targetPRArea, "PRD") //将PR填充到表单
    }
    getProcessChartTo(PRid, ".progressbar")
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
