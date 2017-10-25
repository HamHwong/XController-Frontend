const PurchaseItem = {
  show: function() {
    $("#PruchaseItem")
      .modal()
  },
  hide: function() {
    $("#PruchaseItem")
      .modal('hide')
  },
  autoComplate: function(PI) {
    var targetPRArea = "#PruchaseItem_form"
    var PInfoSet = 'object' == typeof PI ? PI : apiConfig.purchaseitem.Get(PI) //查出改PI详情
    autoComplateInfo(PInfoSet, targetPRArea) //将PR填充到表单
  },
  update: function() {
    var unsavePI = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
    var count = apiConfig.purchaseitem.Add(unsavePI)
    if (count <= 0) {
    }
  },
  updatePITable: function() {
    if (window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]) {
      //填充PI
      var PIinfoSet = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
      var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
      window.__PurchaseRequisitionItem_table = PItable
      PItable.to(window._targetPITableArea)
    }
  },
  destory: function() {
    ClearInputs("#PruchaseItem")
    $("#PIOperation").empty()
    window._target.PI = null
    window._operation = null
  },
  view: {
    init: function() {
      if (!window._target) {
        window._target = {}
      }
      if (!window._target.PI) {
        window._target.PI = {}
      }

      var operationArea = $("#PIOperation")
      var addbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.add()"><span class="glyphicon glyphicon-ok"></span></button>`
      var appendbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.append()"><span class="glyphicon glyphicon-plus"></span></button>`
      var editbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.event.edit()"><span class="glyphicon glyphicon-ok"></span></button>`
      var cancelbtn = `<button type="submit" class="btn btn-primary" onclick="PurchaseItem.hide()"><span class="glyphicon glyphicon-remove"></span></button>`

      switch (window._operation) {
        case Enum.operation.Update:
          operationArea.append($(cancelbtn)).append($(editbtn))
          break
        case Enum.operation.Create:
          operationArea.append($(addbtn)).append($(cancelbtn)).append($(appendbtn))
          break
        default:
          operationArea.append($(cancelbtn))
          break
      }

      bindInputQuery("#brochure", apiConfig.brochure.Top(1000), "_brochurename", "_brochurename", function() {})

    },
    add: function() {
      window._operation = Enum.operation.Create
      PurchaseItem.view.init()
      PurchaseItem.show()
    },
    edit: function(PIid) {
      window._operation = Enum.operation.Update
      PurchaseItem.view.init()
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
    add: function() {
      PurchaseItem.event.append()
      PurchaseItem.hide()
    },
    append: function() {
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
    edit: function() {
      var target = window._target.PI
      var targetid = window._target.PI["_id"]
      var set = formToSet("#PruchaseItem_form")
      for (var k in set) {
        target[k] = set[k]
      }
      target["_id"] = targetid
      if (!targetid.toString().includes("[unsave]")) {
        apiConfig.purchaseitem.Edit(targetid, target)
      }
      var localSource = arrayToSet(window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID], "_id")
      for (var info in target) {
        localSource[targetid][info] = target[info]
      }
      // window.__PurchaseRequisitionItem_table.update(target['_id'], target)
      PurchaseItem.updatePITable()
      ClearInputs("#PruchaseItem_form")
      PurchaseItem.hide()
    },
    delete: function(PIid) {
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
