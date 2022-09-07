import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";
import { Observable } from "rxjs";

export interface kustoQuery {
    StartTime: string;
    EndTime: string;
    ClusterName: string;
    DatabaseName: string;
    QueryText: string;
    OperationName: string;
}

export interface DataTableResponseObject {
    tableName: string;
    columns: DataTableResponseColumn[];
    rows: any[][];
}

export interface DataTableResponseColumn {
    columnName: string;
    dataType?: string;
    columnType?: string;
}

@Injectable()
export class KustoService {

    serviceUrl: string = '/api/kusto/execute';

    constructor(private _httpClient: HttpClient) {
        if (isDevMode()) {
            this.serviceUrl = 'https://localhost:7102/api/kusto/execute'
        }
    }

    execute(kustoQuery: kustoQuery): Observable<HttpResponse<DataTableResponseObject>> {
        let request = this._httpClient.post<DataTableResponseObject>(this.serviceUrl, kustoQuery, {
            headers: this._getHeaders(),
            observe: 'response'
        });

        return request;
    }

    private _getHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Accept', 'application/json');
        return headers;
    }
}