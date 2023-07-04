const config = require('./dbConfig')
const sql = require('mssql')

const validateLogIn = async (USERNAME) => {
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
    catch (error) {
        console.log(error)
    };
};

const setNewPasswrod = async (data) => {
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
    catch (error) {
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

const getNewOrdersDetailsData = async ({ idOrder }) => {
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
            ISNULL(ZESKANOWANE,0) ZESKANOWANE,
            KOD_KRESKOWY
        FROM PRZYJECIA_SZCZEGOLY
        WHERE PRZYJECIE_ID = ${idOrder}
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const checkIfPallet = async ({ palletCode }) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        if exists (select 1 KOD_KRESKOWY from WH_CARRIERS where KOD_KRESKOWY = '${palletCode}')
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

const addScan = async ({ orderId }) => {
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

const deduct = async ({ orderId }) => {
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
            insert into STANY_MAGAZYNOWE (PALETA_NUMER, KOD_PRODUKTU, NAZWA_PRODUKTU, ILOSC, WAGA, KLIENT_ID, KLIENT_NAZWA, W_TRAKCIE, PRZYJECIE_ID, KOD_KRESKOWY)
            VALUES (${data.pallet}, '${data.product_code}', '${data.produck_sym}', 1, 1, ${data.klient_id}, '${data.klient_name}', 1, ${data.przyjecie}, '${data.kod_kreskowy}')
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

const closeOrder = async ({ ID }) => {
    console.log(ID)
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        DELETE FROM PRZYJECIA1
        WHERE ID = ${ID}

        DELETE FROM PRZYJECIA_SZCZEGOLY
        WHERE PRZYJECIE_ID = ${ID}

        UPDATE STANY_MAGAZYNOWE
        SET W_TRAKCIE = 0
        WHERE PRZYJECIE_ID = ${ID}
        `)
    }
    catch (error) {
        console.log(error)
    };
};

const getRemovalsData = async () => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        SELECT
        K.NAZWA KLIENT,
		PS.SKANY,
        P.*   
        FROM WYDANIA P CROSS APPLY
                        (
                        SELECT TOP 1
                        K.NAZWA
                        FROM KLIENCI K
                        WHERE K.ID = P.KLEINT_ID
                        ) K CROSS APPLY 
						(
						SELECT 
						ISNULL(SUM(PS.ZESKANOWANE),0) SKANY
						FROM WYDANIA_SZCZEGOLY PS
						WHERE PS.WYDANIE_ID = P.ID
						) PS
        WHERE OBSLUGA = 'Jakub Zuber'
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const getRemovalDetailsData = async ({ idOrder }) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        SELECT
            ID,
            WYDANIE_ID,
            KOD_PROCUKTU,
            NAZWA_PRODUKTU,
            ILOSC,
            WAGA,
            PAKOWANIE,
            UWAGI,
            ROZBIEZNOSCI,
            ISNULL(ZESKANOWANE,0) ZESKANOWANE,
            KOD_KRESKOWY
        FROM WYDANIA_SZCZEGOLY
        WHERE WYDANIE_ID = ${idOrder}
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const getTransfersData = async ({ pallet }) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        SELECT * 
        FROM STANY_MAGAZYNOWE with(nolock)
        WHERE PALETA_NUMER = '${pallet}'
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const transfer = async ({ cargo, fromPallet, toPallet }) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        drop table if exists #tmp

        declare @session int = CAST(RAND() * 1000000 AS INT)

        create table #tmp (
            code varchar(200),
            number int
        )

        insert into #tmp (code, number) values 
        ${cargo.map(item =>
            `('${item.cargo}', ${item.ilosc})`
        )}
        
        insert into tmp_transfers (ROW, CODE, NUMBER, SESSION)
        select 
        ROW_NUMBER() OVER(ORDER BY code DESC),
        code,
        number,
        @session
        from #tmp

        declare @counter int = (select top 1 row from tmp_transfers where SESSION = @session order by row desc)

        while @counter > 0
            begin
                if exists (select 1 from STANY_MAGAZYNOWE where PALETA_NUMER = '${toPallet}' and KOD_PRODUKTU = (select CODE from tmp_transfers where ROW = @counter and SESSION = @session))
                    begin
                        update STANY_MAGAZYNOWE
                        set ILOSC = ILOSC + (select NUMBER from tmp_transfers where ROW = @counter and SESSION = @session)
                        where PALETA_NUMER = '${toPallet}' and KOD_PRODUKTU = (select CODE from tmp_transfers where ROW = @counter and SESSION = @session)
                    end
                else 
                    begin
                        insert into STANY_MAGAZYNOWE (PALETA_NUMER, KOD_PRODUKTU, NAZWA_PRODUKTU, ILOSC, WAGA, KLIENT_ID, KLIENT_NAZWA, W_TRAKCIE, PRZYJECIE_ID, KOD_KRESKOWY)
                        select 
                        '${toPallet}',
                        SM.KOD_PRODUKTU,
                        SM.NAZWA_PRODUKTU,
                        (select NUMBER from tmp_transfers where ROW = @counter and SESSION = @session),
                        SM.WAGA,
                        SM.KLIENT_ID,
                        SM.KLIENT_NAZWA,
                        SM.W_TRAKCIE,
                        SM.PRZYJECIE_ID,
                        SM.KOD_KRESKOWY
                        from STANY_MAGAZYNOWE SM
                        where PALETA_NUMER = '${fromPallet}' and KOD_PRODUKTU = (select CODE from tmp_transfers where ROW = @counter and SESSION = @session)
                    end

                
                if (select ILOSC from STANY_MAGAZYNOWE where PALETA_NUMER = '${fromPallet}' and KOD_PRODUKTU = (select CODE from tmp_transfers where ROW = @counter and SESSION = @session)) = (select NUMBER from tmp_transfers where ROW = @counter and SESSION = @session)
                    begin
                        delete from STANY_MAGAZYNOWE
                        where PALETA_NUMER = '${fromPallet}' and KOD_PRODUKTU = (select CODE from tmp_transfers where ROW = @counter and SESSION = @session)
                    end
                else
                    begin
                        update STANY_MAGAZYNOWE
                        set ILOSC = ILOSC - (select NUMBER from tmp_transfers where ROW = @counter and SESSION = @session)
                        where PALETA_NUMER = '${fromPallet}' and KOD_PRODUKTU = (select CODE from tmp_transfers where ROW = @counter and SESSION = @session)
                    end

                insert into TRANSFERS (DATA, FROM_PALLET, TO_PALLET, CARGO, NUMBER)
                values (getdate(), '${fromPallet}', '${toPallet}', (select CODE from tmp_transfers where ROW = @counter and SESSION = @session), (select NUMBER from tmp_transfers where ROW = @counter and SESSION = @session))
            
            set @counter = @counter - 1
            end
        
        delete from tmp_transfers
        where SESSION = @session 

        `)
    }
    catch (error) {
        console.log(error)
    };
};



/*
        ${cargo.map(item => {
            `
            


            
        `})}
        */

module.exports = {
    validateLogIn,
    setNewPasswrod,
    getNewOrdersData,
    getNewOrdersDetailsData,
    checkIfPallet,
    addScan,
    deduct,
    addToWh,
    deleteFromWh,
    closeOrder,
    getRemovalsData,
    getRemovalDetailsData,
    getTransfersData,
    transfer
};