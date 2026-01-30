import { Brand } from './brand';
import { VehicleModel } from './model';
import { Vehicle } from './vehicle';
import { VehiclePhoto } from './vehicle_photo';
import { Observation } from "./observation"
import { User } from './user';

export function initAssociations() {
    Vehicle.belongsTo(VehicleModel, { foreignKey: 'model_id', as: 'model' });
    VehicleModel.hasOne(Vehicle, { foreignKey: 'model_id', as: 'vehicle' });

    Vehicle.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasOne(Vehicle, { foreignKey: 'user_id', as: 'vehicle' });

    Brand.hasMany(VehicleModel, { foreignKey: 'brand_id', as: 'models' });
    VehicleModel.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

    Vehicle.hasMany(VehiclePhoto, { foreignKey: 'vehicle_id', as: 'photos' });
    VehiclePhoto.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

    Vehicle.hasMany(Observation, { foreignKey: 'vehicle_id', as: 'observations' });
    Observation.hasOne(Vehicle, { foreignKey: 'vehicle_id', as: 'observations' });
}