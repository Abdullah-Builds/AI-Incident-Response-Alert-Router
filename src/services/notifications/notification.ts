import prisma from "../../db/prisma";

export async function markNotificationSent(notificationId: string): Promise<void> {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: "SENT",
        sent: true,
      },
    });
  } catch (error) {
    console.error(`Failed to mark notification ${notificationId} as SENT`, error);
    throw error;
  }
}

export async function markNotificationFailed(notificationId: string): Promise<void> {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: "FAILED",
        retryCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error(`Failed to mark notification ${notificationId} as FAILED`,error);
    throw error;
  }
}

export async function createNotification(channel : string, incidentId : string) : Promise<string>{
    
   try {
    const notification = await prisma.notification.create({
      data: {
        channel,
        status: "PENDING",
        incident: {
          connect: {
            id: incidentId,
          },
        },
      },
    });

    return notification.id;
  } catch (error) {
    console.error(error);
    throw error;
  }
      
}