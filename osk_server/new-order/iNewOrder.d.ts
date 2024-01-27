interface IProperties {
    order_machine?: string | undefined;
    property?: string;
    val?: string;
}
interface Iorder {
    mainData: {
        order_machine: string;
        number_machine: string;
        name_machine: string;
        description?: string;
        idcustomer: number;
        idcategory: number;
        shipment?: string | null;
        oldNameOrder?: string;
        weight?: number;
    };
    insertProps: Array<IProperties>;
}
export { IProperties, Iorder };
