import jwt from "jsonwebtoken";

export default function authjwt(req,res,next){
    const header = req.header("Authorization");
    if (header != null){
        const token = header.replace("Bearer ", "");
        jwt.verify(token, "rendom123", (err, decoded) => {
            console.log("Decoded token:", decoded);
            if(decoded!=null){
                req.user = decoded;
            } 
        })
    }
    next();
}