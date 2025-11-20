// backend/src/middleware/auth.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization || req.header("Authorization");
    console.log(">> requireAuth - Authorization header:", auth);

    if (!auth || !auth.startsWith("Bearer ")) {
      console.warn("requireAuth: missing or malformed Authorization header");
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    const token = auth.split(" ")[1];
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
      console.log(">> requireAuth - decoded payload:", payload);
    } catch (errVerify) {
      // Try decode for debugging (non-verifying) so you can see content if verification failed
      const decoded = jwt.decode(token);
      console.warn("requireAuth: jwt.verify failed. jwt.decode:", decoded);
      console.error("requireAuth verify error:", errVerify);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Check where user id is stored in the token payload
    const userId = payload.sub || payload.id || payload.userId || payload.uid;
    if (!userId) {
      console.warn("requireAuth: could not find user id in token payload");
      console.warn("payload keys:", Object.keys(payload || {}));
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    (req as any).user = { id: userId };
    console.log("requireAuth: attaching user id to req:", userId);
    return next();

  } catch (err) {
    console.error("requireAuth top-level error:", err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
