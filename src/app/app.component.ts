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

  selectedDate: string = new Date().toISOString().substring(0, 10);

  sites = SITES;
  selectedSite: string = SITES[0].apiKey;

  availabilities?: Availabilities;
  loading = false;
  sessionNames: string[] = [];
  bookings: { [name: string]: { [sessionName: string]: { count: number, restricted: boolean, full: boolean } | undefined } } = {}
  totals: { [name: string]: number } = {}

  constructor(private rollerService: RollerService) {
    this.onChange();
  }

  onChange() {
    const site = this.sites.find(s => s.apiKey === this.selectedSite);
    if (site === undefined) {
      return;
    }
    this.loading = true;
    this.sessionNames = [];
    this.bookings = {};
    this.totals = {};

    this.rollerService.getAvailabilities(this.sites.find(s => s.apiKey === this.selectedSite)!, new Date(this.selectedDate)).subscribe(
      avail => {
        this.availabilities = avail;

        const uniqueNames = new Set<string>();
        avail.products?.forEach(p => {
          const ticketName = p.name ?? '';
          this.bookings[ticketName] = {};
          p.sessions?.forEach(s => {
            if (s.name) {
              if (!(s.name in this.totals)) {
                this.totals[s.name] = 0;
              }
              this.totals[s.name] += s.bookedQuantity ?? 0;
              this.bookings[ticketName][s.name] = {
                count: s.bookedQuantity ?? 0,
                restricted: s.isRestricted ?? false,
                full: s.isSessionCapacityFull ?? false
              }
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
