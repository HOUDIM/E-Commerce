import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';


interface ProfileUpdate {
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
 }

// src/app/features/profile/profile.component.ts
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  

  private initForm() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    const userId = this.authService.getCurrentUserId();
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          username: user.username,
          email: user.email
        });
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur de chargement du profil');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const updateData: ProfileUpdate = {
      username: this.profileForm.get('username')?.value,
      email: this.profileForm.get('email')?.value
    };

    if (this.profileForm.get('newPassword')?.value) {
      updateData.currentPassword = this.profileForm.get('currentPassword')?.value;
      updateData.newPassword = this.profileForm.get('newPassword')?.value;
    }

    this.userService.updateUser(this.user._id, updateData).subscribe({
      next: () => {
        this.toastr.success('Profil mis à jour');
        this.loadUserProfile();
      },
      error: (error) => this.toastr.error(error.error.message || 'Erreur de mise à jour')
    });
  }
}
