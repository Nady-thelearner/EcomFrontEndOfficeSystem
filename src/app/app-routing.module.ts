import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LoginComponent } from './auth/login/login.component';
import { UpdatePassComponent } from './auth/update-pass/update-pass.component';
import { ForgetPassComponent } from './auth/forget-pass/forget-pass.component';
import { ResetPassComponent } from './auth/reset-pass/reset-pass.component';
import { CreateStoreComponent } from './store/create-store/create-store.component';
import { AddProductComponent } from './store/add-product/add-product.component';
import { UserComponent } from './User/user/user.component';
import { VisitStoreComponent } from './User/visit-store/visit-store.component';
import { CartComponent } from './cart/cart.component';
import { AddressComponent } from './address/address.component';
import { ViewOrdersComponent } from './store/view-orders/view-orders.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },

  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'update-pass',
    component: UpdatePassComponent,
  },

  {
    path: 'forget-pass',
    component: ForgetPassComponent,
  },
  {
    path: 'reset-pass',
    component: ResetPassComponent,
  },
  {
    path: 'create-store',
    component: CreateStoreComponent,
  },
  {
    path: 'add-product',
    component: AddProductComponent,
  },

  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'visit-store',
    component: VisitStoreComponent,
  },
  {
    path: 'addto-cart',
    component: CartComponent,
  },
  {
    path: 'address',
    component: AddressComponent,
  },
  {
    path: 'view-orders',
    component: ViewOrdersComponent,
  },
  {
    path: 'side-bar',
    component: SidebarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
