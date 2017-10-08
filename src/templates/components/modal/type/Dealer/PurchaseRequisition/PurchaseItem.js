var PurchaseItem = {
  show: function() {
    $("#PruchaseItem")
      .modal()
  },
  hide: function() {
    $("#PruchaseItem")
      .modal('hide')
  },
  add: function() {
    //是否fields全为空
    if (isAllPRTypeFormFieldEmpty("#PruchaseItem_form"))
      return
    //
    var arr = []
    arr.push(++row_counter)
    var set = formToSet("#PruchaseItem_form")
    var order = ["_brochurefk", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"]
    for (var i of order) {
      arr.push(set[i])
    }
    if (window.__PurchaseRequisitionItem_table) {
      window.__PurchaseRequisitionItem_table.addRow(arr)
      window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID].push(set)
    }
    ClearInputs("#PruchaseItem_form", ["#_brochurefk", "#_quantity"])
  },
  update() {
    var PRIArr = apiConfig.purchaseitem.Paging(window._target["_id"], 0, 100)
    var unsavePRI = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
    var remotePRI = arrayToSet(PRIArr, "_id")
    if (unsavePRI && unsavePRI.length > 0) {
      var PRid = window._target["_id"]
      for (var i = 0; i < unsavePRI.length; i++) {
        //若有新的，则添加，若为老的，则修改
        var nativePRIid = unsavePRI[i]["_id"]
        if (remotePRI[nativePRIid]) {
          var itemID = apiConfig.purchaseitem.Edit(nativePRIid, unsavePRI[i])
        } else {
          unsavePRI[i]["_purchaserequisitionfk"] = PRid
          var itemID = apiConfig.purchaseitem.Add(unsavePRI[i])
        }
      }
      //如果删除PRI
      //更新一下
      PRIArr = apiConfig.purchaseitem.Paging(window._target["_id"], 0, 100)
      nativePRI = arrayToSet(unsavePRI, "_id")
      for (var j = 0; j < PRIArr.length; j++) {
        var remotePRIid = PRIArr[j]["_id"]
        debugger
        if (!nativePRI[remotePRIid]) {
          apiConfig.purchaseitem.Delete(remotePRIid)
        }
      }
    }
  }
}
