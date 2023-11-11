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

async function getTravelTimesForTime() {
     // const myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');
    // myHeaders.append('Authorization', 'Bearer <your-token>');

    // fetch('<your-api-endpoint>', {
    // method: 'GET',
    // headers: myHeaders,
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.log(error));
}

  
