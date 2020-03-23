import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Orders',
      url: '/page/orders',
      icon: 'basket'
    },
    {
      title: 'Items',
      url: '/page/items',
      icon: 'pizza'
    },
  ];
  public labels = [
      {
        title: 'Pending Orders',
        url: 'pending'
      },
    {title: 'Active Orders', url: 'active'},
    {title: 'Completed Orders', url: 'completed'}
    ];

  constructor() { }

  ngOnInit() {
    const path = window.location.pathname.split('page/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

}
