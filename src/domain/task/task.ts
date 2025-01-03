export class Task {
  constructor(
    private _id: number | undefined,
    private _title: string,
    private _userId: number,
    private _scheduleMinnutes: number,
    private _actualMinutes: number
  ) {}
}
