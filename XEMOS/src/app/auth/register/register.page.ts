import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as bcrypt from 'bcryptjs'; // Importa bcrypt

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registroForm!: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  errorMessage: string = '';
  emailExists: boolean = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });

     // Escuchar los cambios en el input de email y verificar si el email existe
     this.registroForm.controls['email'].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(email => this.checkEmailExists(email))
    ).subscribe(response => {
      this.emailExists = response.exists;
    });
  }
  
  onSubmit() {
    if (this.registroForm.valid) {
      const newUser = {
        fullName: this.registroForm.value.fullName,
        email: this.registroForm.value.email,
        password: bcrypt.hashSync(this.registroForm.value.password, 10)
      };
  
      this.http.post<any>('http://34.175.187.252:3000/users', newUser)
        .subscribe(() => {
          console.log('User registered successfully');
          this.router.navigateByUrl('/login');
        }, (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorMessage = error.error.message || 'Unexpected error. Please try again later.';
          } else {
            this.errorMessage = 'Unexpected error. Please try again later.';
          }
          console.error('Server error:', error);
        });

    } else {
      console.error('Invalid form');
      this.errorMessage = "Invalid email or password";
    }
  }
  
  checkEmail() {
    const emailControl = this.registroForm.get('email');
    if (emailControl && emailControl.value) {
      console.log('Email value:', emailControl.value);
      this.checkEmailExists(emailControl.value)
        .pipe(
          map(response => {
            console.log('Response from server:', response);
            return response.exists ? { emailExists: true } : null;
          })
        )
        .subscribe(result => {
          console.log('Result:', result);
          if (result) {
            emailControl.setErrors(result);
          } else {
            emailControl.setErrors(null);
          }
        });
    }
  }
  
  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`http://34.175.187.252:3000/checkEmail/${email}`);
  }

  checkPasswords(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

}
