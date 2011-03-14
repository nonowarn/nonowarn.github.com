jQuery(function($) {
  var Slot = {
    1: "06:20～10:00, 16:50～20:30",
    2: "09:20～13:00, 18:20～22:00",
    3: "12:20～16:00",
    4: "13:50～17:30",
    5: "15:20～19:00"
  };

  var $timingTable = $("#timings"),
      timingTableDom = $timingTable.get(0),
      $search = $("#search").submit(filterRow);

  function init() {
    buildTable();
  }

  function buildTable() {
    setTimeout(function() {
      timingTableDom.innerHTML += TimingTableHTML;
    }, 0);
  }

  function filterRow() {
    var query = $(this).serializeArray()[0].value,
        $timingTableRows = $timingTable.find("tr:has(td)");
    $timingTableRows.each(function() {
      var $this = $(this);
      if ($this.find("td:first").text().indexOf(query) == -1) {
        this.className = "hidden";
      } else {
        this.className = "show";
      }
    });
    return false;
  }

  init();
});
