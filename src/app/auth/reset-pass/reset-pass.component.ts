import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css'],
})
export class ResetPassComponent implements OnInit {
  token: string;
  form: FormGroup;

  message: string;
  success: boolean = false;
  constructor(private userSF: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    this.route.queryParams.subscribe(
      (params) => (this.token = params['token'])
    );
    this.userSF
      .resetPassword(this.form.value.password, this.token)
      .subscribe((res) => {
        console.log('response', res);
        if (res.success) {
          this.success = res.success;
          this.message = `${res.message} for ${res.data.email}`;
        }
      });
  }
}
