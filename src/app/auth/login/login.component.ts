import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  showWrongUserAndPass = false;
  admin = {
    username: 'admin',
    password: 'admin@admin'
  };
  staff = {
    username: 'staff',
    password: 'staff@pass'
  };
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {}
  login() {
    this.showWrongUserAndPass = false;
    console.log(this.form.value)
    if (this.form.value.username === 'admin' && this.form.value.password === 'admin@admin') {
      sessionStorage.setItem('au', JSON.stringify({admin: true}));
      this.router.navigate(['/page']);
    } else if (this.form.value.username === 'staff' && this.form.value.password === 'staff@pass') {
      sessionStorage.setItem('au', JSON.stringify({admin: true}));
      this.router.navigate(['/page']);
    } else {
      this.showWrongUserAndPass = true;
    }
  }
}
