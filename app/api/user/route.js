
import pool from '../../../db'
import { NextResponse } from 'next/server'


export  async  function GET(req) {
    try{
     const result = await pool.query('SELECT * FROM data_table.person')
      return  NextResponse.json(result.rows)
    }catch (error){
     console.error('Error executing query' , error)
     return NextResponse.json({error : 'Internal Server Error'}, {status : 500})
    }
     
 }


//  export const POST = async (req , res) => {
//     const data = await req.json()
//     const {name , age, city, address, phone_number , status } = data

//     console.log(data)
//     try{

//       const query = '`INSERT INTO data_table.person(name, age, city, address, phone_number, status) VALUES($1) '
//       const values= [req.body.content]
//       const result = await pool.query(
//        query,
//        values
//       );
//       console.log(result)
//      return  NextResponse.json(result.rows[0] , {status:201})
//     }catch (error){
//       return NextResponse.json({error : 'Internal Server Error'}, {status : 500})
//     }
//  }

export const POST = async (req) => {
   const data = await req.json();
   const { name, age, city, address, phone_number, status } = data;



  try {
    // Parameterized query to prevent SQL injection
    const query = `
      INSERT INTO data_table.person (name, age, city, address, phone_number, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    const values = [name, age, city, address, phone_number, status];
    
    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error executing query', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};