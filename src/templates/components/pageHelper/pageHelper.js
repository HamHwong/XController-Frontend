//根据不同的
var pageHelper = function(options) {
  //options
  //{
  //  recordsCount 记录总数
  //  rowsPerPage 每页个数
  //  pagesCount 页总数
  //  currentPage 当前页
  //}
  this.rowsPerPage = options.rowsPerPage | 10 //每页多少条记录
  this.currentPage = 0 //当前页数
  this.recordsCount = options.recordsCount | 0
  this.pagesCount = Math.ceil(this.recordsCount / this.rowsPerPage)
  this.startRow = 0
  this.endRow = this.startRow + this.rowsPerPage
  this.api = options.api | apiConfig.purchaserequisition.SearchByStatus
  this.module =
    `
  <nav style="text-align: center">
    <ul class="pagination">
      <li><a href="#">&laquo;</a></li>
      <li><a href="#">1</a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li><a href="#">&raquo;</a></li>
    </ul>
  </nav>
  `
}
pageHelper.prototype.generate = function() {
  var paginationMark = $('<ul class="pagination">')
  var nav = $('<nav style="text-align: center">')
  nav.append(paginationMark)
  for (var i = 1; i <= this.pagesCount; i++) {
    var a = $(`<a href="#">${i}</a>`)
    var that = this
    a.on("click", {
      page: i,
      that: that
    }, function(e) {
      paginationMark.find("a").removeClass("active")
      $(this).addClass("active")
      e.data.that.to(e.data.page)
      console.log(e.data)
    })
    var li = $(`<li></li>`)
    var page = li.append(a)
    paginationMark.append(page)
  }
  return nav
}
pageHelper.prototype.next = function() {

}
pageHelper.prototype.last = function() {

}
pageHelper.prototype.to = function(page) {
  console.log("redirect to", page)
}
