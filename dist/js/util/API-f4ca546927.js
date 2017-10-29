"use strict";

// var root = "http://192.168.1.101:8082"
// var root = "http://192.168.1.101:7856"
var root = "";
var apiConfig = {
  brochure: {
    Get: function Get(id) {
      var api = root + ("/api/brochure/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/brochure/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/brochure/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/brochure/" + id + "/softdelete");
      return PUT(api, data);
    },
    Count: function Count() {
      var api = root + "/api/brochure/count";
      return GET(api);
    },
    Search: function Search(keyword) {
      var api = root + ("/api/brochure/search(" + keyword + ")");
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/brochure/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(startIndex, endIndex) {
      var api = root + ("/api/brochure/paging(" + startIndex + "," + endIndex + ")");
      return GET(api);
    }
  },
  brochurehistory: {
    Get: function Get(id) {
      var api = root + ("/api/brochurehistory/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/brochurehistory/new";
      return POST(api, data);
    },
    Count: function Count() {
      var api = root + "/api/brochure/count";
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/brochurehistory/top(" + topcount + ")");
      return GET(api);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/brochurehistory/" + id + "/update");
      return PUT(api, data);
    },
    Paging: function Paging(brochureid, startIndex, endIndex) {
      var api = root + ("/api/brochurehistory/paging(" + brochureid + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    }
  },
  dealer: {
    Get: function Get(id) {
      var api = root + ("/api/dealer/" + id);
      return GET(api);
    },
    GetByUserName: function GetByUserName(username) {
      var resultset = this.Search(username);
      for (var j = 0; j < resultset.length; j++) {
        var i = resultset[j];
        if (i["_dealername"] == username) return i;
      }
      return null;
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/dealer/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/dealer/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/dealer/" + id + "/softdelete");
      return PUT(api, data);
    },
    Count: function Count() {
      var api = root + "/api/dealer/count";
      return GET(api);
    },
    Search: function Search(keyword) {
      var api = root + ("/api/dealer/search?keyWord=" + keyword);
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/dealer/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(startIndex, endIndex) {
      var api = root + ("/api/dealer/paging(" + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    Login: function Login(username, password) {
      var api = root + ("/api/dealer/login?username=" + username + "&password=" + password);
      return PUT(api);
    }

  },
  optionlist: {
    Get: function Get(id) {
      var api = root + ("/api/optionlist/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/optionlist/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/optionlist/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/optionlist/" + id);
      return DELETE(api);
    },
    Count: function Count() {
      var api = root + "/api/optionlist/count";
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/optionlist/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(startIndex, endIndex) {
      var api = root + ("/api/optionlist/paging(" + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    GetByCategory: function GetByCategory(category) {
      var api = root + ("/api/optionlist/category(" + category + ")");
      return GET(api);
    }
  },
  prprocess: {
    Get: function Get(id) {
      var api = root + ("/api/prprocess/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/prprocess/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/prprocess/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/prprocess/" + id);
      return DELETE(api);
    },
    GenerateAll: function GenerateAll(prid) {
      var api = root + ("/api/prprocess/generateall?prID=" + prid);
      return POST(api);
    },
    Count: function Count() {
      var api = root + "/api/prprocess/count";
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/prprocess/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + ("/api/prprocess/paging(" + purchaseRequisitionid + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    Search: function Search(purchaseRequisitionid) {
      var api = root + ("/api/prprocess/search(" + purchaseRequisitionid + ")");
      return GET(api);
    },
    Approving: function Approving(id, processEnum) {
      var pr = this.Get(id);
      //GET /api/prprocess/paging({purchaseRequisitionid},{startIndex},{endIndex})
      pr["_prprocessstep"] = processEnum;
      this.Edit(id, pr);
    },
    Approve: function Approve(prid, comments) {
      var currentStep = this.getCurrentStep(prid);
      var taskOwner = currentStep["_taskowner"];
      var result = null;
      if (currentStep) {
        if (getCookie('auth').toLowerCase() == "zeiss" && getCookie("name") == taskOwner || getCookie('auth').toLowerCase() == "admin") {
          var id = currentStep["_id"];
          var api = root + ("/api/prprocess/" + id + "/Approve?comments=" + comments);
          result = PUT(api);
        } else {
          throw "Permission Denied";
        }
      }
      return result;
    },
    Reject: function Reject(prid, comments) {
      var currentStep = this.getCurrentStep(prid);
      var taskOwner = currentStep["_taskowner"];
      var result = null;
      if (currentStep) {
        if (getCookie('auth').toLowerCase() == "zeiss" && getCookie("name") == taskOwner || getCookie('auth').toLowerCase() == "admin") {
          var id = currentStep["_id"];
          var api = root + ("/api/prprocess/" + id + "/Reject?comments=" + comments);
          result = PUT(api);
        } else {
          throw "Permission Denied";
        }
      }
      return result;
    },
    SupplierComplete: function SupplierComplete(prid) {
      var currentStep = this.getCurrentStep(prid);

      if (!currentStep || Enum.processStatus.SupplierUpdate != currentStep["_prprocessstep"]) return;

      var taskOwner = currentStep["_taskowner"];
      var result = null;
      if (currentStep) {
        if (getCookie('auth').toLowerCase() == "supplier" && getCookie("name") == taskOwner || getCookie('auth').toLowerCase() == "admin") {
          var id = currentStep["_id"];
          var api = root + ("/api/prprocess/" + id + "/SupplierComplete");
          result = PUT(api);
        } else {
          throw "Permission Denied";
        }
      }
      return result;
    },
    getCurrentStep: function getCurrentStep(prid) {
      var steps = apiConfig.prprocess.Search(prid);
      for (var i = 0; i < steps.length; i++) {
        var step = steps[i];
        if (Enum.enumApprovalResult.Ready == step["_result"]) {
          return step;
        }
      }
    }
  },
  prprocesssetting: {
    Get: function Get(id) {
      var api = root + ("/api/prprocesssetting/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/prprocesssetting/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/prprocesssetting/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/prprocesssetting/" + id);
      return DELETE(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/prprocesssetting/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + ("/api/prprocesssetting/paging(" + purchaseRequisitionid + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    }
  },
  purchaseitem: {
    Get: function Get(id) {
      var api = root + ("/api/purchaseitem/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/purchaseitem/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/purchaseitem/" + id + "/update");
      return PUT(api, data);
    },
    UpdateLogitics: function UpdateLogitics(id, data) {
      //PUT
      var api = root + ("/api/purchaseitem/" + id + "/updatelogistics");
      return PUT(api, data);
    },

    Delete: function Delete(id) {
      //PUT
      var api = root + ("/api/purchaseitem/" + id);
      return DELETE(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/purchaseitem/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(purchaseRequisitionid, startIndex, endIndex) {
      var api = root + ("/api/purchaseitem/paging(" + purchaseRequisitionid + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    }
  },
  purchaserequisition: {
    Get: function Get(id) {
      var api = root + ("/api/purchaserequisition/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/purchaserequisition/submit";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/purchaserequisition/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/purchaserequisition/" + id + "/softdelete");
      return PUT(api, data);
    },
    Count: function Count() {
      var api = root + "/api/purchaserequisition/count";
      return GET(api);
    },
    CountByDealer: function CountByDealer(dealerID, status) {
      var api = root + ("/api/purchaserequisition/countbydealer(" + dealerID + "," + status + ")");
      return GET(api);
    },
    Search: function Search(keyword) {
      var api = root + ("/api/purchaserequisition/search?keyWord=" + keyword);
      return GET(api);
    },
    SearchByStatus: function SearchByStatus(role, userID, Status, startIndex, endIndex) {
      var api = root + ("/api/purchaserequisition/search(" + role + "," + userID + "," + Status + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    SearchByKeywordAndStatus: function SearchByKeywordAndStatus(role, userID, status, keyword, startIndex, endIndex) {
      var api = root + ("/api/purchaserequisition/search(" + role + "," + userID + "," + status + "," + keyword + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/purchaserequisition/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(startIndex, endIndex) {
      var api = root + ("/api/purchaserequisition/paging(" + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    Approve: function Approve(prid) {
      //TODO
      var pr = this.Get(prid);
      // pr["_"]
    },
    Reject: function Reject(prid) {
      //TODO
    },
    Draft: function Draft(data) {
      //POST
      var api = root + "/api/purchaserequisition/draft";
      return POST(api, data);
    },
    Submit: function Submit(data) {
      //POST
      var api = root + "/api/purchaserequisition/submit";
      return POST(api, data);
    },
    Finish: function Finish() {},
    SupplierComplete: function SupplierComplete(prid) {
      // var currentStep = this.getCurrentStep(prid)
      //
      // if (!currentStep || Enum.processStatus.SupplierUpdate != currentStep["_prprocessstep"])
      //   return
      //
      // var taskOwner = currentStep["_taskowner"]
      // var result = null
      // if (currentStep) {
      //   if ((getCookie('auth').toLowerCase() == "supplier" && getCookie("name") == taskOwner) || getCookie('auth').toLowerCase() == "admin") {
      // var id = currentStep["_id"]
      var api = root + ("/api/purchaserequisition/" + prid + "/SupplierComplete");
      // result = PUT(api)
      //   } else {
      //     throw `Permission Denied`
      //   }
      // }
      return PUT(api);
    }
  },
  PRSupplierView: {
    Count: function Count() {
      var api = root + "/api/PRSupplierView/count";
      return GET(api);
    },
    Search: function Search(isCompeleted, keyword, startIndex, endIndex) {
      var api = root + ("/api/PRSupplierView/search(" + isCompeleted + "," + keyword + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    Paging: function Paging(isCompeleted, startIndex, endIndex) {
      var api = root + ("/api/PRSupplierView/search(" + isCompeleted + "," + startIndex + "," + endIndex + ")");
      return GET(api);
    }
  },
  supplier: {
    Get: function Get(id) {
      var api = root + ("/api/supplier/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/supplier/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/supplier/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/supplier/" + id + "/softdelete");
      return PUT(api, data);
    },
    Count: function Count() {
      var api = root + "/api/supplier/count";
      return GET(api);
    },
    Search: function Search(keyword) {
      var api = root + ("/api/supplier/search?keyWord=" + keyword);
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/supplier/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(startIndex, endIndex) {
      var api = root + ("/api/supplier/paging(" + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    Login: function Login(username, password) {
      var api = root + ("/api/supplier/login?username=" + username + "&password=" + password);
      return PUT(api);
    }
  },
  systemsetting: {
    Get: function Get(id) {
      var api = root + ("/api/systemsetting/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/systemsetting/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/systemsetting/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/systemsetting/" + id);
      return DETELE(api);
    },
    Count: function Count() {
      var api = root + "/api/systemsetting/count";
      return GET(api);
    },
    Search: function Search(keyword) {
      var api = root + ("/api/systemsetting/search?keyWord=" + keyword);
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/systemsetting/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(startIndex, endIndex) {
      var api = root + ("/api/systemsetting/paging(" + startIndex + "," + endIndex + ")");
      return GET(api);
    }
  },
  systemuser: {
    Get: function Get(id) {
      var api = root + ("/api/systemuser/" + id);
      return GET(api);
    },
    Add: function Add(data) {
      //POST
      var api = root + "/api/systemuser/new";
      return POST(api, data);
    },
    Edit: function Edit(id, data) {
      //PUT
      var api = root + ("/api/systemuser/" + id + "/update");
      return PUT(api, data);
    },
    Delete: function Delete(id, data) {
      //PUT
      var api = root + ("/api/systemuser/" + id + "/softdelete");
      return PUT(api, data);
    },
    Count: function Count() {
      var api = root + "/api/systemuser/count";
      return GET(api);
    },
    Search: function Search(keyword) {
      var api = root + ("/api/systemuser/search?keyWord=" + keyword);
      return GET(api);
    },
    Top: function Top(topcount) {
      var api = root + ("/api/systemuser/top(" + topcount + ")");
      return GET(api);
    },
    Paging: function Paging(startIndex, endIndex) {
      var api = root + ("/api/systemuser/paging(" + startIndex + "," + endIndex + ")");
      return GET(api);
    },
    Login: function Login(username, password) {
      var api = root + ("/api/systemuser/login?username=" + username + "&password=" + password);
      return PUT(api);
    }
  },
  employee: {
    Login: function Login(username, password) {
      var api = root + ("/api/employee/login(" + username + "," + password + ")");
      return GET(api);
    },
    Search: function Search(accountName) {
      var api = root + ("/api/employee/search(" + accountName + ")");
      return GET(api);
    }
  },
  PRApproverView: {
    Count: function Count() {
      var api = root + "/api/PRApproverView/count";
      return GET(api);
    },
    Paging: function Paging(account, completed, startIndex, endIndex) {
      var api = root + ("/api/PRApproverView/paging(" + account + "," + completed + "," + startIndex + "," + endIndex);
      return GET(api);
    }
  }
};