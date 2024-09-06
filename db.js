const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'data',
    password: 'Somesh2002',
    port: 5432
})


export default pool;




// export async function createTasks(params) {
//     const {} = params;
//     const result = await pool.query('INSERT INTO person ()')
//     return result.rows
    
// }

// export async function deleteTasks(id) {
//     const result = await pool.query(`DELETE FROM person WHERE id=${id}`)
//     return result.rows
    
// }