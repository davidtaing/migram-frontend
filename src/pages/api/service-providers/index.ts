import { NextApiRequest, NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs";
import pino from "pino";

import { ServiceProviderModel } from "@/backend/data/serviceproviders";
import { authenticate } from "@/backend/middlewares/auth";
import {
  createStripeConnectAccount,
  createStripeConnectRedirectLink,
} from "@/backend/services/payments/connect";
import { getPrimaryEmailAddress } from "@/backend/services/users";
import { UserMetadata } from "@/backend/services/users/types";
import { dbConnect } from "@/backend/services/db";

const logger = pino({ name: "api/service-providers" });

async function createServiceProvider(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authResult = await authenticate(req);

  if (authResult.type === "error")
    return res.status(authResult.status).json({ message: authResult.message });

  const { user, userId } = authResult;

  const userMetadata = user.publicMetadata as UserMetadata;

  if (userMetadata.role === "customer")
    return res.status(400).json({
      message: "Bad Request: Customers cannot sign up as Service Providers",
    });

  await dbConnect();

  const emailAddressResult = getPrimaryEmailAddress(user!);

  if (emailAddressResult.type === "error") {
    logger.error(
      { userId: user.id },
      "Error getting primary email address for user"
    );

    return res.status(500).end("Internal Server Error");
  }

  let serviceProviderId: string;
  const existingServiceProvider = await ServiceProviderModel.findById(userId);

  if (!existingServiceProvider) {
    const stripeAccount = await createStripeConnectAccount({
      userId,
      email: emailAddressResult.email,
    });

    serviceProviderId = stripeAccount.id;

    await ServiceProviderModel.create({
      _id: userId,
      serviceProviderId,
    });

    logger.info(
      { serviceProviderId, userId },
      `Created Stripe Connect Account for ${userId}`
    );
  } else {
    const message = "Stripe Service Provider has already been registered";
    logger.error(message);
    serviceProviderId = existingServiceProvider.serviceProviderId;
  }

  logger.info(
    { serviceProviderId },
    "Generating Stripe Connect Onboarding Link"
  );

  const stripeConnectLink = await createStripeConnectRedirectLink(
    serviceProviderId
  );

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      serviceProviderId,
      role: "service-provider",
      onboardingStatus: "pending",
      onboardingUrl: stripeConnectLink.url,
    },
  });

  return res.status(200).json({
    data: { serviceProviderId },
    message:
      "Please follow the redirect link to complete onboarding via Stripe.",
    redirect: stripeConnectLink.url,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Supported" });

  return await createServiceProvider(req, res);
}
