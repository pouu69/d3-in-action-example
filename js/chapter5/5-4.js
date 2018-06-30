window.onload = function(){
  d3.json('../../data/tweets.json', function(error, data){ tree(data.tweets);});

  function tree(incData){
    var nestedTweets = d3.nest().key(function(el){
      return el.user;
    }).entries(incData);

    var packableTweets = { id: 'All Tweets', values: nestedTweets};
    var depthScale = d3.scale.category10([0,1,2]);

    var treeChart = d3.layout.tree();
    treeChart.size([200,200])
      .children(function(d){return d.values;});

    var treeZoom = d3.behavior.zoom();
    treeZoom.on('zoom', zoomed);


    var linkGenerator = d3.svg.diagonal.radial();
    linkGenerator.projection(function(d){return [d.y, d.x / 180 * Math.PI];});

    d3.select('svg')
      .append('g')
      .attr('id', 'treeG')
      .selectAll('g')
      .data(treeChart(packableTweets))
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d){
        return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
      });

    d3.selectAll('g.node')
      .append('circle')
      .attr('r', 10)
      .style('fill', function(d){return depthScale(d.depth);})
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    d3.selectAll('g.node')
      .append('text')
      .text(function(d){return d.id || d.key || d.content});

    d3.select('#treeG').selectAll('path')
      .data(treeChart.links(treeChart(packableTweets)))
      .enter().insert('path', 'g')
      .attr('d', linkGenerator)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '2px');

    d3.select('svg').call(treeZoom);

    function zoomed(){
      var zoomTranslate = treeZoom.translate();
      d3.select('g#treeG').attr('transform', 'translate(' + zoomTranslate[0] + ', '+ zoomTranslate[1] + ')');
    }

  }

}