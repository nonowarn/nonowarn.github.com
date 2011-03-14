jQuery(function($) {
  var Slot = {
    3: "06:20～10:00",
    4: "09:20～13:00",
    5: "12:20～16:00",
    1: "15:20～17:30",
    2: "18:20～22:00"
  },
      itemsPerPage = 20;

  var found = Timings;

  var $timingTable = $("table#timings tbody"),
      timingTableDom = $timingTable.get(0),
      $search = $("#search").submit(filterRow),
      $pagination = $("#pagination")

  function init() {
    initPagination();
  }

  function updateTimings(pageNumber) {
    var itemsHtml = "";
    $timingTable.find("tr.timing").remove();
    for (var i = pageNumber * itemsPerPage, l = i + itemsPerPage; i < l; ++i) {
      if (found[i]) {
        itemsHtml += createRow(found[i]);
      }
    }
    timingTableDom.innerHTML += itemsHtml;
  }

  function createRow(timing) {
    return '<tr class="timing"><td>'
      + timing.town
      + '</td><td>'
      + timing.groups.map(timeString).join(",")
      + '</td></tr>';
  }

  function initPagination() {
    $pagination.pagination(found.length, {
      items_per_page: itemsPerPage,
      callback: updateTimings,
      num_display_entries: 0,
      next_text: "結果の続きを見る",
      prev_text: "さっきの結果に戻る"
    });
    $("#pagination").trigger('setPage', [0]);
  }

  function filterRow() {
    var query = $(this).serializeArray()[0].value.replace(/\s+/, "");
    found = Timings.filter(townLike(query));
    initPagination();
    return false;
  }

  function townLike(query) {
    return function(timing) {
      return timing.town.indexOf(query) !== -1;
    }
  }

  function timeString(group) {
    return Slot[group];
  }

  init();
});
