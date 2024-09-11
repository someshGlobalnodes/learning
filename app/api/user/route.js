
import pool from '../../../db'
import { NextResponse } from 'next/server'


export async function GET(req) {
  try {
    // Check if the address table exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'data_table' 
        AND table_name = 'address'
      ) AS table_exists;
    `;
    
    const tableCheckResult = await pool.query(tableCheckQuery);
    const tableExists = tableCheckResult.rows[0].table_exists;

    let query;
    if (tableExists) {
      // Address table exists, include address data
      query = `
        SELECT 
          person.id, 
          person.name, 
          person.age, 
          person.city, 
          person.phone_number, 
          person.status, 
          person.isChecked, 
          address.address AS address, 
          address.priority
        FROM 
          data_table.person
        LEFT JOIN 
          data_table.address
        ON 
          person.id = address.person_id
        WHERE 
          address.priority = 1
        OR address.priority IS NULL;
      `;
    } else {
      // Address table does not exist, exclude address data
      query = `
        SELECT 
          person.id, 
          person.name, 
          person.age, 
          person.city, 
          person.phone_number, 
          person.status, 
          person.isChecked, 
          NULL AS address, 
          NULL AS priority
        FROM 
          data_table.person;
      `;
    }

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export const POST = async (req) => {
   const data = await req.json();
   const { name, age, city, phone_number, address , status } = data;



  try {
    // Parameterized query to prevent SQL injection
    const query = `
      INSERT INTO data_table.person (name, age, city, phone_number, status)
      VALUES ($1, $2, $3, $4, $5)
         RETURNING id;
    `;
    
    const values = [name, age, city, phone_number, status];
    
    const result = await pool.query(query, values);
    const personId = result?.rows[0]?.id

    const insertAddressQuery = `
    INSERT INTO data_table.address (address, person_id, priority)
    VALUES ($1, $2, $3);
  `;

  const addressPriority = 1;
  const addressValues = [address, personId, addressPriority];

  const response = await pool.query(insertAddressQuery, addressValues);

  

  return NextResponse.json({ person: result.rows[0], address: response.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error executing query', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export  async function DELETE(req ) {
  const { id } = await req.json();
  console.log(id)

    if (!id) {
        return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
      }

    try{
        if(id){
          const resp = await pool.query(
            `DELETE FROM data_table.person WHERE id = ANY($1::int[])`,
            [id]
          );
      
          if (resp.rowCount === 0) {
            return NextResponse.json({ error: 'No record found with the provided ID' }, { status: 404 });
        }
          return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 });
        }
        else{
            throw new Error("Error Deletion Record!")    
            }
    }catch (error){
        console.error('Error executing query', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
     
 }