# README
## Why the presence of pages folder with an app folder

NEXTJS encounters difficulties with webSockets, especially the distinction between client and server.
Pages folder is a legacy which has not been overcome at this point concerning route handling, to make a communication between server and client inside the app. As we render pages in the server, a solution to that is using the route /pages/api routes handling to make this communication between frontend and backend of the app.