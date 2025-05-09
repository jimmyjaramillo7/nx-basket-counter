import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../common/services/auth.service';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  loading = signal(false);

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  myForm: FormGroup = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(5)]]
  })

  login() {
    const payload = this.myForm.value;
    
    this.loading.set(true);
    this.authService
    .login(payload)
    .pipe(
      finalize(()=>{
        this.loading.set(false)
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('/control')
      },
      error: (err) => {
        this._snackBar.open(err, 'Cerrar', {
          duration: 2500,
        });
      }
    })
  }


  validarPassword() {
    return this.myForm.controls['password'].invalid && this.myForm.controls['password'].touched
  }

  validarUser() {
    return this.myForm.controls['username'].invalid && this.myForm.controls['username'].touched
  }
}
