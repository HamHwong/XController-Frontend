var PurchaseItem = {
  show: function () {
    $("#PruchaseItem")
      .modal()
  },
  hide: function () {
    $("#PruchaseItem")
      .modal('hide')
  },
  autoComplate: function (PI) {
    var targetPRArea = "#PruchaseItem_form"
    var PInfoSet = 'object' == typeof PI ? PI : apiConfig.purchaseitem.Get(PI) //查出改PI详情
    autoComplateInfo(PInfoSet, targetPRArea) //将PR填充到表单
  },
  update: function () {
    var PIArr = apiConfig.purchaseitem.Paging(window._target.PI["_id"], 0, 100)
    var unsavePI = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
    var remotePI = arrayToSet(PIArr, "_id")
    debugger
    if (remotePI != unsavePI.length) { //bug
      var PId = window._target.PI["_id"]
      for (var i = 0; i < unsavePI.length; i++) {
        //若有新的，则添加，若为老的，则修改
        var nativePIid = unsavePI[i]["_id"]
        if (remotePI[nativePIid]) {
          var itemID = apiConfig.purchaseitem.Edit(nativePIid, unsavePI[i])
        } else {
          unsavePI[i]["_purchaserequisitionfk"] = PId
          var itemID = apiConfig.purchaseitem.Add(unsavePI[i])
          unsavePI[i]["_id"] = itemID
        }
      }
      //如果删除PI
      //更新后重新获取一下
      PIArr = apiConfig.purchaseitem.Paging(window._target.PI["_id"], 0, 100)
      nativePI = arrayToSet(unsavePI, "_id")
      for (var j = 0; j < PIArr.length; j++) {
        var remotePIid = PIArr[j]["_id"]
        if (!nativePI[remotePIid]) {
          apiConfig.purchaseitem.Delete(remotePIid)
        }
      }
    }
  },
  destory: function () {
    ClearInputs("#PruchaseItem")
    $("#PIOperation").empty()
    window._target.PI = null
  },
  view: {
    add: function () {
      window._operation = Enum.operation.Create
      PurchaseItem.show()
    },
    edit: function (PIid) {
      window._operation = Enum.operation.Update
      if (PIid.includes("[unsave]")) {
        var PItems = arrayToSet(window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID], "_id")
        window._target.PI = PItems[PIid]
      } else {
        window._target.PI = apiConfig.purchaseitem.Get(PIid)
      }
      PurchaseItem.show()
      PurchaseItem.autoComplate(window._target.PI)
    }
  },
  event: {
    add: function () {
      this.append()
      PurchaseItem.hide()
    },
    append: function () {
      //是否fields全为空
      if (isAllPRTypeFormFieldEmpty("#PruchaseItem_form"))
        return
      //
      var arr = []
      var localid = ++row_counter + '[unsave]'
      arr.push(localid)
      var set = formToSet("#PruchaseItem_form")
      set["_id"] = localid
      var order = ["_brochurename", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"]
      for (var i of order) {
        arr.push(set[i])
      }
      if (window.__PurchaseRequisitionItem_table) {
        window.__PurchaseRequisitionItem_table.addRow(arr)
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID].push(set)
      }
      ClearInputs("#PruchaseItem_form", ["#_brochurename", "#_quantity"])
    },
    edit: function () {
      var target = window._target.PI
      var targetid = window._target.PI["_id"]
      var set = formToSet("#PruchaseItem_form")
      for (var k in set) {
        target[k] = set[k]
      }
      target["_id"] = targetid
      apiConfig.purchaseitem.Edit(targetid, target)
      ClearInputs("#PruchaseItem_form")
      PurchaseItem.hide()
    },
    delete: function (PIid) {
      // window.__PurchaseRequisitionItem_table.data[PIid].remove()
      var result = null;
      var PItems = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      if (!PIid.includes("[unsave]")) {
        result = apiConfig.purchaseitem.delete(PIid)
      }
      window.__PurchaseRequisitionItem_table.data[PIid].remove()
      // for (var i = 0; i < PItems.length; i++) {
      //   if (PIid == PItems[i]["_id"]) {
      //     var tempArr = PItems.splice(0, i - 1)
      //     PItems.reverse()
      //     PItems.pop()
      //     PItems.reverse()
      //     PItems = tempArr.concat(PItems)
      //   }
      // }
      alertMessage.show()
    }
  }
}
