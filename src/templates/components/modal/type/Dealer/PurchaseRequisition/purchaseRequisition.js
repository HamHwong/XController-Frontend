var PurchaseRequisition = {
  show: function() {
    this.init()
    $("#PurchaseRequisition")
      .modal()
  },
  hide: function() {
    $("#PurchaseRequisition")
      .modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRArea = "#PurchaseRequisition_form"
    targetPRITableArea = "#InfomationAddArea"
    templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      //填充PRI
      var PRIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)

      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = PRIinfoSet
      // var templateOpts = tableStructures.Dealer.MyOrder.orderDetail
      var PRItable = new table().loadFromTemplateJson(PRIinfoSet, templateOpts)
      window.__PurchaseRequisitionItem_table = PRItable
      PRItable.to(targetPRITableArea)
    }

    // //若为dealer，则自动填充名字和区域
    if ("dealer" == (getCookie("auth")
        .toLowerCase())) {
          var dealer = JSON.parse(getCookie('user'))
          if(dealer){
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
  detail: function(PRid) {
    PRDetail.autoComplate(PRid)
    PRDetail.show()
  },
  init: function() {
    window.__PurchaseRequisition_tempID = generateUUID()
    window.__PurchaseRequisitionItem_Unsave_set = {}
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = []
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
    window._target = null
    window._operation = null
    $("#operation").empty()
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
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      // if (items.length <= 0) {
      //   throw "请购单item数量不能为0"
      // }
      var data = formToSet("#PurchaseRequisition_form")
      //data["_prnumber"] = window.__PurchaseRequisition_tempID //后台生成应该
      data["_prcreated"] = new Date()
      var PRid = apiConfig.purchaserequisition.Add(data)
      for (var i = 0; i < items.length; i++) {
        items[i]["_purchaserequisitionfk"] = PRid
        var itemID = apiConfig.purchaseitem.Add(items[i])
      }
      if (PRid) {
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
        window.__PurchaseRequisition_tempID = null
        PurchaseRequisition.hide()
      }
      table_init() //更新
    },
    edit: function() {
      $("#saver")
        .val(getCookie("name"))

      var data = formToSet("#PurchaseRequisition_form")

      for (var v in data) {
        window._target[v] = data[v]
      }
      apiConfig.purchaserequisition.Edit(window._target["_id"], window._target)
      PurchaseItem.update()
      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = null
      window.__PurchaseRequisition_tempID = null
      PurchaseRequisition.hide()
      table_init() //更新
    }
  }
}
