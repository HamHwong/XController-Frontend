var MessageAlert = function(msg, status, showTime) {
  this.status = status || MessageAlert.Status.SUCCESS
  this.msg = msg || "Congratulation! Action performed!"
  this.statusCode = 0
  this.html = null
  this.dropback = null
  this.showoutTime = 600
  this.showtime = showTime || 1000
  this.hideTime = 300
  this.show(this.mse, this.status)
}

MessageAlert.prototype.new = function(msg, status) {
  this.msg = msg || this.msg
  this.status = status || this.status
  if (this.html)
    this.html.remove()
  // if (!this.html) {
  this.html = this.generateHTML(this.msg, this.status)
  this.html.css("display", "none")
  $("body").append(this.html)
  // }
  if (!this.dropback) {
    this.dropback = $('<div class="MassageAlert_dropback"></div>')
    $("body").append(this.dropback)
  }
  return this.html
}

MessageAlert.prototype.generateHTML = function(msg, status) {
  var mod =
    `
      <div class="MassageAlert_Warp">
        <div class="MassageAlert">
          <label class="MassageAlert_Title">
            <i class="Icon"></i>
            <span class="Status">${status}</span>
          </label>
          <div class="MassageAlert_Body">
            <span>${msg}</span>
          </div>
          <div class="MassageAlert_Footer"></div>
        </div>
      </div>
      `
  return $(mod)
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
  if (!this.inStatus(status))
    throw "Error Status"
  this.new(msg, status)
    .show(this.showoutTime)
  this.dropback.fadeIn(this.showoutTime)

  var self = this
  setTimeout(function() {
    self.hide()
    setTimeout(function() {
      self.destory()
    }, self.hideTime)
  }, self.showoutTime + self.showtime)

  return this
}
// MessageAlert.show = function(msg, status){
//   // this.incident
//   // if(MessageAlert){}
// }

MessageAlert.prototype.hide = function() {
  this.html.hide(this.hideTime)
  this.dropback.fadeOut(this.hideTime)
  return this
};

MessageAlert.Status = {
  SUCCESS: "SUCCESS",
  EXCEPTION: "EXCEPTION",
  ERROR: "ERROR",
}

MessageAlert.prototype.inStatus = function(status) {
  var isContain = false
  if ('string' != typeof status) {
    throw 'invalid status'
  }
  for (var i in MessageAlert.Status) {
    isContain = (status.toUpperCase() === MessageAlert.Status[i]) || isContain
  }
  return isContain
}

// var messageAlert = new MessageAlert()
