var table_init = function(tableList) {
  for (var i in CurrentTableList) {
    var $tablecontainer = $(i)
    var t = new table(CurrentTableList[i])
    t.load().to($tablecontainer)
  }
}