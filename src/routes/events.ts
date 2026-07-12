import express from "express"
import {getEvents,getEventsByStatus,deleteEvent,updateEventStatus} from "../controllers/events";

const EventsRouter = express.Router()

EventsRouter.get('/all',getEvents);
EventsRouter.get('/status',getEventsByStatus)
EventsRouter.delete('/delete',deleteEvent)
EventsRouter.patch("/:id/status", updateEventStatus);
export default EventsRouter;