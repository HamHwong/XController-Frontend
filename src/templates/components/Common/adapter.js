function Adapter(data, orderArray) {
  //HACK 将后台数据转化到前台table结构 -- 最好之后统一数据结构！
  //orderArray 数组来表示展现的顺序和变量
  if (!orderArray) {
    orderArray = []
    for (var i in data[0]) {
      orderArray.push(i)
    }
  }
  var result = []
  for (var i = 0; i < data.length; i++) {
    var row = []
    for (var j = 0; j < orderArray.length; j++) {
      row.push(data[i][orderArray[j]])
    }
    result.push(row)
  }
  return result
}

function Mapper(dataSet) {
  //HACK GET方式获得单个数据的response结构不一样，需要修改结构
  //HACK 全小写，前面加下划线
}
