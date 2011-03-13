jQuery(function($) {
  var Slot = {
    1: "06:20～10:00, 16:50～20:30",
    2: "09:20～13:00, 18:20～22:00",
    3: "12:20～16:00",
    4: "13:50～17:30",
    5: "15:20～19:00"
  };

  var $prefs = $("#prefs"),
      $cities = $("#cities"),
      $result = $("#result");

  var $prefSelector = $("#prefs .selection").delegate('a', 'click', showCities),
      $citySelector = $("#cities .selection").delegate('a', 'click', showResult),
      $selectedArea = $("#selected_area"),
      $group = $("#group"),
      $slot = $("#slot");

  var timingsInPref, selectedArea;

  for (var pref in Timings) {
    $prefSelector.append("<li><a href='javascript:void(0);'>" + pref + "</a></li>");
  }

  function init() {
    timingsInPref = {};
    selectedArea = "";
    $prefs.show(); $cities.hide(); $result.hide();
  }

  function showCities() {
    var pref = $(this).text();

    timingsInPref = Timings[pref];
    selectedArea = pref;
    $citySelector.find("li").remove();
    for (var city in timingsInPref) {
      $citySelector.append("<li><a href='javascript:void(0)'>" + city + "</a></li>");
    }
    $prefs.hide(); $cities.show(); $result.hide();
  }

  function showResult() {
    var city = $(this).text();
        group = timingsInPref[city];
    selectedArea += city;
    $selectedArea.text(selectedArea);
    $group.text(group);
    $slot.text(Slot[group]);
    $prefs.hide(); $cities.hide(); $result.show();
  }

  init();
});
