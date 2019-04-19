

export interface INavbarItem{
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  items?: Array<any>;
  onClick?: (item?: INavbarItem, ev?: Event) => void;
  text?: string;
}

export interface INavbarItemState {
  navbarItems: INavbarItem[];
}

export interface INavbarItemProps {
  domElement: HTMLDivElement;
  linkItems?: INavbarItem[];
  activeLinkUrl?: string;
  activeLinkTitle?: string;
}
