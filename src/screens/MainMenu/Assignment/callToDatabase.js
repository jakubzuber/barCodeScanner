export const submitPlaceAssignment = async (pallet, data) => {
    await fetch('http://192.168.0.191:4999/submitPlace', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            pallet: pallet,
            place: data
        })
    })
};