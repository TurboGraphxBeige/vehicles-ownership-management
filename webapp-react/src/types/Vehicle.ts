import type {Model} from "./Model";
import type {Service} from "./Service";
import type {Photo} from "./Photo";
import type {Observation} from "./Observation";

export interface Vehicle {
    vehicle_id: string;
    user_id: string;
    services: Service[];
    purchase_date: string;
    pricePaid: number;
    photos?: Photo[] | null;
    observations: Observation[];
    model: Model;
    making_year: string;
    // main_picture, which type exactly?
    main_picture: string;
    invoice: string;
    contact_id: string;
}