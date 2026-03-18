import type {Model} from "./Model.ts";

export interface Brand {
    brand_id: string;
    brand_name: string;
    models: Model[];
}