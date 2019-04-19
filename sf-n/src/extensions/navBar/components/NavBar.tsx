import * as React from "react";
import { INavbarItem, INavbarItemState, INavbarItemProps } from "./INavBar";
import { Breadcrumb, IBreadcrumbItem } from 'office-ui-fabric-react/lib/Breadcrumb';
import { SPHttpClient, HttpClientResponse } from "@microsoft/sp-http";
import styles from './NavBar.module.scss';
import { Components } from "gd-sprest-bs";

export default class NaveBar extends React.Component<INavbarItemProps, INavbarItemState> {
  private linkItems: INavbarItem[];

  constructor(props: INavbarItemProps) {
    super(props);

    this.linkItems = [];


    this.state = {
      navbarItems: []
    };
  }

  public componentDidMount() {

    this.setLinks();
  }


  private setLinks() {

     this.linkItems = (this.props.linkItems)? this.props.linkItems : [
      {
          text: "Home"

      },
      {
          text: "Active One",
          isActive: true,

      },
      {
          text: "Disabled Link",
          isDisabled: true
      },
      {
          text: "Dropdown Link",
          items: [
              { text: "Link 1"  ,isSelected:true},
              { text: "Link 2" },
              { text: "Link 3" },
              { text: "Link 4" },
              { text: "Link 5" }
          ]
      }
  ]
  }


  public render(): any {
    // let  container :any = <div id="ImpNavBarHeaderExtHeader" className={styles.ActiveNavBar} > </div >
    var container = document.createElement('div');
    container.className = styles.ActiveNavBar
    container.id = "ImpNavBarHeaderExtHeader"
    this.props.domElement.appendChild(container);

    let el:HTMLElement = document.getElementById("ImpNavBarHeaderExtHeader")
    var navBar =  Components.Navbar({
      brand: "Impactory Test",
      el: el,
      type:  1,
      className:'ActiveNavBar',
      searchBox: {
        onChange: function(value) {
            // Log the value
            console.log("The search value is: " + value);
        },
        onSearch: function(value) {
            // Log the value
            console.log("The search value is: " + value);
        }
    },
      items: this.linkItems
    });
    return (
      navBar
    );
  }
}
