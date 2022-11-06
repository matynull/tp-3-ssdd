

fetch('https://app.cartes.io/maps/695eec4d-cec4-40e5-9d20-c6fca874a941?lat=-37.96305032495199&lng=-57.574300467967994&zoom=18')
    .then(result => result.json())
    .then((output) => {
        console.log('Output: ', output);
        
}).catch(err => console.error(err));