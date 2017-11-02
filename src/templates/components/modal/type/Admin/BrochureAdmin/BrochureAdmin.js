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
      var brochureId = apiConfig.brochure.Add(data)
      if (brochureId) {
        table_init()
      }
      BrochureAdmin.view.hide()
    },
    edit: function() {
      var rawData = window._target
      var data = formToSet("#edit_Brochure")
      for (var i in data) {
        rawData[i] = data[i]
      }
      var brochureId = apiConfig.brochure.Edit(rawData['_id'], data)
      if (brochureId) {
        $("#Edit").modal("hide")
        ClearInputs("#edit_Brochure")
        ClearSelecton("#edit_Brochure")
        ClearTextArea("#edit_Brochure")
      }
      table_init()
    },
    destory: function() {
      ClearAllFields("#Add")
    },
    init: function() {
      bindInputQuery("#supplierfk", apiConfig.supplier.Top(1000), "_suppliername", function() {})
    },
  }
}
