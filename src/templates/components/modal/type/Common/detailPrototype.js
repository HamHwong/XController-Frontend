const DetailPrototype = {
  show: function(PRid) {
    console.log(this.id + " is showing!")
    if (PRid) {
      this.init(PRid)
      this.autoComplate(PRid)
    }
    var that = this
    $(this.id).unbind("hidden.bs.modal")
    $(this.id)
      .on("hidden.bs.modal", function() {
        that.destory()
        console.log(that.id + " hidden!")
      })

    $(this.id).modal()
  },
  hide: function() {
    this.destory()
    $(this.id).modal('hide')
    console.log(this.id + "hidden!")
  },
  destory: function() {
    console.log("parents' destory function")
    clearProcessChart()
    // $("#progressbar").empty()
    ClearAllFields(this.id)

    if (window.target) {
      if (window.target.PR)
        window.target.PR = null
      window.target = null
    }
  },
  autoComplate: function(PRid) {
  
  }
}
