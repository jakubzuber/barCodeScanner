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
    }
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
    }
}

module.exports = {
    validateLogIn,
    setNewPasswrod
};