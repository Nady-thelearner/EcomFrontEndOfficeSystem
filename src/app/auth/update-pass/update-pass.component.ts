import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-update-pass',
  templateUrl: './update-pass.component.html',
  styleUrls: ['./update-pass.component.css'],
})
export class UpdatePassComponent implements OnInit {
  form: FormGroup;
  userId: string;
  isAuthenticated: boolean;

  constructor(private userSF: UserService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      _id: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, { validators: [Validators.required] }),
    });
    this.isAuthenticated = this.userSF.getAuthenticated();
    this.userSF
      .getAuthStatus()
      .subscribe((isAuth) => (this.isAuthenticated = isAuth));
    if (this.isAuthenticated) {
      this.userId = localStorage.getItem('userId');
      this.form.patchValue({ _id: this.userId });
      this.form.get('_id').updateValueAndValidity();
    }
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form);
    this.userSF.updatePassword(this.form.value._id, this.form.value.password);
  }
}
