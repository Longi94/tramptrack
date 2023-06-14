import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RollerService } from './roller/roller.service';
import { SITES, Site } from './site/sites';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  @Input() selectedDate: string = new Date().toDateString();

  sites = SITES;
  selectedSite: Site = SITES[0];

  constructor(private rollerService: RollerService) {
  }

  onChange() {
    this.rollerService.getAvailabilities(this.selectedSite, new Date(this.selectedDate)).subscribe(
      console.log
    );
  }
}
