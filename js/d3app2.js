function Kuba() {

    var format = d3.format(",d");

    d3.select('h1')
      .transition()
        .duration(2500)
        .on("start", function repeat() {
          d3.active(this)
              .tween("text", function() {
                var that = d3.select(this)
                console.log(that)
                let i = d3.interpolateNumber(that.text().replace(/,/g, ""), Math.random() * 1e6);
                return function(t) { that.text(format(i(t))); };
              })
            .transition()
              .delay(1500)
              .on("start", repeat);
        });
}

export {Kuba}





