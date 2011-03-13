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
      $towns = $("#towns"),
      $result = $("#result");

  var $prefSelector = makeSelector($("#prefs .selection"), showCities),
      $citySelector = makeSelector($("#cities .selection"), showTowns),
      $townSelector = makeSelector($("#towns .selection"), showResult),
      $selectedArea = $("#selected_area"),
      $group = $("#group"),
      $slot = $("#slot");

  function init() {
    showPrefs();
  }

  function makeSelector($container, cb) {
    return $container.delegate('a', 'click', cb);
  }

  function showPrefs() {
    timings = Timings;
    selectedArea = "";

    for (var pref in timings) {
      $prefSelector.append("<li><a href='javascript:void(0);'>" + pref + "</a></li>");
    }

    $prefs.show(); $towns.hide(); $cities.hide(); $result.hide();
  }

  function showCities() {
    var pref = $(this).text();

    timings = timings[pref];
    selectedArea = pref;
    $citySelector.find("li").remove();
    for (var city in timings) {
      $citySelector.append("<li><a href='javascript:void(0)'>" + city + "</a></li>");
    }
    $prefs.hide(); $towns.hide(); $cities.show(); $result.hide();
  }

  function showTowns() {
    var city = $(this).text();

    timings = timings[city];
    selectedArea += city;
    $townSelector.find("li").remove();
    for (var town in timings) {
      $townSelector.append("<li><a href='javascript:void(0)'>" + town + "</a></li>");
    }
    $prefs.hide(); $towns.show(); $cities.hide(); $result.hide();
  }

  function showResult() {
    var town = $(this).text();
        group = timings[town];
    selectedArea += town;
    $selectedArea.text(selectedArea);
    $group.text(group);
    $slot.text(Slot[group]);
    $prefs.hide(); $towns.hide(); $cities.hide(); $result.show();
  }

  init();
});
