import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prompt } from '../../models/prompt.model';
import { PromptService } from '../../services/prompt.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-prompt-detail',
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;
  error = '';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promptService: PromptService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promptService.getPrompt(id).subscribe({
        next: (data) => {
          this.prompt = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load prompt details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid prompt ID.';
      this.loading = false;
    }
  }

  copyContent(): void {
    if (this.prompt?.content) {
      navigator.clipboard.writeText(this.prompt.content);
    }
  }

  deletePrompt(): void {
    if (this.prompt && confirm('Are you sure you want to delete this prompt?')) {
      this.promptService.deletePrompt(this.prompt.id).subscribe({
        next: () => {
          this.router.navigate(['/prompts']);
        },
        error: (err) => {
          this.error = 'Failed to delete prompt.';
        }
      });
    }
  }
}
