# Readme

This repository contains the backend, frontend, and websocket server for my project. The idea is to be able to share simply lists with your relatives with instant communication using Websockets and later PubSub/Webpush for notifications.

## Structure
- `backend/`: Contains the backend code.
- `frontend/`: Contains the frontend code.
- `websocket/`: Contains the websocket server code.

## Local Development

To run all services locally, ensure you have Docker and Docker Compose installed and runnning, then follow these steps:

1. Clone the repository:
git clone git@github.com:RomainBasly/simplists.git
cd simplists

2. Install docker and docker compose
For Docker, see : https://www.docker.com/get-started/
For Docker compose, see : https://docs.docker.com/compose/install/

3. Launch Docker

4. Run ``docker-compose up --build``

## First Elements of Architecture to understand this Goulasch



## Reminder for pulling (dev only héhé)
pull: `git subtree pull --prefix={{name_of_folder}} {{name_of_folder}} main --squash`
execute the command `git remote -v` if pulling does not work, to see if a remote branch exists
otherwise add it `git remote add {{name_of_folder}} {{link_to_repo}}` and check again `git remote -v`
