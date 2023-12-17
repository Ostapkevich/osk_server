import { IProperties } from '../iNewOrder';

export class EditedOrderDTO {
  mainData: {
    order_machine: string;
    number_machine: string;
    name_machine: string;
    description: string;
    idcustomer: number;
    idcategory: number;
    shipment: string | null;
    oldNameOrder: string;
    weight:number;
    plan: string;
  };
  insertProps: Array<IProperties>;
  
}
