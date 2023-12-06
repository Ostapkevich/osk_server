import { IProperties } from './interfaseNewOrder';

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
  };
  updateInsertProps: Array<IProperties>;
  deleteProps: Array<IProperties>;
}
