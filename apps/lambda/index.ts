import type {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import Expo from "expo-server-sdk";
import moment from "moment";

import { and, eq, lte } from "@arozvit/db";
import { db } from "@arozvit/db/client";
import {
  ExpoPushToken,
  Notification,
  NotificationPlant,
  Plant,
} from "@arozvit/db/schema";

const expo = new Expo({
  useFcmV1: true,
});

export const handler = async (
  _: APIGatewayEvent,
  __: Context,
): Promise<APIGatewayProxyResult> => {
  const tokens = await db
    .select({ token: ExpoPushToken.token, userId: ExpoPushToken.userId })
    .from(ExpoPushToken);

  const messages = [];

  for (const token of tokens) {
    if (!Expo.isExpoPushToken(token.token)) {
      console.error(
        `Push token ${token.token as string} is not a valid Expo push token`,
      );
      continue;
    }

    const plantWithWateringNeed = await db
      .select({
        nextWatering: Plant.nextWatering,
        id: Plant.id,
        name: Plant.name,
      })
      .from(Plant)
      .where(
        and(
          eq(Plant.userId, token.userId),
          lte(Plant.nextWatering, moment().toDate()),
        ),
      );

    if (plantWithWateringNeed.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No plant to water" }),
      };
    }

    messages.push({
      to: token.token,
      title: "Arrosage à venir",
      body:
        plantWithWateringNeed.length > 1
          ? `${plantWithWateringNeed.length} plantes ont besoin d'un arrosage`
          : `${plantWithWateringNeed[0]?.name} a besoin d'un arrosage`,
      data: {},
    });

    try {
      const notification = await db
        .insert(Notification)
        .values({
          userId: token.userId,
          content:
            plantWithWateringNeed.length > 1
              ? "Des plantes ont besoin d'un arrosage"
              : "Une plante a besoin d'un arrosage",
          isRead: false,
        })
        .returning({ id: Notification.id });

      if (!notification[0]) throw new Error("Notification not created");

      for (const plant of plantWithWateringNeed) {
        await db.insert(NotificationPlant).values({
          notificationId: notification[0].id,
          plantId: plant.id,
        });
      }
    } catch (e) {
      console.log(
        "Une erreur est survenue lors de l'insertion de la notification",
        e,
      );
    }
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  await (async () => {
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Notifications sent" }),
  };
};
