var validator = {
  init: function () {
    var form = $("form[data-validator=true]")
    var validatelist = form.find("*[data-regxRule]")
    for (var i = 0; i < validatelist.length; i++) {
      var control = $(validatelist[i])
      // debugger
      if (control.is("input")) {
        var type = control.attr('type') || 'text'
        switch (type) {
        case 'password':
        case 'text':
        case 'email':
        case 'tel':
        case 'url':
        case 'search':
          control.on('keyup', function (e) {
            console.log($(e.target).data('regxrule'), 'onkeyup works')
            var target = $(e.target)
            var rule = target.data('regxrule')
            validator.validate(target, rule)
          })
          break
        case 'radio':
        case 'checkbox':
        case 'hidden':
          control.on('change', function (e) {
            console.log($(e.target).data('regxrule'), 'onchange works')
            var target = $(e.target)
            var rule = target.data('regxrule')
            validator.validate(target, rule)
          })
          break
        default:
          break
        }
      } else if (control.is("select")) {
        control.on('change', function (e) {
          console.log($(e.target).data('regxrule'), 'onchange works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          validator.validate(target, rule)
        })
      } else if (control.is("textarea")) {
        control.on('keyup', function (e) {
          console.log($(e.target).data('regxrule'), 'onkeyup works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          validator.validate(target, rule)
        })
      }

      // console.log(control,control.data('regxrule'))
      //若是input text password，则绑定onkeyup
      //若是input checkbox radio 则绑定 onchange
    }
  },
  validate: function (target,rule) {
    // var result = rule.match(/\(([^)]*)\)/)[1] //匹配括号里的内容
    var result = rule.split(/\(([^)]*)\)/)//匹配括号里的内容
    var category = result[0]
    var limit = result[1]
    if(limit){
      //若有limit 则说明需要限制长度
    }
    console.log(category,limit)
    var c = regxRule[rule]
  }
}
