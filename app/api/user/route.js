
import pool from '../../../db'
import { NextResponse } from 'next/server'


export  async  function GET(req) {
    try{
     const result = await pool.query('SELECT * FROM data_table.person')
      return  NextResponse.json(result.rows)
    }catch (error){
     console.error('Error executing query' , error)
     return NextResponse.json({error : 'Internal Server Error'})
    }
     
 }