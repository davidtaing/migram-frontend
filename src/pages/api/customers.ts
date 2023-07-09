import { NextApiRequest, NextApiResponse } from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import pino from "pino";

import { CustomerModel } from "@/backend/data/customers";
import { authenticate } from "@/backend/middlewares/auth";
import { dbConnect } from "@/backend/services/db";
import { stripe } from "@/backend/services/payments";
import { getPrimaryEmailAddress } from "@/backend/services/users";
import { UserMetadata } from "@/backend/services/users/types";

const logger = pino({ name: "/src/pages/api/customers.ts" });

const ERRORS = {
  METHOD_NOT_SUPPORTED: "Method Not Supported",
  AUTHENTICATION_FAILED: "Authentication Failed",
  PROVIDER_SIGNUP_PROHIBITED: "Service Providers cannot sign up as Customers",
  STRIPE_CUSTOMER_ALREADY_REGISTERED:
    "Stripe Customer has already been registered",
  PRIMARY_EMAIL_MISSING: "Error getting primary email address for user",
} as const;

async function createStripeCustomer(req: NextApiRequest, res: NextApiResponse) {
  const authResult = await authenticate(req);

  if (authResult.type === "error") {
    logger.error({ authResult }, ERRORS.AUTHENTICATION_FAILED);
    return res.status(authResult.status).json({ message: authResult.message });
  }

  const { user, userId } = authResult;

  const userMetadata = user.publicMetadata as UserMetadata;

  if (userMetadata.role === "service-provider") {
    logger.error(ERRORS.PROVIDER_SIGNUP_PROHIBITED);
    return res.status(403).json({
      message: ERRORS.PROVIDER_SIGNUP_PROHIBITED,
    });
  }

  const existingCustomer = await CustomerModel.findById(userId);

  if (existingCustomer) {
    logger.error(ERRORS.STRIPE_CUSTOMER_ALREADY_REGISTERED);
    return res
      .status(400)
      .json({ message: ERRORS.STRIPE_CUSTOMER_ALREADY_REGISTERED });
  }

  const emailAddressResult = getPrimaryEmailAddress(user!);

  if (emailAddressResult.type === "error") {
    logger.error({ userId: user.id }, ERRORS.PRIMARY_EMAIL_MISSING);

    return res.status(500).send({
      message:
        "We failed to retrieve an email address from our end. Please try again later.",
    });
  }

  const params = {
    email: emailAddressResult.email,
    metadata: {
      userId,
    },
  };

  const stripeCustomer = await stripe.customers.create(params);
  const stripeCustomerId = stripeCustomer.id;

  const newCustomer = await CustomerModel.create({
    _id: userId,
    customerId: stripeCustomerId,
  });

  await clerkClient.users.updateUser(userId, {
    publicMetadata: { customerId: stripeCustomerId, role: "customer" },
  });

  const message = `Successfully Created Stripe Customer for ${userId}`;
  logger.info({ customer: newCustomer }, message);

  return res.status(200).json({
    data: newCustomer,
    message: message,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: ERRORS.METHOD_NOT_SUPPORTED });

  await dbConnect();
  return await createStripeCustomer(req, res);
}
