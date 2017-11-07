const table_buttonPool = {
  pool: {
    editBtn: "<button type='button' name='button' class='btn btn-primary edit' onclick='edit(${PrimaryKey})'>编辑</button>",
    PIEditBtn: "<button type='button' name='button' class='btn btn-primary edit' onclick='PurchaseItem.view.edit(${PrimaryKey})'>编辑</button>",
    submitBtn: "<button type='button' name='button' class='btn btn-primary submit' onclick='submit(${PrimaryKey})'>提交</button>",
    deleteBtn: "<button type='button' name='button' class='btn btn-danger del' onclick='Delete(${PrimaryKey})'>删除</button>",
    PIdeleteBtn: "<button type='button' name='button' class='btn btn-danger del' onclick='PurchaseItem.event.delete(${PrimaryKey})'>删除</button>",
    updateBtn: "<button type='button' name='button' class='btn btn-primary update' onclick='update(${PrimaryKey})'>更新</button>",
    supplyBtn: "<button type='button' name='button' class='btn btn-success supply' onclick='supply(${PrimaryKey})'>入库</button>",
    approveBtn: "<button type='button' name='button' class='btn btn-primary approve' onclick='approve(${PrimaryKey})'>通过</button>",
    rejectBtn: "<button type='button' name='button' class='btn btn-danger reject' onclick='reject(${PrimaryKey})'>拒绝</button>",
    expressUpdateBtn: "<button type='button' name='button' class='btn btn-success expressUpdate' onclick='SupplierPRDetail.view.update(${PrimaryKey})'>更新物流</button>",
    expressViewBtn: "<button type='button' name='button' class='btn btn-success expressView' onclick='expressStatus(${PrimaryKey})'>物流状态</button>",
    finishedBtn: "<button type='button' name='button' class='btn btn-primary finish' onclick='finish(${PrimaryKey})'>完成订单</button>",
    historyBtn: "<button type='button' name='button' class='btn btn-success history' onclick='History(${PrimaryKey})'>历史纪录</button>",
    copyBtn: "<button type='button' name='button' class='btn btn-primary copy' onclick='copy(${PrimaryKey})'>复制</button>",
    deleteDraftBtn: "<button type='button' name='button' class='btn btn-danger del' onclick='deleteDraft(${PrimaryKey})'>删除</button>"
  },
  genetrate(PrimaryKey, btnName) {
    var btnString = table_buttonPool.pool[btnName].replace("${PrimaryKey}","\""+PrimaryKey+"\"")
    return eval($(btnString))
  }
}
