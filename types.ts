import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIOServer;
    };
  };
};

export interface UserInfo {
  id: number;
  roles: {
    User: boolean;
  };
  email: string;
  userName: string;
}

export interface JWTPayload {
  iss?: string; // Issuer
  sub?: string;
  userInfo: UserInfo;
}

export enum ListStatus {
  ACTIVE = "active",
  CROSSED = "CROSSED",
  ARCHIVED = "ARCHIVED",
}
