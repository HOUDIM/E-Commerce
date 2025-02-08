import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Stocker le token et les infos utilisateur
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          this.toastr.success('Connexion réussie');
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
          this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error.message || 'Erreur de connexion';
          this.toastr.error(this.errorMessage ?? 'Unknown error');
        }
      });
    }
  }
}
