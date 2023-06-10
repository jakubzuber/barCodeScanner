const config = require('./dbConfig')
const sql = require('mssql')

const validateLogIn = async(USERNAME) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        select 
        PASSWORD, ONE_TIME_PASSWORD
        from USERS 
        where LOGIN = '${USERNAME}'
        and USER_FOR = 2
        `)
        return data
    }
    catch(error) {
        console.log(error)
    };
};

const setNewPasswrod = async(data) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        update USERS
        set PASSWORD = '${data.PASSWORD}',
            ONE_TIME_PASSWORD = 0
        where LOGIN = '${data.USERNAME}'
        and USER_FOR = 2
        `)
    }
    catch(error) {
        console.log(error)
    };
};

const getNewOrdersData = async () => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        SELECT
        K.NAZWA KLIENT,
		PS.SKANY,
        P.*   
        FROM PRZYJECIA1 P  CROSS APPLY
                        (
                        SELECT TOP 1
                        K.NAZWA
                        FROM KLIENCI K
                        WHERE K.ID = P.KLIENT_ID
                        ) K CROSS APPLY 
						(
						SELECT 
						ISNULL(SUM(PS.ZESKANOWANE),0) SKANY
						FROM PRZYJECIA_SZCZEGOLY PS
						WHERE PS.PRZYJECIE_ID = P.ID
						) PS
        WHERE OBSLUGA = 'Jakub Zuber'
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const getNewOrdersDetailsData = async ({idOrder}) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        SELECT
            ID,
            PRZYJECIE_ID,
            KOD_PRODUKTU,
            NAZWA_PRODUKTU,
            ILOSC,
            WAGA,
            PAKOWANIE,
            UWAGI,
            ROZBIEZNOSC,
            ISNULL(ZESKANOWANE,0) ZESKANOWANE
        FROM PRZYJECIA_SZCZEGOLY
        WHERE PRZYJECIE_ID = ${idOrder}
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

module.exports = {
    validateLogIn,
    setNewPasswrod,
    getNewOrdersData,
    getNewOrdersDetailsData
};