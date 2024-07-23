import { IHour } from "./IHour";

export interface ISummary {
    date?: string;
    hour: IHour;
    total?: number;
    selectedDate?: string;
}
