const regxRule = {

  string: {
    regx: function (min, max) {
      var result = min
      // if (max)
      result += "," + max
      return `^.{${result}}$`
    },
    msg: `至少`
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
    regx: function (min, max) {
      var result = min
      // if (max)
      result += "," + max
      return `^\\d{${result}}$`
    },
    msg: ""
  }


}
