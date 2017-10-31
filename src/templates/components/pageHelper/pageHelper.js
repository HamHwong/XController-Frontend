const pageHelperConfig = {
  rowsPerPage: 10
}
const generateTableWithPageHelper = function(obj) {

  var target = obj.target
  var templateOpts = obj.templateOpts
  var counter = obj.counter
  var datasourceAPI = obj.datasourceAPI
  var startIndex = 0
  var endIndex = startIndex + pageHelperConfig.rowsPerPage
  //options将会传入datasourceAPI,故参数应该与api保持一致
  var options = obj.options || {
    role: getCookie("role"),
    uid: getCookie('uid'),
  }
  options.status = options.status //不一定必须
  options.startIndex = startIndex
  options.endIndex = endIndex

  var datasource = function(datasourceAPI, options) {
    return function(options) {
      return datasourceAPI.call(this, options)
    }
  }(datasourceAPI, options)

  new table().loadFromTemplateJson(datasource(options), templateOpts).to(target)
  new pageHelper({
    recordsCount: counter,
    target: target,
    callback: function(obj) {
      //obj里面只带有startIndex和endIndex信息
      //当点击分页时需要call的函数
      options.startIndex = obj.startIndex
      options.endIndex = obj.endIndex
      new table().loadFromTemplateJson(datasource(options), templateOpts).to(this.target) //target已绑定pageHelper
    }
  })
}
var pageHelper = function(options) {
  //options
  //{
  //  recordsCount 记录总数
  //  rowsPerPage 每页个数
  //  pagesCount 页总数
  //  currentPage 当前页
  //}
  this.rowsPerPage = options.rowsPerPage | pageHelperConfig.rowsPerPage //每页多少条记录 required
  this.currentPage = 1 //当前页数
  this.recordsCount = options.recordsCount | 0
  this.pagesCount = Math.ceil(this.recordsCount / this.rowsPerPage)
  this.startIndex = 0
  this.endIndex = this.startIndex + this.rowsPerPage
  this.callback = options.callback
  this.target = $(options.target)

  this.target.append(this.generate())
}
pageHelper.prototype.generate = function() {
  if (this.recordsCount / this.rowsPerPage < 1) {
    return
  }
  var paginationMark = $('<ul class="pagination">')
  var nav = $('<nav style="text-align: center">')
  nav.append(paginationMark)
  for (var i = 1; i <= this.pagesCount; i++) {
    var a = $(`<a href="#">${i}</a>`)
    var li = $(`<li></li>`)
    var that = this

    if (i == this.currentPage) {
      paginationMark.find("li").removeClass("active")
      li.addClass("active")
    }

    li.on("click", {
      page: i,
      that: that
    }, function(e) {
      paginationMark.find("li").removeClass("active")
      $(this).addClass("active")
      e.data.that.to(e.data.page)
      console.log(e.data)
    })

    var page = li.append(a)
    paginationMark.append(page)
  }
  return nav
}
pageHelper.prototype.next = function() {
  var targetPage = this.currentPage + 1
  this.to(targetPage)
}
pageHelper.prototype.last = function() {
  var targetPage = this.currentPage - 1
  this.to(targetPage)
}
pageHelper.prototype.to = function(page) {
  if (page > this.pagesCount || page <= 0) {
    console.log("ERROR PAGES")
    return
  }
  this.currentPage = page
  this.startIndex = (this.currentPage - 1) * this.rowsPerPage
  this.endIndex = this.startIndex + this.rowsPerPage - 1
  if (this.currentPage == this.pagesCount) {
    var tailCount = (this.recordsCount % this.rowsPerPage)
    if (tailCount != 0) {
      this.endIndex = this.startIndex + tailCount
    }
  }
  this.callback.apply(this, [{
    startIndex: this.startIndex,
    endIndex: this.endIndex
  }])
  this.target.append(this.generate())
}
