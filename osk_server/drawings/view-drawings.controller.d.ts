import { AppService } from 'src/app.service';
import { Response } from 'express';
export declare class ViewDrawingsController {
    private appService;
    constructor(appService: AppService);
    downloadFile(res: Response, path: string): void;
    viewDrawings(searchParams: any): Promise<{
        drawings: any[];
        notFound?: undefined;
        serverError?: undefined;
    } | {
        notFound: string;
        drawings?: undefined;
        serverError?: undefined;
    } | {
        serverError: any;
        drawings?: undefined;
        notFound?: undefined;
    }>;
}
