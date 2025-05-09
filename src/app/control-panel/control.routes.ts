import { Routes } from '@angular/router';
import { isLoggedGuard } from '../common/guards/is-logged.guard';

export const ControlRoutes: Routes = [
    {
        path: 'sorteo',
        loadComponent: () => import('./pages/raffle-clipp/raffle-clipp.component').then(m => m.RaffleClippComponent)
    },
    {
        path: '',
        loadComponent: () => import('./control-panel.component').then(m => m.ControlPanelComponent),
        children:[
            {
                path: 'general',
                loadComponent: () => import('./pages/general-config/general-config.component').then(m => m.GeneralConfigComponent)
            },
            {
                path: 'video',
                loadComponent: () => import('./pages/video-config/video-config.component').then(m => m.VideoConfigComponent)
            },
            {
                path: 'vistas',
                loadComponent: () => import('./pages/view-selector/view-selector.component').then(m => m.ViewSelectorComponent)
            },
            {
                path: '**',
                redirectTo: 'general'
            }
        ],
        canActivate: [
            isLoggedGuard
        ]
    }
];
