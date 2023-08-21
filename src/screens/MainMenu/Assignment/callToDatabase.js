import { ip } from "../../../ipconfig";

export const submitPlaceAssignment = async (pallet, data) => {
    await fetch(`http://${ip}:4999/submitPlace`, {
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

export const fetchDiscription = async (pallet) => {
    const data = await fetch(`http://${ip}:4999/fetchPlace`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            place: pallet
        })
    })
    .then(res => res.json())
    return data 
};
