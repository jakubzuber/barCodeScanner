export const submitTransferApi = async ({data, fromPallet, toPallet}) => {
    await fetch('http://192.168.0.191:4999/transfer', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            cargo: data,
            fromPallet: fromPallet,
            toPallet: toPallet
        })
    })
};