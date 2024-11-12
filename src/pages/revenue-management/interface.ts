import {ETypeChart} from '../../components/chart';

export interface ITypeChart {
  appointment: ETypeChart;
  service: ETypeChart;
}

export interface IYearChoose {
  appointment: string;
  service: string;
}

export interface IMonthChoose {
  appointment: number;
  service: number;
}

// export enum EMonth {
//   ALL = 0, // tất cả
//   JANUARY = 1, // tháng 1
//   FEBRUARY = 2, // tháng 2
//   MARCH = 3, // tháng 3
//   APRIL = 4, // tháng 4
//   MAY = 5, // tháng 5
//   JUNE = 6, // tháng 6
//   JULY = 7, // tháng 7
//   AUGUST = 8, // tháng 8
//   SEPTEMBER = 9, // tháng 9
//   OCTOBER = 10, // tháng 10
//   NOVEMBER = 11, // tháng 11
//   DECEMBER = 12, // tháng 12
// }

export enum ETypeChooseForChart {
  APPOINMENT = 'APPOINMENT',
  SERVICE = 'SERVICE',
}
