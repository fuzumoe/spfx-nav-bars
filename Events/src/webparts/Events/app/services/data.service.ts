import { IEvent, IDataService } from '../models/events.model';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { Injectable } from '@angular/core';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { sp, List, ListEnsureResult, ItemUpdateResult, ItemAddResult, FieldAddResult } from "@pnp/sp";
import { TryCatchStmt } from '@angular/compiler';

@Injectable()
export class DataService implements IDataService {
  private _eventItems: IEvent[] = [
    {
      ID: 1,
      Title: 'Company Event 1',
      FirstName1: 'Clark',
      LastName: 'Kent',
      TotalAttendees: 3,
      Email: 'ckent@justiceleague.com',
      EventName: 'Company Event 1'
    },
    {
      ID: 2,
      Title: 'Company Event 2',
      FirstName1: 'Diana',
      LastName: 'Prince',
      TotalAttendees: 1,
      Email: 'dprince@justiceleague.com',
      EventName: 'Company Event 2'
    },
    {
      ID: 3,
      Title: 'Company Event 3',
      FirstName1: 'Arthur',
      LastName: 'Curry',
      TotalAttendees: 2,
      Email: 'acurry@justiceleague.com',
      EventName: 'Company Event 3'
    },
    {
      ID: 4,
      Title: 'Company Event 4',
      FirstName1: 'John',
      LastName: 'Jones',
      TotalAttendees: 4,
      Email: 'jjones@justiceleague.com',
      EventName: 'Company Event 4'
    }
  ];

  private _eventChoices: string[] = [
    'Company Event 1',
    'Company Event 2',
    'Company Event 3',
    'Company Event 4',
  ];

  private context: IWebPartContext;

  constructor() {
    this.context = window["webPartContext"];
  }

  private _testGetEvents(): Promise<IEvent[]> {
    const that = this;
    return new Promise<IEvent[]>((resolve) => {
      resolve(that._eventItems);
    });
  }

  private _testGetEventChoices(): Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      resolve(this._eventChoices);
    });
  }

  private _testAddEvent(event: IEvent): Promise<{}> {
    const that = this;
    this._eventItems.push(event);
    return new Promise<{}>((resolve) => {
      resolve(that._eventItems);
    });
  }

  private _testUpdateEvent(event: IEvent): Promise<{}> {
    const that = this;

    for (let i: number = 0; i < this._eventItems.length; i++) {
      if (this._eventItems[i].ID === event.ID) {
        this._eventItems[i].Email = event.Email;
        this._eventItems[i].EventName = event.EventName;
        this._eventItems[i].FirstName1 = event.FirstName1;
        this._eventItems[i].LastName = event.LastName;
        this._eventItems[i].Title = event.Title;
        this._eventItems[i].TotalAttendees = event.TotalAttendees;
      }
    }
    return new Promise<{}>((resolve) => {
      resolve();
    });
  }

  private _testDeleteEvent(event: IEvent): Promise<{}> {
    const that = this;
    let pos: number = -1;

    for (let i: number = 0; i < that._eventItems.length; i++) {
      if (that._eventItems[i].ID === event.ID) {
        pos = i;
        break;
      }
    }

    if (pos > -1) {
      that._eventItems.splice(pos, 1);
    }

    return new Promise<{}>((resolve) => {
      resolve();
    });
  }

  private _prodGetEvents(): Promise<IEvent[]> {
    const that = this;

    return sp.web.lists.getByTitle("Events").items.select("Id", "Title", "FirstName1", "LastName", "EventName", "Email", "TotalAttendees").get<IEvent[]>().then(e => {
      that._eventItems = e;
      return that._eventItems;
    });
  }

  private _prodGetEventChoices(): Promise<string[]> {
    const that = this;
    return sp.web.fields.getByTitle('EventName').get().then((data) => {
      that._eventChoices = [];
      for (let choice of data.Choices) {
        that._eventChoices.push(choice);
      }
      return that._eventChoices;
    });
  }

  private _prodAddEvent(event: IEvent): Promise<{}> {
    const that = this;

    return sp.web.lists.getByTitle("Events").items.add(event).then((iar: ItemAddResult) => {
      return null;
    });
  }

  private _prodUpdateEvent(event: IEvent): Promise<{}> {
    const that = this;

    return sp.web.lists.getByTitle("Events").items.getById(event.ID).update({
      Email: event.Email,
      EventName: event.EventName,
      FirstName1: event.FirstName1,
      LastName: event.LastName,
      Title: event.Title,
      TotalAttendees: event.TotalAttendees
    }).then(u => {
      return null;
    });
  }

  private _prodDeleteEvent(event: IEvent): Promise<{}> {
    return sp.web.lists.getByTitle("Events").items.getById(event.ID).delete().then(u => {
      return null;
    });
  }

  public GetEventsAsync(): Promise<IEvent[]> {
    if (Environment.type === EnvironmentType.Local) {
      return this._testGetEvents();
    }
    else {
      return this._prodGetEvents();
    }
  }

  public AddEventAsync(event: IEvent): Promise<{}> {
    if (Environment.type === EnvironmentType.Local) {
      return this._testAddEvent(event);
    }
    else {
      return this._prodAddEvent(event);
    }
  }

  public UpdateEventAsync(event): Promise<{}> {
    if (Environment.type === EnvironmentType.Local) {
      return this._testUpdateEvent(event);
    }
    else {
      return this._prodUpdateEvent(event);
    }
  }

  public DeleteEventAsync(event): Promise<{}> {
    if (Environment.type === EnvironmentType.Local) {
      return this._testDeleteEvent(event);
    }
    else {
      return this._prodDeleteEvent(event);
    }
  }

  public GetEventChoicesAsync(): Promise<string[]> {
    if (Environment.type === EnvironmentType.Local) {
      return this._testGetEventChoices();
    }
    else {
      return this._prodGetEventChoices();
    }
  }
}
