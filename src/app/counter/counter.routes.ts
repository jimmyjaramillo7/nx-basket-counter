import { Routes } from '@angular/router';

export const CounterRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./counter.component').then(m => m.CounterComponent),
        children: [
           {
            path: 'main',
            loadComponent: () => import('./pages/main-counter/mainCounter.component').then(m => m.MainCounterComponent),
            title: "Vista Principal"
           },
           {
            path: 'video',
            loadComponent: () => import('./pages/video-screen/videoScreen.component').then(m => m.VideoScreenComponent),
            title: "Pantalla de Video"
           },
           {
            path: 'kiss-cam',
            loadComponent: () => import('./pages/kiss-cam/kiss-cam.component').then(m => m.KissCamComponent),
            title: "Kiss Cam"
           },
           {
            path: 'raffle',
            loadComponent: () => import('./pages/raffle/raffle.component').then(m => m.SorteoComponent),
            title: "Sorteo Clipp"
           },
           {
            path: 'live',
            loadComponent: () => import('./pages/live-cam/live-cam.component').then(m => m.LiveCamComponent),
            title: "Live Cam"
           },
           {
            path: 'alike-cam',
            loadComponent: () => import('./pages/alike-cam/alike-cam.component').then(m => m.AlikeCamComponent),
            title: "Similar Cam"
           },
           {
            path: '**',
            redirectTo: 'main',
           }
        ]
    }
];
