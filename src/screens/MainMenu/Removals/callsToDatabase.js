export const closeRemovalOrder = async(ID) => {
    await fetch('http://10.0.0.153:4999/closeRemovalOrder', {
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

export const addToDatabase = async(ID) => {
    await fetch('http://10.0.0.153:4999/addItemToDatabase', {
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

export const takeFromInventory = async(ID) => {
    await fetch('http://10.0.0.153:4999/takeFromInventory', {
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

export const addToPositions = async({detailsId, whPlace, pallet, productCode, idRemovals, productBarcode, klinetId, klientNazwa, oldPallet, productName}) => {
    await fetch('http://10.0.0.153:4999/addToPossitions', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            detailsId: detailsId,
            pallet: pallet,
            whPlace: whPlace,
            productCode: productCode,
            idRemovals: idRemovals,
            productBarcode: productBarcode,
            klinetId: klinetId,
            klientNazwa: klientNazwa,
            oldPallet: oldPallet,
            productName: productName
        })
    })
};