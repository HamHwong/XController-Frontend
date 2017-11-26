function ModalAlert(obj) {
  if (!obj)
    var obj = new Object()
  this.name = obj.name || "tempModalAlert"
  this.label = obj.label || "您确认吗？"
  this.title = obj.title || "提示信息"
  this.okLabel = obj.okLabel || "确定"
  this.ok = obj.ok || null
  this.cancelLabel = obj.cancelLabel || "取消"
  this.cancel = obj.cancel || null
  this.model = `
  <div class="modal fade" id="${this.name}">
    <div class="modal-dialog">
      <div class="modal-content message_align">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title">${this.title}</h4>
        </div>
        <div class="modal-body">
          <p>${this.label}</p>
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div>`
  this.html = $(this.model)

  var that = this
  this.html.on("hidden.bs.modal", function() {
    console.log(that)
    $(that.html).remove()
    that = null
  })

  var okbtn = $(`<button class="btn btn-danger" data-dismiss="modal">${this.okLabel}</a>`)
  var cancelbtn = $(`<button type="button" class="btn btn-default" data-dismiss="modal">${this.cancelLabel}</button>`)
  if (this.ok) {
    okbtn.on("click", function() {
      that.ok()
      // that.ok.call(that)
    })
  }
  if (this.cancel) {
    cancelbtn.on("click", function() {
      that.cancel()
    })
  }
  this.html.find(".modal-footer").append($(okbtn))
  this.html.find(".modal-footer").append($(cancelbtn))
  $("body").append(this.html)
  this.html.modal()
}
