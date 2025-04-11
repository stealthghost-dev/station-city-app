import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IFullAddress } from '../Interfaces/iFullAddress';
@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {

  constructor(private http: HttpClient) {}

  getCities(): Observable<string[]> {
    return this.http.get('assets/cityList.txt', { responseType: 'text' }).pipe(
      map(text => text.split('\n').map(line => line.trim()).filter(Boolean))
    );
  }

  getCityAddresses(city: string): Observable<{ street: string, station: string }[]> {
    const fileName = `assets/${city}_Address.txt`;
    return this.http.get(fileName, { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n');
        const uniqueAddresses = new Map<string, string>(); // street → station
        for (let line of lines) {
          const cols = line.split('\t');
          const station = cols[1];
          const street = [cols[5], cols[6], cols[7]].filter(Boolean).join(' ').trim();
          if (street && !uniqueAddresses.has(street)) {
            uniqueAddresses.set(street, station);
          }
        }
        return Array.from(uniqueAddresses.entries()).map(([street, station]) => ({ street, station }));
      })
    );
  }


  getAddressesForCity(city: string): Observable<IFullAddress[]> {
    const filePath = `assets/${city}_Address.txt`;
  
    return this.http.get(filePath, { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n');
        const resultMap = new Map<string, IFullAddress>();
  
        for (let line of lines) {
          const cols = line.split('\t');
          const station = cols[1]?.trim();
          const house = cols[4]?.trim();
          const prefix = cols[5]?.trim();
          const streetName = cols[6]?.trim();
          const suffix = cols[8]?.trim();
          const zip = cols[3]?.trim();
  
          if (!streetName || !station) continue;
  
          const streetKey = streetName.toUpperCase();
          const fullAddress = [house, prefix, streetName, suffix, zip].filter(Boolean).join(' ');
          const displayAddress = `${fullAddress} (Station ${station})`;
  
          // Use fullAddress + station as unique key
          const uniqueKey = `${fullAddress}|${station}`;
          if (!resultMap.has(uniqueKey)) {
            resultMap.set(uniqueKey, {
              station,
              streetKey,
              fullAddress: displayAddress
            });
          }
        }
  
        return Array.from(resultMap.values());
      })
    );
  }
  getStationInfo(stationCode: string, street: string): Observable<{ number: string, name: string, phone: string } | null> {
    return this.http.get('assets/VCStationPhoneNumbers.txt', { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n');
  
        // Case 1: Station code is a 2-digit number
        if (/^\d{2}$/.test(stationCode)) {
          const match = lines.find(line => line.startsWith(stationCode + '\t'));
          if (match) {
            const cols = match.split('\t');
            return {
              number: stationCode,
              name: cols[1]?.trim() ?? '',
              phone: cols[5]?.trim() ?? ''
            };
          }
        }
  
        // Case 2: Fallback codes
        switch (stationCode.toUpperCase()) {
          case 'VEN':
            return { number: 'VEN', name: 'Ventura Station', phone: '805-339-4393' };
          case 'OXD':
            return { number: 'OXD', name: 'Oxnard Station', phone: '805-385-7722' };
          case 'FIL':
            return { number: 'FIL', name: 'Fillmore Station', phone: '805-524-0586' };
          default:
            return null;
        }
      })
    );
  }
  getStationPhone(stationCode: string, street: string): Observable<string | null> {
    return this.http.get('assets/VCStationPhoneNumbers.txt', { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n');
  
        // Case 1: 2-digit station number
        if (/^\d{2}$/.test(stationCode)) {
          const match = lines.find(line => line.startsWith(stationCode + '\t'));
          if (match) {
            const cols = match.split('\t');
            return cols[5]?.trim() ?? null;
          }
        }
  
        // Case 2: fallback station codes like 'VEN', 'OXD', 'FIL'
        switch (stationCode.toUpperCase()) {
          case 'VEN':
            return '805-339-4393';
          case 'OXD':
            return '805-385-7722';
          case 'FIL':
            return '805-524-0586';
          default:
            return null;
        }
      })
    );
  }

  getStationPhoneSecond(stationNumber: string | null | undefined, street: string): Observable<string | null> {
    return this.http.get('assets/VCStationPhoneNumbers.txt', { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n');
  
        // Scenario 1: Station number is a valid 2-digit number
        if (stationNumber && /^\d{2}$/.test(stationNumber)) {
          const match = lines.find(line => line.startsWith(stationNumber + '\t'));
          if (match) {
            const cols = match.split('\t');
            return cols[5]?.trim() ?? null;
          }
        }
  
        // Scenario 2: Use last 3 letters of the street name
        const lastThree = street.slice(-3).toUpperCase();
        switch (lastThree) {
          case 'VEN':
            return '805-339-4393';
          case 'OXD':
            return '805-385-7722';
          case 'FIL':
            return '805-524-0586';
          default:
            return null;
        }
      })
    );
  }

  getStationPhoneOriginal(stationNum: string): Observable<string | null> {
    return this.http.get('assets/VCStationPhoneNumbers.txt', { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n');
        for (let line of lines) {
          const cols = line.split('\t');
          if (cols[0] === stationNum) {
            return cols[5]; // phone number
          }
        }
        return null;
      })
    );
  }
}

