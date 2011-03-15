# -*- coding: utf-8 -*-
require 'json'

groups = Hash.new { |pref, city|
  pref[city] = Hash.new { |city, town|
    city[town] = Hash.new { |town, group|
      town[group] = []
    }
  }
}

IO.readlines("timings.csv").each do |line|
  pref, city, town, group = line.chomp.split(/,/)

  [pref, city, town].map { |s| s.gsub(/\s+/, "") }
  group = group.to_i

  gs = groups[pref][city][town]
  gs << group unless gs.include?(group)
end

File.open('timings.js', 'w') { |f|
  f.print 'var AllTimings ='
  f.print groups.to_json
}
