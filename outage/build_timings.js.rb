# -*- coding: utf-8 -*-
require 'json'

timings = []
IO.readlines("timings.csv").each do |line|
  pref, city, town, group = line.chomp.split(/,/)
  timings << { town: (pref + city + town).gsub(/\s+/, ""), group: group.to_i }
end
print 'var Timings ='
print timings.to_json
