import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { pool } from '../../db';
import type { TUser } from './auth.interface';
import config from '../../config';



const signupUserIntoDB = async (payload: TUser) => {

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
    return result.rows[0]
}


const loginUserIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    /* 1. check if the user exists */

    const userData = await pool.query(
        ` SELECT * FROM users WHERE email=$1 `,
        [email]
    )
    if (userData.rowCount === 0) {
        throw new Error("Invalid email")
    }
    const user = userData.rows[0]
    /* 2. compare the password */
    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
        throw new Error("Invalid password")
    }

    /* Generate Token */

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
    }
    const accessToken = jwt.sign(jwtPayload, config.secret as string, { expiresIn: '1d' })


    delete user.password
    return { 'token': accessToken, 'user': user }
}



export const authService = {
    signupUserIntoDB,
    loginUserIntoDB
}