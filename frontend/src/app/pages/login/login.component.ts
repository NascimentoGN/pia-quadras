import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode = true; // Alterna entre Login e Cadastro
  email = '';
  password = '';
  name = '';
  phone = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.isLoginMode) {
      // FAZER LOGIN
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => this.router.navigate(['/']), // Redireciona para a Home
        error: (err) => this.errorMessage = 'Email ou senha inválidos.'
      });
    } else {
      // FAZER CADASTRO
      const userData = { name: this.name, email: this.email, password: this.password, phone: this.phone };
      this.authService.register(userData).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => this.errorMessage = err.error.error || 'Erro ao criar conta.'
      });
    }
  }
}