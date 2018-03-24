import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class RegisterService {

  private registerUrl: string = environment.api + 'cryptoipl/saveInfo';

    constructor(private http: HttpClient) { }

    saveInfo(user) {
      let url = environment.api + 'cryptoipl/';
      if (user._id) {
        console.log('update');
        url += user._id + '/updateinfo';
      } else {
        console.log('save');
        url += 'saveinfo';
      }
      return this.http.post(url, user);
    }

    getEmail(wallet): Observable<any> {
      const fetchEmailUrl = environment.api + 'cryptoipl/' + wallet;
      console.log('url : ', fetchEmailUrl);
      return this.http.get(fetchEmailUrl);
    }

}
