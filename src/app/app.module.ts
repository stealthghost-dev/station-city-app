import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataLoaderService } from './Services/data-loader.service';
import { CityStreetSelectorComponent } from './Components/city-street-selector/city-street-selector.component';
@NgModule({
  declarations: [
    AppComponent,
    CityStreetSelectorComponent
  ],
  imports: [
    BrowserModule,

    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(), DataLoaderService,
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
