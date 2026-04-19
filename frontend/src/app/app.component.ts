import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn = false;
  userEmail = '';
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.userEmail = this.authService.getEmail() || '';
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/prompts']);
  }

  goToLoginSignup() {
    this.router.navigate(['/login']);
  }

  goCreatePrompt() {
    if (this.isLoggedIn) {
      this.router.navigate(['/prompts/new']);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: '/prompts/new' } });
    }
  }
}
