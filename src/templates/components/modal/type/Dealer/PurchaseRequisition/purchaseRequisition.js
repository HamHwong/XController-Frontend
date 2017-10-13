const PurchaseRequisition = {
  new: function (obj) {
    var PR = new Object()
    //TODO PR的model
    return PR
  },
  show: function () {
    window.__PurchaseRequisition_tempID = generateUUID()
    this.init()
    $("#PurchaseRequisition")
      .modal()
  },
  hide: function () {
    $("#PurchaseRequisition")
      .modal('hide')
  },
  autoComplate: function (PRid) {
    var targetPRArea = "#PurchaseRequisition_form"
    targetPITableArea = "#InfomationAddArea"
    templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = PIinfoSet
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
      window.__PurchaseRequisitionItem_table = PItable
      PItable.to(targetPITableArea)
    }

    // //若为dealer，则自动填充名字和区域
    if ("dealer" == (getCookie("auth")
        .toLowerCase())) {
      var dealer = JSON.parse(getCookie('user'))
      if (dealer) {
        $("#_demanderfk")
          .val(dealer["_id"])
        $("#_demanderfk")
          .attr("readonly", "readonly")
        $("#_dealerregion")
          .val(dealer["_dealerregion"])
        $("#_dealerregion")
          .attr("disabled", "true")
      }
      // autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
    }
  },
  detail: function (PRid) {
    window._operation = Enum.operation.Read
    PRDetail.autoComplate(PRid)
    PRDetail.show()
  },
  init: function () {
    window.__PurchaseRequisitionItem_Unsave_set = {}
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = []

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
  destory: function () {
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
    init:function(){
      if(window._target){
          window._target={}
      }
    }
    create: function () {
      window._operation = Enum.operation.Create
      PurchaseRequisition.show()
      PurchaseRequisition.autoComplate()
    },
    copy: function (PRid) {
      window._operation = Enum.operation.Copy
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
    },
    edit: function (PRid) {
      window._operation = Enum.operation.Update
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      PurchaseRequisition.show()
      //填充dealer
      PurchaseRequisition.autoComplate(PRid)
    },
    delete: function (PRid) {
      $("#Delete").modal()
    }
  },
  event: {
    draft: function () {
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
    submit: function () {
      $("#saver")
        .val(getCookie("name"))
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
        var itemID = apiConfig.purchaseitem.Add(items[i])
      }
      apiConfig.prprocess.GenerateAll(PRid) //获取所有steps
      if (PRid) {
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
        window.__PurchaseRequisition_tempID = null
      }
      table_init() //更新
      PurchaseRequisition.hide()
    },
    edit: function () {
      $("#saver")
        .val(getCookie("name"))
      var data = formToSet("#PurchaseRequisition_form")

      for (var v in data) {
        window._target.PR[v] = data[v]
      }
      apiConfig.purchaserequisition.Edit(window._target.PR["_id"], window._target.PR)
      // PurchaseItem.update()
      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
      window.__PurchaseRequisition_tempID = null
      PurchaseRequisition.hide()
      table_init() //更新
    }
  }
}
