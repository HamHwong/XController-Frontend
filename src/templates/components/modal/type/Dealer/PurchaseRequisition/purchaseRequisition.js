const PurchaseRequisition = {
  new: function(obj) {
    var PR = new Object()
    //TODO PR的model
    return PR
  },
  show: function() {
    PurchaseRequisition.init()
    $("#PurchaseRequisition")
      .modal()
  },
  hide: function() {
    $("#PurchaseRequisition")
      .modal('hide')
  },
  init: function() {
    //
    bindInputQuery("#requestordealerfk", apiConfig.dealer.Top(1000), "_dealername", function() {
      var val = $("#_requestordealerfk").val()
      var dealer = apiConfig.dealer.Get(val)
      $("#_dealerregion")
        .val(dealer["_dealerregion"])
      $("#_dealerregion")
        .attr("disabled", "true")
    })

    $("#requestoremployeefk").on("keyup", function(e) {
      bindInputQuery("#requestoremployeefk", apiConfig.employee.Search(e.target.value), "eNNameField", function() {
        var val = $("#_requestoremployeefk").val()
        var employee = apiConfig.employee.Search(val)
        $("#_dealerregion") //字段不见了
          .val(employee["_dealerregion"])
        $("#_dealerregion")
          .attr("disabled", "true")
      })
    })

    $("#submitter").val(getCookie('name'))
    $("#submitter").attr("disabled", "true")
    // PurchaseRequisition.view.init()

    // //若为dealer，则自动填充名字和区域
    if ("dealer" == (getCookie("auth").toLowerCase())) {
      var dealer = JSON.parse(getCookie('user'))
      if (dealer) {
        $("#_requestordealerfk")
          .val(dealer["_id"])
        $("#requestordealerfk").val(dealer["_dealername"])
        $("#requestoremployeefk").val(dealer["_dealername"])
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
    } else if ("zeiss" == (getCookie("auth").toLowerCase())) {
      $("#requestoremployeefk").val(getCookie('name'))
      $("#requestoremployeefk")
        .attr("readonly", "readonly")
      var employee = JSON.parse(getCookie('user'))
      if (employee) {
        $(".requestorInput").hide()
        $("#forEmployee").show()
        $("#agentCheck").hide()
        $("#requireAgent").on("click", function() {
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

            $("#requestoremployeefk").val(getCookie('name'))
            $("#requestoremployeefk")
              .attr("readonly", "readonly")

            $("#forEmployee").attr("readonly", "readonly")
            $("#agentCheck input").attr("checked", "false")
            $("#agentCheck input").attr('disabled', 'true')
            $("#agentCheck").hide()
          }
        })
        $("#agentCheck input").on("click", function(e) {
          var t = $(e.target)
          console.log(t.val());
          if (t.is(':checked')) {
            if (0 == t.val()) {
              $(".requestorInput").attr('disabled', 'true')
              $(".requestorInput").hide()
              $("#forEmployee").removeAttr('disabled')
              $("#forEmployee").show()
            } else {
              //for Dealer
              $(".requestorInput").attr('disabled', 'true')
              $(".requestorInput").hide()
              $("#forDealer").removeAttr('disabled')
              $("#forDealer").show()
            }
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
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
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
    // console.log(1, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
    // console.log(2, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    window.__PurchaseRequisitionItem_table = PItable
    // console.log(3, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
    PItable.to(window._targetPITableArea)
    // console.log(4, window.__PurchaseRequisition_tempID, window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID])
  },
  detail: function(PRid) {
    $("#progressbar").empty()
    window._operation = Enum.operation.Read
    PRDetail.autoComplate(PRid)
    PRDetail.show()
  },
  destory: function() {
    ClearAllFields("#PurchaseRequisition")
    $("#progressbar").empty()
    if (window.__PurchaseRequisitionItem_table) {
      window.__PurchaseRequisitionItem_table.remove()
      window.__PurchaseRequisitionItem_table = null
    }
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
    window.__PurchaseRequisition_tempID = null
    window.__PurchaseRequisitionItem_Unsave_set = null
    window._target.PR = null
    window._operation = null
    window._targetPITableArea = null
    $("#operation").empty()
  },
  view: {
    init: function() {
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

      var operationArea = $("#operation")
      var draftbtn = `<button type="button" class="btn btn-success col-xs-3 col-md-3 col-xs-offset-1" onclick="PurchaseRequisition.event.draft()">Draft</button>`
      var submitbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.submit()">提交</button>`
      var editbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.edit()">修改</button>`
      var cancelbtn = `<button type="button" class="btn btn-danger col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">取消</button>`
      var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
      switch (window._operation) {
        case Enum.operation.Update:
          operationArea.append($(editbtn)).append($(cancelbtn))
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
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_processstatus"] = Enum.prstatus.Draft
      data["_prnumber"] = generateUUID()
      var PRid = apiConfig.purchaserequisition.Draft(data)
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      for (var i = 0; i < items.length; i++) {
        items[i]["_purchaserequisitionfk"] = PRid
        var itemID = apiConfig.purchaseitem.Add(items[i])
      }
      ClearAllFields("#PurchaseRequisition")
      PurchaseRequisition.hide()
      table_init()
    },
    submit: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      // if (items.length <= 0) {
      //   throw "请购单item数量不能为0"
      // }
      debugger
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_prstatus"] = Enum.prstatus.Progress
      var submitter = $("#submitter").val()
      switch (getCookie('auth').toLowerCase()) {
        case 'zeiss':
          data["_submitteremployeefk"] = submitter
          // if ("" != $("#_requestordealerfk").val()) {
          //   if ($("#_requestoremployeefk").val() == submitter)
          //     data["_submitteremployeefk"] = submitter
          //   else
          //     data["_submitteremployeefk"] = $("#_requestoremployeefk").val()
          // } else if ("" != $("#_requestordealerfk").val()) {
          //   data["_submitteremployeefk"] = submitter
          // }
          // data["_submitteremployee"] = submitter
          break
        case 'dealer':
          data["_submitterdealerfk"] = submitter
          break
      }
      var PRid = apiConfig.purchaserequisition.Add(data)

      for (var i = 0; i < items.length; i++) {
        items[i]["_purchaserequisitionfk"] = PRid
        // var itemID = apiConfig.purchaseitem.Add(items[i])
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
