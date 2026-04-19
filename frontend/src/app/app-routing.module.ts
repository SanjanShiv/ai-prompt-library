import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromptListComponent } from './components/prompt-list/prompt-list.component';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail.component';
import { AddPromptComponent } from './components/add-prompt/add-prompt.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/prompts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'prompts', component: PromptListComponent },
  { path: 'prompts/new', component: AddPromptComponent, canActivate: [AuthGuard] },
  { path: 'prompts/:id', component: PromptDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
