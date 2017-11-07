'use strict';
var tableStructures = {
        Admin: {
            Bruchure: {
                History: {
                    'tablename': 'History',
                    'hasHeader': true,
                    'hasButton': false,
                    'keyArr': ["id", "key", "key", "prop", "prop", "prop"],
                    'viewOrder': ["_id", "_direction", "_quantity", "_operator", "_created"],
                    'data': [["序列", "操作", "物品数量", "操作人", "操作时间"]]
                },
                Inventory: {
                    'tablename': 'Inventory',
                    'hasHeader': true,
                    'hasButton': true,
                    'buttonPool': ["supplyBtn", "historyBtn", "editBtn", "deleteBtn"],
                    'keyArr': ["id", "key", "key", "prop", "prop"],
                    'viewOrder': ["_id", "_brochurenumber", "_brochurename", "_quantity", "_description"],
                    'data': [["序列", "版本号", "物品名称", "物品数量", "描述"]]
                }
            },
            OrderAdmin: {
                Order: {
                    'tablename': 'order',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': false,
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_processstatus"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "当前审批人"]]
                },
                Reject: {
                    'tablename': 'reject',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': true,
                    'buttonPool': ["copyBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_processstatus"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"]]
                },
                Success: {
                    'tablename': 'success',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': true,
                    'buttonPool': ["copyBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_processstatus"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"]]
                }
            },
            DealerAdmin: {
                Dealer: {
                    'tablename': 'dealer',
                    'hasHeader': true,
                    'hasButton': true,
                    'buttonPool': ["editBtn", "deleteBtn"],
                    'viewOrder': ["_id", "_dealercode", "_dealername", "_dealerregion", "_dealerproduct", "_phonenumber", "_email", "_accountname", "_password"],
                    'keyArr': ["id", "key", "key", "prop", "prop", "prop", "prop", "key", "prop"],
                    'data': [["序列", "代理商编码", "代理商名称", "区域", "代理产品", "手机号", "邮箱", "账号", "密码"]]
                }
            },
            SupplierAdmin: {
                Supplier: {
                    'tablename': 'supplier',
                    'hasHeader': true,
                    'hasButton': true,
                    'buttonPool': ["editBtn", "deleteBtn"],
                    'keyArr': ["id", "key", "key", "prop", "prop", "prop"],
                    'viewOrder': ["_id", "_suppliercode", "_suppliername", "_phonenumber", "_accountname", "_password"],
                    'data': [["序列", "供应商编码", "名称", "手机号", "账号", "密码"]]
                }
            },
            SystemAdmin: {
                SystemUser: {
                    'tablename': 'SystemUser',
                    'hasHeader': true,
                    'hasButton': true,
                    'buttonPool': ["editBtn", "deleteBtn"],
                    'viewOrder': ["_id", "_accountname", "_password", "_email"],
                    'keyArr': ["id", "key", "prop", "prop"],
                    'data': [["序列", "账号", "密码", "邮箱"]]
                }
            },
            Dictionary: {
                'tablename': 'Dictionary',
                'hasHeader': true,
                'hasButton': true,
                'buttonPool': ["editBtn", "deleteBtn"],
                'viewOrder': ["_id", "_optionname", "_optionvalue", "_sequence", "_description", "_category"],
                'keyArr': ["id", "key", "prop", "prop", "prop", "prop"],
                'data': [["ID", "选项名", "选项值", "排序值", "描述", "分类"]]
            }
        },
        Dealer: {
            MyOrder: {
                Draft: {
                    'tablename': 'draft',
                    'hasHeader': true,
                    'hasDetail': false,
                    'hasButton': true,
                    'buttonPool': ["copyBtn", "editBtn", "deleteDraftBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_prcreated"],
                    'keyArr': ["id", "prop", "key", "prop"],
                    'data': [["序列", "草稿号", "用途", "保存时间"]]
                },
                PurchaseRequisitionItemTable: {
                    'tablename': 'PurchaseRequisitionItemTable',
                    'hasHeader': true,
                    'hasButton': true,
                    'hasDetail': false,
                    'buttonPool': ["PIEditBtn", "PIdeleteBtn"],
                    'viewOrder': ["_id", "_brochurename", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"],
                    'keyArr': ["id", "key", "prop", "key", "prop", "prop", "prop"],
                    'data': [["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"]]
                },
                Approving: {
                    'tablename': 'approving',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': false,
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_prcreated"],
                    'keyArr': ["id", "prop", "key", "prop"],
                    'data': [["序列", "订单号", "用途", "提交时间"]]
                },
                Rejected: {
                    'tablename': 'rejected',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': true,
                    'buttonPool': ["copyBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"]]
                },
                Success: {
                    'tablename': 'success',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': true,
                    'buttonPool': ["copyBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"]]
                },
                orderDetail: {
                    'name': 'orderDetail',
                    'hasHeader': true,
                    'hasButton': false,
                    'viewOrder': ["_id", "_brochurename", "_quantity", "_consignee", "_contactnumber", "_deliverydate", "_deliveryaddress", "_deliverypriorityfk", "_logistics"],
                    'keyArr': ["id", "key", "prop", "prop", "prop", "prop", "prop", "prop", "key"],
                    // "buttonPool": ["expressViewBtn"],
                    'data': [["序列", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址", "紧急程度", "物流信息"]]
                }
            }
        },
        Supplier: {
            MyOrder: {
                Approving: {
                    'tablename': 'approving',
                    'hasHeader': true,
                    'hasDetail': false,
                    'hasButton': true,
                    'buttonPool': ["expressUpdateBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purpose", "_requestor", "_phonenumber"],
                    'keyArr': ["id", "prop", "key", "prop", "hide"],
                    'data': [["序列", "订单号", "用途", "申请人", "联系电话"]]
                },
                Success: {
                    'tablename': 'success',
                    'hasHeader': true,
                    'hasDetail': false,
                    'hasButton': false,
                    'viewOrder': ["_id", "_prnumber", "_purpose", "_requestor", "_prCompleted"],
                    'keyArr': ["id", "prop", "key", "prop",, "prop"],
                    'data': [["序列", "订单号", "用途", "申请人", "结束时间"]]
                },
                ExpressUpdateDetail: {
                    'name': 'expressupdatedetail',
                    'hasHeader': true,
                    'hasButton': true,
                    'hasDetail': false,
                    'viewOrder': ["_id", "_brochurename", "_quantity", "_logistics", "_deliverydate"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'buttonPool': ["updateBtn"],
                    'data': [["序列", "物品名字", "物品数量", "物流信息", "交付时间"]]
                }
            },
            Brochure: {
                'tablename': 'Inventory',
                'hasHeader': true,
                'hasDetail': true,
                'hasButton': true,
                'buttonPool': ["supplyBtn"],
                'viewOrder': ["_id", "_brochurecode", "_brochurename", "_quantity"],
                'keyArr': ["id", "prop", "key", "prop"],
                'data': [["序列", "物品编号", "物品名称", "物品数量"]]
            }
        },
        Employee: {
            MyOrder: {
                Draft: {
                    'tablename': 'draft',
                    'hasHeader': true,
                    'hasDetail': false,
                    'hasButton': true,
                    'buttonPool': ["copyBtn", "editBtn", "deleteDraftBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_prcreated"],
                    'keyArr': ["id", "prop", "key", "prop"],
                    'data': [["序列", "草稿号", "用途", "保存时间"]]
                },
                PurchaseRequisitionItemTable: {
                    'tablename': 'PurchaseRequisitionItemTable',
                    'hasHeader': true,
                    'hasButton': true,
                    'hasDetail': false,
                    'buttonPool': ["PIEditBtn", "PIdeleteBtn"],
                    'viewOrder': ["_id", "_brochurename", "_deliverydate", "_quantity", "_consignee", "_contactnumber", "_deliveryaddress"],
                    'keyArr': ["id", "key", "prop", "key", "prop", "prop", "prop"],
                    'data': [["编号", "申请种类", "交付时间", "申请数量", "收货人", "收货电话", "收货地址"]]
                },
                Approving: {
                    'tablename': 'approving',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': false,
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_prcreated"],
                    'keyArr': ["id", "prop", "key", "prop"],
                    'data': [["序列", "订单号", "用途", "提交时间"]]
                },
                Rejected: {
                    'tablename': 'rejected',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': true,
                    'buttonPool': ["copyBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"]]
                },
                Success: {
                    'tablename': 'success',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': true,
                    'buttonPool': ["copyBtn"],
                    'viewOrder': ["_id", "_prnumber", "_purposefk", "_requestorfk", "_prcreated", "_prcompleted"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"]]
                },
                orderDetail: {
                    'name': 'orderDetail',
                    'hasHeader': true,
                    'hasButton': false,
                    'viewOrder': ["_id", "_brochurename", "_quantity", "_consignee", "_contactnumber", "_deliverydate", "_deliveryaddress", "_deliverypriorityfk", "_logistics"],
                    'keyArr': ["id", "key", "prop", "prop", "prop", "prop", "prop", "prop", "key"],
                    // "buttonPool": ["expressViewBtn"],
                    'data': [["序列", "申请种类", "申请数量", "收货人", "收货电话", "交付时间", "收货地址", "紧急程度", "物流信息"]]
                }
            },
            Approval: {
                Applying: {
                    'tablename': 'order',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': false,
                    'viewOrder': ["_id", "_prnumber", "_purpose", "_submitter", "_prcreated"],
                    'keyArr': ["id", "prop", "key", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间"]]
                },
                Success: {
                    'tablename': 'success',
                    'hasHeader': true,
                    'hasDetail': true,
                    'hasButton': false,
                    'viewOrder': ["_id", "_prnumber", "_purpose", "_submitter", "_prcreated", "_prcompleted"],
                    'keyArr': ["id", "prop", "key", "prop", "prop", "prop"],
                    'data': [["序列", "订单号", "用途", "提交人", "提交时间", "结束时间"]]
                }
            }
        }
    };