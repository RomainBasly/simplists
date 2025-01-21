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

export interface ClientToServerEvents {
  ping: () => void;
}
export interface ServerToClientEvents {
  pong: () => void;
}

export type IResponse = IList[];

export type IList = {
  "app-lists": IListContent;
};
export type IListContent = {
  id: string;
  listName: string;
  thematic: string;
  description: string;
  beneficiaries: IBeneficiary[];
  items: IElement[];
};

export type IBeneficiary = {
  "app-users": IUser;
};

export type IUser = {
  userName: string;
  user_id: string;
};

export type IElement = {
  id: string;
  updated_at: string;
  content: string;
  statusOpen: boolean;
};

export type IUpdateList = {
  message: string;
  success: boolean;
  data: {
    itemContentChanged: {
      content: string;
      id: string;
      statusOpen: boolean;
      updated_at: string;
    }[];
  };
};


