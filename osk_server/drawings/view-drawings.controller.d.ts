import { AppService } from 'src/app.service';
export declare class ViewDrawingsController {
    private appService;
    constructor(appService: AppService);
    viewDrawings(searchParams: any): Promise<{
        notFound: string;
        drawings?: undefined;
        serverError?: undefined;
    } | {
        drawings: any;
        notFound?: undefined;
        serverError?: undefined;
    } | {
        serverError: any;
        notFound?: undefined;
        drawings?: undefined;
    }>;
}
