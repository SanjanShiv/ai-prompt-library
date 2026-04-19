import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  templateUrl: './add-prompt.component.html',
  styleUrls: ['./add-prompt.component.css']
})
export class AddPromptComponent implements OnInit {
  promptForm!: FormGroup;
  isSubmitting = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      tags: ['']
    });
  }

  onSubmit(): void {
    if (this.promptForm.invalid) {
      this.promptForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.promptService.createPrompt(this.promptForm.value).subscribe({
      next: (data) => {
        this.isSubmitting = false;
        this.router.navigate(['/prompts', data.id]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to create prompt. Please try again.';
        console.error(err);
      }
    });
  }
}
