
import pool from '../../../db'
import { NextRequest , NextResponse } from 'next/server';


export default async function CREATE() {
 
    const data = {  isChecked}

   try{
     const res = await pool.query(`INSERT INTO data_table.person ${data} VALUES ${params} `)
   }catch(error){
    console.log(error)
   }
     
 }


 



