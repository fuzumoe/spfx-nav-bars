import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import * as React from "react";
import * as ReactDom from 'react-dom';

import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import NavBar from './NavBar';
import { Dialog } from '@microsoft/sp-dialog';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import * as strings from 'ApplicationCustomizerStrings';

const LOG_SOURCE: string = 'ApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ApplicationCustomizer
  extends BaseApplicationCustomizer<IApplicationCustomizerProperties> {
    private _headerPlaceholder: PlaceholderContent;

    @override
    public onInit(): Promise<void> {
      Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

      // Added to handle possible changes on the existence of placeholders
      this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

      // Call render method for generating the needed html elements
      this._renderPlaceHolders();

      return Promise.resolve<void>();
    }

    private _renderPlaceHolders(): void {
      // Check if the header placeholder is already set and if the header placeholder is available
      if (!this._headerPlaceholder && this.context.placeholderProvider.placeholderNames.indexOf(PlaceholderName.Top) !== -1) {
        this._headerPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, {
          onDispose: this._onDispose
        });

        // The extension should not assume that the expected placeholder is available.
        if (!this._headerPlaceholder) {
          console.error('The expected placeholder (PageHeader) was not found.');
          return;
        }

        if (this._headerPlaceholder.domElement) {
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
          const element: any = React.createElement(
            Navbar,
            {
              collapsed: true
            }
          );
          ReactDom.render(element, this._headerPlaceholder.domElement);
      }
    }
    }
    private _onDispose(): void {
      console.log('[Breadcrumb._onDispose] Disposed breadcrumb.');
    }
}
