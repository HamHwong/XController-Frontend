const BrochureAdmin = {
  view: {
    show: function() {
      BrochureAdmin.event.init()
      $("#Add").modal()
    },
    hide: function() {
      BrochureAdmin.event.destory()
      $("#Add").modal("hide")
    },
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
    destory: function() {
      ClearAllFields("#Add")
    },
    init: function() {
      bindInputQuery("#supplierfk", apiConfig.supplier.Top(1000), "_suppliername", function() {})
    },
  }
}
