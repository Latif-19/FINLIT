// ─── Simulation Service (FR-5) ───────────────────────────────────────────────
// Backend endpoints: POST /simulations/save, GET /simulations/history
// Note: Calculations are done client-side. Backend only stores user parameters + results.

import { api } from "./api";
import type { SimulationSaveRequest, SimulationSaveResponse, SimulationRecord } from "@/types/api";

export const simulationService = {
  saveSimulation: (data: SimulationSaveRequest) =>
    api.post<SimulationSaveResponse>("/simulations/save", data),

  getHistory: () =>
    api.get<SimulationRecord[]>("/simulations/history"),
};
