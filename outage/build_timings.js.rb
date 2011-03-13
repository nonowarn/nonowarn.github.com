require 'json'

timings = {}

IO.readlines("timings.csv").each do |line|
  pref, city, town, zone = line.chomp.split(/,/)
  timings[pref] ||= {}
  timings[pref][city] ||= {}
  timings[pref][city][town] = zone
end

print "var Timings = "
puts timings.to_json
