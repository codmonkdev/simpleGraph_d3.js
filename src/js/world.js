import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import * as d3 from 'd3';
//import * as d3_s_s from 'd3-simple-slider';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import * as img from './addImageInPage.js';
import * as flCInMap from './flagCircleInMap.js';
import * as cbJson from './addComboBoxFromJson.js';
import * as addCountries from './addCountries.js';
import { addSlider } from './addSlider.js';

const loadedData = [{}];
loadedData.push({ "id": "1", "EngName": "Agriculture, forestry, and fishing, value added (current US$)", "RusName": "Сельское, лесное и рыбное хозяйство, добавленная стоимость (в текущих ценах)", "url": "data/DTO/Agriculture, forestry, and fishing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "2", "EngName": "Cereal production (metric tons)", "RusName": "Производство зерновых (в метрических тоннах)", "url": "data/DTO/Cereal production (metric tons).json", "jsonType": "UFA" });
loadedData.push({ "id": "3", "EngName": "GDP (Merged data)", "RusName": "ВВП (объединенные данные)", "url": "data/DTO/GDP (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "4", "EngName": "Industry (including construction), value added (current US$)", "RusName": "Промышленность (включая строительство), добавленная стоимость (в текущих ценах)", "url": "data/DTO/Industry (including construction), value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "5", "EngName": "Manufacturing, value added (current US$)", "RusName": "Производство, добавленная стоимость (в текущих ценах)", "url": "data/DTO/Manufacturing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "6", "EngName": "PerCapita GDP", "RusName": "ВВП на душу населения", "url": "data/DTO/PerCapita GDP.json", "jsonType": "UFA" });
loadedData.push({ "id": "7", "EngName": "Population (Merged data)", "RusName": "Население (объединенные данные)", "url": "data/DTO/Population (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "8", "EngName": "Services, value added (current US$)", "RusName": "Услуги, добавленная стоимость (в текущих ценах)", "url": "data/DTO/Services, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "9", "EngName": "GDP", "RusName": "ВВП", "url": "data/data_new.json", "jsonType": "SAMARA" });

let svg;
let projection;
let width;
let height;

let onClickDropDown = function (d) {
	console.log(d);
	buildBubble(d,svg,projection,width);
};
cbJson.addComboBoxFromJson.addBootstrapDropDown(loadedData, "dropDownList", "id", "RusName", onClickDropDown);

function buildBubble(ldata,svg,projection,width) {
	console.log("typeof (ldata.listYear)=" + typeof (ldata.listYear));
	document.getElementById("nameContainer").innerHTML = "";
	document.getElementById("nameContainer").innerHTML = "<h4>"+ldata.RusName+"</h4>";
	if (typeof (ldata.listYear) === "undefined") {
		console.log("yes");
		console.log("ldata.url=" + ldata.url);
		d3.json(ldata.url, function (error, dataFromFile) {
			if (error) console.log(error);
			console.log("dataFromFile=" + dataFromFile);
			ldata.dataFromFile = dataFromFile;
			console.log("ldata.dataFromFile=" + ldata.dataFromFile);
			let listYear;
			if (ldata.jsonType == "UFA") {
				listYear = addSlider.getListYearNew(ldata.dataFromFile);
			} else if (ldata.jsonType == "SAMARA") {
				listYear = addSlider.getListYear(ldata.dataFromFile);
			}
			console.log("listYear=" + listYear);
			ldata.listYear = listYear;
			console.log("ldata.listYear=" + ldata.listYear);
			console.log("ldata.listYear[]=" + ldata.listYear[ldata.listYear.length - 1]);
			let curDataYearFilter;
			console.log("ldata.jsonType=" + ldata.jsonType);
			if (ldata.jsonType == "UFA") {
				curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
			} else if (ldata.jsonType == "SAMARA") {
				curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
			}
			console.log("curDataYearFilter=" + JSON.stringify(curDataYearFilter));
			let mxval;
			if (ldata.jsonType == "UFA") {
				mxval = flCInMap.flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
			} else if (ldata.jsonType == "SAMARA") {
				mxval = flCInMap.flagCircleInMap.getMaxValue(ldata.dataFromFile);
			}
			
			let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_",mxval);
			if (ldata.jsonType == "UFA") {
				flagCircleInMap.addFlagCircleInMapNew();
			} else if (ldata.jsonType == "SAMARA") {
				flagCircleInMap.addFlagCircleInMap();
			}
			let updateFunction;
			if (ldata.jsonType == "UFA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					let h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);

					let curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, listYear[h2]);
					let mxval;
					if (ldata.jsonType == "UFA") {
						mxval = flCInMap.flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					} else if (ldata.jsonType == "SAMARA") {
						mxval = flCInMap.flagCircleInMap.getMaxValue(ldata.dataFromFile);
					}
					let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_",mxval);
					flagCircleInMap.addFlagCircleInMapNew();
				}
			} else if (ldata.jsonType == "SAMARA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					let h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);
					let mxval;
					if (ldata.jsonType == "UFA") {
						mxval = flCInMap.flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					} else if (ldata.jsonType == "SAMARA") {
						mxval = flCInMap.flagCircleInMap.getMaxValue(ldata.dataFromFile);
					}
					let curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, listYear[h2]);
					let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_",mxval);
					flagCircleInMap.addFlagCircleInMap();
				}
			}
			addSlider.addSlider("vis", width, listYear, updateFunction);
		});
	} else {
		let curDataYearFilter;
		console.log("ldata.jsonType=" + ldata.jsonType);
		if (ldata.jsonType == "UFA") {
			curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
		} else if (ldata.jsonType == "SAMARA") {
			curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
		}
		console.log("curDataYearFilter=" + JSON.stringify(curDataYearFilter));
		let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
		if (ldata.jsonType == "UFA") {
			flagCircleInMap.addFlagCircleInMapNew();
		} else if (ldata.jsonType == "SAMARA") {
			flagCircleInMap.addFlagCircleInMap();
		}
		let updateFunction;
		if (ldata.jsonType == "UFA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				let h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				let curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[h2]);
				let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
				flagCircleInMap.addFlagCircleInMapNew();
			}
		} else if (ldata.jsonType == "SAMARA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				let h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				let curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[h2]);
				let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
				flagCircleInMap.addFlagCircleInMap();
			}
		}
		addSlider.addSlider("vis", width, ldata.listYear, updateFunction);
	}
}

let url = "data/countries.json";
let url2 = "data/data_new.json";
d3.json(url, function (error, countries) {
	if (error) console.log(error);
	d3.json(url2, function (error, places) {
		if (error) console.log(error);


		width = parseInt(d3.select("#mapContainer").style("width")),
			height = parseInt(d3.select("#mapContainer").style("height"));
		console.log("width=" + width);
		console.log("height=" + height);
		console.log("width / (2 * Math.PI)=" + width / (2 * Math.PI)) - 50;
		let scale0 = (width - 1) / 2 / Math.PI;
		projection = d3.geoEquirectangular()
			.scale([scale0]) // scale to fit group width;
			.translate([width / 2, height / 2 + 50])// ensure centred in group
			//.translate([0,0])// ensure centred in group
			;


		svg = d3.select("div#mapContainer").append("svg")
			.attr("width", width)
			.attr("height", height)
			// .call(d3.zoom().on("zoom", function () {
			// 	svg.attr("transform", d3.event.transform)
			// }))
			;

		addCountries.addCountries.addContries(countries.features, svg, projection);

		let addImageInPage = new img.AddImageInPage(svg, places, "iso2", "img_", "img/flags/", ".png");
		addImageInPage.addImageInPage();

		let ldata = loadedData[7];

		buildBubble(ldata,svg,projection,width);


		// let listYear = addSlider.getListYear(places);

		// let curDataYearFilter = addSlider.filterByYear(places, listYear[0]);
		// let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
		// flagCircleInMap.addFlagCircleInMap();

		// let updateFunction = function (h, handle, label, xScale) {
		// 	// update position and text of label according to slider scale
		// 	let h2 = Number((h).toFixed(0));
		// 	handle.attr("cx", xScale(h));

		// 	label.attr("x", xScale(h)).text(listYear[h2]);

		// 	let curDataYearFilter = addSlider.filterByYear(places, listYear[h2]);
		// 	let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
		// 	flagCircleInMap.addFlagCircleInMap();
		// }

		// addSlider.addSlider("vis", width, listYear, updateFunction);


		// let playButton = d3.select("#play-button");
		// playButton.on("click", function () {

		// });
	})

});