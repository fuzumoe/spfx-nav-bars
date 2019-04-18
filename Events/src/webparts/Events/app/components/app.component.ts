import { Component, OnInit } from '@angular/core';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import styles from '../../EventsWebPart.module.scss';
import { DataService } from '../services/data.service';
import { IEvent } from '../models/events.model';
import { sp, List, ListEnsureResult, ItemUpdateResult, ItemAddResult, FieldAddResult } from "@pnp/sp";

@Component({
  selector: 'spfx-app',
  providers: [DataService],
  template: `<div class="${styles.events}">
  <table class="${styles.table}">
      <tr>
          <th>First Name</th>
          <th>Last Name</th>
      </tr>
      <tr>
          <td><input type="text" id="txtFirstName1" [(ngModel)]="newAttendeeFirstName1" /></td>
          <td><input type="text" id="txtLastName" [(ngModel)]="newAttendeeLastName" /></td>
      </tr>
      <tr>
        <th>Email</th>
        <th>Event Name</th>
      </tr>
      <tr>
          <td><input type="text" id="txtEmail" [(ngModel)]="newAttendeeEmail" /></td>
          <td>
              <select name="" id="" [(ngModel)]="newAttendeeEventName">
                  <option *ngFor="let eventName of eventNames">{{eventName}}</option>
              </select>
          </td>
        </tr>
        <tr>
          <th>Total Attendees</th>
          <th></th>
        </tr>
        <tr>
          <td><input type="text" id="txtTotal" [(ngModel)]="newAttendeeTotal" /></td>
          <td>
              <input type="button" id="btnAddAttendee" value="Add" (click)="AddAttendee()">
              <input type="button" id="btnUpdateAttendee" value="Update" (click)="UpdateAttendee()">
          </td>
      </tr>
  </table>
  <table class="${styles.table}">
  <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Event Name</th>
      <th>Total Attendees</th>
      <th>Update</th>
      <th>Delete</th>
  </tr>
  <tr *ngFor="let attendee of eventCollection">
      <td>{{attendee.FirstName1}}</td>
      <td>{{attendee.LastName}}</td>
      <td>{{attendee.Email}}</td>
      <td>{{attendee.EventName}}</td>
      <td>{{attendee.TotalAttendees}}</td>
      <td>
          <input type="button" id="btnPrepUpdateAttendee" value="Update" (click)="PrepUpdateAttendee(attendee)">
      </td>
      <td>
          <input type="button" id="btnDeleteAttendee" value="Delete" (click)="DeleteAttendee(attendee)">
      </td>
  </tr>
</table>`
})
export class AppComponent implements OnInit {

  public context: IWebPartContext;

  public newEvent: IEvent = null;
  public eventCollection: IEvent[] = [];
  private eventNames: string[] = [];
  public newAttendeeEventName: string = '';
  public newAttendeeFirstName1: string = '';
  public newAttendeeLastName: string = '';
  public newAttendeeEmail: string = '';
  public newAttendeeTotal: number = 0;
  public newEventName: string = '';
  public newAttendeeID: number = 0;

  constructor(private dataService: DataService) {
  }

  private LoadAttendees() {
    const that = this;
    this.dataService.GetEventsAsync()
      .then((events: IEvent[]): void => {
        that.eventCollection = [];
        that.eventCollection = events;
      });
  }

  private LoadEventChoices() {
    const that = this;
    this.dataService.GetEventChoicesAsync()
      .then((eventChoices: string[]): void => {
        that.eventNames = [];
        that.eventNames = eventChoices;
      });
  }

  private AddAttendee() {
    const that = this;

    let event: IEvent = {
      ID: 0,
      FirstName1: that.newAttendeeFirstName1,
      LastName: that.newAttendeeLastName,
      Email: that.newAttendeeEmail,
      Title: that.newAttendeeEventName,
      TotalAttendees: that.newAttendeeTotal,
      EventName: that.newAttendeeEventName
    };

    this.dataService.AddEventAsync(event).then((events: IEvent[]) => {
      that.LoadAttendees();
    });


    that.newAttendeeFirstName1 = '';
    that.newAttendeeLastName = '';
    that.newAttendeeEmail = '';
    that.newAttendeeEventName = '';
    that.newAttendeeTotal = 0;
  }

  private PrepUpdateAttendee(att: IEvent) {
    this.newAttendeeID = att.ID;
    this.newAttendeeFirstName1 = att.FirstName1;
    this.newAttendeeLastName = att.LastName;
    this.newAttendeeEmail = att.Email;
    this.newAttendeeEventName = att.EventName;
    this.newAttendeeTotal = att.TotalAttendees;
  }

  private UpdateAttendee() {
    const that = this;

    let attendee: IEvent = {
      ID: that.newAttendeeID,
      FirstName1: that.newAttendeeFirstName1,
      LastName: that.newAttendeeLastName,
      Email: that.newAttendeeEmail,
      Title: that.newAttendeeEventName,
      TotalAttendees: that.newAttendeeTotal,
      EventName: that.newAttendeeEventName
    };

    this.dataService.UpdateEventAsync(attendee).then((events: IEvent[]) => {
      that.LoadAttendees();
    });

    that.newAttendeeID = 0;
    that.newAttendeeFirstName1 = '';
    that.newAttendeeLastName = '';
    that.newAttendeeEmail = '';
    that.newAttendeeEventName = '';
    that.newAttendeeTotal = 0;
  }

  private DeleteAttendee(att: IEvent) {
    const that = this;
    this.dataService.DeleteEventAsync(att).then((events: IEvent[]) => {
      that.LoadAttendees();
    });
  }

  public ngOnInit() {
    this.context = window["webPartContext"];
    this.LoadAttendees();
    this.LoadEventChoices();
  }
}
