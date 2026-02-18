import type { Request, Response, NextFunction } from 'express';
import { vehicleService } from '../services/vehicles.service.js';

export const getBrands =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.getBrands(req, res, next)
};

export const getModels =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.getModels(req, res, next)
};

export const getVehicles =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.getVehicles(req, res, next)
};

export const getVehicle =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.getVehicle(req, res, next)
};

export const newVehicle =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.newVehicle(req, res, next)
};

export const deleteVehicle =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.deleteVehicle(req, res, next)
};

export const getVehicleImages =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.getVehicleImages(req, res, next)
};

export const newVehicleImage =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.newVehicleImage(req, res, next)
};

export const deleteVehicleImage =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.deleteVehicleImage(req, res, next)
};