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

const checkIfPallet = async ({palletCode}) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        if exists (select 1 KOD_KRESKOWY from WH_CARRIERS where KOD_KRESKOWY = ${palletCode})
            begin
                select 1 KOD
            end 
        else 
            begin
                select 0 KOD
            end
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const addScan = async ({orderId}) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        update PRZYJECIA_SZCZEGOLY
        SET ZESKANOWANE = ISNULL(ZESKANOWANE,0) + 1
        WHERE ID = ${orderId}
        `)
    }
    catch (error) {
        console.log(error)
    };
};

const deduct = async ({orderId}) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        update PRZYJECIA_SZCZEGOLY
        SET ZESKANOWANE = ISNULL(ZESKANOWANE,0) - 1
        WHERE ID = ${orderId}
        `)
    }
    catch (error) {
        console.log(error)
    };
};

const addToWh = async (data) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        if exists (select 1 from STANY_MAGAZYNOWE where KOD_PRODUKTU = '${data.product_code}' and PALETA_NUMER = ${data.pallet} and KLIENT_ID = ${data.klient_id})
        begin
            update STANY_MAGAZYNOWE
            set ILOSC = ILOSC + 1
            where KOD_PRODUKTU = '${data.product_code}' and PALETA_NUMER = ${data.pallet} and KLIENT_ID = ${data.klient_id}
        end
      else
        begin
            insert into STANY_MAGAZYNOWE (PALETA_NUMER, KOD_PRODUKTU, NAZWA_PRODUKTU, ILOSC, WAGA, KLIENT_ID, KLIENT_NAZWA, W_TRAKCIE, PRZYJECIE_ID)
            VALUES (${data.pallet}, '${data.product_code}', '${data.produck_sym}', 1, 1, ${data.klient_id}, '${data.klient_name}', 1, ${data.przyjecie})
        end
        `)
    }
    catch (error) {
        console.log(error)
    };
};

const deleteFromWh = async (data) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        if (select top 1 ILOSC from STANY_MAGAZYNOWE where KOD_PRODUKTU = '${data.product_code}' and PALETA_NUMER = ${data.pallet} and KLIENT_ID = ${data.klient_id}) = 1
            begin
                delete from STANY_MAGAZYNOWE
                where KOD_PRODUKTU = '${data.product_code}' and PALETA_NUMER = ${data.pallet} and KLIENT_ID = ${data.klient_id}
            end
        else
            begin
                update STANY_MAGAZYNOWE
                set ILOSC = ILOSC - 1
                where KOD_PRODUKTU = '${data.product_code}' and PALETA_NUMER = ${data.pallet} and KLIENT_ID = ${data.klient_id}
            end
        
        `)
    }
    catch (error) {
        console.log(error)
    };
};



module.exports = {
    validateLogIn,
    setNewPasswrod,
    getNewOrdersData,
    getNewOrdersDetailsData,
    checkIfPallet,
    addScan,
    deduct,
    addToWh,
    deleteFromWh
};