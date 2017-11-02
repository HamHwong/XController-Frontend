const PurchaseRequisition = {
  show: function() {
    PurchaseRequisition.init()
    $("#PurchaseRequisition")
      .modal()
  },
  hide: function() {
    PurchaseRequisition.destory()
    $("#PurchaseRequisition")
      .modal('hide')
  },
  init: function() {
    bindInputQuery({
      input: "#requestordealerfk",
      datasourceAPI: apiConfig.dealer.Search,
      searchObj: {},
      innerTextName: "_dealername",
      valueName: "_id",
      callback: function(result) {
        console.log(result)
        var val = $("#_requestordealerfk").val()
        var dealer = apiConfig.dealer.Get(val)
        $("#_dealerregion")
          .val(dealer["_dealerregion"])
      }
    })

    bindInputQuery({
      input: "#requestoremployeefk",
      datasourceAPI: apiConfig.employee.Search,
      searchObj: {},
      innerTextName: "eNNameField",
      valueName: "accountField",
      callback: function(result) {
        $("#_requestoremployeefk").val(result["accountField"])
      }
    })

    // $("#requestoremployeefk").on("keyup", function(e) {
    //   bindInputQuery("#requestoremployeefk", apiConfig.employee.Search(e.target.value), "eNNameField", "accountField", function() {
    //     var val = $("#requestoremployeefk").val()
    //     var employee = apiConfig.employee.Search(val)
    //     $("#_requestoremployeefk").val(employee[0]["accountField"])
    //   })
    // })

    $("#submitter").val(getCookie('account'))
    $("#submitter").attr("disabled", "true")

    // //若为dealer，则自动填充名字和区域
    if (Enum.role.DEALEAR == getCookie("role")) {
      var dealer = JSON.parse(getCookie('user'))
      if (dealer) {
        $("#_requestordealerfk")
          .val(dealer["_id"])
        $("#_submitterdealerfk")
          .val(dealer["_id"])
        $("#requestordealerfk").val(dealer["_dealername"])
        $("#submitterdealerfk").val(dealer["_dealername"])
        $("#requestordealerfk")
          .attr("readonly", "readonly")
        $("#requestoremployeefk")
          .attr("readonly", "readonly")
        $("#_dealerregion")
          .val(dealer["_dealerregion"])
        $("#_dealerregion")
          .attr("disabled", "true")
      }
      // autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
    } else if (Enum.role.EMPLOYEE == getCookie("role")) {
      var employee = JSON.parse(getCookie('user'))
      if (employee) {
        $("#requestoremployeefk").val(employee["accountField"])
        $("#_requestoremployeefk").val(employee["accountField"])
        $("#requestoremployeefk")
          .attr("readonly", "readonly")

        $(".requestorInput").hide()
        $("#forEmployee").show()
        $("#agentCheck").hide()
        $("#requireAgent").on("click", function() {
          $(".requestorInput input").attr('disabled', 'true')
          if ($(this).is(":checked")) {
            $("#requestoremployeefk").val("")
            $("#requestoremployeefk")
              .removeAttr("readonly")

            $("#agentCheck input").removeAttr('disabled')
            $("#agentCheck").show()
          } else {
            $(".queryinput").val("")
            $(".requestorInput").hide()
            $("#forEmployee").show()

            var radio = $("#agentCheck input")
            for (var a = 0; a < radio.length; a++) {
              radio[a].checked = false
            }

            $("#requestoremployeefk").val(employee["accountField"])
            $("#requestoremployeefk")
              .attr("readonly", "readonly")

            $("#forEmployee").attr("readonly", "readonly")
            $("#agentCheck input").attr("checked", "false")
            $("#agentCheck input").attr('disabled', 'true')
            $("#agentCheck").hide()
          }
        })
        $("#agentCheck input").on("click", function(e) {
          // var t = $(e.target)
          // debugger
          $(".requestorInput").hide()
          var t = $("#agentCheck input[name='agent']:checked")
          if ("forEmp" == t.data("value")) {
            $("#forEmployee input").removeAttr('disabled')
            $("#forEmployee").show()
          } else {
            //for Dealer
            $("#forDealer input").removeAttr('disabled')
            $("#forDealer").show()
          }
        })
      }
    }

  },
  autoComplate: function(PRid) {
    var targetPRArea = "#PurchaseRequisition_form"
    window._targetPITableArea = "#InfomationAddArea"
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出PR详情
      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      PurchaseRequisition.loadPITable(PRid)
    }

  },
  loadPITable: function(PRid) {
    //填充PI
    var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = PIinfoSet
    var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    var tmp = PIinfoSet.slice(0)
    var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
    window.__PurchaseRequisitionItem_table = PItable
    PItable.to(window._targetPITableArea)
  },
  detail: function(PRid) {
    window._operation = Enum.operation.Read
    PRDetail.show(PRid)
  },
  destory: function() {
    ClearAllFields("#PurchaseRequisition")
    if (window.__PurchaseRequisitionItem_table) {
      window.__PurchaseRequisitionItem_table.remove()
      window.__PurchaseRequisitionItem_table = null
    }
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
    window.__PurchaseRequisition_tempID = null
    window.__PurchaseRequisitionItem_Unsave_set = null

    if (window._target) {
      if (window._target.PR)
        window._target.PR = null
      window._target = null
    }
    window._operation = null
    window._targetPITableArea = null
    $("#operation").empty()
  },
  view: {
    init: function() {
      window._targetPITableArea = "#InfomationAddArea"
      ClearAllFields("#PurchaseRequisition")
      $("#progressbar").empty()
      $("#operation").empty()
      window.__PurchaseRequisition_tempID = generateUUID()

      if (!window._target) {
        window._target = {}
      }
      if (!window._target.PR) {
        window._target.PR = {}
      }
      if (!window.__PurchaseRequisitionItem_Unsave_set) {
        window.__PurchaseRequisitionItem_Unsave_set = {}
      }
      if (!window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]) {
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = []
      }
      if (!window.__PurchaseRequisitionItem_table) {
        window.__PurchaseRequisitionItem_table = new table().new(tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable, ["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"])
        window.__PurchaseRequisitionItem_table.to(window._targetPITableArea)
      }

      var operationArea = $("#operation")
      var draftbtn = `<button type="button" class="btn btn-success col-xs-3 col-md-3 col-xs-offset-1" onclick="PurchaseRequisition.event.draft()">Draft</button>`
      var submitbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.submit()">提交</button>`
      var editbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.edit()">修改</button>`
      var cancelbtn = `<button type="button" class="btn btn-danger col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">取消</button>`
      var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
      switch (window._operation) {
        case Enum.operation.Update:
          operationArea.append($(editbtn)).append($(submitbtn)).append($(cancelbtn))
          break
        case Enum.operation.Create:
          operationArea.append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
          break
        case Enum.operation.Copy:
          operationArea.append($(draftbtn)).append($(submitbtn)).append($(cancelbtn))
          break
        default:
          operationArea.append($(closebtnlbtn))
          break
      }
    },
    create: function() {
      window._operation = Enum.operation.Create
      PurchaseRequisition.view.init()
      PurchaseRequisition.show()
      PurchaseRequisition.autoComplate()
    },
    copy: function(PRid) {
      window._operation = Enum.operation.Copy
      PurchaseRequisition.view.init()
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
    },
    edit: function(PRid) {
      window._operation = Enum.operation.Update
      PurchaseRequisition.view.init()
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
      // console.log(5, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    },
    delete: function(PRid) {
      window._operation = Enum.operation.Delete
      PurchaseRequisition.view.init()
      $("#Delete").modal()
    }
  },
  event: {
    draft: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      var submitter = $("#submitter").val()
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_prstatus"] = Enum.prstatus.Draft

      switch (getCookie('role')) {
        case Enum.role.EMPLOYEE:
          data["_submitteremployeefk"] = getCookie('account')
          data["_requestordealerfk"] = null
          break
        case Enum.role.DEALEAR:
          data["_submitterdealerfk"] = getCookie('uid')
          break
      }

      var PRid = apiConfig.purchaserequisition.Draft(data)

      for (var i = 0; i < items.length; i++) {
        items[i]["_purchaserequisitionfk"] = PRid
      }
      apiConfig.purchaseitem.Add(items)
      // apiConfig.prprocess.GenerateAll(PRid) //获取所有steps
      table_init() //更新
      PurchaseRequisition.hide()
    },
    submit: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      // if (items.length <= 0) {
      //   throw "请购单item数量不能为0"
      // }
      var submitter = $("#submitter").val()
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_prstatus"] = Enum.prstatus.Progress

      if (window._operation == Enum.operation.Update) {
        data["_id"] = window._target.PR["_id"]
        data["_prstatus"] = window._target.PR["_prstatus"]
      } //TODO

      switch (getCookie('role')) {
        case Enum.role.EMPLOYEE:
          data["_submitteremployeefk"] = submitter
          data["_requestordealerfk"] = null
          break
        case Enum.role.DEALEAR:
          data["_submitterdealerfk"] = getCookie('uid')
          break
      }

      var PRid = apiConfig.purchaserequisition.Add(data)

      for (var i = 0; i < items.length; i++) {
        items[i]["_purchaserequisitionfk"] = PRid
      }
      apiConfig.purchaseitem.Add(items)
      apiConfig.prprocess.GenerateAll(PRid) //获取所有steps
      table_init() //更新
      PurchaseRequisition.hide()
    },
    edit: function() {
      $("#saver").val(getCookie("name"))
      var data = formToSet("#PurchaseRequisition_form")
      for (var v in data) {
        window._target.PR[v] = data[v]
      }
      apiConfig.purchaserequisition.Edit(window._target.PR["_id"], window._target.PR)
      PurchaseItem.update()
      PurchaseRequisition.hide()
      table_init() //更新
    }
  }
}
