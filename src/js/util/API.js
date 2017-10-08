// var root = "http://192.168.1.101:8082"
var root = ""
const apiConfig = {
  brochure: {
    Get: function(id) {
      var api = root + `/api/brochure/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/brochure/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/brochure/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/brochure/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/brochure/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/brochure/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/brochure/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/brochure/paging(${startIndex},${endIndex})`
      return GET(api)
    }
  },
  brochurehistory: {
    Get: function(id) {
      var api = root + `/api/brochurehistory/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/brochurehistory/new`
      return POST(api, data)
    },
    Count: function() {
      var api = root + `/api/brochure/count`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/brochurehistory/top(${topcount})`
      return GET(api)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/brochurehistory/${id}/update`
      return PUT(api, data)
    },
    Paging: function(brochureid, startIndex, endIndex) {
      var api = root + `/api/brochurehistory/paging(${brochureid},${startIndex},${endIndex})`
      return GET(api)
    }
  },
  dealer: {
    Get: function(id) {
      var api = root + `/api/dealer/${id}`
      return GET(api)
    },
    GetByUserName: function(username) {
      var resultset = this.Search(username)
      for (var i of resultset) {
        if (i["_dealername"] == username)
          return i
      }
      return null
    },
    Add: function(data) {
      //POST
      var api = root + `/api/dealer/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/dealer/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/dealer/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/dealer/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/dealer/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/dealer/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/dealer/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/dealer/login?username=${username}&password=${password}`
      return PUT(api)
    }

  },
  optionlist: {
    Get: function(id) {
      var api = root + `/api/optionlist/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/optionlist/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/optionlist/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/optionlist/${id}`
      return DELETE(api)
    },
    Count: function() {
      var api = root + `/api/optionlist/count`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/optionlist/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/optionlist/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    GetByCategory: function(category) {
      var api = root + `/api/optionlist/category(${category})`
      return GET(api)
    }
  },
  prprocess: {
    Get: function(id) {
      var api = root + `/api/prprocess/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/prprocess/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/prprocess/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/prprocess/${id}`
      return DELETE(api)
    },
    Count: function() {
      var api = root + `/api/prprocess/count`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/prprocess/top(${topcount})`
      return GET(api)
    },
    Paging: function(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + `/api/prprocess/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    },
    Approving: function(id,processEnum) {
        var pr = this.Get(id)
        //GET /api/prprocess/paging({purchaseRequisitionid},{startIndex},{endIndex})
        pr["_prprocessstep"] = processEnum
        this.Edit(id,pr)
    }
  },
  prprocesssetting: {
    Get: function(id) {
      var api = root + `/api/prprocesssetting/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/prprocesssetting/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/prprocesssetting/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/prprocesssetting/${id}`
      return DELETE(api)
    },
    Top: function(topcount) {
      var api = root + `/api/prprocesssetting/top(${topcount})`
      return GET(api)
    },
    Paging: function(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + `/api/prprocesssetting/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    }
  },
  purchaseitem: {
    Get: function(id) {
      var api = root + `/api/purchaseitem/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/purchaseitem/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/purchaseitem/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id) {
      //PUT
      var api = root + `/api/purchaseitem/${id}`
      return DELETE(api)
    },
    Top: function(topcount) {
      var api = root + `/api/purchaseitem/top(${topcount})`
      return GET(api)
    },
    Paging: function(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + `/api/purchaseitem/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    }
  },
  purchaserequisition: {
    Get: function(id) {
      var api = root + `/api/purchaserequisition/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/purchaserequisition/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/purchaserequisition/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/purchaserequisition/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/purchaserequisition/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/purchaserequisition/search?keyWord=${keyword}`
      return GET(api)
    },
    SearchByStatus: function(role, userID, Status, startIndex, endIndex) {
      //TODO
    },
    SearchByKeywordAndStatus: function(role, userID, status, keyword, startIndex, endIndex) {
      //TODO
    },
    Top: function(topcount) {
      var api = root + `/api/purchaserequisition/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/purchaserequisition/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Approve: function(prid) {
      //TODO
      var pr = this.Get(prid)
      // pr["_"]
    },
    Reject: function(prid) {
      //TODO
    },
    Draft: function(data) {
      //POST
      var api = root + `/api/purchaserequisition/draft`
      return POST(api, data)
    },
    Submit: function(data) {
      //POST
      var api = root + `/api/purchaserequisition/submit`
      return POST(api, data)
    },
    Finish: function() {

    }
  },
  PRSupplierView: {
    Search: function() {
      var api = root + `/api/PRSupplierView/search`
      return GET(api)
    }
  },
  supplier: {
    Get: function(id) {
      var api = root + `/api/supplier/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/supplier/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/supplier/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/supplier/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/supplier/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/supplier/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/supplier/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/supplier/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/supplier/login?username=${username}&password=${password}`
      return PUT(api)
    }
  },
  systemsetting: {
    Get: function(id) {
      var api = root + `/api/systemsetting/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/systemsetting/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/systemsetting/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/systemsetting/${id}`
      return DETELE(api)
    },
    Count: function() {
      var api = root + `/api/systemsetting/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/systemsetting/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemsetting/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/systemsetting/paging(${startIndex},${endIndex})`
      return GET(api)
    }
  },
  systemuser: {
    Get: function(id) {
      var api = root + `/api/systemuser/${id}`
      return GET(api)
    },
    Add: function(data) {
      //POST
      var api = root + `/api/systemuser/new`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/systemuser/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id, data) {
      //PUT
      var api = root + `/api/systemuser/${id}/softdelete`
      return PUT(api, data)
    },
    Count: function() {
      var api = root + `/api/systemuser/count`
      return GET(api)
    },
    Search: function(keyword) {
      var api = root + `/api/systemuser/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemuser/top(${topcount})`
      return GET(api)
    },
    Paging: function(startIndex, endIndex) {
      var api = root + `/api/systemuser/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/systemuser/login?username=${username}&password=${password}`
      return PUT(api)
    }
  },
}
