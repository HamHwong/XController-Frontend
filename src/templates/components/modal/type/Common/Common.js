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


function formToSet(form) {
  form = $(form)
  var formArr = form
    .serializeArray()

  var set = {}
  for (var record of formArr) {
    var key = record["name"]
    var value = record["value"]
    set[key] = value
  }
  return set
}

function autoComplateInfo(infoSet, form) {
  form = $(form)
  var set = formToSet(form)
  for (var i in set) {
    form.find("#"+i).val(infoSet[i])
  }
}
