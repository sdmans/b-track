import { DatabaseDataViewerComponent } from './database-data-viewer/database-data-viewer.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { SubmitComponent } from './submit/submit.component';

export const routes = [
    { path: "", 
        component: DatabaseDataViewerComponent,
        data: {
            meta: {
                title: 'Home',
                description: 'Home page with overall view of bill data'
            }
        }
    },
    {
        path: "detail",
        component: BillDetailComponent
    },
    {
        path: "submit",
        component: SubmitComponent
    }
]