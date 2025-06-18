import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule),
    canActivate: [authGuard]
  },
  {
    path: 'quotes',
    loadChildren: () => import('./features/quotes/quotes.module').then(m => m.QuotesModule),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
]; 