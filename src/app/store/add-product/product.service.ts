import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { cryptoService } from 'src/app/auth/crypto.service';
import { UserService } from 'src/app/auth/user.service';

@Injectable({ providedIn: 'root' })
export class productService {
  productIds = [];
  vendor_id: string;
  productDetails: any[];
  constructor(
    private http: HttpClient,
    private userSF: UserService,
    private cryptoSF: cryptoService,
    private cookieService: CookieService
  ) {
    // console.log('productSF triggered constructor ');
    if (this.cookieService.check('productId')) {
      console.log('inside cookies logic ');
      const decryptedArr = this.cryptoSF.decrypt(
        this.userSF.getCookie('productId')
      );
      const jsonArr = JSON.parse(decryptedArr);
      this.productIds = jsonArr;
    } else {
      this.userSF.getProductIDNew().subscribe((res) => {
        if (res && res.data != null) {
          const encryptedProductIDs = res.data.productID;
          this.userSF.setCookie('productId', encryptedProductIDs, 1);
          const decryptedArr = this.cryptoSF.decrypt(res.data.productID);
          const jsonArr = JSON.parse(decryptedArr);
          this.productIds = jsonArr;
          console.log('product id decypted', jsonArr);
        }
        console.log('observable res', res);
      });
    }
  }

  addProduct(
    quantity: string,
    productName: string,
    categoryId: string,
    subCategoryId: string,
    vendor_id: string,
    store_id: string,
    image: string,
    price: string,
    discount: string
  ) {
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();

      console.log('tokken...', token);
      const headers = new HttpHeaders({
        authorization: token,
      });
      console.log('add product triggered');
      const formData = new FormData();
        formData.append('quantity', quantity),
        formData.append('vendor_id', vendor_id),
        formData.append('store_id', store_id),
        formData.append('name', productName),
        formData.append('price', price),
        formData.append('discount', discount),
        formData.append('category_id', categoryId),
        formData.append('subCategory_id', subCategoryId);
        formData.append('images', image);
      this.http
        .post('http://localhost:3000/api/add-product', formData, { headers })
        .subscribe((data) => console.log(data));
    }
  }

  addUpdproductID(productID: string) {
    const userID = this.userSF.getUserID().userId;
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();
      const headers = new HttpHeaders({
        authorization: token,
      });

      return this.http.post<any>(
        'http://localhost:3000/api/add-productIDs',
        { userID, productID },
        { headers }
      );
    }
    return null;
  }

  deleteProductID() {
    const userID = this.userSF.getUserID().userId;
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();
      const headers = new HttpHeaders({
        authorization: token,
      });

      return this.http.post<any>(
        'http://localhost:3000/api/del-productIDs',
        { userID },
        { headers }
      );
    }
    return null;
  }

  getVendorID() {
    return this.vendor_id;
  }

  getProducts(vendor_id: string): any {
    this.vendor_id = vendor_id;
    // console.log('get product triggered...', vendor_id);
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();
      this.userSF.getTokenN().subscribe((token) => {
        var token = token;
      });
      // console.log('fetch prooduct triggered......', token);
      const headers = new HttpHeaders({
        authorization: token,
      });
      const params = new HttpParams().set('vendor_id', vendor_id);

      const options = {
        headers: headers,
        params: params,
      };
      return this.http.get('http://localhost:3000/api/get-productNew', options);
    }
  }

  getOneProduct(product_id: string): any {
    console.log('fetch product_id......', product_id);
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();
      // console.log('fetch prooduct triggered......$', token);
      const headers = new HttpHeaders({
        authorization: token,
      });
      const options = {
        headers: headers,
      };
      return this.http.get(
        `http://localhost:3000/api/get-one-product?product_id=${product_id}`,
        options
      );
    }
    return null;
  }

  addCartDetails(product_Id: string) {
    this.productIds.push(product_Id);
    console.log('product added..', this.productIds);
    //-----------------
    const productIDArr = JSON.stringify(this.productIds);
    const encryptedArr = this.cryptoSF.encrypt(productIDArr);
    this.userSF.setCookie('productId', encryptedArr, 1);
    const productIDEncrp = this.userSF.getCookie('productId');
    this.addUpdproductID(productIDEncrp).subscribe((res) =>
      console.log('productID enrp added', res.productID)
    );

    //------------------------
    this.userSF.addToCart();
  }

  removeFromCart(product_id: string) {
    const indexToRemove = this.productIds.indexOf(product_id);

    if (indexToRemove !== -1) {
      this.productIds.splice(indexToRemove, 1);

      //-----------------
      const productIDArr = JSON.stringify(this.productIds);
      const encryptedArr = this.cryptoSF.encrypt(productIDArr);
      this.userSF.setCookie('productId', encryptedArr, 1);
      const productIDEncrp = this.userSF.getCookie('productId');
      const userID = this.userSF.getUserID().userId;
      this.addUpdproductID(productIDEncrp).subscribe((res) =>
        console.log('productID enrp added', res)
      );

      //------------------------
    }
  }

  getCartDetails() {
    if (this.cookieService.check('productId')) {
      const decryptedArr = this.cryptoSF.decrypt(
        this.userSF.getCookie('productId')
      );
      const jsonArr = JSON.parse(decryptedArr);
      this.productIds = jsonArr;
      var len = jsonArr.length;
    }
    return this.productIds;
  }

  updateCartVendStatus(status: string, uniqueRef: string) {
    //
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();
      // const uniqueRef = '202401081223388993';
      // const status = 'Order packed again!!';
      const headers = new HttpHeaders({
        authorization: token,
      });

      const options = {
        headers: headers,
      };

      return this.http.post<any>(
        `http://localhost:3000/api/update-vend-stat?uniqueRef=${uniqueRef}`,
        { status },
        options
      );
    }
    return null;
  }

  getOderDetails() {
    const vendorId = '64de01a8523964da627a86df';
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();
      const headers = new HttpHeaders({
        authorization: token,
      });
      const options = {
        headers: headers,
      };
      return this.http.get<any>(
        `http://localhost:3000/api/get-order-det?vendorId=${vendorId}`,
        options
      );
    }
    return null;
  }
  addproductDetails(productDetails: any[]): any {
    if (this.userSF.getAuthenticated) {
      var token = this.userSF.getToken();
      console.log('fetch prooduct triggered......12', token);
      const headers = new HttpHeaders({
        authorization: token,
      });
      const options = {
        headers: headers,
      };
      return this.http.post(
        'http://localhost:3000/api/add-to-cart',
        productDetails,
        options
      );
    }
    return null;
  }
}
