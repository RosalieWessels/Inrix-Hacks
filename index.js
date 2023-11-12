var addresses = [];
var destination = {};
initializeMap();

async function getCoordinates(myaddress, destinationString) {
    await fetch("https://geocode.maps.co/search?q=" + destinationString) 
    .then(response => { 
    if (response.ok) { 
        return response.json(); // Parse the response data as JSON 
    } else { 
        throw new Error('API request failed'); 
    } 
    }) 
    .then(data => { 
        // Process the response data here 
        console.log(data); // Example: Logging the data to the console 
        //var obj = JSON.parse(data);
        let lat = data[0].lat;
        let lon = data[0].lon;
        console.log(lat, lon);
        destination = {"lat": lat, "lon" : lon};
        console.log("DESTINATION", destination);
    }) 
    .catch(error => { 
    // Handle any errors here 
    console.error(error); // Example: Logging the error to the console 
    });

    for (var i = 0; i < myaddress.length; i++) {
        await fetch("https://geocode.maps.co/search?q=" + myaddress[i]) 
        .then(response => { 
        if (response.ok) { 
            return response.json(); // Parse the response data as JSON 
        } else { 
            throw new Error('API request failed'); 
        } 
        }) 
        .then(data => { 
            // Process the response data here 
            console.log(data); // Example: Logging the data to the console
            let lat = data[0].lat;
            let lon = data[0].lon;
            console.log(lat, lon);
            addresses.push({"lat": lat, "lon" : lon});
            console.log("Here is the final result hihi", addresses);
        }) 
        .catch(error => { 
        // Handle any errors here 
        console.error(error); // Example: Logging the error to the console 
        });
    }

    return destination, addresses;
}

async function getAddresses() {
    var myaddress = document.getElementById("address-box").value.split("\n");
    var destinationString = document.getElementById("destination-address").value;
    var date = document.getElementById("event-date").value;
    var startTime = document.getElementById("event-start-time").value;
    var endTime = document.getElementById("event-end-time").value;

    destination, addresses = await getCoordinates(myaddress, destinationString);

    console.log(destination, addresses);

    let token = await getToken();
    console.log("TOKEN", token);

    var travelInfoList = await getTravelTimesForTime(token, destination, addresses, date, startTime, endTime);
    console.log("FININALLY FINISHED", travelInfoList);
}


async function getToken() {
    //get API TOKEN
    let token = "";
    await fetch("http://localhost:8000/gettoken") 
    .then(response => { 
    if (response.ok) { 
        return response.json(); // Parse the response data as JSON 
    } else { 
        throw new Error('API request failed'); 
    } 
    }) 
    .then(data => { 
        // Process the response data here 
        console.log(data); // Example: Logging the data to the console 
        console.log(data.token);
        token = data.token;
    }) 
    return token;
};

async function getTravelTimesForTime(token, destination, addresses, date, startTime, endTime) {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let bearer = 'Bearer ' + token;
    console.log(bearer);
    myHeaders.append('Authorization', bearer);

    //get all times the concert could possibly start
    console.log("DATE, STARTTIME, ENDTIME", date, startTime, endTime);
    var st = moment(startTime, "HH:mm");
    var et = moment(endTime, "HH:mm");
    
    let times = getTimesBetween(st, et);
    console.log(times);

    var travelInfoList = [];

    for (var j = 0; j < times.length; j++) {
        //example 2009-04-04T13:42:41Z, worked: 2024-04-04T13%3A42%3A41Z
        let arrivalTime = date + "T" + times[j] + ":00Z";
        console.log("ARRIVAL TIME", arrivalTime);

        var array = [];
        for (var i = 0; i < addresses.length; i++) {
            await fetch(`https://api.iq.inrix.com/findRoute?wp_1=${addresses[i].lat}%2C${addresses[i].lon}&wp_2=${destination.lat}%2C${destination.lon}&arrivalTime=${arrivalTime}&format=json`, {
            method: 'GET',
            headers: myHeaders,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log("TRAVEL TIME", data.result.trip.routes[0].travelTimeMinutes);
                array.push({"travelTimeWT" : data.result.trip.routes[0].travelTimeMinutes, "travelTimeNT" : data.result.trip.routes[0].uncongestedTravelTimeMinutes});
            }) 
            .catch(error => console.log(error));

            //CHANGE POTENTIAL TIME
            if (((i-1) % 3) == 0) {
                await delay(1500)
            }
            await delay(200);
        } 
        travelInfoList.push({"arrivalTime" : times[j], "travel" : array}); 
    }    
    return travelInfoList;
}

  
function getTimesBetween(start, end) {
    const times = [];
    let current = new Date(start);
    while (current <= end) {
        let time = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let t = moment(time,"H:mm A").format("HH:mm");
        times.push(t);
        current.setMinutes(current.getMinutes() + 30);
    }
    return times;
}


function initializeMap() {
    var lat            = 37.773972;
    var lon            =  -122.431297;
    var zoom           = 14;

    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);

    map = new OpenLayers.Map("Map");
    var mapnik         = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    var markers = new OpenLayers.Layer.Markers("Markers");
    var size = new OpenLayers.Size(40,40);
    var icon = new OpenLayers.Icon('marker.png', size);
    map.addLayer(markers);

    markers.addMarker(new OpenLayers.Marker(position, icon));

    map.setCenter(position, zoom);
}

  
  
