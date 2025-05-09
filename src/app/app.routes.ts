import { Routes } from '@angular/router';
import { Boar } from './common/services/board-socket.service';
import { isUnauthenticatedGuard } from './common/guards/is-unauthenticated.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'selector',
        pathMatch: 'full'
    },
    {
        path: 'screen',
        loadChildren: () => import('./counter/counter.routes').then(m => m.CounterRoutes),
        providers: [
            Boar
        ]
    },
    {
        path: 'control',
        loadChildren: () => import('./control-panel/control.routes').then(m => m.ControlRoutes),
        providers: [
            Boar
        ]
    },
    {
        path: 'login',
        title: "Login",
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        canActivate: [
            isUnauthenticatedGuard
        ]
    },
    {
        path: 'selector',
        loadComponent: () => import('./selector/selector.component').then(m => m.SelectorComponent),
        title: "Selector"
    },
    {
        path: 'transmission',
        loadComponent: () => import('./transmission/transmission.component').then(m => m.TransmissionComponent),
        title: "Transmisión",
        providers: [
            Boar
        ]
    },
    /* {
        path: '**',
        redirectTo: 'screen'
    } */
];
