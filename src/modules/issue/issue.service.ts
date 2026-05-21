import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { TIssue } from "./issue.interface"
import config from '../../config'
import { pool } from '../../db'


const issueCreateIntoDB = async (payload: TIssue, req: any) => {

    const { description, title, type } = payload
    console.log(description, title, type)
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Unauthorized")
    }
    let decoded: JwtPayload
    try {
        decoded = jwt.verify(token, config.secret as string) as JwtPayload
    } catch (err) {
        throw new Error("Invalid or expired token")
    }
    req.user = decoded
    const userData = await pool.query(` 
        SELECT * FROM users WHERE email=$1
        `, [req.user.email])
    if (userData.rowCount === 0) {
        throw new Error("User Not Found")
    }
    const result = await pool.query(` 
        INSERT INTO issues(description, title, type, reporter_id) VALUES($1,$2,$3,$4)
        RETURNING * `, [description, title, type, req.user.id])

    return result.rows[0]
}


export const issueService = {
    issueCreateIntoDB
}