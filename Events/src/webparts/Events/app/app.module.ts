import { NgModule, Injector }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from "@angular/elements";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

import { AppComponent }  from './components/app.component';
//import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import { DataService } from './services/data.service';

@NgModule({
  imports:      [ BrowserModule, HttpClientModule, FormsModule ],
  declarations: [ AppComponent ],
  providers: [ DataService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {

  constructor(private injector: Injector) {}

  public ngDoBootstrap() {
      if(!customElements.get('spfx-app'))
      {
         // define a custom element to get a valid entry point before Angular is fully bootstrapped
         const appElement = createCustomElement(AppComponent, {injector : this.injector});
         customElements.define('spfx-app', appElement);
      }
  }

}
