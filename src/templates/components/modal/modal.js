//多模态HACK
var counter = 0;
$(document).unbind('hidden.bs.modal')
  .on('hidden.bs.modal', '.modal', function(e) {
    $(this).css("z-index", 1050)
    // $('.modal-backdrop')[counter].css("z-index",1049)
    counter--
  });
$(document).unbind('show.bs.modal')
  .on('show.bs.modal', '.modal', function(e) {
    $(this).css("z-index", 1050 + counter + 2)
    // if ($('.modal-backdrop').length <= 1 )
    //   return
    console.log("chufa")
    var setter = setTimeout(function() {
      console.log("finding",counter,$('.modal-backdrop').length)
      if (counter == $('.modal-backdrop').length) {
        console.log("found")
        $('.modal-backdrop:last-child').css("z-index", 1050 + counter)
        clearTimeout(setter)
        console.log("set")
      }
    }, 0)

    counter++
  });
