import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class UtilityService {

  constructor(
    private http: HttpClient
  ) { }

  etherToCurrency(): Observable<any> {
    return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR');
  }

  sendEmail(mailObject: any): Observable<any> {
    const mailApi = 'https://jsonplaceholder.typicode.com/posts';
    return this.http.post(mailApi, mailObject);
  }
}
