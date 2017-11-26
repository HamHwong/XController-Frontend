var SupplierPRDetail = {
  id: "#SupplierPRDetail",

  autoComplate: function(PRid) {
    var targetPRArea = "#SupplierPRDetail",
      targetPITableArea = "#SupplierPRDetail .goodsInfomation",
      templateOpts = tableStructures.Supplier.MyOrder.ExpressUpdateDetail
    if (PRid) {
      //填充PI
      var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
      new table().loadFromTemplateJson(PIinfoSet, templateOpts).to(targetPITableArea)
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出改PR详情
      for (var i in PRinfoSet) {
        PRinfoSet[i] = PRinfoSet[i] || "无"
      }
      PRinfoSet["_logistics"] = PRinfoSet["_logistics"].replace(",",",\r\n") || "暂无物流信息"
      autoComplateInfo(PRinfoSet, targetPRArea, "PRD") //将PR填充到表单
      getProcessChartTo(PRid, ".progressbar")
    }
    var logistics = window.target.PR["_logistics"]
    $("#_logistics").val(logistics)
    var logisticsArray = logistics.split(",")
    for (var i = 0; i < logisticsArray.length; i++) {
      SupplierPRDetail.event.Express.appendExpress(logisticsArray[i])
    }
  },
  destory: function() {
    this.__proto__.destory()
    $(".expressRow").remove()
  },
  view: {
    init: function() {
      $(".expressRow").remove()

      if (!window.target) {
        window.target = {}
      }
      if (!window.target.PR) {
        window.target.PR = {}
      }
    },
    update: function(PRid) {
      window._operation = Enum.operation.Update
      SupplierPRDetail.view.init()

      window.target.PR = apiConfig.purchaserequisition.Get(PRid)
      SupplierPRDetail.show()
      SupplierPRDetail.autoComplate(PRid)
    },
    finish: function() {
      // var PRid = window.target.PR["_id"]
      window._operation = Enum.operation.Update
      // apiConfig.prprocess.SupplierComplete(PRid)
      // SupplierPRDetail.destory()
      SupplierPRDetail.hide()
    }
  },
  event: {
    Express: {
      appendExpress: function(str) {
        str = str || ""
        var model =
          `
            <div class="col-sm-11 col-xs-11 col-md-11 col-lg-11 mt10 mb10 expressRow">
              <label for="expressid" class="col-xs-2 col-md-2 control-label">物流单号</label>
              <div class="input-group">
                <input name="expressid" placeholder="请输入物流单号" type="text" class="form-control" onkeyup="SupplierPRDetail.event.Express.change()" value="${str}">
                <span class="input-group-btn">
                    <button class="btn btn-default" type="button" onclick="SupplierPRDetail.event.Express.reduceExpress(this)">-</button>
                </span>
              </div><!-- /input-group -->
            </div><!-- /.col-lg-6 -->
          `
        $("#Express_form").find("#ExpressAppendBtn").before($(model))
      },
      reduceExpress: function(elem) {
        elem = $(elem)
        elem.parents(".expressRow").remove()
        SupplierPRDetail.event.Express.change()
        // console.log()
      },
      change: function() {
        // var text = $(e).val()
        $("#Express_form").find("#_logistics").val("")
        var str = ""
        var arr = $("#Express_form").serializeArray()
        for (var i = 0; i < arr.length; i++) {
          if ("expressid" == arr[i]["name"]) {
            str += arr[i].value + ","
          }
        }
        while (str.lastIndexOf(',') != -1 && str.lastIndexOf(',') == str.length - 1) {
          str = str.slice(0, str.length - 1)
        }
        $("#Express_form").find("#_logistics").val(str)
      },
      save: function() {
        window.target.PR['_logistics'] = $("#Express_form").find("#_logistics").val()
        var result = apiConfig.purchaserequisition.Edit(window.target.PR["_id"], window.target.PR)
        if (result) {
          new MessageAlert("保存成功", MessageAlert.Status.SUCCESS)
          SupplierPRDetail.hide()
          console.log("Saved!")
        } else {
          new MessageAlert("保存失败", MessageAlert.Status.ERROR)
        }
      }
      // update: function() {
      //   var piid = window.target.PI["_id"]
      //   var prid = window.target.PR["_id"]
      //   SupplierPRDetail.autoComplate(prid)
      //   window.target.PI["_logistics"] = formToSet("#update_Express")["_logistics"]
      //   var isUpdate = apiConfig.purchaseitem.UpdateLogitics(piid, window.target.PI)
      //   if (isUpdate == true) {
      //     new MessageAlert("物流信息更新成功！", MessageAlert.Status.SUCCESS)
      //   }else{
      //     new MessageAlert("物流信息更新失败！", MessageAlert.Status.EXCEPTION)
      //   }
      //   SupplierPRDetail.autoComplate(prid)
      //   SupplierPRDetail.view.Express.destory()
      //   SupplierPRDetail.view.Express.hide()
      // }
    },
    finish: function() {
      var prid = window.target.PR["_id"]
      // var prprocesses = apiConfig.prprocess.Search({keyword:prid})
      // var pi = apiConfig.purchaseitem.Paging(prid, 0, 1000)
      // var isAllLogisticsFilled = true
      //
      // for (var i = 0; i < pi.length; i++) {
      //   if (isStringEmpty(pi[i]["_logistics"])) {
      //     isAllLogisticsFilled = false
      //   }
      // }

      // if (!isAllLogisticsFilled) {
      //   new MessageAlert("有订单物流信息未填写，不能完成该订单", MessageAlert.Status.EXCEPTION)
      //   return
      // }

      var isFinished = apiConfig.purchaserequisition.SupplierComplete(prid)
      if (isFinished == true) {
        new MessageAlert("您已完成该订单", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("订单完成失败", MessageAlert.Status.EXCEPTION)
      }
      // SupplierPRDetail.destory()
      SupplierPRDetail.hide()
      table_init()
    }
  }
}
SupplierPRDetail.__proto__ = DetailPrototype
