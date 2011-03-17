jQuery(function($) {
  var ItemsPerPage = 20,
      DateFormat = "yy/mm/dd",
      BaseSlot = {
        3: "06:20～10:00",
        4: "09:20～13:00",
        5: "12:20～16:00",
        1: "15:20～19:00",
        2: "18:20～22:00"
      },
      BasePeekSlot = {
        3: "13:50〜17:30",
        4: "16:50〜20:30",
        5: null,
        1: null,
        2: null
      },
      NumGroup = 5,
      BaseDate = $.datepicker.parseDate(DateFormat, "2011/03/15");

  var currentTimings = flatten(AllTimings),
      currentSlot = BaseSlot,
      currentPeekSlot = BasePeekSlot;

  var $timingTable = $("table#timings tbody"),
      timingTableDom = $timingTable.get(0),
      $search = $("#search").submit(filterRow),
      $pagination = $("#pagination"),
      $date = $("#date");

  var found = currentTimings;

  function init() {
    initSlot();
    initPagination();
    initDatepicker();
  }

  function initPagination() {
    refreshPage();
  }

  function initDatepicker() {
    $date
      .datepicker()
      .val($.datepicker.formatDate(DateFormat, new Date))
      .change(updateGroup);
  }

  function initSlot() {
    var today = new Date;
    updateSlot(today);
  }

  function refreshPage() {
    $pagination.pagination(found.length, {
      items_per_page: ItemsPerPage,
      callback: updateTimings,
      num_display_entries: 0,
      next_text: "結果の続きを見る",
      prev_text: "さっきの結果に戻る"
    });
    $("#pagination").trigger('setPage', [0]);
  }

  function updateTimings(pageNumber) {
    var itemsHtml = "";
    $timingTable.find("tr.timing").remove();
    for (var i = pageNumber * ItemsPerPage, l = i + ItemsPerPage; i < l; ++i) {
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
      + '</td><td>'
      + timing.groups.map(peekTimeString).filter(notNull).join(",")
      + '</td></tr>';
  }

  function timeString(group) {
    return currentSlot[group];
  }

  function peekTimeString(group) {
    return currentPeekSlot[group];
  }

  function notNull(obj) {
    return null !== obj
  }

  function updateSlot(date) {
    currentSlot = slotAt(BaseSlot, date);
    currentPeekSlot = slotAt(BasePeekSlot, date);
  }

  function updateGroup() {
    var $this = $(this),
        thisDate = $.datepicker.parseDate(DateFormat, $this.val());
    updateSlot(thisDate);
    refreshPage();
  }

  function slotAt(base, date) {
    var difference = dateDiff(date, BaseDate),
        newSlot = {};

    for (var i in base) {
      var newI = (Number(i) + difference) % NumGroup || 5;
      newSlot[newI] = base[i];
    }

    return newSlot;
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

  function updateFoundItem(query) {
    found = currentTimings.filter(townLike(query));
  }

  function filterRow() {
    var query = $(this).serializeArray()[0].value.replace(/\s+/, "");
    updateFoundItem(query);
    refreshPage();
    return false;
  }

  function townLike(query) {
    return function(timing) {
      return timing.town.indexOf(query) !== -1;
    }
  }

  init();
});
