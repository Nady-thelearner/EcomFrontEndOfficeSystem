import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './auth/header/header.component';
import { UpdatePassComponent } from './auth/update-pass/update-pass.component';
import { ForgetPassComponent } from './auth/forget-pass/forget-pass.component';
import { ResetPassComponent } from './auth/reset-pass/reset-pass.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CreateStoreComponent } from './store/create-store/create-store.component';
import { AddProductComponent } from './store/add-product/add-product.component';
import { UserComponent } from './User/user/user.component';
import { VisitStoreComponent } from './User/visit-store/visit-store.component';
import { CartComponent } from './cart/cart.component';
import { AddressComponent } from './address/address.component';
import { ViewOrdersComponent } from './store/view-orders/view-orders.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    HeaderComponent,
    UpdatePassComponent,
    ForgetPassComponent,
    ResetPassComponent,
    CreateStoreComponent,
    AddProductComponent,
    UserComponent,
    VisitStoreComponent,
    CartComponent,
    AddressComponent,
    ViewOrdersComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
