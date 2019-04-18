import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import { sp } from "@pnp/sp";

import * as strings from 'ExttestCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IExttestCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'ExttestCommandSet';

export default class ExttestCommandSet extends BaseListViewCommandSet<IExttestCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  private getEventTotals(eventName: string): Promise<number>{
    let total: number = 0;

    return sp.web.lists.getByTitle("Events").items.select("EventName", "TotalAttendees").get().then(data => {
      for (let event of data) {
        if(event.EventName === eventName)
          total += event.TotalAttendees + 0;
      }
      return total;
    });
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    const that = this;
    switch (event.itemId) {
      case 'COMMAND_2':
        Dialog.prompt(`Enter event name`).then((value: string) => {
          that.getEventTotals(value).then(total => {
            Dialog.alert(total.toString());
          });
        });
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
