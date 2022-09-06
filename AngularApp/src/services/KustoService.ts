import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
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

    constructor(private _httpClient: HttpClient) {
    }

    execute(kustoQuery: kustoQuery): Observable<HttpResponse<DataTableResponseObject>> {
        let request = this._httpClient.post<DataTableResponseObject>('https://localhost:7102/api/kusto/execute', kustoQuery, {
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