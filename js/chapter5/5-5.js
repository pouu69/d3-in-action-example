window.onload = function(){
  d3.csv('../../data/movies.csv', function(error, data){ dataViz(data);});

  function dataViz(incData) {
    expData = incData;
    stackData = [];

    var xScale = d3.scale.linear().domain([0, 10]).range([0, 500]);
    var yScale = d3.scale.linear().domain([0, 100]).range([500, 0]);

    var movieColors = d3.scale.category10(['movie1','movie2','movie3','movie4','movie5','movie6']);

    var stackArea = d3.svg.area()
      .interpolate('basis')
      .x(function(d){return xScale(d.x);})
      .y0(function(d){return yScale(d.y0);})
      .y1(function(d){return yScale(d.y0 + d.y);});

    for(x in incData[0]) {
      if (x !== 'day') {
        var newMovieObject = { name: x, values: []};
        for ( y in incData) {
          newMovieObject.values.push({
            x: parseInt(incData[y]['day']),
            y: parseInt(incData[y][x])
          });
        }
        stackData.push(newMovieObject);
      }
    }
    stackLayout = d3.layout.stack()
      .offset('silhouette')
      .order('inside-out')
      .values(function(d){return d.values;});

    d3.select('svg').selectAll('path')
      .data(stackLayout(stackData))
      .enter().append('path')
      .style('fill', function(d){return movieColors(d.name);})
      .attr('d', function(d){return stackArea(d.values);});
  }
}