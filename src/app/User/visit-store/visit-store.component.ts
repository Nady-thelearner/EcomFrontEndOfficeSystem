import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';
import { productService } from 'src/app/store/add-product/product.service';

@Component({
  selector: 'app-visit-store',
  templateUrl: './visit-store.component.html',
  styleUrls: ['./visit-store.component.css'],
})
export class VisitStoreComponent {
  storeData: any;
  vendorId: string;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private route: ActivatedRoute,
    private productSF: productService,
    private userSF: UserService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['vendorId']) {
        this.vendorId = params['vendorId'];
        this.userSF.getTokenN().subscribe((token) => {
          var token = token;

          this.productSF.getProducts(params['vendorId']).subscribe((res) => {
            console.log('fetch products vist store component', res);
            if (res) {
              this.storeData = res.data;
              console.log('store data', this.storeData);
            }
          });
        });
      }
    });
  }

  addToCart(item: any) {
    this.productSF.addCartDetails(item.product_id);
  }
}
