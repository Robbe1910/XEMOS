import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage implements OnInit {
  public changePasswordForm!: FormGroup;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const email = this.changePasswordForm.value.email;
      const newPassword = this.changePasswordForm.value.newPassword;
      this.authService.changePassword(email, newPassword).subscribe(
        () => {
          this.router.navigateByUrl('/login');
        },
        (error: any) => {
          this.errorMessage = error.message;
        }
      );
    } else {
      this.errorMessage = "Invalid email or password";
    }
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  checkPasswords(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { notSame: true };
  }

  // Función de validación personalizada para verificar la complejidad de la contraseña
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const hasUppercase = /[A-Z]/.test(value); // Verifica si hay al menos una mayúscula
      const hasLowercase = /[a-z]/.test(value); // Verifica si hay al menos una minúscula
      const hasNumber = /\d/.test(value); // Verifica si hay al menos un número
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value); // Verifica si hay al menos un símbolo especial

      const valid = hasUppercase && hasLowercase && hasNumber && hasSpecial;

      return valid ? null : { 'passwordRequirements': true };
    };
  }
}
