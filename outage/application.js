jQuery(function($) {
  var Slot = {
    1: "06:20～10:00, 16:50～20:30",
    2: "09:20～13:00, 18:20～22:00",
    3: "12:20～16:00",
    4: "13:50～17:30",
    5: "15:20～19:00"
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
      + Slot[timing.group]
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
    var query = $(this).serializeArray()[0].value;
    found = Timings.filter(townLike(query));
    initPagination();
    return false;
  }

  function townLike(query) {
    return function(timing) {
      return timing.town.indexOf(query) !== -1;
    }
  }

  init();
});
