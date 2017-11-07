const BrochureAdmin = {
  //TODO
  view: {
    add: {
      show: function() {
        BrochureAdmin.event.init()
        $("#Add").modal()
      },
      hide: function() {
        BrochureAdmin.event.destory()
        $("#Add").modal("hide")
      },
    },
    edit: {
      show: function() {
        BrochureAdmin.event.init()
        $("#Edit").modal()
      },
      hide: function() {
        BrochureAdmin.event.destory()
        $("#Edit").modal("hide")
      },
    },
    delete: {
      show: function() {
        $("#Delete")
          .modal()
      },
      hide: function() {
        $("#Delete")
          .modal("hide")
      }
    },
    supply: {
      show: function() {
        $("#Supply")
          .modal()
      },
      hide: function() {
        $("#Supply")
          .modal("hide")
      }
    },
    history: {
      show: function(bid) {
        BrochureHistory.show(bid)
      },
      hide: function() {
        $("#History")
          .modal("hide")
      }
    }
  },
  event: {
    add: function() {
      var data = formToSet("#add_Brochure")
      data["_createtime"] = new Date()
      var brochureId = apiConfig.brochure.Add(getCookie("account"),data)
      if (brochureId > 0) {
        new MessageAlert("添加成功", MessageAlert.Status.SUCCESS)
        BrochureAdmin.view.add.hide()
      } else {
        new MessageAlert("添加失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    },
    edit: function() {
      var rawData = window._target
      var data = formToSet("#edit_Brochure")
      for (var i in data) {
        rawData[i] = data[i]
      }
      var brochureId = apiConfig.brochure.Edit(rawData['_id'], data)
      if (brochureId > 0) {
        new MessageAlert("修改成功", MessageAlert.Status.SUCCESS)
        BrochureAdmin.view.edit.hide()
        ClearInputs("#edit_Brochure")
        ClearSelection("#edit_Brochure")
        ClearTextArea("#edit_Brochure")
      } else {
        new MessageAlert("修改失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    },
    destory: function() {
      ClearAllFields("#Add")
    },
    init: function() {
      bindInputQuery({
        input: "#supplierfk",
        datasourceAPI: apiConfig.supplier.Search,
        searchObj: {},
        innerTextName: "_suppliername",
        valueName: "_id",
        callback: function(result) {}
      })
    },
  }
}
