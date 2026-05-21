import bcrypt from 'bcrypt'
import { pool } from '../../db';



const signupUserIntoDB = async (payload: any) => {

    const { name, email, password, role } = payload
    const isUserExists = await pool.query(
        ` SELECT * FROM users WHERE email = $1`,
        [email]
    )
    if (isUserExists.rows.length > 0) {
        throw new Error('User already exists')
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
        INSERT INTO users(name, email, password, role) 
        VALUES($1,$2,$3,COALESCE($4,'contributor')) 
        RETURNING *
        `, [name, email, hashPassword, role])
    delete result.rows[0].password;
    return result
}




export const authService = {
    signupUserIntoDB
}