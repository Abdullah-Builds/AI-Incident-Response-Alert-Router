import prisma from "../db/prisma.ts";

export type IncidentPayload = {
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical" ;
  summary: string;
  recommended_action: string[];
};
const validSeverities = ["Low", "Medium", "High", "Critical"] as const;


export async function Parser(notificationId : string) : Promise<{payload : IncidentPayload, notification : Object }>{
    try{
       const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
      include: {
        incident: true,
      },
    });
    if(!notification){
        throw new Error("Notification not found")
    }

    if (!validSeverities.includes(notification?.incident.severity as any)) {
      throw new Error("Invalid severity");
    }

    const payload: IncidentPayload = {
      title: notification?.incident.title ?? "",
      severity: notification?.incident.severity  as IncidentPayload["severity"],
      summary: notification?.incident.summary ?? "",
      recommended_action: notification?.incident.recommended_action as string[],
    };
    return {payload,notification};

    }catch(error){
        console.error(error)
        throw error
    }
   
}