mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v11",
    center: ["114.91806886064437","4.899780795496759"],
    zoom: 14.5
})

map.addControl(new mapboxgl.NavigationControl())

const marker = new mapboxgl.Marker({
    color: 'blue',
    }).setLngLat(["114.91806886064437","4.899780795496759"])
    .setPopup(
    new mapboxgl.Popup() 
    .setHTML(
        "<h6><b>Heng Thai Property Centre</b></h6>" 
        )
    )
    .addTo(map);
