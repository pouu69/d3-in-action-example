window.onload = function(){
  d3.json('../../data/tweets.json', function(error, data){ circlePack(data.tweets);});

  function circlePack(incData) {
    var nestedTweets = d3.nest().key(function(el){
      return el.user;
    }).entries(incData);

    var packableTweets = { id: 'All Tweets', values: nestedTweets};
    var depthScale = d3.scale.category10([0,1,2]);

    var packChart = d3.layout.pack();

    packChart.size([500,500])
      .children(function(d){
        return d.values;
      })
      .value(function(d){
        return d.retweets.length + d.favorites.length + 1;
      });

    d3.select('svg')
      .selectAll('circle')
      .data(packChart(packableTweets))
      .enter()
      .append('circle')
      .attr('r', function(d){return d.r;})
      .attr('cx', function(d){return d.x;})
      .attr('cy', function(d){return d.y;})
      .style('fill', function(d){return depthScale(d.depth);})
      .style('stroke', 'black')
      .style('stroke', '2px');

  }
}