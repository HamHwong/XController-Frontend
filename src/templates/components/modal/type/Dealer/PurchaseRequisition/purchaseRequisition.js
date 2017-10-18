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
    bindInputQuery("#demanderfk", apiConfig.dealer.Top(1000), function() {
      var val = $("#_demanderfk").val()
      var dealer = apiConfig.dealer.Get(val)
      $("#_dealerregion")
        .val(dealer["_dealerregion"])
      $("#_dealerregion")
        .attr("disabled", "true")
    })
    // PurchaseRequisition.view.init()
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#PurchaseRequisition_form"
    targetPITableArea = "#InfomationAddArea"

    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      PurchaseRequisition.loadPITable(PRid)
    }

    // //若为dealer，则自动填充名字和区域
    if ("dealer" == (getCookie("auth")
        .toLowerCase())) {
      var dealer = JSON.parse(getCookie('user'))
      if (dealer) {
        $("#_demanderfk")
          .val(dealer["_id"])
        $("#demanderfk").val(dealer["_dealername"])
        $("#demanderfk")
          .attr("readonly", "readonly")
        $("#_dealerregion")
          .val(dealer["_dealerregion"])
        $("#_dealerregion")
          .attr("disabled", "true")
      }
      // autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
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
    PItable.to(targetPITableArea)
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
      $("#saver")
        .val(getCookie("name"))
      debugger
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      // if (items.length <= 0) {
      //   throw "请购单item数量不能为0"
      // }
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_prstatus"] = Enum.prstatus.Progress
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
