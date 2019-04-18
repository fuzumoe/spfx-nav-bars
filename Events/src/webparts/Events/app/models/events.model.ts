export interface IEvent {
  ID: number;
  Title: string;
  FirstName1: string;
  LastName: string;
  TotalAttendees: number;
  Email: string;
  EventName: string;
}

export interface IDataService {
  GetEventsAsync(showpastevents?: boolean): Promise<IEvent[]>;
  GetEventChoicesAsync(): Promise<string[]>;
  AddEventAsync(event: IEvent): Promise<{}>;
  UpdateEventAsync(event: IEvent): Promise<{}>;
  DeleteEventAsync(event: IEvent): Promise<{}>;
}