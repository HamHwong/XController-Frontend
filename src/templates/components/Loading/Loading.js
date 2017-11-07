var LoadingEmelement = function() {
  this.html = $(`<div class="loadingElement"></div>`)
  return this
}
LoadingEmelement.prototype.jump = function(target, time) {
  var tempDistance = 0
  var speed = target / time
  for (; tempDistance < target; tempDistance += speed) {
    this.html.css("top", tempDistance)
  }
}
var Loading = function({
  count,
  time
}) {
  this.count = count
  this.time = time
  this.generate({
    count: count,
    time: time
  })
}
Loading.prototype.generate = function({
  count,
  time
}) {
  if (!$(".Loading").length) {
    $("body").append("<div class='Loading'>")
  } else {
    $(".Loading").empty()
  }
  $(".Loading").append("<div class='loadingElements'>")

  var loadingContainer = $(".loadingElements")
  for (var i = 0; i < count; i++) {
    var c = new LoadingEmelement()
    c.jump(100, 1000)
    loadingContainer.append(c.html)
  }
}
Loading.prototype.move = function() {

}
