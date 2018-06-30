window.onload = function(){
  d3.csv('../../data/movies.csv', drawChart);

  function drawChart(data) {
    var xScale = d3.scale.linear().domain([0,11]).range([0,500]);
    var yScale = d3.scale.linear().domain([-100,100]).range([500,0]);
    var sizeScale = d3.scale.linear().domain([0,200]).range([20,20]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickSize(500)
      .ticks(4)
      // .tickValues([1,2,3,4,5,6,7,8,9,10]);

    d3.select('svg').append('g').attr('id', 'xAxisG').call(xAxis);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("right")
      .ticks(8)
      .tickSize(500)
      .tickSubdivide(true);

    d3.select('svg').append('g').attr('id', 'yAxisG').call(yAxis);

    var fillScale = d3.scale.linear()
      .domain([1, 10])
      .range(['lightgray', 'black']);
    var n = 0;
    for(x in data[0]) {
      if (x!=='day'){
        var movieArea = d3.svg.area()
          .x(function(d){
            return xScale(d.day);
          })
          .y(function(d){
            return yScale(alternatingStacking(d, x, 'top'));
          })
          .y0(function(d){
            return yScale(alternatingStacking(d, x, 'bottom'));
          })
          .interpolate("basis");

        d3.select('svg')
          .append('path')
          .style('id', x + 'Area')
          .attr('d', movieArea(data))
          .attr('fill', fillScale(n))
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .style('opacity', 1);

        n++;
      }
    }

    function alternatingStacking(incomingData, incomingAttribute,topBottom) {
      var newHeight = 0;
      var skip = true;
      for (x in incomingData) {
        if (x != "day") {
          if (x == "movie1" || skip == false) {
            newHeight += parseInt(incomingData[x]);
            if (x == incomingAttribute) {
              break;
            }
            if (skip == false) {
              skip = true;
            }
            else {
              n%2 == 0 ? skip = false : skip = true;
            }
          }
          else {
            skip = false;
          }
        }
      }
      if(topBottom == "bottom") {
        newHeight = -newHeight;
      }
      if (n > 1 && n%2 == 1 && topBottom == "bottom") {
        newHeight = 0;
      }
      if (n > 1 && n%2 == 0 && topBottom == "top") {
        newHeight = 0;
      }
      return newHeight;
    }


    function simpleStacking(incomingData, incomingAttribute) {
      var newHeight = 0;
      for( x in incomingData) {
        if (x !== 'day') {
          newHeight += parseInt(incomingData[x]);
          if ( x === incomingAttribute) {
            break;
          }
        }
      }
      return newHeight;
    }
  }
}