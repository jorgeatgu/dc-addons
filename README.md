# DC Addons Paired Row

⚠️⚠️ [WIP] ⚠️⚠️

This [dc.js](http://dc-js.github.io/dc.js/) addon provides a paired row.

Fork dc-addons-paired-row to build a Piramid Population Chart.

```
yarn add dc-addons-paired-row
npm i dc-addons-paired-row
```

## Example 
```
import pairedRow from 'dc-addons-paired-row'
import * as d3 from 'd3';
import crossfilter from 'crossfilter2'
import dc from 'dc'

var chart = pairedRow('#chart');
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
    width: 450,
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
      return d.key[1];
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
   chart.render(piramidChart())

  filter.options({
    dimension: genderDimension,
    group: genderGroup
  })

  chart.chartGroup('main')
  dc.chartRegistry.register(chart, "main");


  state.options({
    dimension: stateDimension,
    group: stateGroup
  })

  state.on('filtered', function(state) {
    piramidChart()
  })

  filter.on('filtered', function(filter) {
    piramidChart()
  })

  dc.renderAll('main');
  let allRows = d3.selectAll('g.row')
  allRows
    .attr('opacity', 0)
});

function piramidChart() {
  setTimeout(() => {
    let selectLeftRows = d3.selectAll('.left-chart g.row rect')
    selectLeftRows = selectLeftRows._groups[0]
    const leftChart = d3.select('.left-chart')
    const widthLeftchart = leftChart._groups[0][0].clientWidth - 30
    selectLeftRows.forEach(rect => {
      const rectWidth = rect.width.animVal.value
      const translateREct = widthLeftchart - rectWidth

      rect.setAttribute('width', 0)
      rect.setAttribute('x', translateREct)
      rect.setAttribute('width', rectWidth)
    })
    let allRects = d3.selectAll('g.row')
    allRects.attr('opacity', 1)
  }, 1000)
}
```

```
  .left-chart.dc-chart g.row text {
    display: none; }

  .dc-chart .axis {
    display: none; }

  .dc-chart rect {
    rx: 5px;
    transition: all .3s ease-in-out; }

  .right-chart.dc-chart g.row text.titlerow {
    display: none; }

  .right-chart.dc-chart g.row text {
    fill: #111; }
```
