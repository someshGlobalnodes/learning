
import pool from '../../../../db'
import { NextRequest , NextResponse } from 'next/server';





export async function PUT(req, { params }) {
  const { id } = params;
  const { name, age, city, phone_number, status, address } = await req.json();

  // Update person query
  const personUpdateQuery = `
    UPDATE data_table.person
    SET name = $1, age = $2, city = $3, phone_number = $4, status = $5
    WHERE id = $6
  `;
  const personValues = [name, age, city, phone_number, status, id];

  // Update address query (priority is fixed to 3)
  const updateAddressQuery = `
    UPDATE data_table.address
    SET address = $1, priority = 1
    WHERE person_id = $2
  `;

  const addressValues = [address, id ];  // No need to pass priority

  try {
    if (!id) {
      return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
    }

    // Update person data
    const personResp = await pool.query(personUpdateQuery, personValues);
    if (personResp.rowCount === 0) {
      return NextResponse.json({ error: 'No record found with the provided ID' }, { status: 404 });
    }

    // Update address data
    const addressResp = await pool.query(updateAddressQuery, addressValues , priority);

    return NextResponse.json({ person: personResp.rows[0], address: addressResp.rows[0] }, { status: 201 });

  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
