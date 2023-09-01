import { NextApiRequest, NextApiResponse } from "next";
import to from "await-to-js";
import pino from "pino";
import Stripe from "stripe";

import { WebhookEventModel } from "@/backend/data/webhooks";
import { verifyStripeWebhook } from "@/backend/util/webhooks";
import { TaskModel } from "@/backend/data/tasks";
import { dbConnect } from "@/backend/services/db";

const logger = pino({ name: "/src/pages/api/webhooks/payments.ts" });

const ERRORS = {
  METHOD_NOT_SUPPORTED: "Method Not Supported",
  INVALID_STRIPE_WEBHOOK: "Stripe Webhook Verification Failed",
  SAVE_WEBHOOK_FAILED: "Failed to save webhook event status to database",
  TASK_NOT_FOUND: "Task not found",
  UPDATE_WEBHOOK_STATUS_FAILED:
    "Failed to save webhook event status to database",
} as const;

async function handlePaymentIntentSucceeded(
  payload: Stripe.Event,
  res: NextApiResponse
) {
  logger.info({ id: payload.id }, "Stripe Payment Intent Succeeded");
  const { id } = payload;

  let err, task, existingEvent;
  [err, existingEvent] = await to(WebhookEventModel.findOne({ id }));

  if (existingEvent && existingEvent.status !== "rejected") {
    logger.info({ existingEvent }, "Duplicate Webhook Event");
    return res.status(200).json({ message: "duplicate" });
  }

  [err] = await to(
    WebhookEventModel.create({
      _id: id,
      source: "Stripe",
      status: "pending",
    })
  );

  if (err) {
    logger.error({ eventId: id }, ERRORS.SAVE_WEBHOOK_FAILED);

    return res
      .status(500)
      .json({ eventId: id, message: ERRORS.SAVE_WEBHOOK_FAILED });
  }

  const paymentIntent = payload.data.object as Stripe.PaymentIntent;
  const taskId = paymentIntent.metadata.taskId;

  [err, task] = await to(
    TaskModel.findOneAndUpdate(
      { _id: taskId },
      {
        paymentStatus: "Paid",
      }
    )
  );

  if (err || !task) {
    logger.error({ eventId: id, err, task, taskId }, ERRORS.TASK_NOT_FOUND);
    return res
      .status(404)
      .json({ eventId: id, message: ERRORS.TASK_NOT_FOUND });
  }

  [err] = await to(
    WebhookEventModel.updateOne({ _id: id }, { status: "success" })
  );

  if (err) {
    logger.error({ id }, ERRORS.UPDATE_WEBHOOK_STATUS_FAILED);

    return res
      .status(500)
      .json({ eventId: id, message: ERRORS.UPDATE_WEBHOOK_STATUS_FAILED });
  }

  return res.status(200).json({ taskId });
}

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    logger.info(ERRORS.METHOD_NOT_SUPPORTED);
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: ERRORS.METHOD_NOT_SUPPORTED });
  }

  await dbConnect();

  const verificationResult = await verifyStripeWebhook(req);

  if (verificationResult.type === "error") {
    logger.error(ERRORS.INVALID_STRIPE_WEBHOOK);

    return res.status(verificationResult.status).json({
      message: ERRORS.INVALID_STRIPE_WEBHOOK,
      error: verificationResult.error,
    });
  }

  const eventType = verificationResult.payload.type;

  switch (eventType) {
    case "payment_intent.succeeded":
      return await handlePaymentIntentSucceeded(
        verificationResult.payload,
        res
      );
    default:
      const message = "Skipped Stripe Webhook";
      logger.info({ event: eventType }, message);
      return res
        .status(200)
        .json({ message, type: eventType, id: verificationResult.payload.id });
  }
}
