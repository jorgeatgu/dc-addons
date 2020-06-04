# DC Addons: Population Pyramid Chart

⚠️ Use with caution

This chart is a forked of the dc-addons-paired-rows chart from [dc-addons](https://github.com/Intellipharm/dc-addons) to build a population pyramid chart.

```zsh
yarn add dc-addons-paired-row
npm i dc-addons-paired-row
```

## Example 
```js
import pairedRow from 'dc-addons-paired-row'
import * as d3 from 'd3';
import crossfilter from 'crossfilter2'
import dc from 'dc'

var chart = pairedRow('#chart', 'main');
dc.chartRegistry.register(chart, 'main');
var filter = dc.pieChart('#filter', 'main');
var state = dc.pieChart('#state', 'main');


d3.csv('data/demo3.csv', function(error, experiments) {
  var ndx = crossfilter(experiments),
    ageGenderDimension = ndx.dimension(function(d) {
      var age_range = 'Unknown';

      if (d.age <= 9) {
        age_range = '0 - 9';
      } else if (d.age <= 19) {
        age_range = '10 - 19';
      } else if (d.age <= 29) {
        age_range = '20 - 29';
      } else if (d.age <= 39) {
        age_range = '30 - 39';
      } else if (d.age <= 49) {
        age_range = '40 - 49';
      } else if (d.age <= 59) {
        age_range = '50 - 59';
      } else if (d.age <= 69) {
        age_range = '60 - 69';
      } else if (d.age <= 79) {
        age_range = '70 - 79';
      } else if (d.age <= 89) {
        age_range = '80 - 89';
      } else if (d.age <= 99) {
        age_range = '90 - 99';
      } else if (d.age >= 100) {
        age_range = '100+';
      }

      return [d.gender, age_range];
    }),
    ageGenderGroup = ageGenderDimension.group().reduceCount(),
    genderDimension = ndx.dimension(function(d) { return d.gender; }),
    genderGroup = genderDimension.group().reduceCount(),
    stateDimension = ndx.dimension(function(d) { return d.state; }),
    stateGroup = stateDimension.group().reduceCount();

  const group = {
    all: function() {
      var age_ranges = ['0 - 9', '10 - 19', '20 - 29', '30 - 39', '40 - 49', '50 - 59', '60 - 69', '70 - 79', '80 - 89', '90 - 99', '100+'];

      // convert to object so we can easily tell if a key exists
      var values = {};
      ageGenderGroup.all().forEach(function(d) {
        values[d.key[0] + '.' + d.key[1]] = d.value;
      });

      // convert back into an array for the chart, making sure that all age_ranges exist
      var g = [];
      age_ranges.forEach(function(age_range) {
        g.push({
          key: ['Male', age_range],
          value: values['Male.' + age_range] || 0
        });
        g.push({
          key: ['Female', age_range],
          value: values['Female.' + age_range] || 0
        });
      });

      return g;
    }
  };

  chart.options({
    // display
    width: 250,
    height: 250,
    labelOffsetX: -50,
    fixedBarHeight: 10,
    gap: 10,
    colorCalculator: function(d) {
      if (d.key[0] === 'Male') {
        return '#5A9BCA';
      }

      return '#C95AC7';
    },

    // data
    dimension: ageGenderDimension,
    group: group,

    // misc
    renderTitleLabel: true,
    title: function(d) {
    },
    label: function(d) {
      return d.key[1];
    },
    cap: 15,

    // if elastic is set than the sub charts will have different extent ranges, which could mean the data is interpreted incorrectly
    elasticX: true,

    // custom
    leftKeyFilter: function(d) {
      return d.key[0] === 'Male';
    },
    rightKeyFilter: function(d) {
      return d.key[0] === 'Female';
    },
  })

  chart.pyramidChart()

  chart.rightChart().on('filtered', function() {
    state.redraw()
    filter.redraw()
    chart.rightChart().redraw()
  })

  chart.leftChart().on('filtered', function() {
    state.redraw()
    filter.redraw()
    chart.leftChart().redraw()
  })

  filter.options({
    dimension: genderDimension,
    group: genderGroup
  })

  state.options({
    dimension: stateDimension,
    group: stateGroup
  })

  dc.renderAll('main');
});
```

```css
.left-chart.dc-chart g.row text {
  display: none;
}

.dc-chart .axis {
  display: none;
}

.dc-chart .axis-y {
  display: block;
}

.dc-chart rect {
  rx: 5px;
  transition: all 1s ease-in-out;
}

.right-chart.dc-chart g.row text.titlerow {
  display: none;
}

.right-chart.dc-chart g.row text {
  fill: #111;
  pointer-events: none;
}
```



