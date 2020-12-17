import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      // {
      //   path: 'friends',
      //   loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
      // },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./maps/maps.module').then( m => m.MapsPageModule)
      },
      {
        path: 'friends',
        loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
      }
    ]
  },
  
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
