//PUT GET PUT DELETE

function POST(url, data) {
  var data = JSON.stringify(data)
  var c = $.ajax({
    "url": url,
    "contentType": "application/json; charset=utf-8",
    "type": "POST",
    "data": data,
    "dataType": "json",
    "async": false
  })
  return c.responseJSON

} //增
function DELETE(url) {

} //删
function PUT(url, data) {
  var data = JSON.stringify(data)
  var c = $.ajax({
    "url": url,
    "contentType": "application/json; charset=utf-8",
    "type": "PUT",
    "data": data,
    "dataType": "json",
    "async": false
  })
  return c.responseJSON
} //改
function GET(url) {
  var c = $.ajax({
    "url": url,
    "contentType": "application/json; charset=utf-8",
    "type": "GET",
    "dataType": "json",
    "async": false
  })
  return c.responseJSON
} //查
