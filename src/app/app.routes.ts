import { Routes } from '@angular/router';
import { DatabaseDataViewerComponent } from './database-data-viewer/database-data-viewer.component';
import { SubmitComponent } from './submit/submit.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogInComponent } from './log-in/log-in.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/bill-data-list', pathMatch: 'full' },
    { path: 'bill-data-list', component: DatabaseDataViewerComponent },
    { path: 'submit', component: SubmitComponent },
    {path: 'login', component: LogInComponent},
    { path: 'register', component: RegisterComponent },
    { path: '**', component: PageNotFoundComponent }
]