import Event from "events";

export enum EOpeningState {
  OPEN = "open",
  CLOSED = "closed",
}

class EventEmitter extends Event {}

export default class UserMenuStatus {
  private static ctx: UserMenuStatus;

  private _status: EOpeningState = EOpeningState.CLOSED;
  private readonly event = new EventEmitter();

  private constructor() {
    UserMenuStatus.ctx = this;
    this.switch(this.status);
  }

  public static getInstance() {
    if (!UserMenuStatus.ctx) return new this();
    return UserMenuStatus.ctx;
  }

  public get status() {
    return this._status;
  }

  public onChange(callback: (status: EOpeningState) => void) {
    this.event.on("change", callback);
    return () => {
      this.event.off("change", callback);
    };
  }

  public toggle() {
    if (this.status === EOpeningState.CLOSED) {
      this.switch(EOpeningState.OPEN);
      return;
    }
    this.switch(EOpeningState.CLOSED);
    return;
  }

  public close() {
    this.switch(EOpeningState.CLOSED);
  }

  private switch(status: EOpeningState) {
    if (status === this.status) return;
    this._status = status;
    this.event.emit("change", status);
  }
}
