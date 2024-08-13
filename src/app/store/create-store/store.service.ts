import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private authenticated: boolean = false;
  private token: string;

  constructor(
    private http: HttpClient,
    private userSF: UserService,
    private route: Router
  ) {
    this.initialize();
  }

  private initialize() {
    // this.userSF.getUserData();

    this.authenticated = this.userSF.getAuthenticated();
    if (this.authenticated) {
      // this.token = this.userSF.getToken();
      this.userSF.getTokenN().subscribe((token) => {
        this.token = token;
      });
    }
  }
  createStore(
    storeName: string,
    vendorid: string,
    logo: string,
    businessEmail: string,
    address: string,
    pin: string,
    latitude: string,
    longitude: string
  ) {
    if (this.authenticated) {
      const headers = new HttpHeaders({
        authorization: this.token,
      });
      console.log('create store triggered');
      const formData = new FormData();
      formData.append('storeName', storeName),
        formData.append('vendor_id', vendorid),
        formData.append('logo', logo),
        formData.append('business_email', businessEmail),
        formData.append('address', address),
        formData.append('pin', pin),
        formData.append('latitude', latitude),
        formData.append('longitude', longitude);

      this.http
        .post<any>('http://localhost:3000/api/create-store', formData, {
          headers,
        })
        .subscribe((res) => {
          if (res.success == true) {
            this.route.navigate(['/add-product']);
          }
        });
    }
  }

  fetchStore(userID: string): any {
    if (this.authenticated) {
      console.log('fetch ssttore triggered......', this.token);
      const headers = new HttpHeaders({
        authorization: this.token,
      });
      const params = new HttpParams().set('vendor_id', userID);
      const options = {
        headers: headers,
        params: params,
      };
      return this.http.get('http://localhost:3000/api/get-store', options);
    }
    return null;
  }

  fetchAllStore() {
    if (this.authenticated) {
      const headers = new HttpHeaders({
        authorization: this.token,
      });
      const options = { headers: headers };

      return this.http.get<any>(
        'http://localhost:3000/api/get-all-store',
        options
      );
    } else {
      return null;
    }
  }

  fetchSubCategory(subCategoryName: string): any {
    if (this.authenticated) {
      const headers = new HttpHeaders({
        authorization: this.token,
      });
      const params = new HttpParams().set('subCategory_name', subCategoryName);

      const options = {
        headers: headers,
        params: params,
      };
      return this.http.get(
        'http://localhost:3000/api/fetch-sub-category',
        options
      );
    }
  }
}
