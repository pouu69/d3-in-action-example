window.onload = function() {

  d3.json('../../data/tweets.json', function(error, data){ pie(data.tweets);});

  function pie(tweetsData){

    var nestedTweets = d3.nest()
      .key(function(el){
        return el.user;
      }).entries(tweetsData);

    nestedTweets.forEach(function(el){
      el.numTweets = el.values.length;
      el.numFavorites = d3.sum(el.values, function(d){
        return d.favorites.length;
      });
      el.numRetweets = d3.sum(el.values, function(d){
        return d.retweets.length;
      });
    });

    var pieChart = d3.layout.pie();
    pieChart.value(function(d){
      return d.numTweets;
    });

    var yourPie = pieChart(nestedTweets);

    var newArc = d3.svg.arc();
    newArc.outerRadius(100);
    newArc.innerRadius(20);

    d3.select('svg')
      .append('g')
      .attr('transform', 'translate(250,250)')
      .selectAll('path')
      .data(yourPie)
      .enter()
      .append('path')
      .attr('d', newArc)
      .style('fill', 'blue')
      .style('opacity', .5)
      .style('stroke', 'black')
      .style('stroke-width', '2px');

    // pieChart.value(function(d){
    //   return d.numFavorites;
    // });
    //
    // d3.selectAll('path').data(pieChart(nestedTweets))
    //   .transition().duration(1000).attr('d', newArc);

    pieChart.value(function(d){return d.numRetweets;});

    d3.selectAll('path').data(pieChart(nestedTweets.filter(function(d){return d.numRetweets > 0;})), function(d){ return d.data.key; })
      .exit().remove();

    d3.selectAll('path').data(pieChart(nestedTweets.filter(function(d){return d.numRetweets > 0;})), function(d){ return d.data.key; })
      .transition().duration(1000).attrTween('d', arcTween);

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t){
        return newArc(i(t));
      }
    }
  }

  pie();
}