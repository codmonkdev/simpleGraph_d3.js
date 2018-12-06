import * as d3 from 'd3';

import * as d3geoprojection from 'd3-geo-projection';

let width = '100%',
    height = '100%';

let projection = d3.geoEquirectangular();
  
let path = d3.geoPath()
  .projection(projection)

let svg = d3.select("div").append("svg")
    .attr("width", width)
	.attr("height", height)
	.call(d3.zoom().on("zoom", function () {
			svg.attr("transform", d3.event.transform)
	}));
	

let url = "data/countries.json";
let url2 = "data/word-country-data.json";//"data/word-country-centroids.json";
d3.json(url, function(error, countries) {
d3.json(url2, function(error, places) {
  if (error) console.log(error);
  
  //console.log("geojson", countries, places);
 
  svg.selectAll("path")
    .data(countries.features)
  .enter().append("path")
    .attr("d", path)
    // .on("mouseover",function(d) {
    // 	//console.log("just had a mouseover", d3.select(d));
    // 	d3.select(this)
    //   	.classed("active",true)
  	// })
  	// .on("mouseout",function(d){
    // 	d3.select(this)
    //   	.classed("active",false)
	// })
	;
  
  let defs = svg.append("defs");
  let imgPattern = defs.selectAll("pattern").data(places)
    	.enter()
    .append("pattern")
        .attr("id", function(d){return "img_"+d.iso2;})
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternUnits", "objectBoundingBox")
		.attr("patternContentUnits", "objectBoundingBox")
    	.append("image")
    	.attr("width", 1)
        .attr("height", 1)
		.attr("preserveAspectRatio", "none")
        .attr("xlink:href", function(d){return "img/flags/"+d.iso2+".png";})
		;
	

	let maxValue=-9999;
	
	places.sort(function(x, y){
		let resX = 0;
		if(typeof(x.dataCountries)!="undefined"&&typeof(x.dataCountries[0])!="undefined"){
			if(x.dataCountries[0].value!=null){
				resX=x.dataCountries[0].value;
			}
		}
		let resY = 0;
		if(typeof(y.dataCountries)!="undefined"&&typeof(y.dataCountries[0])!="undefined"){
			if(y.dataCountries[0].value!=null){
				resY=y.dataCountries[0].value;
			}
		}

		return d3.descending(resX, resY);
	 })

	// for(let d of places) {
	// 	let res;
	// 	if(typeof(d.dataCountries)!="undefined"&&typeof(d.dataCountries[0])!="undefined"){
	// 		if(d.dataCountries[0].value!=null){
	// 			res=d.dataCountries[0].value;
	// 		}
	// 		else{
	// 			res=0;
	// 		}
	// 	}
	// 	else{
	// 		res=0;
	// 	};
	// 	if(res>maxValue){
	// 		maxValue = res;
	// 	}
	// }
	maxValue = places[0].dataCountries[0].value;
	// console.log("maxValue"+maxValue);
	// console.log("plases[0] "+JSON.stringify(places[0]));
    let sizeScale = d3.scaleSqrt().domain([0,maxValue]).range([0,50]);

// Define the div for the tooltip
	const div = d3.select("body").append("div")
	    .attr("class", "tooltip")				
        .style("opacity", 0);

  svg.selectAll("circle")
  	.data(places)
  .enter().append("circle")
	  .attr('r',function(d) {	let res; 
								//console.log(typeof(d.dataCountries));
								//console.log(typeof(d.dataCountries[0]));
		                        if(typeof(d.dataCountries)!="undefined"&&typeof(d.dataCountries[0])!="undefined"){
									//console.log("true");
									if(d.dataCountries[0].value!=null){
										res=(d.dataCountries)[0].value;
									}
									else{
										res=0;
									}
									
								}
								else{
									//console.log("false");
									res=0;
								};
								res = sizeScale(res);
								//console.log("res="+res);
								return res;
							}
			)
    .attr('cx',function(d) { return projection(d.centroid)[0]})
    .attr('cy',function(d) { return projection(d.centroid)[1]})
	.style("fill", function(d){return "url(#img_"+d.iso2+")";})
								
	.on("mouseover",function(d) {
		d3.select(this).classed("active",true);
		let res = 0;
		if(typeof(d.dataCountries)!="undefined"&&typeof(d.dataCountries[0])!="undefined"){
			if(d.dataCountries[0].value!=null){
				res=(d.dataCountries)[0].value/1000000;
			}
		}
		const htmlData = d.name_ru + "<br/>ВВП:"  + Math.round(res*100)/100 + " m US$";

		div.transition()		
               // .duration(200)		
                .style("opacity", .9);		
            div.html(htmlData)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	

  	})
  	.on("mouseout",function(d){
		d3.select(this).classed("active",false);
		div.transition()		
               // .duration(500)		
                .style("opacity", 0);	
    });
  
  })
  
});