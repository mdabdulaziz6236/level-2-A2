import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { TIssue } from "./issue.interface"
import config from '../../config'
import { pool } from '../../db'
import { USER_ROLE } from '../../types'


const issueCreateIntoDB = async (payload: TIssue, req: any) => {

    const { description, title, type } = payload
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


const issueDeleteFromDB = async (id: string, req: any) => {
    const token = req.headers.authorization
    if (!token) {
        throw new Error("Unauthorized")
    }
    let decoded: JwtPayload
    try {
        decoded = jwt.verify(
            token,
            config.secret as string
        ) as JwtPayload
    } catch {
        throw new Error("Invalid or expired token")
    }
    req.user = decoded
    // role check
    if (req.user.role !== USER_ROLE.maintainer) {
        throw new Error("Forbidden")
    }
    const result = await pool.query(
        `DELETE FROM issues WHERE id=$1`,
        [id]
    )
    if (result.rowCount === 0) {
        throw new Error("Issue Not Found")
    }
    console.log(result)
    return result.rows[0]
}
export const issueService = {
    issueCreateIntoDB,
    issueDeleteFromDB
}