import { NextApiRequest, NextApiResponse } from "next";
import pino from "pino";

import { OfferModel } from "@/backend/data/offers";
import { TaskModel } from "@/backend/data/tasks";
import { authenticate } from "@/backend/middlewares/auth";
import { dbConnect } from "@/backend/services/db";

const ERRORS = {
  METHOD_NOT_SUPPORTED: "Method Not Supported",
  AUTHENTICATION_FAILED: "Authentication Failed",
  OFFER_NOT_FOUND: "Offer not found",
  OFFER_ALREADY_APPROVED: "An offer has already been approved",
  TASK_NOT_FOUND: "The task that offer belongs to could not be found.",
  TASK_STATUS_NOT_OPEN: "Tasks cannot be approved if the status is not 'Open'",
  UNAUTHORIZED: "You are not allowed to access this resource",
} as const;

const logger = pino({ name: "/src/pages/api/offers/[id]/approve.ts" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: ERRORS.METHOD_NOT_SUPPORTED });

  const { id } = req.query;

  const authResult = await authenticate(req);

  if (authResult.type === "error") {
    logger.error({ authResult }, ERRORS.AUTHENTICATION_FAILED);
    return res.status(authResult.status).json({ message: authResult.message });
  }

  await dbConnect();

  const offer = await OfferModel.findOne({ _id: id });

  if (!offer) {
    logger.error(ERRORS.OFFER_NOT_FOUND);
    return res.status(404).json({ message: ERRORS.OFFER_NOT_FOUND });
  }

  const task = await TaskModel.findOne({ _id: offer.task });

  if (!task) {
    logger.error(ERRORS.TASK_NOT_FOUND);
    return res.status(404).json({ message: ERRORS.TASK_NOT_FOUND });
  }

  const isTaskOwner = authResult.userId === task?.userId;

  if (!isTaskOwner) {
    logger.error(ERRORS.UNAUTHORIZED);
    return res.status(403).json({ message: ERRORS.UNAUTHORIZED });
  }

  if (task.status !== "Open") {
    logger.error(ERRORS.TASK_STATUS_NOT_OPEN);
    return res.status(400).json({
      message: ERRORS.TASK_STATUS_NOT_OPEN,
    });
  }

  if (task.acceptedOffer) {
    logger.error(ERRORS.OFFER_ALREADY_APPROVED);
    return res.status(400).json({ message: ERRORS.OFFER_ALREADY_APPROVED });
  }

  const otherOffersFilter = {
    task: task._id,
    _id: { $ne: offer._id },
  };

  await OfferModel.updateMany(otherOffersFilter, {
    status: "Rejected",
  });

  offer.set({ status: "Accepted" });
  task.set({ status: "In Progress", acceptedOffer: offer._id });

  await Promise.all([offer.save(), task.save()]);

  return res.status(200).json({
    data: {
      task: task._id,
      offerId: offer._id,
    },
  });
}
