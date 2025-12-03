// middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { userId: number; role: string } | undefined;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
};
