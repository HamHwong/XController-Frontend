const BrochureHistory = {
  show: function(bid) {
    BrochureHistory.init(bid)
    $("#History").modal()
  },
  hide: function() {
    $("#History").modal("hide")
  },
  init: function(bid) {
    generateTableWithPageHelper({
      target: ".infomationTable",
      templateOpts: tableStructures.Admin.Bruchure.History,
      counter: apiConfig.brochurehistory.CountById(bid),
      datasourceAPI: apiConfig.brochurehistory.Paging,
      options: {
        brochureid: bid
      }
    })
  }
}
