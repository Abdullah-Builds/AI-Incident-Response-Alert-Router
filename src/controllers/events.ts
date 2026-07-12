import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";


// get the events ?page=1&limit=100&order=desc
export const getEvents = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const orderQuery = String(req.query.order || "desc").toLowerCase();
        const order: 'asc' | 'desc' = orderQuery === 'asc' ? 'asc' : 'desc';

        const events = await prisma.event.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                receivedAt: order,
            } as any,
        });
        return res.status(200).json(events);

    }  catch(error){
       if (error instanceof Error){
         return res.status(401).json({message : error.message})
       }
       return res.status(401).json({message : "Unknown Error"})
    }
}


//get ?status=active
export const getEventsByStatus = async (req: Request, res: Response) => {
    try {
        const status = req.query.status as string;

        const events = await prisma.event.findMany({
            where: {
                status,
            },
        });
        return res.status(200).json(events);

    } catch(error){
       if (error instanceof Error){
         return res.status(401).json({message : error.message})
       }
       return res.status(401).json({message : "Unknown Error"})
    }
}


//delete Events
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const to_delete = req.body.to_delete as string;

        if (!to_delete || typeof to_delete !== "string") {
            return res.status(401).json({ message: "Invalid" });
        }

        const deletedEvent = await prisma.event.delete({
            where: {
                id: to_delete,
            },
        });

        return res.status(200).json(deletedEvent);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ message: error.message });
        }
        return res.status(401).json({ message: "Unknown Error" });
    }
}

//?123/status
export const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = Array.isArray(id) ? id[0] : id;

    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required",
      });
    }

    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        status: "not_active",
      },
    });

    return res.status(200).json({
      message: "Event status updated successfully",
      event,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unknown error",
    });
  }
};