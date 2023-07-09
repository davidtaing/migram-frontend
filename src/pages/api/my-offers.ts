import { NextApiRequest, NextApiResponse } from "next";
import pino from "pino";

import { OfferModel } from "@/backend/data/offers";
import { dbConnect } from "@/backend/services/db";
import { authenticate } from "@/backend/middlewares/auth";
import { UserMetadata } from "@/backend/services/users/types";
import { TaskModel } from "@/backend/data/tasks";

const logger = pino({ name: "/src/pages/api/my-offers.ts" });

const ERRORS = {
  METHOD_NOT_SUPPORTED: "Method Not Supported",
  AUTHENTICATION_FAILED: "Authentication Failed",
  UNAUTHORIZED: "You are not allowed to access this resource",
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: ERRORS.METHOD_NOT_SUPPORTED });

  const authResult = await authenticate(req);

  if (authResult.type === "error") {
    logger.error({ authResult }, ERRORS.AUTHENTICATION_FAILED);
    return res.status(authResult.status).json({ message: authResult.message });
  }

  const userMetadata = authResult.user.publicMetadata as UserMetadata;

  if (userMetadata.role !== "service-provider") {
    logger.error(ERRORS.UNAUTHORIZED);
    return res.status(403).json({ message: ERRORS.UNAUTHORIZED });
  }

  await dbConnect();

  const offers = await OfferModel.find({
    userId: authResult.userId,
  })
    .populate({
      path: "task",
      model: TaskModel,
    })
    .exec();

  return res.status(200).json({ data: offers });
}
