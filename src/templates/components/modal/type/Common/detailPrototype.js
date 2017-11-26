const DetailPrototype = {
  show: function(PRid) {
    console.log(this.id + " is showing!")
    if (PRid) {
      this.init(PRid)
      this.autoComplate(PRid)
    }

    var that = this
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
  showMe: function() {
    console.log("my name is " + this.id);
  }
}
