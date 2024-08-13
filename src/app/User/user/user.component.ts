import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { StoreService } from 'src/app/store/create-store/store.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor(private storeSF: StoreService, private userSF: UserService) {}

  storeDatas: any;
  ngOnInit(): void {
    this.fetchStores();
  }

  fetchStores() {
    this.userSF.getTokenN().subscribe((token) => {
      var token = token;

      this.storeSF.fetchAllStore().subscribe((res) => {
        console.log('store data', res);
        this.storeDatas = res.data;
      });
    });
  }
}
