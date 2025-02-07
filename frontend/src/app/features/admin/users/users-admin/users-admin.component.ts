import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';

// src/app/features/admin/users/users-admin.component.ts
@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html'
})
export class UsersAdminComponent implements OnInit {
  users: any[] = [];
  loading = false;
  userRoles = ['user', 'admin'];

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur de chargement des utilisateurs');
        this.loading = false;
      }
    });
  }

  updateUserRole(userId: string, newRole: string) {
    this.userService.updateUser(userId, { role: newRole }).subscribe({
      next: () => {
        this.toastr.success('Rôle mis à jour');
        this.loadUsers();
      },
      error: () => this.toastr.error('Erreur de mise à jour')
    });
  }

  deleteUser(userId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.toastr.success('Utilisateur supprimé');
          this.loadUsers();
        },
        error: () => this.toastr.error('Erreur de suppression')
      });
    }
  }
}
