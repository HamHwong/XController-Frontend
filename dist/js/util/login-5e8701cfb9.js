"use strict";

var e = function e(elem) {
  return document.querySelector(elem);
};
var log = function log(e) {
  return console.log.bind(console)(e);
};

// $(function() {
//   var slider = new SliderUnlock("#slider", {
//     labelTip: "滑动验证",
//     successLabelTip: "验证成功"
//   }, function() {
//     login()
//   }, function() {});
//   slider.init();
// })

function formToSet(form) {
  form = $(form);
  var formArr = form.serializeArray();
  var set = {};
  for (var i = 0; i < formArr.length; i++) {
    var record = formArr[i];
    var key = record["name"];
    var value = record["value"];
    set[key] = value;
  }
  return set;
}

function login() {
  var root = "";
  var set = formToSet("#login_form");
  var username = set["username"];
  var password = set["password"];

  switch (window.role) {
    case 'admin':
    case 'Admin':
      var user = apiConfig.systemuser.Login(username, password);
      if (user) {
        //BUG
        window.location.href = "./admin-home.html";
        setCookie("auth", "Admin");
        setCookie("name", user["_accountname"]);
        setCookie("account", user["_accountname"]);
        setCookie("uid", user["_id"]);
        setCookie("user", JSON.stringify(user));
      }
      break;
    case 'dealer':
    case 'Dealer':
      var user = apiConfig.dealer.Login(username, password);
      if (user) {
        window.location.href = "./dealer-home.html";
        setCookie("auth", "Dealer");
        setCookie("name", user["_accountname"]);
        setCookie("account", user["_accountname"]);
        setCookie("uid", user["_id"]);
        setCookie("user", JSON.stringify(user));
      }
      break;
    case 'supplier':
    case 'Supplier':
      var user = apiConfig.supplier.Login(username, password);
      if (user) {
        window.location.href = "./supplier-home.html";
        setCookie("auth", "Supplier");
        setCookie("name", user["_accountname"]);
        setCookie("account", user["_accountname"]);
        setCookie("uid", user["_id"]);
        setCookie("user", JSON.stringify(user));
      }
      break;
    case 'zeiss':
    case 'Zeiss':
      var user = apiConfig.employee.Login(username, password);
      console.log(user);
      // if ("zeiss" == username.toLowerCase()) {
      if (user) {
        window.location.href = "./zeiss-home.html";
        /**
         *   "statusField": 0,
              "nameField": "string",
              "eNNameField": "string",
              "mobileField": "string",
              "emailField": "string",
              "accountField": "string"
         */
        setCookie("auth", "Zeiss");
        setCookie("name", user["nameField"]);
        setCookie("account", user["accountField"]);
        // setCookie("name", "BLManager")
        // var user = {
        //   "_id":"BLManager"
        // }
        setCookie("user", JSON.stringify(user));
      }
      break;
  }
  return false;
}
$("#role").on('change', function (e) {
  window.role = $("#role").val();
});
window.role = $("#role").val();

$("#login_form").on("keydown", function (e) {
  if (e.which === 13) {
    console.log("Enter");
    e.preventDefault();
    login();
  }
});