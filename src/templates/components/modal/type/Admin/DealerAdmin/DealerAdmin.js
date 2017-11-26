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
        window.target = apiConfig.dealer.Get(rid)
        autoComplateInfo(window.target, "#edit_Dealer")
        $("#Edit").modal()
      },
      hide: function() {
        $("#Edit").modal("hide")
      },
    },
    delete: {
      show: function(rid) {
        window.target = apiConfig.dealer.Get(rid)
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
      if (dealerId>0) {
        new MessageAlert("添加成功", MessageAlert.Status.SUCCESS)
        DealerAdmin.view.add.hide()
        ClearInputs("#add_Dealer")
        ClearSelection("#add_Dealer")
        ClearTextArea("#add_Dealer")
      }else{
        new MessageAlert("添加失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    },
    edit: function() {
      var rawData = window.target
      var data = formToSet("#edit_Dealer")
      for (var i in data) {
        rawData[i] = data[i]
      }
      var dealerId = apiConfig.dealer.Edit(rawData['_id'], data)
      if (dealerId>0) {
        DealerAdmin.view.edit.hide()
        new MessageAlert("修改成功", MessageAlert.Status.SUCCESS)
        ClearInputs("#edit_Dealer")
        ClearSelection("#edit_Dealer")
        ClearTextArea("#edit_Dealer")
      }else{
        new MessageAlert("修改失败", MessageAlert.Status.EXCEPTION)
      }
      table_init()
    }
  }
}
