import { Observable } from "rxjs";

export interface RequestPostUpload {
  extension: string;
  size: number;
  name: string;
  buffer: Buffer;
  user_id: number;
}

export interface ResponseUpload {
  status: number;
  message: string;
  data: any;
}

export interface RequestExportTimeOff {
  columns: {
    name: string;
    code: string;
    department_name: string;
    position_name: string;
    division_name: string;
    start_date: string;
    number_of_day: string;
    has_money: string;
    no_money: string;
    type_name: string;
    reason: string;
  };
  data: any;
  start_date: string;
  end_date: string;
}

export interface FileServiceClient {
  postUploadImage(body: RequestPostUpload): Observable<ResponseUpload>;

  getExportTimeOff(payload: RequestExportTimeOff): Observable<ResponseUpload>;
}
