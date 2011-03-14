# -*- coding: utf-8 -*-
require 'json'

slot = [
  nil,
  "06:20～10:00, 16:50～20:30",
  "09:20～13:00, 18:20～22:00",
  "12:20～16:00",
  "13:50～17:30",
  "15:20～19:00"
]
timings = {}

IO.readlines("timings.csv").each do |line|
  pref, city, town, zone = line.chomp.split(/,/)
  timings[pref + city + town] ||= slot[zone.to_i]
end

print 'var TimingTableHTML = "'
timings.each do |city, slot|
  print <<-HTML
    <tr><td>#{city}</td><td>#{slot}</td></tr> \\
  HTML
end
print '"'
