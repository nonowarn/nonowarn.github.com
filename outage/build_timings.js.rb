# -*- coding: utf-8 -*-
require 'json'

town2groups = Hash.new { |h,k| h[k] = [] }
IO.readlines("timings.csv").each do |line|
  pref, city, town, group = line.chomp.split(/,/)
  town2groups[(pref + city + town).gsub(/\s+/, "")] << group.to_i
end
print 'var Timings ='
print town2groups.map { |t,gs| { :town => t, :groups => gs.uniq } }.to_json
