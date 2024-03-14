import { AppService } from 'src/app.service';
export declare class ViewDrawingsController {
    private appService;
    constructor(appService: AppService);
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
