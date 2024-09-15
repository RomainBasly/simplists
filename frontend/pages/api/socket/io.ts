// import { Server as NetServer } from "http";
// import { NextApiRequest } from "next";
// import { Server as ServerIO } from "socket.io";
// import { NextApiResponseServerIo } from "../../../types";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
//   if (!res.socket.server.io) {
//     const httpServer: NetServer = res.socket.server as any;
//     const io = new ServerIO(
//       httpServer,
//       {
//         cors: {
//           origin: "http://localhost:3000", // Adjust this to match your Next.js app's origin
//           methods: ["GET", "POST"],
//         },
//       }
//     );
//     res.socket.server.io = io;
//   }
//   res.end();
// };

// export default ioHandler;
