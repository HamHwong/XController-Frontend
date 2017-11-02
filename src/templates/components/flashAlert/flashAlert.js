var MessageAlert = function(msg, status) {
  this.status = status || MessageAlert.Status.SUCCESS
  this.msg = msg || "Congratulation! Action performed!"
  this.statusCode = 0
  this.html = null
  this.dropback = null
  this.showoutTime = 600
  this.showtime = 1000
  this.hideTime = 300
  this.mod =
    `
  <div class="MassageAlert_Warp">
    <div class="MassageAlert">
      <label class="MassageAlert_Title">
        <i class="Icon"></i>
        <span class="Status">${this.status}</span>
      </label>
      <div class="MassageAlert_Body">
        <span>${this.msg}</span>
      </div>
      <div class="MassageAlert_Footer"></div>
    </div>
  </div>
  `
  // this.show()
}

MessageAlert.prototype.new = function() {
  if (!this.html) {
    this.html = $(this.mod)
    this.html.css("display", "none")
    $("body").append(this.html)
  }
  if (!this.dropback) {
    this.dropback = $('<div class="MassageAlert_dropback"></div>')
    $("body").append(this.dropback)
  }
  return this
}

MessageAlert.prototype.destory = function() {
  if (this.html) {
    this.html.remove()
  }
  if (this.dropback) {
    this.dropback.remove()
  }
}

MessageAlert.prototype.show = function(msg, status) {
  //TODO
  this.new(msg, status).html
    .show(this.showoutTime)
  this.dropback.fadeIn(this.showoutTime)

  var self = this
  setTimeout(function() {
    self.hide()
  }, this.showoutTime + this.showtime)

  return this

};
// MessageAlert.show = function(msg, status){
//   // this.incident
//   // if(MessageAlert){}
// }

MessageAlert.prototype.hide = function() {
  this.html.hide(this.hideTime)
  this.dropback.fadeOut(this.hideTime)
};

MessageAlert.Status = {
  SUCCESS: "SUCCESS",
  EXCEPTION: "EXCEPTION",
  ERROR: "ERROR",
}

MessageAlert.prototype.inStatus = function(status) {
  var isContain = true
  if ('string' != typeof status) {
    throw 'invalid status'
  }
  for (var i in this.Status) {
    isContain = isContain && (status.toUpperCase == this.Status[i])
  }
  return isContain
}

var messageAlert = new MessageAlert()
