import { Routes } from '@angular/router';
import { VehicleListComponent } from './features/vehicles/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './features/vehicles/vehicle-form/vehicle-form.component';
import { VehicleDetailComponent } from './features/vehicles/vehicle-detail/vehicle-detail.component';
import { GroupListComponent } from './features/groups/group-list/group-list.component';
import { GroupFormComponent } from './features/groups/group-form/group-form.component';
import { GroupDetailComponent } from './features/groups/group-detail/group-detail.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    {
        path: 'vehicles',
        component: VehicleListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'vehicles/new',
        component: VehicleFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'vehicles/edit/:id',
        component: VehicleFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'vehicles/:id',
        component: VehicleDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'groups',
        component: GroupListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'groups/new',
        component: GroupFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'groups/:id',
        component: GroupDetailComponent,
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '/login' }
];