const Enum = {
  role: {
    /// ZEISS员工
    EMPLOYEE: "EMPLOYEE",
    /// 代理商
    DEALERL: "DEALERL",
    /// 供应商
    SUPPLIER: "SUPPLIER",
    /// 系统管理员
    SYSADMIN: "SYSADMIN"
  },
  prstatus: {
    /// 草稿状态
    Draft: "Draft",
    /// 申请中
    Progress: "Progress",
    /// 结束状态：已通过审核
    Approved: "Approved",
    /// 结束状态：审核已拒绝
    Rejected: "Rejected",
    /// 已交付状态
    Delivered: "Delivered"
  },
  processStatus: {
    /// 提交进入流程状态
    Submitted: "Submitted",
    /// 等待直线经理审批状态
    LineManagerApproval: "LineManagerApproval",
    /// 等待BU经理审批状态
    BUManagerApproval: "BUManagerApproval",
    /// 等待市场经理审批
    MarketingManagerApproval: "MarketingManagerApproval",
    /// 等待市场总监审批
    MarketingDirectorApproval: "MarketingDirectorApproval",
    /// 被通知人
    NotifiedParty: "NotifiedParty",
    /// 等待供应商更新物流信息
    SupplierUpdate: "SupplierUpdate",
    /// 完成
    End: "End"
  },
  enumApprovalResult: {
    /// <summary>
    /// 未操作
    /// </summary>
    NoAction:"NoAction",
    /// <summary>
    /// 审批通过
    /// </summary>
    Success:"Success",
    /// <summary>
    /// 审批拒绝
    /// </summary>
    Rejected:"Rejected"

  },
  operation: {
    Create: "Create",
    Update: "Update",
    Read: "Read",
    Delete: "Delete",
    Copy: "Copy"
  }
}
