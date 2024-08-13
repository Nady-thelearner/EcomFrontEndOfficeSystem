import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../create-store/store.service';
import { UserService } from 'src/app/auth/user.service';
import { productService } from './product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  constructor(
    private storeSF: StoreService,
    private userSF: UserService,
    private productSF: productService,
    private route: Router
  ) {
    // initialize();
  }
  form: FormGroup;
  categorySelected: string;
  subCategorySelected: string;
  product: string;
  imagePreview: string;

  categoryList: string[] = ['Shoe', 'Furniture'];
  subCategoryList: string[] = [];

  ngOnInit(): void {
    this.form = new FormGroup({
      categoryId: new FormControl(null, { validators: [Validators.required] }),
      subCategoryId: new FormControl(null, {
        validators: [Validators.required],
      }),
      product: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] }),
      discount: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null),
      vendorId: new FormControl(null, { validators: [Validators.required] }),
      storeId: new FormControl(null, { validators: [Validators.required] }),
      quantityPrd: new FormControl(null, { validators: [Validators.required] }),
    });

    const vendor_id = this.userSF.getUserID().userId;
    this.userSF.getTokenN().subscribe((token) => {
      var token = token;
      this.storeSF.fetchStore(vendor_id).subscribe((data) => {
        console.log('fetch store ddaata...venndor1', data);
        console.log('fetch store ddaata...venndor', vendor_id);
        console.log('fetch store ddaata...data.vendorID', data.data._id);
        this.form.patchValue({ storeId: data.data._id });
        this.form.patchValue({ vendorId: data.data.vendor_id });
        this.form.get('storeId').updateValueAndValidity();
        this.form.get('vendorId').updateValueAndValidity();
      });
    });
  }

  onCategoryChange(selectedValue: any): void {
    if (selectedValue == 'Shoe') {
      this.subCategoryList = ['Nike', 'Puma', 'Addidas'];
    } else if (selectedValue == 'Furniture') {
      this.subCategoryList = ['Pepperfry', 'Urban Ladder', 'FabIndia'];
    }
  }

  onSubCategory() {
    console.log('function called', this.subCategorySelected);
    this.storeSF
      .fetchSubCategory(this.subCategorySelected)
      .subscribe((data) => {
        console.log('testtt', data);
        this.form.patchValue({ categoryId: data.data.category_id });
        this.form.patchValue({ subCategoryId: data.data._id });
        this.form.get('categoryId').updateValueAndValidity();
        this.form.get('subCategoryId').updateValueAndValidity();
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('form Element', this.form);
      return;
    }
    console.log('form Element', this.form);
    this.productSF.addProduct(
      this.form.value.quantityPrd,
      this.form.value.product,
      this.form.value.categoryId,
      this.form.value.subCategoryId,
      this.form.value.vendorId,
      this.form.value.storeId,
      this.form.value.image,
      this.form.value.price,
      this.form.value.discount
    );
    this.route.navigate(['/create-store']);
  }
  //quantity
}
