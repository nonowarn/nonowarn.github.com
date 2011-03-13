require 'json'

timings = {}

IO.readlines("timings.txt").each do |line|
  pref, city, zone = line.chomp.split(/,/)
  timings[pref] ||= {}
  timings[pref][city] = zone
end

print "var Timings = "
puts timings.to_json
