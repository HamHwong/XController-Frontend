const validator = {
  init: function() {
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
            control.unbind("keyup")
            control.on('keyup', function(e) {
              var target = $(e.target)
              var rule = target.data('regxrule')
              var result = validator.validate(target, rule)
              validator.displayResult(target, result)
            })
            break
          case 'radio':
          case 'checkbox':
          case 'hidden':
            control.unbind("change")
            control.on('change', function(e) {
              var target = $(e.target)
              var rule = target.data('regxrule')
              var result = validator.validate(target, rule)
              validator.displayResult(target, result)
            })
            break
          default:
            break
        }
      } else if (control.is("select")) {
        control.unbind("change")
        control.on('change', function(e) {
          // console.log($(e.target).data('regxrule'), 'onchange works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          console.log(target);
          var result = validator.validate(target, rule)
          validator.displayResult(target, result)
        })
      } else if (control.is("textarea")) {
        control.unbind("keyup")
        control.on('keyup', function(e) {
          // console.log($(e.target).data('regxrule'), 'onkeyup works')
          var target = $(e.target)
          var rule = target.data('regxrule')
          var result = validator.validate(target, rule)
          validator.displayResult(target, result)
        })
      }
      //若是input text password，则绑定onkeyup
      //若是input checkbox radio 则绑定 onchange
    }
  },
  validate: function(target, rule) {
    // && ||
    var result = {}
    var regStr = ""
    var regxResult = rule.split(/\(([^)]*)\)/) //匹配括号里的内容
    var category = regxResult[0]
    var limit = regxResult[1]
    // console.log(category, limit)
    var c = null
    if (!(c = regxRule[category])) {
      //regxRule里无值,则说明其可能为一个字符串（函数或者正则）
      var str = category
      try {
        c = eval(str)
      } catch (e) {
        c = str
      }

      if ('function' == typeof c) {
        //若为函数,则将target传入进行判断,返回true或者false
        result['result'] = c(target)
        result['warning'] = result['result'] ? "OK" : "ERROR"
      } else if ('string' == typeof c) {
        //若为字符串，则为正则
        regStr = c
        var regexp = new RegExp(regStr)
        var value = $(target).is("input") ? $(target).val() : $(target).text()
        result['result'] = regexp.test(value)
        result['warning'] = result['result'] ? "OK" : "ERROR"
      }
    } else if (c = regxRule[category]) {
      //若在正则库中到
      if ('function' == typeof c["regx"]) {
        if (limit) {
          //若有limit 则说明需要限制长度
          var limitList = limit.split(",")
          var min = ""
          var max = ""
          var MinAndMax = ""
          if (limitList.length > 2)
            console.log('only two integers required,Max and Min')
          else if (limitList.length == 2) {
            try {
              var i1 = parseInt(limitList[0])
              var i2 = parseInt(limitList[1])
              max = i1 > i2 ? i1 : i2
              min = i1 < i2 ? i1 : i2
              // MinAndMax = min + "," + max
            } catch (e) {
              console.log(e)
            }
          } else {
            min = parseInt(limitList[0])
          }
          regStr = c["regx"](min, max)
        } else {
          regStr = c["regx"]()
        }
      } else {
        regStr = c["regx"]
      }
      // console.log(c["regx"])
      var regexp = new RegExp(regStr)
      var value = ($(target).is("input") || $(target).is("select")) ? $(target).val() : $(target).text()
      // console.log(value, regexp.test(value))
      result['result'] = regexp.test(value)
      result['msg'] = c['msg']
    }
    // return result
    return result
  },
  displayResult: function(target, result) {
    if (!result['result']) {
      validator.error(target, result)
    } else {
      validator.pass(target)
    }
  },
  error: function(target, result) {
    target = $(target)
    var RESULT = result["result"]
    var MSG = result["msg"]
    var PNode = target.parent('div')
    target.attr("validate", false)
    PNode.removeClass("has-success").addClass("has-error")
    PNode.find("i.validator_error").remove()
    PNode.append(`<i class="validator_error text-danger">${MSG}</i>`)
  },
  pass: function(target) {
    target = $(target)
    var PNode = target.parent('div')
    target.attr("validate", true)
    PNode.removeClass("has-error").addClass("has-success")
    PNode.find("i.validator_error").remove()
  },
  Restore: function() {
    var form = $("form[data-validator=true]")
    var validatelist = form.find("*[data-regxRule]")
    for (var i = 0; i < validatelist.length; i++) {
      var target = $(validatelist[i])
      var PNode = target.parent('div')
      target.attr("validate", false)
      PNode.removeClass("has-error").removeClass("has-success")
      PNode.find("i.validator_error").remove()
    }
  },
  Result: function(form) {
    var form = $(form)
    if (form.data("validator")) {
      var validatelist = form.find("*[data-regxRule]")
      var finalResult = true
      for (var i = 0; i < validatelist.length; i++) {
        var target = $(validatelist[i])
        var result = validator.validate(target, target.data("regxrule"))
        validator.displayResult(target, validator.validate(target, target.data("regxrule")))
        finalResult = result["result"] && finalResult
      }
    }
    return finalResult
  }
}
