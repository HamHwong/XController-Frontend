function ClearInputs(form) {
  form = $(form)
  var inputs = form.find("input")
  var a = inputs
  for (var i = 0; i < a.length; i++) {
    $(a[i])
      .val("")
  }
}

function ClearTextArea(form) {
  form = $(form)
  var textarea = form.find("textarea")
  var a = textarea
  for (var i = 0; i < a.length; i++) {
    $(a[i])
      .val("")
  }
}

function ClearSelecton(form) {
  form = $(form)
  var selection = form.find("select")
  var a = selection
  for (var i = 0; i < a.length; i++) {
    $(a[i])
      .val("-1")
  }
}
