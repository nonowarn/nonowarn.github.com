jQuery(function($) {
  var BaseSlot = {
    3: "06:20～10:00",
    4: "09:20～13:00",
    5: "12:20～16:00",
    1: "15:20～19:00",
    2: "18:20～22:00"
  },
      Slot = BaseSlot;
      itemsPerPage = 20;

  var Timings = flatten(AllTimings),
      DateFormat = "yy/mm/dd";

  var $timingTable = $("table#timings tbody"),
      timingTableDom = $timingTable.get(0),
      $search = $("#search").submit(filterRow),
      $pagination = $("#pagination"),
      $date = $("#date");

  var found = Timings;

  function init() {
    initSlot();
    initPagination();
    initDatepicker();
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

  function initDatepicker() {
    $date
      .datepicker()
      .val($.datepicker.formatDate(DateFormat, new Date))
      .change(updateGroup);
  }

  function initSlot() {
    Slot = slotAt(new Date);
    console.log(Slot);
  }

  function slotAt(date) {
    var baseDate = $.datepicker.parseDate(DateFormat, "2011/03/15"),
        difference = dateDiff(date, baseDate),
        numGroup = 5,
        newSlot = {};

    for (var i in BaseSlot) {
      var newI = (Number(i) + difference) % numGroup || 5;
      newSlot[newI] = BaseSlot[i];
    }

    return newSlot;
  }

  function updateGroup() {
    var $this = $(this),
        thisDate = $.datepicker.parseDate(DateFormat, $this.val());
    console.log(Slot)
    Slot = slotAt(thisDate);
    initPagination();
  }


  function dateDiff(lhs, rhs) {
    return Math.floor((lhs.getTime() - rhs.getTime()) / (1000*60*60*24));
  }
  function flatten(timings) {
    var r = [];

    for (var pref in timings) {
      for (var city in timings[pref]) {
        for (var town in timings[pref][city]) {
          var groups = timings[pref][city][town];
          r.push({town: pref + city + town, groups: groups});
        }
      }
    }

    return r;
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
