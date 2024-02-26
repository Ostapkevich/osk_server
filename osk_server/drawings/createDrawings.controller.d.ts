import { AppService } from 'src/app.service';
import { ScanService } from 'src/drawings/scan.service';
import { DrawingService } from './drawing.service';
export declare class CreateDrawingsController {
    protected appService: AppService;
    private scanService;
    private dravingSerice;
    constructor(appService: AppService, scanService: ScanService, dravingSerice: DrawingService);
    saveDrawing(bodyData: any): Promise<{
        response: any;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    saveBlank(typeBlank: number, bodyData: any): Promise<{
        id: any;
        serverError?: undefined;
    } | {
        serverError: any;
        id?: undefined;
    }>;
    deleteBlank(typeBlank: number, id: number, idDrawing: number, newTypeBlank: number): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    deleteMaterial(id: number): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    addPositionSP(bodyData: any): Promise<{
        idParent: number;
        idChild: any;
        response?: undefined;
        serverError?: undefined;
    } | {
        response: string;
        idParent?: undefined;
        idChild?: undefined;
        serverError?: undefined;
    } | {
        serverError: any;
        idParent?: undefined;
        idChild?: undefined;
        response?: undefined;
    }>;
    saveAll(typeBlank: string, bodyData: any): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    addMaterial(bodyData: any): Promise<{
        id: any;
        serverError?: undefined;
    } | {
        serverError: any;
        id?: undefined;
    }>;
    findByID(idOrNumber: number | string, findBy: string): Promise<{
        notFound: string;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
        positionsSP?: undefined;
        serverError?: undefined;
    } | {
        drawing: any;
        blank: any;
        materials: any;
        positionsSP: any;
        notFound?: undefined;
        serverError?: undefined;
    } | {
        serverError: any;
        notFound?: undefined;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
        positionsSP?: undefined;
    }> | {
        serverError: any;
    };
    deletePositionSP(idDrawing: number, idParent: number, ind: number): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    changePositionSP(id1: number, ind1: number, id2: number, ind2: number): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    scan(): {
        scan: string[];
        serverError?: undefined;
    } | {
        serverError: any;
        scan?: undefined;
    };
}
