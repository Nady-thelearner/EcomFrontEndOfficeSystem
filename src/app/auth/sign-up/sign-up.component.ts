import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  imagePreview: string;
  form: FormGroup;
  showSegment1: boolean = true;
  showSegment2: boolean = false;

  constructor(private userSF: UserService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
      type: new FormControl(null, { validators: [Validators.required] }),
      mobile: new FormControl(null, { validators: [Validators.required] }),
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

  onNextSegment1() {
    this.showSegment1 = false;
    this.showSegment2 = true;
  }

  onPrevSegment2() {
    this.showSegment1 = true;
    this.showSegment2 = false;
  }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    console.log('form Element', this.form);

    this.userSF.regirsterUser(
      this.form.value.name,
      this.form.value.email,
      this.form.value.password,
      this.form.value.image,
      this.form.value.type,
      this.form.value.mobile
    );
  }
}
