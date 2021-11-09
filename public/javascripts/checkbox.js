// the number '2' in line 6 in here matches the number of properties we want to search in the searchbar in the index page. there should be 5 but one is general search (that uses text index from mongo) for location or name or propertyType. So there are other 4 fields to loop over.
document.getElementById("checkbox").onchange = function() {
    document.getElementById("inputField").disabled=!this.checked
    }

for (let i =0; i < 2; i++) {
    document.getElementById(`checkbox${i}`).onchange = function() {
    document.getElementById(`inputField${i}`).disabled=!this.checked
    }
}