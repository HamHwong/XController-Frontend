const PurchaseItem = {
  show: function() {
    PurchaseItem.init()
    // $("#PruchaseItem")
    //   .on("hidden.bs.modal", function() {
    //     PurchaseItem.destory()
    //   })
    $("#PruchaseItem")
      .modal()
  },
  hide: function() {
    PurchaseItem.destory()
    $("#PruchaseItem")
      .modal('hide')
  },
  autoComplate: function(PI) {
    var targetPRArea = "#PruchaseItem_form"
    var PInfoSet = 'object' == typeof PI ? PI : apiConfig.purchaseitem.Get(PI) //查出改PI详情

    bindOptionData({
      $select: "#_brochurename",
      datasource: apiConfig.brochure.Search({
        keyword: PInfoSet["_brochurename"]
      }),
      innerTextName: "_brochurename",
      valueName: "_brochurename"
    })

    PInfoSet["brochure"] = PInfoSet["_brochurename"]
    autoComplateInfo(PInfoSet, targetPRArea) //将PR填充到表单
  },
  init: function() {
    $("#PruchaseItem").unbind("hidden.bs.modal")
    $("#PruchaseItem")
      .on("hidden.bs.modal", function(e) {
        PurchaseItem.destory()
      })
    bindInputQuery({
      input: "#brochure",
      datasourceAPI: apiConfig.brochure.Search,
      searchObj: {},
      innerTextName: "_brochurename",
      valueName: "_brochurename",
      callback: function(result) {
        console.log(result)
        // $("#_requestoremployeefk").val(result["accountField"])
      }
    })
  },
  update: function() {
    var unsavePI = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
    var prid = window._target.PR["_id"]
    for (var i = 0; i < unsavePI.length; i++) {
      var item = unsavePI[i]
      item["_purchaserequisitionfk"] = prid
    }
    console.log(unsavePI)
    var count = apiConfig.purchaseitem.Add(unsavePI)
    return count
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
    validator.Restore()
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
      if (PIid.search("[unsave]") >= 0) {
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
      if (PurchaseItem.event.append())
        PurchaseItem.hide()
    },
    append: function() {
      //是否fields全为空
      if (!validator.Result("#PruchaseItem_form")) {
        new MessageAlert("填写错误，请确认数据！", MessageAlert.Status.ERROR)
        return false
      }
      //
      var arr = []
      var localid = ++row_counter + '[unsave]'
      arr.push(localid)
      var set = formToSet("#PruchaseItem_form")
      set["_id"] = localid
      var order = ["_brochurename", "_quantity", "_deliverypriorityfk"]
      for (var i = 0; i < order.length; i++) {
        arr.push(set[order[i]])
      }
      if (window.__PurchaseRequisitionItem_table) {
        window.__PurchaseRequisitionItem_table.addRow(arr)
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID].push(set)
      }

      ClearInputs("#PruchaseItem_form", ["brochure", "_quantity"])
      ClearSelection("#PruchaseItem_form")
      return true
    },
    edit: function() {
      var target = window._target.PI
      var targetid = window._target.PI["_id"]
      var set = formToSet("#PruchaseItem_form")
      for (var k in set) {
        target[k] = set[k]
      }
      target["_id"] = targetid
      var EditRemoteData = true
      var re = targetid.toString().search("[unsave]")
      if (!(targetid.toString().search("[unsave]") >= 0)) {
        EditRemoteData = apiConfig.purchaseitem.Edit(targetid, target)
      } else {
        EditRemoteData = true
      }
      if (EditRemoteData) {
        var localSource = arrayToSet(window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID], "_id")
        for (var info in target) {
          localSource[targetid][info] = target[info]
        }
        new MessageAlert("修改成功", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("更新失败", MessageAlert.Status.EXCEPTION)
      }
      PurchaseItem.updatePITable()
      ClearInputs("#PruchaseItem_form")
      PurchaseItem.hide()
    },
    delete: function(PIid) {
      var DeleteRemoteData = true;
      var PItems = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      if (!(PIid.search("[unsave]") >= 0)) {
        DeleteRemoteData = apiConfig.purchaseitem.Delete(PIid)
      } else {
        DeleteRemoteData = true
      }
      if (DeleteRemoteData) {
        var newArray = deleteFromObjectArray(PItems, "_id", PIid)
        // var pos = -1
        // for (var i = 0; i < PItems.length; i++) {
        //   if (PItems[i]["_id"] == PIid) {
        //     pos = i
        //     break
        //   }
        // }
        // if (pos > 0)
        //   PItems.splice(pos, 1)
        window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = newArray
        window.__PurchaseRequisitionItem_table.data[PIid].remove()
        new MessageAlert("删除成功", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("删除失败", MessageAlert.Status.EXCEPTION)

      }
    }
  }
}
