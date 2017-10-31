'use strict';
function Adapter(data, orderArray) {
    //HACK 将后台数据转化到前台table结构 -- 最好之后统一数据结构！
    //orderArray 显示的属性和顺序
    var order = orderArray;
    if (!orderArray) {
        //若没有orderArray，则将所有的数据都显示出来
        order = [];
        for (var key in data[0]) {
            order.push(key);    // console.log(i); 
        }
    }
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var row = [];
        for (var j = 0; j < order.length; j++) {
            row.push(data[i][order[j]]);
        }
        result.push(row);
    }
    return result;
}