import { Component, OnInit } from '@angular/core';
import { Prompt } from '../../models/prompt.model';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css']
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;

  constructor(private promptService: PromptService) { }

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => {
        this.prompts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load prompts', err);
        this.loading = false;
      }
    });
  }
}
