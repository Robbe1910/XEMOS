import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/)]], // Utilizar una expresión regular más precisa para validar el correo electrónico
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]],
      confirmPassword: ['', Validators.required],
      confirmEmail: ['', Validators.required]
    }, { validator: this.checkPasswords });

    // Escuchar los cambios en el input de email y verificar si el email existe
    this.registroForm.controls['email'].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(email => this.checkEmailExists(email))
    ).subscribe(response => {
      this.emailExists = response;
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const newUser = {
        fullName: this.registroForm.value.fullName,
        email: this.registroForm.value.email,
        password: this.registroForm.value.password
      };
  
      this.authService.registerUser(newUser);
      this.router.navigateByUrl('/confirm-email');
    } else {
      this.errorMessage = "Invalid email or password";
    }
  }  


  checkEmail() {
    const emailControl = this.registroForm.get('email');
    if (emailControl && emailControl.value) {
      this.checkEmailExists(emailControl.value)
        .pipe(
          map(response => {
            return response ? { emailExists: true } : null;
          })
        )
        .subscribe(result => {
          if (result) {
            emailControl.setErrors(result);
          } else {
            emailControl.setErrors(null);
          }
        });
    }
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`http://34.175.187.252:3000/checkEmail/${email}`).pipe(
      map(response => response.exists) // Transformar la respuesta para que solo devuelva el valor booleano
    );
  }
  

  checkPasswords(formGroup: FormGroup) {
    const email = formGroup.get('email')?.value; // Obtén el valor del campo de correo electrónico
    const confirmEmail = formGroup.get('confirmEmail')?.value; // Obtén el valor del campo de confirmación de correo electrónico
    const password = formGroup.get('password')?.value; // Obtén el valor del campo de contraseña
    const confirmPassword = formGroup.get('confirmPassword')?.value; // Obtén el valor del campo de confirmación de contraseña
    
    let errors: any = {}; // Inicializa errors como un objeto vacío

    if (email !== confirmEmail) {
        errors = { ...errors, notSameEmail: true };
    }

    if (password !== confirmPassword) {
        errors = { ...errors, notSamePassword: true };
    }

    return errors;
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

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

}
