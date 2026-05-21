export interface TUser {
    name: string,
    email: string,
    password: string,
    role?: "contributor" | "maintainer"
}

export interface TUserLogin {
    email: string,
    password: string
}