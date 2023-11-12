var addresses = [];
var destination = {};

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

    destination, addresses = await getCoordinates(myaddress, destinationString);

    console.log(destination, addresses);

    let token = await getToken();
    console.log("TOKEN", token);

    await getTravelTimesForTime(token, destination, addresses);
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

async function getTravelTimesForTime(token, destination, addresses) {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let bearer = 'Bearer ' + token;
    console.log(bearer);
    myHeaders.append('Authorization', bearer);

    for (var i = 0; i < addresses.length; i++) {
        await fetch(`https://api.iq.inrix.com/findRoute?wp_1=${addresses[i].lat}%2C${addresses[i].lon}&wp_2=${destination.lat}%2C${destination.lon}&arrivalTime=2024-04-04T13%3A42%3A41Z&format=json`, {
        method: 'GET',
        headers: myHeaders,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log("TRAVEL TIME", data.result.trip.routes[0].travelTimeMinutes);
        })
        .catch(error => console.log(error));

        //CHANGE POTENTIAL TIME
        if (((i-1) % 3) == 0) {
            await delay(1000)
        }
        await delay(100);
    }   
}

  
