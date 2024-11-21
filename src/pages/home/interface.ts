export interface IFilterForYear {
  dataAppointmentsForMonth: IMonthTotal[];
  dataAppointmentsForDay: IDayTotal[];
  dataServicesForMonth: IServiceForMonth[];
}

export interface IMonthTotal {
  month: string;
  count: number;
}

export interface IDayTotal {
  day: string;
  count: number;
}

export interface IServiceForMonth {
  id: number;
  month: string;
  count: number;
}
