function createSoccerViz() {

  d3.csv('./data/worldcup.csv', function(data) {overallTeamViz(data);})
  d3.text('../modal.html', function(data){
    d3.select("body").append('div').attr('id', 'modal').html(data);
  });
  d3.html('../resources/icon.svg', loadSvg);

  function loadSvg(svgData) {
    d3.selectAll('g').each(function(){
      var gParent = this;
      d3.select(svgData).selectAll('path').each(function(){
        gParent.appendChild(this.cloneNode(true));
      });

    });
    d3.selectAll('path').style('fill', 'darked').style('stroke', 'black').style('stroke-width', '1px');
  }

  function overallTeamViz(incomingData) {
    d3.select('svg')
      .append('g')
      .attr('id', 'teamsG')
      .attr('transform', 'translate(50,300)')
      .selectAll('g')
      .data(incomingData)
      .enter()
      .append('g')
      .attr('class', 'overallG')
      .attr('transform', function(d, i){return "translate(" + (i*50) + ", 0)"});

    var teamG = d3.selectAll('g.overallG');

    teamG
      .append('circle')
      .attr('r', 0)
      .transition()
      .delay(function(d,i) {return i*100})
      .duration(500)
      .attr('r', 40)
      .transition()
      .duration(500)
      .attr('r', 20)
      .style('fill', 'pink')
      .style('stroke', 'black')
      .style('stroke-width', '1px');

    teamG
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', 30)
      .style('font-size', '10px')
      .text(function(d){return d.team;})

    // teamG.insert('image', 'text')
    //   .attr('xlink:href', function(d){
    //     return 'images/' + d.team + '.png';
    //   })
    //   .attr('width', '45px')
    //   .attr('height', '20px')
    //   .attr('x', '-22').attr('y', '-10');

    teamG.on('mouseover', highlightRegion2)
      .on('mouseout', unHightlight);

    teamG.select("text").style("pointer-events","none");

    teamG.on('click', teamClick);

    function teamClick(d) {
      d3.selectAll('td.data').data(d3.values(d)).html(function(p){return p;});
    }

    var dataKeys = d3.keys(incomingData[0]).filter(function(el){
      return el != 'team' && el != 'region';
    });

    d3.select('#controls').selectAll('button.teams')
      .data(dataKeys).enter()
      .append('button')
      .on('click', buttonClick)
      .html(function(d){return d;});


    function buttonClick(datapoint) {
      var maxValue = d3.max(incomingData, function(d){
        return parseFloat(d[datapoint]);
      });

      var colorQuantize = d3.scale.quantize().domain([0, maxValue]).range(colorbrewer.Reds[5]);
      var tenColorScale = d3.scale.category10(["UEFA", "CONMEBOL", "CAF", "AFC"]);
      var ybRamp = d3.scale.linear()
        .interpolate(d3.interpolateLab)
        .domain([0, maxValue])
        .range(["yellow", "blue"]);

      var radiusScale = d3.scale.linear().domain([0, maxValue]).range([2,20]);

      d3.selectAll('g.overallG').select('circle').transition().duration(1000)
        .attr('r', function(d){
          return radiusScale(d[datapoint]);
        }).style('fill', function(d){ return colorQuantize(d[datapoint])});
    }

    function highlightRegion(d) {
      d3.selectAll('g.overallG').select('circle')
        .style('fill', function(p){
          return p.region == d.region ? 'red' : 'gray';
        });
    }

    function highlightRegion2(d) {
      var teamColor = d3.rgb("pink");
      d3.select(this).select("text").classed("highlight", true).attr("y", 10).style("font-size","30px");
      d3.selectAll("g.overallG").select("circle").style("fill", function(p) {
        console.log(p.region === d.region);
        return p.region === d.region ? teamColor.darker(.75) : teamColor.brighter(.55);
      });
      this.parentElement.appendChild(this);
    };

    function unHightlight() {
      d3.selectAll("g.overallG").select("circle").attr("class", "");
      d3.selectAll("g.overallG").select("text")
        .classed("highlight", false).attr("y", 30).style("font-size","10px");
    }
  }
}

