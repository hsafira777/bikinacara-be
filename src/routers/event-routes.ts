import express from "express";
import { getFilteredEventsHandler } from "../controllers/getFilteredEvents";

const FilteredEventsRouter = express.Router();

FilteredEventsRouter.get("/filter", getFilteredEventsHandler);

export default FilteredEventsRouter;
