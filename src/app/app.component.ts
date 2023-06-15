import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RollerService } from './roller/roller.service';
import { SITES, Site } from './site/sites';
import { Availabilities } from './roller/availabilities';

type CellData = {
  count: number,
  countConsideringLocation: number,
  restricted: boolean,
  full: boolean
} | undefined;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  selectedDate: string = new Date().toISOString().substring(0, 10);

  sites = SITES;
  selectedSite: string = SITES[0].apiKey;

  consideringLocation: boolean = true;

  availabilities?: Availabilities;
  loading = false;
  sessionNames: string[] = [];
  bookings: { [name: string]: { [sessionName: string]: CellData } } = {}

  constructor(private rollerService: RollerService) {
    this.onChange();
  }

  getCellClass(data: CellData): string {
    if (data === undefined) {
      return 'booking-no-data';
    }
    if (data.full) {
      return 'booking-full';
    }
    const count = this.consideringLocation ? data.countConsideringLocation : data.count;
    if (count > 10) {
      return 'booking-many';
    }
    if (count > 0) {
      return 'booking-few';
    }
    return 'booking-empty';
  }

  onChange() {
    const site = this.sites.find(s => s.apiKey === this.selectedSite);
    if (site === undefined) {
      return;
    }
    this.loading = true;
    this.sessionNames = [];
    this.bookings = {};

    this.rollerService.getAvailabilities(this.sites.find(s => s.apiKey === this.selectedSite)!, new Date(this.selectedDate)).subscribe(
      avail => {
        this.availabilities = avail;

        const uniqueNames = new Set<string>();
        avail.products?.forEach(p => {
          const ticketName = p.name ?? '';
          this.bookings[ticketName] = {};
          p.sessions?.forEach(s => {
            if (s.name) {
              this.bookings[ticketName][s.name] = {
                count: s.bookedQuantity ?? 0,
                countConsideringLocation: s.productBookedQuantityConsideringLocation ?? 0,
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
