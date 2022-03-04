export interface IChat {
  _id: string;
  to: string;
  from: string;
  message: string;
}

export interface IChatInputDTO {
  to: string;
  from: string;
  message: string;
}
