var SupplierPRDetail = {
  show: function() {
    $("#Detail").modal()
  },
  hide: function() {
    $("#Detail").modal('hide')
  },
  autoComplate: function(PRid) {
    var targetPRITableArea = "#Detail .goodsInfomation",
      templateOpts = tableStructures.Supplier.MyOrder.ExpressUpdateDetail
    if (PRid) {
      var PRIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      new table().loadFromTemplateJson(PRIinfoSet, templateOpts).to(targetPRITableArea)
    }
  },
  destory: function() {
    window._target.PI = null
    window._target.PR = null
    window._target = null
    SupplierPRDetail.view.Express.destory()
  },
  view: {
    init: function() {
      if (!window._target) {
        window._target = {}
      }
      if (!window._target.PR) {
        window._target.PR = {}
      }
      if (!window._target.PI) {
        window._target.PI = {}
      }
    },
    update: function(PRid) {
      window._operation = Enum.operation.Read
      SupplierPRDetail.view.init()
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      SupplierPRDetail.autoComplate(PRid)
      SupplierPRDetail.show()
    },
    finish: function() {
      // var PRid = window._target.PR["_id"]
      window._operation = Enum.operation.Update
      // apiConfig.prprocess.SupplierComplete(PRid)
      SupplierPRDetail.destory()
      SupplierPRDetail.hide()
    },
    Express: {
      show: function() {
        $("#Update").modal()
      },
      hide: function() {
        $("#Update").modal('hide')
      },
      update: function(PIid) {
        window._target.PI = apiConfig.purchaseitem.Get(PIid)
        SupplierPRDetail.view.Express.show()
      },
      destory: function() {
        ClearTextArea("#Update")
      }
    }
  },
  event: {
    Express: {
      update: function() {
        var piid = window._target.PI["_id"]
        var prid = window._target.PR["_id"]
        SupplierPRDetail.autoComplate(prid)
        window._target.PI["_logistics"] = formToSet("#update_Express")["_logistics"]
        var isUpdate = apiConfig.purchaseitem.UpdateLogitics(piid, window._target.PI)
        if (isUpdate == true) {
          new MessageAlert("物流信息更新成功！", MessageAlert.Status.SUCCESS)
        }else{
          new MessageAlert("物流信息更新失败！", MessageAlert.Status.EXCEPTION)
        }
        SupplierPRDetail.autoComplate(prid)
        SupplierPRDetail.view.Express.destory()
        SupplierPRDetail.view.Express.hide()
      }
    },
    finish: function() {
      var prid = window._target.PR["_id"]
      // var prprocesses = apiConfig.prprocess.Search({keyword:prid})
      var pi = apiConfig.purchaseitem.Paging(prid, 0, 1000)
      var isAllLogisticsFilled = true

      for (var i = 0; i < pi.length; i++) {
        if (isStringEmpty(pi[i]["_logistics"])) {
          isAllLogisticsFilled = false
        }
      }

      if (!isAllLogisticsFilled) {
        new MessageAlert("有订单物流信息未填写，不能完成该订单", MessageAlert.Status.EXCEPTION)
        return
      }

      var isFinished = apiConfig.purchaserequisition.SupplierComplete(prid)
      if (isFinished == true) {
        new MessageAlert("您已完成该订单", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("订单完成失败", MessageAlert.Status.EXCEPTION)
      }
      SupplierPRDetail.destory()
      SupplierPRDetail.hide()
      table_init()
    }
  }
}
