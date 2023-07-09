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
        SELECT 
        SM.*
        FROM STANY_MAGAZYNOWE SM with(nolock) 
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

const placeCheck = async ({ placeCode }) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        if exists (select 1 KOD_KRESKOWY from WH_PLACES where KOD  = '${placeCode}')
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

const submitPlace = async ({pallet, place}) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`

        update WH_CARRIERS
        set PLACE_ID = (select top 1 ID from WH_PLACES where KOD = '${place}')
        where KOD_KRESKOWY = '${pallet}'
       
        `)
    }
    catch (error) {
        console.log(error)
    };
};

const fetchPlace = async ({place}) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
                select top 1
                isnull(wp.ID,0) id,
                isnull(wp.OPIS,0) opis
                from WH_CARRIERS wc left join WH_PLACES wp on wc.PLACE_ID = wp.ID
                where wc.KOD_KRESKOWY = '${place}'
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const fetchCollectionData = async ({idOrder}) => {
    try {
        let pool = await sql.connect(config);
        let data = await pool.request().query(`
        select 
        sm.ID whId,
        sm.PALETA_NUMER,
        sm.KOD_PRODUKTU,
        sm.ILOSC,
        sm.KOD_KRESKOWY,
        b.placeId,
        b.placeOpis,
        b.placeCode,
        b.placeOrder,
        sm.KLIENT_ID,
		sm.KLIENT_NAZWA
        from STANY_MAGAZYNOWE sm outer apply (select
                                              wp.ID placeId,
                                              wp.OPIS placeOpis,
                                              wp.kod placeCode,
                                              wp.KOLEJNOSC placeOrder,
                                              wc.KOD_KRESKOWY palletCode
                                              from WH_CARRIERS wc inner join WH_PLACES wp on wc.PLACE_ID = wp.ID
                                              where sm.PALETA_NUMER = wc.KOD_KRESKOWY
                                              ) b
        where KOD_PRODUKTU in (
                              select 
                              ws.KOD_PROCUKTU
                              from WYDANIA w with(nolock) 
                              inner join WYDANIA_SZCZEGOLY ws with(nolock) on w.ID = ws.WYDANIE_ID
                              where w.id = ${idOrder}
                              and w.KLEINT_ID = sm.KLIENT_ID
                              )
      order by b.placeOrder 
        `)
        return data
    }
    catch (error) {
        console.log(error)
    };
};

const addItemToDatabase = async ({ ID }) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        update WYDANIA_SZCZEGOLY
        set ZESKANOWANE = isnull(ZESKANOWANE,0) + 1
        where id = ${ID} 
        `)
    }
    catch (error) {
        console.log(error)
    };
};

const takeFromInventory = async ({ ID }) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        declare @check int = (select ILOSC from STANY_MAGAZYNOWE where id = ${ID})
  
        if @check > 1
	        begin
		        update STANY_MAGAZYNOWE
		        set ILOSC = ILOSC - 1
		        where ID = ${ID}
	        end
        else
	        begin
		        delete from STANY_MAGAZYNOWE
		        where id = ${ID}
	    end
    `)
    }
    catch (error) {
        console.log(error)
    };
};

const closeRemovalOrder = async ({ ID }) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        
        update WYDANIA
        set OBSLUGA_KONIEC = getdate()
        where id = ${ID}

        delete from WYDANIA
        where id = ${ID}

        update WYDANIA_SZCZEGOLY
        set ROZBIEZNOSCI = ILOSC - isnull(ZESKANOWANE,ILOSC)
        where id = ${ID}

        delete from WYDANIA_SZCZEGOLY
        where WYDANIE_ID = ${ID}

        delete from WYDANIA_POZYCJE
        where WYDANIE_ID = ${ID}
    `)
    }
    catch (error) {
        console.log(error)
    };
};

const addToPossitions = async ({detailsId, whPlace, pallet, productCode, idRemovals, productBarcode, klinetId, klientNazwa, oldPallet, productName}) => {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
        if exists (select 1 from WYDANIA_POZYCJE where WYDANIE_SZCZEGOLY_ID = ${detailsId} and PALETA = '${pallet}' and KOD = '${productCode}' and hist_oldPallet = '${oldPallet}')
	        begin
		        update WYDANIA_POZYCJE
		        set ILOSC = isnull(ILOSC,0) + 1
		        where WYDANIE_SZCZEGOLY_ID = ${detailsId} 
                and PALETA = '${pallet}' 
                and KOD = '${productCode}'
	        end
        else 
	        begin
		        INSERT INTO WYDANIA_POZYCJE (WYDANIE_SZCZEGOLY_ID, PALETA, KOD, ILOSC, WYDANIE_ID, KOD_KREKOSWY_TOWARU, hist_whPlace, hist_klientId, hist_klientNazwa, hist_oldPallet, NAZWA_PRODUKTU)
		        VALUES (${detailsId}, '${pallet}', '${productCode}', 1, ${idRemovals}, '${productBarcode}', ${whPlace}, ${klinetId}, '${klientNazwa}', '${oldPallet}', '${productName}')
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
    deleteFromWh,
    closeOrder,
    getRemovalsData,
    getRemovalDetailsData,
    getTransfersData,
    transfer,
    placeCheck,
    submitPlace,
    fetchPlace,
    fetchCollectionData,
    addItemToDatabase,
    takeFromInventory,
    closeRemovalOrder,
    addToPossitions
};