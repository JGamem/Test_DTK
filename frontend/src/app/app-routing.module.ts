import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './features/vehicles/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './features/vehicles/vehicle-form/vehicle-form.component';
import { VehicleDetailComponent } from './features/vehicles/vehicle-detail/vehicle-detail.component';
import { GroupListComponent } from './features/groups/group-list/group-list.component';
import { GroupFormComponent } from './features/groups/group-form/group-form.component';
import { GroupDetailComponent } from './features/groups/group-detail/group-detail.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'vehicles',
        component: VehicleListComponent,
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/vehicles', pathMatch: 'full' },
    { path: 'vehicles', component: VehicleListComponent },
    { path: 'vehicles/new', component: VehicleFormComponent },
    { path: 'vehicles/edit/:id', component: VehicleFormComponent },
    { path: 'vehicles/:id', component: VehicleDetailComponent },
    { path: 'groups', component: GroupListComponent },
    { path: 'groups/new', component: GroupFormComponent },
    { path: 'groups/:id', component: GroupDetailComponent },
    { path: '**', redirectTo: '/vehicles' },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }