function getProcessChartTo(PRid, target) {
  var steps = apiConfig.prprocess.Search({
    keyword: PRid
  })
  target = $(target)
  for (var i = 0; i < steps.length; i++) {
    var result = steps[i]["_result"]
    var time = steps[i]["_lastmodified"]
    // var tasktitle = steps[i]["_tasktitle"]
    var result = steps[i]["_result"]
    var taskowner = steps[i]["_taskowner"]
    var taskownername = steps[i]["_taskOwnerName"]
    var comment = steps[i]["_comments"]
    var prprocessstep = steps[i]["_prprocessstep"]
    var mod = `<li class="glyphicon"><a title="${comment}">${prprocessstep}</a><span class="small">${taskownername}<span><span class="operationtime">${time}</span></li>`
    var $mod = $(mod)
    $mod.css("width", (100 / steps.length) + '%')

    if (result == Enum.enumApprovalResult.NoAction) {
      $mod.addClass('noAction')
    } else if (result == Enum.enumApprovalResult.Ready) {
      $mod.addClass('processing')
    } else if (result == Enum.enumApprovalResult.Success || result == Enum.enumApprovalResult.Approved) {
      $mod.addClass('approved')
    } else if (result == Enum.enumApprovalResult.Rejected || result == Enum.enumApprovalResult.Failure) {
      $mod.addClass('rejected')
    }

    if (prprocessstep == Enum.processStatus.NotifiedParty) {
      $mod.addClass('infomation')
    }
    $(target).append($mod)
  }
}

function clearProcessChart() {
  $(".progressbar").empty()
}
