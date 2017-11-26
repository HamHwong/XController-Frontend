// var root = "http://192.168.1.101:8082"
// var root = "http://192.168.1.101:7856"
var root = ""
const apiConfig = {
  brochure: {
    Get: function(id) {
      var api = root + `/api/brochure/${id}`
      return GET(api)
    },
    Add: function(actionOwner, data) {
      //POST
      var api = root + `/api/brochure/new?actionOwner=${actionOwner}`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var account = getCookie("account")
      var api = root + `/api/brochure/${id}/update?actionOwner=${account}`
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
    Search: function({
      keyword,
    }) {
      var api = root + `/api/brochure/search(${keyword})`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/brochure/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex,
      keyword
    }) {
      if (keyword) {
        var api = root + `/api/brochure/search(${keyword},${startIndex},${endIndex})`
      } else {
        var api = root + `/api/brochure/paging(${startIndex},${endIndex})`
      }
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
      var api = root + `/api/brochurehistory/count`
      return GET(api)
    },
    CountById: function(brochureid) {
      var api = root + `/api/brochurehistory/count(${brochureid})`
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
    Paging: function({
      brochureid,
      startIndex,
      endIndex
    }) {
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
      var resultset = this.Search({
        username
      })
      for (var j = 0; j < resultset.length; j++) {
        var i = resultset[j]
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/dealer/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/dealer/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    GenerateAll: function(prid) {
      var api = root + `/api/prprocess/generateall?prID=${prid}`
      return POST(api)
    },
    Count: function() {
      var api = root + `/api/prprocess/count`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/prprocess/top(${topcount})`
      return GET(api)
    },
    Paging: function(
      purchaseRequisitionid,
      startIndex,
      endIndex
    ) {
      var api = root + `/api/prprocess/paging(${purchaseRequisitionid},${startIndex},${endIndex})`
      return GET(api)
    },
    Search: function({
      keyword
    }) {
      var purchaseRequisitionid = keyword
      var api = root + `/api/prprocess/search(${purchaseRequisitionid})`
      return GET(api)
    },
    // Approving: function(id, processEnum) {
    //   var pr = this.Get(id)
    //   //GET /api/prprocess/paging({purchaseRequisitionid},{startIndex},{endIndex})
    //   pr["_prprocessstep"] = processEnum
    //   this.Edit(id, pr)
    // },
    Approve: function(prid, comments) {
      var currentStep = apiConfig.prprocess.getCurrentStep(prid)
      var taskOwner = currentStep["_taskowner"]
      var result = null
      if (currentStep) {
        if ((getCookie('role') == Enum.role.EMPLOYEE && getCookie("account") == taskOwner.toUpperCase()) || getCookie('role') == Enum.role.SYSADMIN) {
          var id = currentStep["_id"]
          var api = root + `/api/prprocess/${id}/Approve?comments=${comments}`
          result = PUT(api)
        }
      }
      return result
    },
    Reject: function(prid, comments) {
      var currentStep = apiConfig.prprocess.getCurrentStep(prid)
      var taskOwner = currentStep["_taskowner"]
      var result = null
      if (currentStep) {
        if ((getCookie('role') == Enum.role.EMPLOYEE && getCookie("account") == taskOwner.toUpperCase()) || getCookie('role') == Enum.role.SYSADMIN) {
          var id = currentStep["_id"]
          var api = root + `/api/prprocess/${id}/Reject?comments=${comments}`
          result = PUT(api)
        } else {
          throw `Permission Denied`
        }
      }
      return result
    },
    getCurrentStep: function(prid) {
      var steps = apiConfig.prprocess.Paging(prid, 0, 1000)
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i]
        if (Enum.enumApprovalResult.Ready == step["_result"]) {
          return step
        }
      }
      console.log("当前PR已完成！")
      return {
        "_taskowner": ""
      }

    },
    getStepByAccount: function(prid, account) {
      var steps = apiConfig.prprocess.Paging(prid, 0, 1000)
      var stepArr = []
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i]
        if (account == step["_taskowner"]) {
          stepArr.push(step)
        }
      }
      return stepArr
    },
    getPrStepCommentsByAccount: function(prid, account) {
      var array = this.getStepByAccount(prid, account)
      var comments = []
      if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
          var date = array[i]["_lastmodified"]
          var comment = array[i]["_comments"]
          var obj = {
            date: date,
            comment: comment
          }
          comments.push(obj)
        }
      }
      return comments
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
    Paging: function({
      purchaseRequisitionid,
      startIndex,
      endIndex
    }) {
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
    Check: function(data) {
      //POST
      var api = root + `/api/purchaseitem/check`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/purchaseitem/${id}/update`
      return PUT(api, data)
    },
    UpdateLogitics(id, data) {
      //PUT
      var api = root + `/api/purchaseitem/${id}/updatelogistics`
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
    Paging: function(
      purchaseRequisitionid,
      startIndex,
      endIndex
    ) {
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
      var api = root + `/api/purchaserequisition/submit`
      return POST(api, data)
    },
    Edit: function(id, data) {
      //PUT
      var api = root + `/api/purchaserequisition/${id}/update`
      return PUT(api, data)
    },
    Delete: function(id) {
      //PUT
      var api = root + `/api/purchaserequisition/${id}`
      return DELETE(api)
    },
    Count: function() {
      var api = root + `/api/purchaserequisition/count`
      return GET(api)
    },
    CountByDealer: function(dealerID, status) {
      var api = root + `/api/purchaserequisition/countbydealer(${dealerID},${status})`
      return GET(api)
    },
    CountByEmployee: function(employeeAccount, status) {
      var api = root + `/api/purchaserequisition/countbyemployee(${employeeAccount},${status})`
      return GET(api)
    },
    Search: function({
      keyword
    }) {
      var api = root + `/api/purchaserequisition/search?keyWord=${keyword}`
      return GET(api)
    },
    SearchByStatus: function({
      role,
      uid,
      status,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/purchaserequisition/search(${role},${uid},${status},${startIndex},${endIndex})`
      return GET(api)
    },
    SearchByKeywordAndStatus: function({
      role,
      uid,
      status,
      keyword,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/purchaserequisition/search(${role},${uid},${status},${keyword},${startIndex},${endIndex})`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/purchaserequisition/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {

      var startIndex = startIndex
      var endIndex = endIndex
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
    SupplierComplete: function(prid) {
      //TODO
      var currentStep = apiConfig.prprocess.getCurrentStep(prid)

      if (!currentStep || Enum.processStatus.SupplierUpdate != currentStep["_prprocessstep"])
        return false

      // var taskOwner = currentStep["_taskowner"]//supplier暂时不用规定权限
      var result = false
      if (currentStep) {
        if ((getCookie('role') == Enum.role.SUPPLIER) || (getCookie('role') === Enum.role.SYSADMIN)) {
          // var id = currentStep["_id"]
          var api = root + `/api/purchaserequisition/${prid}/SupplierComplete`
          result = PUT(api)
        }
      }
      return result
    },
  },
  PRSupplierView: {
    Count: function(completed) {
      var api = root + `/api/PRSupplierView/count?completed=${completed}`
      return GET(api)
    },
    Search: function({
      isCompeleted,
      keyword,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/PRSupplierView/search(${isCompeleted},${keyword},${startIndex},${endIndex})`
      return GET(api)
    },
    Paging: function({
      isCompeleted,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/PRSupplierView/search(${isCompeleted},${startIndex},${endIndex})`
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/supplier/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/supplier/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/systemsetting/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemsetting/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
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
    Search: function({
      keyword
    }) {
      var api = root + `/api/systemuser/search?keyWord=${keyword}`
      return GET(api)
    },
    Top: function(topcount) {
      var api = root + `/api/systemuser/top(${topcount})`
      return GET(api)
    },
    Paging: function({
      startIndex,
      endIndex
    }) {
      var api = root + `/api/systemuser/paging(${startIndex},${endIndex})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/systemuser/login?username=${username}&password=${password}`
      return PUT(api)
    }
  },
  employee: {
    Get: function(accountName) {
      var api = root + `/api/employee/GetEmployee(${accountName})`
      return GET(api)
    },
    Login: function(username, password) {
      var api = root + `/api/employee/login(${username},${password})`
      return GET(api)
    },
    Search: function({
      keyword
    }) {
      var name = keyword
      var api = root + `/api/employee/search(${name})`
      return GET(api)
    }
  },
  PRApproverView: {
    Count: function(account, status) {
      var api = root + `/api/PRApproverView/count?account=${account}&status=${status}`
      return GET(api)
    },
    Paging: function({
      account,
      completed,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/PRApproverView/paging(${account},${completed},${startIndex},${endIndex}`
      return GET(api)
    }
  },
  PRAdminView: {
    Count: function(status, keyword) {
      if (keyword) {
        var api = root + `/api/PRAdminView/count?keyword=${keyword}&status=${status}`
      } else {
        var api = root + `/api/PRAdminView/count?status=${status}`
      }
      return GET(api)
    },
    Paging: function({
      status,
      startIndex,
      endIndex
    }) {
      var api = root + `/api/PRAdminView/paging(${status},${startIndex},${endIndex}`
      return GET(api)
    }
  }
}
