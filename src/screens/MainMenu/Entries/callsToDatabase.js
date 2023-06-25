
export const addScanToDatabase = async (id) => {
    await fetch('http://192.168.0.191:4999/addScan', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            orderId: id
        })
    })
};

export const addScanToWh = async (data) => {
    await fetch('http://192.168.0.191:4999/addToWh', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            pallet: data.pallet,
            product_code: data.code,
            produck_sym: data.symbol,
            number: data.number,
            weight: 0,
            klient_id: data.klientId,
            klient_name: data.klient,
            working_on: 1
        })
    })
};

export const deleteFromWh = async (data) => {
    await fetch('http://192.168.0.191:4999/deleteFromWh', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            pallet: data.pallet,
            product_code: data.code,
            klient_id: data.klientId,
        })
    })
};

export const deductScanFromDatabase = async (id) => {
    await fetch('http://192.168.0.191:4999/deduct', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            orderId: id
        })
    })
};

