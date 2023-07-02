export const closeRemovalOrder = async(ID) => {
    await fetch('http://192.168.0.191:4999/closeRemovalOrder', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            ID: ID
        })
    })
};