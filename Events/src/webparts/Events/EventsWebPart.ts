import 'zone.js';

import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

//Include Polyfills for unsupported browsers (if using Angular Elements)
import "@webcomponents/custom-elements/src/native-shim";
import "core-js/es7/reflect";
//import 'reflect-metadata';
require('zone.js');
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import styles from './EventsWebPart.module.scss';
import * as strings from 'EventsWebPartStrings';
import { sp } from "@pnp/sp";

export interface IEventsWebPartProps {
  description: string;
}

export default class EventsWebPart extends BaseClientSideWebPart<IEventsWebPartProps> {
  private _showPastEvents: Boolean = false;
  public render(): void {
    // forward the context globally
    window['webPartContext'] = this.context;
    // default UI
    this.domElement.innerHTML = '<div class="container"><spfx-app></spfx-app></div>';
    // init angular
    platformBrowserDynamic().bootstrapModule(AppModule);    
  }

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneCheckbox('checkBoxField',{
                  text: 'Show Past Events'
                }),              ]
            }
          ]
        }
      ]
    };
  }
}
