export interface IResponse<T> {
  data: T;
}

export interface IRetrieveNotificationsResponse {
  recipients: string[];
}

export interface ISuspendStudentResponse {
  student: string;
  suspended: boolean;
}
