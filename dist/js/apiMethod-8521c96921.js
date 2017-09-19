function GET(url) {
  return $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    async: false
  }).responseJSON
} //query
function PUT(url, data) {
  return $.ajax({
    url: url,
    type: "PUT",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: data,
    async: false
  }).responseJSON
} //update
function POST(url, data) {
  return $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: data,
    async: false
  }).responseJSON
} // new
function DELETE(url) {
  return $.ajax({
    url: url,
    type: "DELETE",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    async: false
  }).responseJSON
} //delete

function LOGIN(url, data) {
  url += "?username=" + set["username"] + "&password=" + set["password"]
  return $.ajax({
    url: url,
    type: "PUT",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    async: false
  }).responseJSON
}
