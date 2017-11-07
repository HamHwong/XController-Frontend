const regxRule = {

  string: {
    regx: function(min, max) {
      var result = min
      // if (max)
      result += "," + max
      return `^.{${result}}$`
    },
    msg: `请输入至少min,最多max位字符，不能输入带有#￥%_等特殊符号。`
  },

  account: {
    regx: "",
    msg: ""
  },

  email: {
    regx: "\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}",
    msg: "请输入正常的邮箱"
  },

  phone: {
    regx: "(13\\d|14[57]|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[0589]\\d{7}|[0-9-()（）]{7,18}",
    msg: "请输入正确的手机号码或者座机号码！"
  },

  number: {
    regx: function(min, max) {
      var msg = ""
      var regxstr = ""
      if (min != undefined) {
        var result = min
        result += "," + max
        msg = `请输入至少${min},最多不超过${max}位的数字！`
        regxstr = `^\\d{${result}}$`
      } else {
        msg = `请输入数字！`
        regxstr = `^\\d{1,}$`
      }
      regxRule.number.msg = msg
      return regxstr
    },
    msg: `请输入至少min,最多不超过max位的数字！`
  },
  notnull: {
    regx: "\\S{1,}",
    msg: "不能为空！"
  },
  select: {
    regx: "[^-1]\\d*",
    msg: "请选择！"
  },
  selectEmployee:{
    regx: "[^-1]\\d*",
    msg: "没有找到该员工！请确认后查询！"
  },
  selectDealer:{
    regx: "[^-1]\\d*",
    msg: "没有找到该代理商！请确认后查询！"
  },

  password: {},

  checkbox: {
    regx: function(min, max) {
      //最少選min個，最多選max個

    }
  },

  radio: {},



}
