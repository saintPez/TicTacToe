# TicTacToe

Simple tic-tac-toe app project

## Installation

to install the dependencies run the following commands:

```bash
git clone https://github.com/saintPez/TicTacToe.git
cd tictactoe
npm install
```

### Environment Variables

to use environment variables, create a file `.env.NODE_ENV` and replaces `NODE_ENV` with Node Environment, inside the `tictactoe/api/` or `tictactoe/app/` folder

#### Example with the `.env.production` file inside the `tictactoe/api/` folder:

```.env
PORT=3000
MONGO_URI=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
```
