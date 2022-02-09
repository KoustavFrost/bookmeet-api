export interface Socket<OnData, EmitData> {
  on(event: string, callback: (data: OnData) => void);
  emit(event: string, data: EmitData);
}

export type AppData = {
  allSockets: Socket<any, any>[];
};

export enum SocketIoEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}
