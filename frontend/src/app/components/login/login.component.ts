import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isSignupMode = false;
  isSubmitting = false;
  submitError = '';
  redirectUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check query params for initial mode and redirect behavior
    this.route.queryParams.subscribe(params => {
      this.isSignupMode = params['mode'] === 'signup';
      this.redirectUrl = params['redirect'] || null;
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.submitError = '';
  }

  setMode(signupMode: boolean) {
    this.isSignupMode = signupMode;
    this.submitError = '';
  }

  onSubmit(): void {
    const form = this.isSignupMode ? this.signupForm : this.loginForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.submitError = '';

    if (this.isSignupMode) {
      this.authService.signup(form.value).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.submitError = 'Signup successful! Please login.';
          this.isSignupMode = false;
          this.signupForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError = err.error?.error || 'Signup failed. Please try again.';
        }
      });
    } else {
      this.authService.login(form.value).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          const destination = this.redirectUrl || '/prompts';
          this.router.navigateByUrl(destination);
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.status === 401) {
              this.submitError = 'Invalid credentials provided.';
          } else {
              this.submitError = err.error?.error || 'Server error. Please try again later.';
          }
        }
      });
    }
  }
}
