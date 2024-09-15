// 'use client'
// import React, { useEffect, useState } from 'react'
// import io from 'socket.io-client'

// const socket = io('http://localhost:3001', { transports: ['websocket'] })

// export default function SocketConnector() {
//   const [statusMessage, setStatusMessage] = useState<string>(
//     'Connecting to the socket...',
//   )
//   useEffect(() => {
//     console.log('mounted socket connector')
//     socket.on('connect', () => {
//       console.log('connect to socket.IO server from the nextJS frontend')
//       setStatusMessage('Connected to the Socket.IO Server')
//     })

//     socket.on('From Api', (data: any) => {
//       setStatusMessage(data)
//     })
//     socket.on('disconnect', (data: any) => {
//       setStatusMessage('Disconnected to the Socket.IO Server')
//     })

//     // return () => {
//     //   socket.off('connect')
//     //   socket.off('From Api')
//     //   socket.disconnect()
//     // }
//   }, [])
//   return <div>socket Status2 : {statusMessage}</div>
// }
'use client'

import { useSocket } from '@/components/providers/socket-provider'

// import { useSocket } from '@/components/providers/socket-provider'

// Garder celui là
export default function SocketConnector() {
  const { isConnected, listAttributes } = useSocket()
  if (!listAttributes) {
    return <div>Error</div>
  }
  return <div>`You are {isConnected ? 'connected' : 'disconnected'}`</div>
}
