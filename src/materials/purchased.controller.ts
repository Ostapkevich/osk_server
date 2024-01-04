import { AppService } from "src/app.service";
import { MaterailsController } from "./materials.controller";
import { Controller } from "@nestjs/common";

@Controller('/purchased')
export class PurchasedController extends MaterailsController {
constructor(protected appService: AppService){
   super(appService)
    this.itemTable='purchased';
    this.categoryTable='purchased_type';
}
}