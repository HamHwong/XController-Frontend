const DealerAdmin = {
  view: {
    add: {
      show: function() {
        $("#Add").modal()
      },
      hide: function() {
        $("#Add").modal("hide")
      },
    },
    edit: {
      show: function(rid) {
        window._target = apiConfig.dealer.Get(rid)
        autoComplateInfo(window._target, "#edit_Dealer")
        $("#Edit").modal()
      },
      hide: function() {
        $("#Edit").modal("hide")
      },
    },
    delete: {
      show: function() {
        window._target = apiConfig.dealer.Get(rid)
        $("#Delete")
          .modal()
      },
      hide: function() {
        $("#Delete")
          .modal("hide")
      }
    }
  },
  event: {
    add: function() {
      var data = formToSet("#add_Dealer")
      var dealerId = apiConfig.dealer.Add(data)
      if (dealerId) {
        $("#Add").modal("hide")
        ClearInputs("#add_Dealer")
        ClearSelecton("#add_Dealer")
        ClearTextArea("#add_Dealer")
      }
      table_init()
    },
    edit: function() {
      var rawData = window._target
      var data = formToSet("#edit_Dealer")
      for (var i in data) {
        rawData[i] = data[i]
      }
      var dealerId = apiConfig.dealer.Edit(rawData['_id'], data)
      if (dealerId) {
        $("#Edit").modal("hide")
        ClearInputs("#edit_Dealer")
        ClearSelecton("#edit_Dealer")
        ClearTextArea("#edit_Dealer")
      }
      table_init()
    }
  }
}
