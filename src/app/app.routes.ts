import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home', title: 'Home' },
    
    {
        path: 'home',
        loadComponent: () => import('./components/home/home')
            .then((m) => m.Home), title: 'Home'
    },
    {
        path: 'dynamic-component',
        loadComponent: () => import('./components/dynamic-component/dynamic-component')
            .then((m) => m.DynamicComponent), title: 'Dynamic Component'
    },
];
