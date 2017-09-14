//多模态HACK
var couter = 0;
$(document)
  .on('hidden.bs.modal', '.modal', function (e) {
    $(this)
      .css("z-index", 1050)
    couter--
  });
$(document)
  .on('show.bs.modal', '.modal', function (e) {
    $(this)
      .css("z-index", 1050 + couter)
    couter++
  });
