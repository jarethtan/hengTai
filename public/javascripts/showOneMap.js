    mapboxgl.accessToken = mapToken

    const map = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/mapbox/streets-v11",
        center: property.geometry.coordinates,
        zoom: 12
    })

    map.addControl(new mapboxgl.NavigationControl())

    const marker = new mapboxgl.Marker({
        color: 'blue',
        }).setLngLat(property.geometry.coordinates)
        .setPopup(
        new mapboxgl.Popup() 
        .setHTML(
            `<h5>${property.name}</h5><p>${property.location}</p>`
            )
        )
        .addTo(map);
