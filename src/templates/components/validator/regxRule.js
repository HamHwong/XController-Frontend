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

  mobile: {
    regx: "(13\\d|14[57]|15[^4,\\D]|17[13678]|18\\d)\\d{8}|170[0589]\\d{7}",
    msg: ""
  },

  number: {
    regx: function(min, max) {
      var result = min
      // if (max)
      result += "," + max
      regxRule.number.msg = `请输入至少${min},最多不超过${max}位的数字！`
      return `^\\d{${result}}$`
    },
    msg: `请输入至少min,最多不超过max位的数字！`
  },

  select: {},

  password: {},

  checkbox: {
    regx: function(min, max) {
      //最少選min個，最多選max個

    }
  },

  radio: {},



}
