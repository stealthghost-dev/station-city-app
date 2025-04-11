import { Component, OnInit } from '@angular/core';
import { DataLoaderService } from '../../Services/data-loader.service';
import { IFullAddress } from '../../Interfaces/iFullAddress';

@Component({
  selector: 'app-city-street-selector',
  templateUrl: './city-street-selector.component.html',
  styleUrls: ['./city-street-selector.component.css'],
  standalone: false
})
export class CityStreetSelectorComponent implements OnInit {
  cities: string[] = [];
  selectedCity = '';

  filteredAddresses: IFullAddress[] = [];
  
  streets: string[] = [];
  selectedStreet = '';
  
  addresses: IFullAddress[] = [];
  selectedAddress: IFullAddress | null = null;
  
  stationInfo: { number: string, name: string, phone: string } | null = null;

  constructor(private dataLoader: DataLoaderService) {}

  ngOnInit(): void {
    this.dataLoader.getCities().subscribe(cities => this.cities = cities);
  }

  onCityChange(): void {
    this.selectedStreet = '';
    this.selectedAddress = null;
    this.stationInfo = null;
  
    this.dataLoader.getAddressesForCity(this.selectedCity).subscribe(addresses => {
      this.addresses = addresses;
      this.streets = Array.from(new Set(addresses.map(a => a.streetKey))).sort();
    });
  }

  // onStreetChange(): void {
  //   const selected = this.streets.find(s => s.street === this.selectedStreet);
  //   if (selected) {
  //     this.stationNumber = selected.station;
  //     this.dataLoader.getStationPhone(this.stationNumber).subscribe(phone => {
  //       this.stationPhone = phone;
  //     });
  //   }
  // }
  onStreetChange(): void {
    this.selectedAddress = null;
    this.stationInfo = null;
  
    this.filteredAddresses = this.addresses.filter(a => a.streetKey === this.selectedStreet);
  }

  onAddressChange(): void {
    if (this.selectedAddress) {
      this.dataLoader.getStationInfo(this.selectedAddress.station, this.selectedAddress.fullAddress)
        .subscribe(info => this.stationInfo = info);
    }
  }
}
