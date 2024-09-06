
import pool from '../../../db'
import { NextResponse } from 'next/server';


export default async function DEL(id) {
    const { id } = req.query;
    try{
        const result = await pool.query(`DELETE FROM person WHERE id=${id}`)
        return NextResponse.json( result.rows ,{ message: 'User deleted successfully' });
    }catch (error){
        console.error('Error executing query', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
     
 }