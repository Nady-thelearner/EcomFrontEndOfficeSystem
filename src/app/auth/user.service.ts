import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { loginRes } from './login/loginRes.model';
import { resetRes } from './reset-pass/reset-pass.model';
import { Router } from '@angular/router';
import { cryptoService } from './crypto.service';
import { CookieService } from 'ngx-cookie-service';

const BACK_END_URL = 'http://localhost:3000/api/register';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userId: string;
  private token: string;
  private authenticated: boolean = false;
  private authStatus = new Subject<boolean>();
  private isVendor = new Subject<boolean>();
  private cartItemsSubject = new BehaviorSubject<number>(0);
  cartItem$ = this.cartItemsSubject.asObservable();
  constructor(
    private http: HttpClient,
    private route: Router,
    private cryptoSF: cryptoService,
    private cookieService: CookieService
  ) {
    this.initialize();
  }

  private initialize() {
    // console.log('user service triggered');
    if (this.cookieService.check('productId')) {
      const decryptedArr = this.cryptoSF.decrypt(this.getCookie('productId'));
      const jsonArr = JSON.parse(decryptedArr);
      var len = jsonArr.length;
      this.cartItemsSubject.next(len);
    } else {
      if (this.token) {
        this.getProductIDNew().subscribe((res) => {
          console.log('obs res', res);
          if (res.data != null) {
            const encryptedProductIDs = res.data.productID;
            this.setCookie('productId', encryptedProductIDs, 1);
            const decryptedArr = this.cryptoSF.decrypt(res.data.productID);
            const jsonArr = JSON.parse(decryptedArr);
            var len = jsonArr.length;
            this.cartItemsSubject.next(len);
            console.log('product id decypted', jsonArr);
          }
          console.log('observable res', res);
        });
      }
    }
    // Initialization logic here
    // this.getUserDataN();
    const userID = this.getUserID().userId;
    this.token = this.getUserID().token;
    if (userID != '' || userID != null) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }

    if (this.authenticated) {
      this.token = this.getToken();
    }
  }

  addToCart() {
    const cartValue = this.cartItemsSubject.value;
    this.cartItemsSubject.next(cartValue + 1);
  }
  removeFromCart() {
    const cartValue = this.cartItemsSubject.value;
    if (cartValue > 0) {
      this.cartItemsSubject.next(cartValue - 1);
    }
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value;
  }
  setCartItemCount(cart: number) {
    this.cartItemsSubject.next(cart);
  }

  getUserID() {
    return this.getLocalData();
  }
  getToken() {
    return this.token;
  }
  getTokenN(): Observable<any> {
    return this.getUserDataN().pipe(map(() => this.token));
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  getVendorStatus() {
    return this.isVendor.asObservable();
  }
  getAuthenticated() {
    return this.authenticated;
  }

  private SaveData(userId: string, token: string, isVendor: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('isVendor', isVendor);
  }

  private getLocalData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isVendor = localStorage.getItem('isVendor');

    return {
      userId: userId,
      token: token,
      isVendor: isVendor,
    };
  }

  private clearLocalData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('isVendor');
  }

  regirsterUser(
    name: string,
    email: string,
    password: string,
    image: string,
    type: string,
    mobile: string
  ) {
    const formData = new FormData();
    formData.append('name', name),
      formData.append('email', email),
      formData.append('password', password),
      formData.append('image', image),
      formData.append('type', type),
      formData.append('mobile', mobile);
    console.log('register service triggered', formData);

    this.http
      .post(BACK_END_URL, formData)
      .subscribe((data) => console.log(data));
  }

  loginUser(email: string, password: string) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    console.log('triggered login', formData);

    this.http
      .post<loginRes>('http://localhost:3000/api/login', { email, password })
      .subscribe({
        next: (res) => {
          console.log('login success', res);
          //user
          if (res.data.token && +res.data.type == 1) {
            const isVendor = true;
            this.userId = res.data._id;
            this.token = res.data.token;
            this.SaveData(this.userId, this.token, 'Y');
            this.authenticated = true;
            this.authStatus.next(true);
            this.isVendor.next(isVendor);
            this.saveUserData(isVendor);

            this.route.navigate(['/create-store']);
          } else {
            const isVendor = false;
            this.userId = res.data._id;
            this.token = res.data.token;
            this.SaveData(this.userId, this.token, 'N');
            this.authenticated = true;
            this.authStatus.next(true);
            this.isVendor.next(isVendor);
            this.saveUserData(isVendor);
            // this.getUserData();
            this.route.navigate(['/user']);
          }
          this.initialize();
        },
        error: (error) => {
          console.log('error occured ');
          this.authenticated = false;
          this.authStatus.next(false);
        },
      });
  }

  logout() {
    this.updateUserData('User Logged Out.');
    this.token = null;
    this.authenticated = false;
    this.clearLocalData();
    this.userId = null;
    this.deleteCookie('uniqueUserId');
    this.deleteCookie('userCartDet');
    this.deleteCookie('productId');

    // clearTimeout(this.tokenTimer);
    this.route.navigate(['/']);
  }

  forgetPassword(email: string) {
    console.log('email', email);
    this.http
      .post('http://localhost:3000/api/forget-password', { email })
      .subscribe((res) => {
        console.log('response', res);
      });
  }

  resetPassword(password: string, resetToken: string) {
    // const params = new HttpParams().set('token', resetToken);
    return this.http.post<resetRes>(
      `http://localhost:3000/api/reset-password?token=${resetToken}`,
      {
        password,
      }
    );
  }

  updatePassword(_id: string, password: string) {
    if (this.authenticated) {
      const headers = new HttpHeaders({
        authorization: this.token,
      });
      console.log('update Data head userid password', headers, _id, password);
      this.http
        .post(
          'http://localhost:3000/api/update-password',
          {
            _id,
            password,
          },
          { headers }
        )
        .subscribe((res) => console.log('Updated successfully', res));
    }
  }

  getUserAddress(): any {
    if (this.authenticated) {
      const userId = this.getLocalData().userId;
      const headers = new HttpHeaders({
        authorization: this.token,
      });
      const params = new HttpParams().set('user_id', userId);
      const options = {
        headers: headers,
        params: params,
      };
      return this.http.get('http://localhost:3000/api/get-address', options);
    }
  }

  addUserAddress(address: string): any {
    if (this.authenticated) {
      const userId = this.getLocalData().userId;
      const headers = new HttpHeaders({
        authorization: this.token,
      });
      const params = new HttpParams()
        .set('user_id', userId)
        .set('address', address);
      const options = {
        headers: headers,
        params: params,
      };
      return this.http.post(
        'http://localhost:3000/api/add-address',
        {},
        options
      );
    }
  }

  saveUserData(isVendor: boolean) {
    if (this.authenticated) {
      const userId = this.getLocalData().userId;
      const token = this.getLocalData().token;
      const status = 'loggedIn';
      const headers = new HttpHeaders({
        authorization: this.token,
      });

      const options = {
        headers: headers,
      };
      return this.http
        .post<any>(
          'http://localhost:3000/api/saveUserData',
          { userId, token, status, isVendor },
          options
        )
        .subscribe((res) => {
          console.log('addUserDatauserRes', res);
          // const userID = res.data._id;
          const userID = res.data.user_id;
          // localStorage.setItem('uniqueUserId', userID);
          this.setCookie('uniqueUserId', userID, 1);
          console.log('unoiqueid cookeie', this.getCookie('uniqueUserId'));
        });
    } else {
      return null;
    }
  }

  updateUserData(status: string) {
    if (this.authenticated) {
      const userId = this.getLocalData().userId;
      const token = this.getLocalData().token;
      // const status = 'loggedIn';
      const headers = new HttpHeaders({
        authorization: this.token,
      });

      const options = {
        headers: headers,
      };
      return this.http
        .post<any>(
          'http://localhost:3000/api/updateUserData',
          { userId, token, status },
          options
        )
        .subscribe((res) => {
          console.log('User status', res);
          const userID = res.data._id;
        });
    } else {
      return null;
    }
  }

  getUserDataN(): Observable<any> {
    if (
      this.getCookie('uniqueUserId')
        ? this.getCookie('uniqueUserId') != ''
        : false || this.getCookie('uniqueUserId')
        ? this.getCookie('uniqueUserId') != null
        : false
    ) {
      const id = localStorage.getItem('uniqueUserId')
        ? localStorage.getItem('uniqueUserId')
        : this.getCookie('uniqueUserId');
      // const id = '658c068c3ef29ccdccc52b10';
      var token = this.getLocalData().token;
      var userId = this.getLocalData().userId;
      var isVendor = this.getLocalData().isVendor;
      // console.log('token 123', token, 'userID', userId, 'ID', id);
      if (
        token == '' ||
        userId == '' ||
        isVendor == '' ||
        token == null ||
        userId == null ||
        isVendor == null
      ) {
        console.log('inside if $$');
        return this.http
          .get<any>(`http://localhost:3000/api/getUserData?id=${id}`)
          .pipe(
            map((res) => {
              this.token = res.data.token;
              this.userId = res.data.user_id;
              const isVendor = res.data.isVendor ? 'Y' : 'N';
              this.SaveData(this.userId, this.token, isVendor);
              console.log('getUserDatauserRes$$', res);
              return res;
            })
          );
      } else {
        this.token = token;
        this.userId = userId;
        this.isVendor.next(isVendor == 'Y' ? true : false);
        return of(token);
      }
    } else {
      return of(null);
    }
  }

  getProductIDNew(): Observable<any> {
    console.log('get Product ID change for vendor triggered');
    var userID = this.getUserID().userId;

    if (this.getAuthenticated) {
      var token = this.getLocalData().token;
      if (token) {
        const headers = new HttpHeaders({
          authorization: token,
        });
        const params = new HttpParams().set('userID', userID);

        const options = {
          headers: headers,
          params: params,
        };

        return this.http
          .get<any>('http://localhost:3000/api/get-productIDs', options)
          .pipe(
            map((res) => {
              return res;
            })
          );
      }
    }
    return of(null);
  }

  setCookie(name: string, value: any, days: number): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const cookieValue =
      encodeURIComponent(name) +
      '=' +
      encodeURIComponent(value) +
      '; expires=' +
      expirationDate.toUTCString() +
      '; path=/; secure';
    document.cookie = cookieValue;
  }

  getCookie(name: string): string | null {
    const decodedName = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(decodedName) === 0) {
        return decodeURIComponent(
          cookie.substring(decodedName.length, cookie.length)
        );
      }
    }

    return null;
  }
  updateCookie(name: string, value: any, days: number): void {
    this.setCookie(name, value, days);
  }
  deleteCookie(name: string) {
    document.cookie =
      name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
