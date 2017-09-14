bindInputQuery("#dealerId", "./test/searchDictionary/DealerCollections.json")
bindInputQuery("#BrochureType", "./test/searchDictionary/BrochureType.json")
$('#EstimateTime')
  .datetimepicker({
    format: 'yyyy-mm-dd',
    weekStart: 1,
    startDate: '2017-01-01',
    autoclose: true,
    startView: 4,
    minView: 2,
    forceParse: false,
    language: 'zh-CN'
  });


$("#addPR")
  .on("click", function () {
    if (!window.__purchaseRequisitionTable) {
      var purchaseRequisitionTable = new table()
      var t = {
        "tablename": "AddPR",
        "hasHeader": true,
        "hasButton": false,
        "keyArr": ["id", "key", "prop", "key", "prop", "prop", "prop"]
      }
      purchaseRequisitionTable.new(t, ["编号", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址"])
        .to($("#InfomationAddArea"))
      window.__purchaseRequisitionTable = purchaseRequisitionTable
    }
  })
