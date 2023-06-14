import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RollerService } from './roller/roller.service';
import { SITES, Site } from './site/sites';
import { Availabilities } from './roller/availabilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  selectedDate: string = new Date().toDateString();

  sites = SITES;
  selectedSite: Site = SITES[0];

  availabilities?: Availabilities;
  loading = false;
  sessionNames: string[] = [];
  bookings: { [name: string]: { [sessionName: string]: number } } = {}

  constructor(private rollerService: RollerService) {
  }

  onChange() {
    this.loading = true;
    this.sessionNames = [];
    this.bookings = {};
    this.rollerService.getAvailabilities(this.selectedSite, new Date(this.selectedDate)).subscribe(
      avail => {
        this.availabilities = avail;

        const uniqueNames = new Set<string>();
        avail.products?.forEach(p => {
          const ticketName = p.name ?? '';
          this.bookings[ticketName] = {};
          p.sessions?.forEach(s => {
            if (s.name) {
              this.bookings[ticketName][s.name] = s.bookedQuantity ?? 0;
              uniqueNames.add(s.name);
            }
          });
        });

        for (const name of uniqueNames) {
          this.sessionNames.push(name);
        }
        this.sessionNames.sort();
        this.loading = false;
      }
    );
  }
}
