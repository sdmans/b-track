import { Routes } from '@angular/router';
import { DatabaseDataViewerComponent } from './database-data-viewer/database-data-viewer.component';
import { SubmitComponent } from './submit/submit.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogInComponent } from './log-in/log-in.component';
import { CurrentDataViewerComponent } from './current-data-viewer/current-data-viewer.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    { path: 'list', component: DatabaseDataViewerComponent },
    { path: 'submit', component: SubmitComponent },
    { path: 'login', component: LogInComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'current', component: CurrentDataViewerComponent },
    { path: '**', component: PageNotFoundComponent }
]