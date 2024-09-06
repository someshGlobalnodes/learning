
import pool from '../../../../db'
import { NextRequest , NextResponse } from 'next/server';


export  async function DELETE(req, {params} ) {
  console.log(params)
  const id =  req.nextUrl.searchParams;

    if (!id) {
        return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
      }

    try{
        if(id){
        const resp = await pool.query(`DELETE FROM data_table.person WHERE id =${id}`)
        return NextResponse.json( {resp:resp},{status:200});
        }
        else{
            throw new Error("Error Deletion Record!")    
            }
    }catch (error){
        console.error('Error executing query', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
     
 }