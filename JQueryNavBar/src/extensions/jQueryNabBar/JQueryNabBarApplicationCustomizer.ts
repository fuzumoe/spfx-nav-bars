import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'JQueryNabBarApplicationCustomizerStrings';
import { escape } from '@microsoft/sp-lodash-subset';

const LOG_SOURCE: string = 'JqnavbarextentionApplicationCustomizer';
import styles from './Jqnavbar.module.scss';
import pnp, { Items } from "sp-pnp-js";
import * as jQuery from 'jquery';
import * as _ from "lodash"
const NAV_TERMS_KEY: string = 'global-navigation-terms';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IJQueryNabBarApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class JQueryNabBarApplicationCustomizer
  extends BaseApplicationCustomizer<IJQueryNabBarApplicationCustomizerProperties> {

    private _topPlaceholder: PlaceholderContent | undefined;
    private itemsGen: string = null;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);

      let items =  [
        {
            text: "Home",
             url: "#"

        },
        {
            text: "Active One",
            url: "#"

        },
        {
            text: "Disabled Link",
            url: "#"
        },
        {
            text: "Dropdown Link",
            url: "#",
            submenus: [{
              title:"Some Title",
               items:[
                { text: "Link 1" , url: "#"},
                { text: "Link 2",  url: "#" },
                { text: "Link 3", url: "#" },
                { text: "Link 4",
                url: "#" },
                { text: "Link 5",
                url: "#" }
               ]

            }
            ]
        }
    ]
       //Generate Mega Menu HTML
       let menuString: string = this.generateMenueBar(items);
       this.itemsGen = menuString
       //Set HTML
       jQuery("#menu ul").html(menuString);
           // Call render method for generating the HTML elements.
      this.renderPlaceHolders();


      jQuery('#menu > ul > li:has( > ul)').addClass(`${styles.menuDropdownIcon}`);
      //Checks if li has sub (ul) and adds class for toggle icon - just an UI

      jQuery('#menu > ul > li > ul:not(:has(ul))').addClass(`${styles.normalSub}`);
      //Checks if drodown menu's li elements have anothere level (ul), if not the dropdown is shown as regular dropdown, not a mega menu (thanks Luka Kladaric)

      jQuery("#menu > ul").before(`<a href="#" class="${styles.menuMobile}" id="menuMobile">Navigation</a>`);

      //Adds menu-mobile class (for mobile toggle menu) before the normal menu
      //Mobile menu is hidden if width is more then 959px, but normal menu is displayed
      //Normal menu is hidden if width is below 959px, and jquery adds mobile menu
      //Done this way so it can be used with wordpress without any trouble

    //Make sure that menu is hidden when resizing the window to desktop
  // tslint:disable-next-line: no-function-expression
    jQuery(window).resize(function(){
        if (jQuery(window).width() > 943) {
          jQuery("#menu > ul > li").children("ul").hide();
        }
      });

      jQuery("#menu > ul > li").hover(function (e) {
        if (jQuery(window).width() > 943) {
          jQuery(this).children("ul").stop(true, false).fadeToggle(150);
          e.preventDefault();
        }
      });
      //If width is more than 943px dropdowns are displayed on hover

      jQuery("#menu > ul > li").click(function () {
        if (jQuery(window).width() <= 943) {
          jQuery(this).children("ul").fadeToggle(150);
        }
      });
      //If width is less or equal to 943px dropdowns are displayed on click (thanks Aman Jain from stackoverflow)

      //window.showOnMobileClass = `${styles.showOnMobile}`;
    // tslint:disable-next-line: no-function-expression
      jQuery("#menuMobile").click(function (e) {
        jQuery("#menu > ul").toggleClass(`${styles.showOnMobile}`);
        e.preventDefault();
      });


    return Promise.resolve();
  }


  private generateMenueBar(items: any[]): string {
    let menuString: string = "";
// tslint:disable-next-line: no-function-expression
       _.forEach(items, function(item){
        menuString += "<li><a href=\"" + item.url + "\">" + item.text + "</a>";

        // if
        if(item.submenus){
          console.log(_.isUndefined(item.submenus));
          console.log(_.isEmpty(item.submenus));
          menuString += "<ul>";
// tslint:disable-next-line: no-function-expression
          _.forEach(item.submenus, function(sItems){
            menuString += "<li><a href='#'>" + sItems.title + "</a>";

            menuString += "<ul>";
// tslint:disable-next-line: no-function-expression
            _.forEach(sItems.items, function(it){
              menuString += "<li><a href=\"" + it.url + "\">" + it.text  + "</a> </li>";
            });
            menuString += "</ul>";
            menuString += "</ul> </li>";

          });

        }

       });

      menuString += "</li>";

    return menuString;
  }


  private renderPlaceHolders(): void {

    console.log('HelloWorldApplicationCustomizer._renderPlaceHolders()');
    console.log('Available placeholders: ',  this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));
    console.log(this.context.placeholderProvider);
    // Handling the top placeholder
    if (!this._topPlaceholder) {
      console.log("||||||||||||||||||||||||||||||||||||||||||||||||||");
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent( PlaceholderName.Top, { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }

      if (this.properties) {
        console.log("|||0|||||0||||||0|||||0|||||||||||||||||||||||||||||||");
        if (this._topPlaceholder.domElement) {
          let firstPart:string =  `<div class="${styles.app}">  <div class="${styles.menuContainer}"> <div class="${styles.menu}" id="menu">  <ul>`;
          let secondPart:string =  this.itemsGen;
          let thirdPart: string =  `</ul>  </div> </div>  </div>`;
          this._topPlaceholder.domElement.innerHTML = firstPart + secondPart + thirdPart;
        }
      }
    }
  }
  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
