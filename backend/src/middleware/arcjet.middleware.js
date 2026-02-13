import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export async function arcjetProjection(req, res, next){
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit())  return res.status(429).json({ message: "Rate Limit exceeded. Please Try Again Later" });
            else if (decision.reason.isBot())   return res.status(429).json({ message: "Bot access Denied" });
            else    return res.status(403).json({ message: "Access Denied By Security Policy" })
        }
        if (decision.results.some(isSpoofedBot)) {  // Check for spoofed Bots
            return res.status(403).json({message:"Malicious Bot Activity Detected",error:"Spoofed Bot Detected"})
        } 
        next();
    } catch (error) {
        console.error("Arcjet Protection Error:", error);
        next();
    }
}
