import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

export const hashedPassword = async (userValue) => {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(userValue, salt)
    return password;
}

export const comparePassword = async (userPassword , password) => {
    try {
        const isMatch = await bcrypt.compare(userPassword , password)
        return isMatch;
    } catch (error) {
        console.log(error )
    }
}

export const createJWT = (id) => {
    return jwt.sign(
     { userId : id} , process.env.JWT_SECRET , {
            expiresIn : '1d'
        }
    )
}