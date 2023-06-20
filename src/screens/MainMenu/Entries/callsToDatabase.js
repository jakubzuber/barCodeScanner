
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

