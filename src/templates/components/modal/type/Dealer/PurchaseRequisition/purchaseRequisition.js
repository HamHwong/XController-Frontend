const PurchaseRequisition = {
  show: function() {
    PurchaseRequisition.init()
    $("#PurchaseRequisition")
      .modal()
  },
  hide: function() {
    PurchaseRequisition.destory()
    $("#PurchaseRequisition")
      .modal('hide')
  },
  init: function() {
    if (!window.__PurchaseRequisitionItem_Unsave_set)
      window.__PurchaseRequisitionItem_Unsave_set = {}
    $('#_deliverydate')
      .datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        startDate: new Date(),
        autoclose: true,
        startView: 2,
        minView: 2,
        forceParse: false,
        language: 'zh-CN'
      });
    //
    // //HACK 超过10次之后不显示datatimepicker：
    // //原因：在本系统中为了同时使用多个modal窗口，
    // //为了避免第二层modal窗口被第一层窗口覆盖（官方不推荐使用多个模态窗口）
    // //在本系统中为了同时使用多个用了一个hack方法去监听document（在modal.js），
    // //定义一个全局变量存modal层数，然后当类为.modal的modal窗口触发shown.bs.modal事件后，counter+1
    // //然后将modal的z-index设置为 1050+counter，从而避免多个模态窗口以同一zindex显示而造成覆盖
    // //同时为其绑定hidden.bs.modal事件，当modal隐藏时候触发，将counter-- ，保证层数准确性
    // //而datatimepicker插件也是基于bootstrap的modal窗口，
    // //但是作者的实现当datatimepicker显示的时候是trigger了shown.bs.modal，
    // //而关闭的时候没有triggerhidden.bs.modal，从而没有触发之前绑定的counter--事件，
    // //导致PI表单层的z-index在每点一次绑定了datatimepicker的input时就触发++，但是timer消失时没触发--，
    // //所以当触发10次以后，PI的表单modal的z-index就大于了1060，盖住了datatimepicker
    // $('#_deliverydate')
    //   .datetimepicker().on("hide", function(e) {
    //     console.log("datapicker触发modal hide", e)
    //     // e.preventdefault()
    //     var event = $.Event("hidden.bs.modal")
    //     $('#_deliverydate').datetimepicker().trigger("hidden.bs.modal")
    //     // return false;
    //   })


    bindInputQuery({
      input: "#requestordealerfk",
      datasourceAPI: apiConfig.dealer.Search,
      searchObj: {},
      innerTextName: "_dealername",
      valueName: "_id",
      callback: function(result) {
        var val = $("#_requestordealerfk").val()
        var dealer = apiConfig.dealer.Get(val)
        $("#_region")
          .val(dealer["_dealerregion"])
      }
    })

    bindInputQuery({
      input: "#requestoremployeefk",
      datasourceAPI: apiConfig.employee.Search,
      searchObj: {},
      innerTextName: "eNNameField",
      valueName: "accountField",
      callback: function(result) {
        $("#_requestoremployeefk").val(result["accountField"])
        $("#_region")
          .val(result["regionField"])
      }
    })

    $("#submitter").val(getCookie('account'))
    $("#submitter").attr("readonly", "readonly")

    // //若为dealer，则自动填充名字和区域
    switch (getCookie("role")) {
      case Enum.role.DEALEAR:
        var dealer = JSON.parse(getCookie('user'))
        if (dealer) {

          $("#_requestordealerfk")
            .val(dealer["_id"])
          $("#_submitterdealerfk")
            .val(dealer["_id"])

          $("#requestordealerfk").val(dealer["_dealername"])
          $("#submitterdealerfk").val(dealer["_dealername"])

          $("#requestordealerfk")
            .attr("readonly", "readonly")
          $("#requestoremployeefk")
            .attr("readonly", "readonly")

          $("#_region")
            .val(dealer["_dealerregion"])
          $("#_region")
            .attr("readonly", "readonly")

        }
        break
      case Enum.role.EMPLOYEE:
      case Enum.role.SYSADMIN:
        var user = JSON.parse(getCookie('user'))
        //COMMON INIT
        $("#agentCheck input").on("change", function(e) {
          $(".requestorInput").hide()
          var t = $("#agentCheck input[name='agent']:checked")
          $(".requestorInput input").val("")
          $(".requestorInput input").removeAttr("data-regxRule")
          if ("forEmp" == t.data("value")) {
            //for Employee
            $("#forEmployee input").removeAttr('disabled')
            $("#forEmployee select").attr("data-regxRule", "selectEmployee")
            $("#forEmployee").show()
          } else {
            //for Dealer
            $("#forDealer input").removeAttr('disabled')
            $("#forDealer select").attr("data-regxRule", "selectDealer")
            $("#forDealer").show()
          }

          validator.init() //重新绑定validator
        })
        //COMMON INIT

        var user = JSON.parse(getCookie('user'))
        if (user) {
          if (Enum.role.EMPLOYEE == getCookie("role")) {
            $("#requireAgent").on("change", function() {
              $(".requestorInput input").attr('disabled', 'true')
              if ($(this).is(":checked")) {
                $("#_requestoremployeefk").empty()
                $("#requestoremployeefk").val("")
                $("#requestoremployeefk")
                  .removeAttr("readonly")

                $("#agentCheck input").removeAttr('disabled')
                $("#agentCheck").css("visibility", "visible")
              } else {
                //若是employee将自己绑定到提交的申请人的选项input上去
                bindOptionData({
                  $select: "#_requestoremployeefk",
                  datasource: apiConfig.employee.Search({
                    keyword: getCookie("name")
                  }),
                  innerTextName: "eNNameField",
                  valueName: "accountField"
                })
                $("#_requestoremployeefk").val(user["accountField"])
                $("#_region")
                  .val(user["regionField"])

                //如果不需要代填
                $(".queryinput").val("")
                $(".requestorInput").hide()
                $("#forEmployee").show()

                ClearRadio("#agentCheck")

                $("#requestoremployeefk").val(user["eNNameField"])
                $("#_requestoremployeefk").val(user["accountField"])

                $("#requestoremployeefk")
                  .attr("readonly", "readonly")

                $("#forEmployee").attr("readonly", "readonly")
                $("#agentCheck input").attr("checked", "false")
                $("#agentCheck input").attr('disabled', 'true')
                $("#agentCheck").css("visibility", "hidden")
              }
            })
            bindOptionData({
              $select: "#_requestoremployeefk",
              datasource: apiConfig.employee.Search({
                keyword: getCookie("name")
              }),
              innerTextName: "eNNameField",
              valueName: "accountField"
            })
            //并且选上
            $("#requestoremployeefk").val(user["eNNameField"])
            $("#_requestoremployeefk").val(user["accountField"])
            $("#requestoremployeefk")
              .attr("readonly", "readonly")
            $(".requestorInput").hide() //将两个requestor输入框隐藏
            $("#forEmployee").show() //显示forEmployee的
            //填充当前employee的区域
            $("#_region")
              .val(user["regionField"])
            $("#_region")
              .attr("readonly", "readonly")
            // $("#agentCheck").hide()
            // 隐藏代填的两个选项
            $("#agentCheck").css("visibility", "hidden")
            //END
          } else {
            //若是SYSADMIN，则强制选择代填，并且禁用掉#requireAgent
            //默认选择For Employee
            $("#requireAgent").remove()
            $(".requestorInput").hide()
            $("#agentCheck input:first").prop("checked", "checked")
            $("#forEmployee").show()
          }
        }
        break
    }

  },
  autoComplate: function(PRid) {

    var targetPRArea = "#PurchaseRequisition_form"
    window._targetPITableArea = "#InfomationAddArea"
    if (PRid) {
      //填充其他信息
      var PRinfoSet = apiConfig.purchaserequisition.Get(PRid) //查出PR详情
      autoComplateInfo(PRinfoSet, targetPRArea) //将PR填充到表单
      PurchaseRequisition.loadPITable(PRid)
    }

  },
  loadPITable: function(PRid) {
    //填充PI
    var PIinfoSet = apiConfig.purchaseitem.Paging(PRid, 0, 100)
    // //HACK api Paging单独给了view比较好绑定数据，但是因为编辑什么的都需要使用paging方法，所以可能会导致取下来填充的紧急程度变成中文而无法提交
    // for (var i in PIinfoSet) {
    //   switch (PIinfoSet[i]["_deliverypriorityfk"]) {
    //     case "一般快递":
    //       PIinfoSet[i]["_deliverypriorityfk"] = 15
    //       break
    //     case "紧急快递":
    //       PIinfoSet[i]["_deliverypriorityfk"] = 16
    //       break
    //   }
    // }
    // //HACK
    window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID] = PIinfoSet
    var templateOpts = tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable
    var tmp = PIinfoSet.slice(0)
    var PItable = new table().loadFromTemplateJson(PIinfoSet, templateOpts)
    window.__PurchaseRequisitionItem_table = PItable
    PItable.to(window._targetPITableArea)
  },
  detail: function(PRid) {
    window._operation = Enum.operation.Read
    PRDetail.show(PRid)
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

    if (window._target) {
      if (window._target.PR)
        window._target.PR = null
      window._target = null
    }
    window._operation = null
    window._targetPITableArea = null
    $("#operation").empty()
  },
  view: {
    init: function() {
      window._targetPITableArea = "#InfomationAddArea"
      ClearAllFields("#PurchaseRequisition")
      $("#progressbar").empty()
      $("#operation").empty()
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
      if (!window.__PurchaseRequisitionItem_table) {
        window.__PurchaseRequisitionItem_table = new table().new(tableStructures.Dealer.MyOrder.PurchaseRequisitionItemTable, ["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"])
        window.__PurchaseRequisitionItem_table.to(window._targetPITableArea)
      }

      var operationArea = $("#operation")
      var draftbtn = `<button type="button" class="btn btn-success col-xs-3 col-md-3 col-xs-offset-1" onclick="PurchaseRequisition.event.draft()">草稿</button>`
      var submitbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.submit()">提交</button>`
      var editbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" onclick="PurchaseRequisition.event.edit()">修改</button>`
      var cancelbtn = `<button type="button" class="btn btn-danger col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">取消</button>`
      var closebtnlbtn = `<button type="button" class="btn btn-primary col-xs-3 col-md-3" data-dismiss="modal" aria-hidden="true">关闭</button>`
      switch (window._operation) {
        case Enum.operation.Update:
          operationArea.append($(editbtn)).append($(submitbtn)).append($(cancelbtn))
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
      window._target.PR = apiConfig.purchaserequisition.Get(PRid)
      $("#Delete").modal()
    }
  },
  event: {
    draft: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      var submitter = $("#submitter").val()
      var data = formToSet("#PurchaseRequisition_form")
      data["_prcreated"] = new Date()
      data["_prstatus"] = Enum.prstatus.Draft

      switch (getCookie('role')) {
        case Enum.role.EMPLOYEE:
          data["_submitteremployeefk"] = getCookie('account')
          data["_requestordealerfk"] = null
          break
        case Enum.role.DEALEAR:
          data["_submitterdealerfk"] = getCookie('uid')
          data["_requestordealerfk"] = getCookie('uid')
          break
      }

      var PRid = apiConfig.purchaserequisition.Draft(data)

      if (PRid > 0) {
        for (var i = 0; i < items.length; i++) {
          items[i]["_purchaserequisitionfk"] = PRid
        }
        var successCount = apiConfig.purchaseitem.Add(items)
        new MessageAlert("该条记录已加入草稿箱！", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("未知错误，请检查数据！", MessageAlert.Status.SUCCESS)
      }

      table_init() //更新
      PurchaseRequisition.hide()
    },
    submit: function() {
      var items = window.__PurchaseRequisitionItem_Unsave_set[window.__PurchaseRequisition_tempID]
      items = items ? items : []
      if (items.length <= 0) {
        new MessageAlert("请购单item数量不能为0", MessageAlert.Status.ERROR)
        return
        // throw "请购单item数量不能为0"
      }
      if (validator.Result("#PurchaseRequisition_form")) {
        var submitter = $("#submitter").val()
        var data = formToSet("#PurchaseRequisition_form")
        data["_prcreated"] = new Date()
        data["_prstatus"] = Enum.prstatus.Progress
        //如果是Draft转Submit
        if (window._operation == Enum.operation.Update) {
          data["_id"] = window._target.PR["_id"]
          data["_prstatus"] = window._target.PR["_prstatus"]
        } //TODO


        switch (getCookie('role')) {
          case Enum.role.EMPLOYEE:
            data["_submitteremployeefk"] = submitter
            data["_requestordealerfk"] = null
            break
          case Enum.role.DEALEAR:
            data["_submitterdealerfk"] = getCookie('uid')
            data["_requestordealerfk"] = getCookie('uid')
            break
        }

        var PRid = apiConfig.purchaserequisition.Add(data)
        if (PRid > 0) {
          for (var i = 0; i < items.length; i++) {
            items[i]["_purchaserequisitionfk"] = PRid
            // items[i]["_logistics"] = null
            // items[i]["_contactnumber"] = null
          }
          var picount = apiConfig.purchaseitem.Add(items)

          if (picount > 0) {
            apiConfig.prprocess.GenerateAll(PRid) //获取所有steps
            new MessageAlert("提交成功！", MessageAlert.Status.SUCCESS)
            PurchaseRequisition.hide()
            validator.Restore()
          } else {
            new MessageAlert("采购物品信息有误！", MessageAlert.Status.EXCEPTION)
          }
        } else {
          new MessageAlert("提交失败!请检查表单数据！", MessageAlert.Status.EXCEPTION)
        }
      } else {
        new MessageAlert("提交失败!请检查表单数据！", MessageAlert.Status.EXCEPTION)
      }
      table_init() //更新
    },
    edit: function() {
      $("#saver").val(getCookie("name"))
      var data = formToSet("#PurchaseRequisition_form")
      for (var v in data) {
        window._target.PR[v] = data[v]
      }
      var EditRemoteData = apiConfig.purchaserequisition.Edit(window._target.PR["_id"], window._target.PR)
      if (EditRemoteData) {
        var picount = PurchaseItem.update()
        new MessageAlert("修改成功！", MessageAlert.Status.SUCCESS)
      } else {
        new MessageAlert("修改失败！", MessageAlert.Status.EXCEPTION)
      }
      PurchaseRequisition.hide()
      table_init() //更新
    },
    delete: function() {
      if (window._target.PR) {
        var id = window._target.PR["_id"]
        var result = apiConfig.purchaserequisition.Delete(id)
        if(result){
          new MessageAlert("成功删除该草稿！",MessageAlert.SUCCESS)
          $("#Delete").modal("hide")
        }else{
          new MessageAlert("删除草稿失败！请重试！",MessageAlert.EXCEPTION)
        }
        table_init()
      }
    }
  }
}
