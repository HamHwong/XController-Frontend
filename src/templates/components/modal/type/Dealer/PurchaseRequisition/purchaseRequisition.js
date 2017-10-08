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

    //若为dealer，则自动填充名字和区域
    if ("dealer" == (getCookie("auth")
        .toLowerCase())) {
      $("#_demanderfk")
        .val("dealer")
      $("#_demanderfk")
        .attr("readonly", "readonly")
      $("#_dealerregion")
        .val(apiConfig.dealer.GetByUserName(getCookie("name"))["_dealerregion"])
      $("#_dealerregion")
        .attr("disabled", "true")
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
  }
}
