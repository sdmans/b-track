/* Importing tools to make features in Angular work */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Importing components for project */
import { AppComponent } from './app.component';
import { CurrentDataViewerComponent } from './current-data-viewer/current-data-viewer.component';
import { DatabaseDataViewerComponent } from './database-data-viewer/database-data-viewer.component';
import { BillDataService } from './services/bill-data.service';

/* Importing routing things */
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';

/* importing Firebase and Environment */
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';

/* importing Firebase Modules */
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { SubmitComponent } from './submit/submit.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogInComponent } from './log-in/log-in.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrentDataViewerComponent,
    DatabaseDataViewerComponent,
    BillDetailComponent,
    SubmitComponent,
    RegisterComponent,
    PageNotFoundComponent,
    LogInComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [AngularFireDatabase, BillDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
