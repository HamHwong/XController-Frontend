'use strict';
// var root = "http://192.168.1.101:8082"
// var root = "http://192.168.1.101:7856"
var root = '';
var apiConfig = {
        brochure: {
            Get: function Get(id) {
                var api = root + ('/api/brochure/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/brochure/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var account = getCookie('account');
                var api = root + ('/api/brochure/' + id + '/update?actionOwner=' + account);
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/brochure/' + id + '/softdelete');
                return PUT(api, data);
            },
            Count: function Count() {
                var api = root + '/api/brochure/count';
                return GET(api);
            },
            Search: function Search(_ref) {
                var keyword = _ref.keyword;
                var api = root + ('/api/brochure/search(' + keyword + ')');
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/brochure/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref2) {
                var startIndex = _ref2.startIndex, endIndex = _ref2.endIndex;
                var api = root + ('/api/brochure/paging(' + startIndex + ',' + endIndex + ')');
                return GET(api);
            }
        },
        brochurehistory: {
            Get: function Get(id) {
                var api = root + ('/api/brochurehistory/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/brochurehistory/new';
                return POST(api, data);
            },
            Count: function Count() {
                var api = root + '/api/brochurehistory/count';
                return GET(api);
            },
            CountById: function CountById(brochureid) {
                var api = root + ('/api/brochurehistory/count(' + brochureid + ')');
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/brochurehistory/top(' + topcount + ')');
                return GET(api);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/brochurehistory/' + id + '/update');
                return PUT(api, data);
            },
            Paging: function Paging(_ref3) {
                var brochureid = _ref3.brochureid, startIndex = _ref3.startIndex, endIndex = _ref3.endIndex;
                var api = root + ('/api/brochurehistory/paging(' + brochureid + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            }
        },
        dealer: {
            Get: function Get(id) {
                var api = root + ('/api/dealer/' + id);
                return GET(api);
            },
            GetByUserName: function GetByUserName(username) {
                var resultset = this.Search({ username: username });
                for (var j = 0; j < resultset.length; j++) {
                    var i = resultset[j];
                    if (i['_dealername'] == username)
                        return i;
                }
                return null;
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/dealer/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/dealer/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/dealer/' + id + '/softdelete');
                return PUT(api, data);
            },
            Count: function Count() {
                var api = root + '/api/dealer/count';
                return GET(api);
            },
            Search: function Search(_ref4) {
                var keyword = _ref4.keyword;
                var api = root + ('/api/dealer/search?keyWord=' + keyword);
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/dealer/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref5) {
                var startIndex = _ref5.startIndex, endIndex = _ref5.endIndex;
                var api = root + ('/api/dealer/paging(' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            Login: function Login(username, password) {
                var api = root + ('/api/dealer/login?username=' + username + '&password=' + password);
                return PUT(api);
            }
        },
        optionlist: {
            Get: function Get(id) {
                var api = root + ('/api/optionlist/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/optionlist/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/optionlist/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/optionlist/' + id);
                return DELETE(api);
            },
            Count: function Count() {
                var api = root + '/api/optionlist/count';
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/optionlist/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref6) {
                var startIndex = _ref6.startIndex, endIndex = _ref6.endIndex;
                var api = root + ('/api/optionlist/paging(' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            GetByCategory: function GetByCategory(category) {
                var api = root + ('/api/optionlist/category(' + category + ')');
                return GET(api);
            }
        },
        prprocess: {
            Get: function Get(id) {
                var api = root + ('/api/prprocess/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/prprocess/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/prprocess/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/prprocess/' + id);
                return DELETE(api);
            },
            GenerateAll: function GenerateAll(prid) {
                var api = root + ('/api/prprocess/generateall?prID=' + prid);
                return POST(api);
            },
            Count: function Count() {
                var api = root + '/api/prprocess/count';
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/prprocess/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(purchaseRequisitionid, startIndex, endIndex) {
                var api = root + ('/api/prprocess/paging(' + purchaseRequisitionid + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            Search: function Search(_ref7) {
                var keyword = _ref7.keyword;
                var purchaseRequisitionid = keyword;
                var api = root + ('/api/prprocess/search(' + purchaseRequisitionid + ')');
                return GET(api);
            },
            Approving: function Approving(id, processEnum) {
                var pr = this.Get(id);
                //GET /api/prprocess/paging({purchaseRequisitionid},{startIndex},{endIndex})
                pr['_prprocessstep'] = processEnum;
                this.Edit(id, pr);
            },
            Approve: function Approve(prid, comments) {
                var currentStep = this.getCurrentStep(prid);
                var taskOwner = currentStep['_taskowner'];
                var result = null;
                if (currentStep) {
                    if (getCookie('auth').toLowerCase() == 'zeiss' && getCookie('name') == taskOwner || getCookie('auth').toLowerCase() == 'admin') {
                        var id = currentStep['_id'];
                        var api = root + ('/api/prprocess/' + id + '/Approve?comments=' + comments);
                        result = PUT(api);
                    } else {
                        throw 'Permission Denied';
                    }
                }
                return result;
            },
            Reject: function Reject(prid, comments) {
                var currentStep = this.getCurrentStep(prid);
                var taskOwner = currentStep['_taskowner'];
                var result = null;
                if (currentStep) {
                    if (getCookie('auth').toLowerCase() == 'zeiss' && getCookie('name') == taskOwner || getCookie('auth').toLowerCase() == 'admin') {
                        var id = currentStep['_id'];
                        var api = root + ('/api/prprocess/' + id + '/Reject?comments=' + comments);
                        result = PUT(api);
                    } else {
                        throw 'Permission Denied';
                    }
                }
                return result;
            },
            SupplierComplete: function SupplierComplete(prid) {
                var currentStep = this.getCurrentStep(prid);
                if (!currentStep || Enum.processStatus.SupplierUpdate != currentStep['_prprocessstep'])
                    return;
                var taskOwner = currentStep['_taskowner'];
                var result = null;
                if (currentStep) {
                    if (getCookie('auth').toLowerCase() == 'supplier' && getCookie('name') == taskOwner || getCookie('auth').toLowerCase() == 'admin') {
                        var id = currentStep['_id'];
                        var api = root + ('/api/prprocess/' + id + '/SupplierComplete');
                        result = PUT(api);
                    } else {
                        throw 'Permission Denied';
                    }
                }
                return result;
            },
            getCurrentStep: function getCurrentStep(prid) {
                var steps = apiConfig.prprocess.Search({ keyword: prid });
                for (var i = 0; i < steps.length; i++) {
                    var step = steps[i];
                    if (Enum.enumApprovalResult.Ready == step['_result']) {
                        return step;
                    }
                }
            }
        },
        prprocesssetting: {
            Get: function Get(id) {
                var api = root + ('/api/prprocesssetting/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/prprocesssetting/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/prprocesssetting/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/prprocesssetting/' + id);
                return DELETE(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/prprocesssetting/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref8) {
                var purchaseRequisitionid = _ref8.purchaseRequisitionid, startIndex = _ref8.startIndex, endIndex = _ref8.endIndex;
                var api = root + ('/api/prprocesssetting/paging(' + purchaseRequisitionid + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            }
        },
        purchaseitem: {
            Get: function Get(id) {
                var api = root + ('/api/purchaseitem/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/purchaseitem/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/purchaseitem/' + id + '/update');
                return PUT(api, data);
            },
            UpdateLogitics: function UpdateLogitics(id, data) {
                //PUT
                var api = root + ('/api/purchaseitem/' + id + '/updatelogistics');
                return PUT(api, data);
            },
            Delete: function Delete(id) {
                //PUT
                var api = root + ('/api/purchaseitem/' + id);
                return DELETE(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/purchaseitem/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(purchaseRequisitionid, startIndex, endIndex) {
                var api = root + ('/api/purchaseitem/paging(' + purchaseRequisitionid + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            }
        },
        purchaserequisition: {
            Get: function Get(id) {
                var api = root + ('/api/purchaserequisition/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/purchaserequisition/submit';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/purchaserequisition/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/purchaserequisition/' + id + '/softdelete');
                return PUT(api, data);
            },
            Count: function Count() {
                var api = root + '/api/purchaserequisition/count';
                return GET(api);
            },
            CountByDealer: function CountByDealer(dealerID, status) {
                var api = root + ('/api/purchaserequisition/countbydealer(' + dealerID + ',' + status + ')');
                return GET(api);
            },
            CountByEmployee: function CountByEmployee(employeeAccount, status) {
                var api = root + ('/api/purchaserequisition/countbyemployee(' + employeeAccount + ',' + status + ')');
                return GET(api);
            },
            Search: function Search(_ref9) {
                var keyword = _ref9.keyword;
                var api = root + ('/api/purchaserequisition/search?keyWord=' + keyword);
                return GET(api);
            },
            SearchByStatus: function SearchByStatus(_ref10) {
                var role = _ref10.role, uid = _ref10.uid, status = _ref10.status, startIndex = _ref10.startIndex, endIndex = _ref10.endIndex;
                var api = root + ('/api/purchaserequisition/search(' + role + ',' + uid + ',' + status + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            SearchByKeywordAndStatus: function SearchByKeywordAndStatus(_ref11) {
                var role = _ref11.role, uid = _ref11.uid, status = _ref11.status, keyword = _ref11.keyword, startIndex = _ref11.startIndex, endIndex = _ref11.endIndex;
                var api = root + ('/api/purchaserequisition/search(' + role + ',' + uid + ',' + status + ',' + keyword + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/purchaserequisition/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref12) {
                var startIndex = _ref12.startIndex, endIndex = _ref12.endIndex;
                var startIndex = startIndex;
                var endIndex = endIndex;
                var api = root + ('/api/purchaserequisition/paging(' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            Approve: function Approve(prid) {
                //TODO
                var pr = this.Get(prid);    // pr["_"]
            },
            Reject: function Reject(prid) {
            },
            Draft: function Draft(data) {
                //POST
                var api = root + '/api/purchaserequisition/draft';
                return POST(api, data);
            },
            Submit: function Submit(data) {
                //POST
                var api = root + '/api/purchaserequisition/submit';
                return POST(api, data);
            },
            Finish: function Finish() {
            },
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
                var api = root + ('/api/purchaserequisition/' + prid + '/SupplierComplete');
                // result = PUT(api)
                //   } else {
                //     throw `Permission Denied`
                //   }
                // }
                return PUT(api);
            }
        },
        PRSupplierView: {
            Count: function Count(completed) {
                var api = root + ('/api/PRSupplierView/count?completed=' + completed);
                return GET(api);
            },
            Search: function Search(_ref13) {
                var isCompeleted = _ref13.isCompeleted, keyword = _ref13.keyword, startIndex = _ref13.startIndex, endIndex = _ref13.endIndex;
                var api = root + ('/api/PRSupplierView/search(' + isCompeleted + ',' + keyword + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            Paging: function Paging(_ref14) {
                var isCompeleted = _ref14.isCompeleted, startIndex = _ref14.startIndex, endIndex = _ref14.endIndex;
                var api = root + ('/api/PRSupplierView/search(' + isCompeleted + ',' + startIndex + ',' + endIndex + ')');
                return GET(api);
            }
        },
        supplier: {
            Get: function Get(id) {
                var api = root + ('/api/supplier/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/supplier/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/supplier/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/supplier/' + id + '/softdelete');
                return PUT(api, data);
            },
            Count: function Count() {
                var api = root + '/api/supplier/count';
                return GET(api);
            },
            Search: function Search(_ref15) {
                var keyword = _ref15.keyword;
                var api = root + ('/api/supplier/search?keyWord=' + keyword);
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/supplier/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref16) {
                var startIndex = _ref16.startIndex, endIndex = _ref16.endIndex;
                var api = root + ('/api/supplier/paging(' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            Login: function Login(username, password) {
                var api = root + ('/api/supplier/login?username=' + username + '&password=' + password);
                return PUT(api);
            }
        },
        systemsetting: {
            Get: function Get(id) {
                var api = root + ('/api/systemsetting/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/systemsetting/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/systemsetting/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/systemsetting/' + id);
                return DETELE(api);
            },
            Count: function Count() {
                var api = root + '/api/systemsetting/count';
                return GET(api);
            },
            Search: function Search(_ref17) {
                var keyword = _ref17.keyword;
                var api = root + ('/api/systemsetting/search?keyWord=' + keyword);
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/systemsetting/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref18) {
                var startIndex = _ref18.startIndex, endIndex = _ref18.endIndex;
                var api = root + ('/api/systemsetting/paging(' + startIndex + ',' + endIndex + ')');
                return GET(api);
            }
        },
        systemuser: {
            Get: function Get(id) {
                var api = root + ('/api/systemuser/' + id);
                return GET(api);
            },
            Add: function Add(data) {
                //POST
                var api = root + '/api/systemuser/new';
                return POST(api, data);
            },
            Edit: function Edit(id, data) {
                //PUT
                var api = root + ('/api/systemuser/' + id + '/update');
                return PUT(api, data);
            },
            Delete: function Delete(id, data) {
                //PUT
                var api = root + ('/api/systemuser/' + id + '/softdelete');
                return PUT(api, data);
            },
            Count: function Count() {
                var api = root + '/api/systemuser/count';
                return GET(api);
            },
            Search: function Search(_ref19) {
                var keyword = _ref19.keyword;
                var api = root + ('/api/systemuser/search?keyWord=' + keyword);
                return GET(api);
            },
            Top: function Top(topcount) {
                var api = root + ('/api/systemuser/top(' + topcount + ')');
                return GET(api);
            },
            Paging: function Paging(_ref20) {
                var startIndex = _ref20.startIndex, endIndex = _ref20.endIndex;
                var api = root + ('/api/systemuser/paging(' + startIndex + ',' + endIndex + ')');
                return GET(api);
            },
            Login: function Login(username, password) {
                var api = root + ('/api/systemuser/login?username=' + username + '&password=' + password);
                return PUT(api);
            }
        },
        employee: {
            Login: function Login(username, password) {
                var api = root + ('/api/employee/login(' + username + ',' + password + ')');
                return GET(api);
            },
            Search: function Search(_ref21) {
                var keyword = _ref21.keyword;
                var accountName = keyword;
                var api = root + ('/api/employee/search(' + accountName + ')');
                return GET(api);
            }
        },
        PRApproverView: {
            Count: function Count(account, status) {
                var api = root + ('/api/PRApproverView/count?account=' + account + '&status=' + status);
                return GET(api);
            },
            Paging: function Paging(_ref22) {
                var account = _ref22.account, completed = _ref22.completed, startIndex = _ref22.startIndex, endIndex = _ref22.endIndex;
                var api = root + ('/api/PRApproverView/paging(' + account + ',' + completed + ',' + startIndex + ',' + endIndex);
                return GET(api);
            }
        }
    };