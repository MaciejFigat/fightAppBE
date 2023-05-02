# fightAppBE
This is the server for the fightApp project. 
This project was made with Node.js, Express.js and MongoDB.

## Installation
1. Clone the repository
2. Install the dependencies
3. Run the server

```npm run server```
## Environmental Variables
To connect to MongoDB you need a .env file with the following variables:

```MONGO_URI = <your mongo uri>```

You will need to create a database in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and get the URI from there. 

```PORT = 5000```
```NODE_ENV = development (or production)```

If You choose to use mailing like I do during user authentication, you will need to add the following variables:

```HOST = hostEmail```
```USER = userEmail```
```PASS = password```
```SERVICE = gmail (or whatever you use)```

You can get an account here: [email-JS](https://www.emailjs.com/)


## Deployment
[I recommend Render.com for deployment](https://render.com/)

## Miscelaneous
Remember about the .gitignore file. 
Also if you use MongoDB Atlas do enable the IP whitelist and add your IP address there.

## Contact me 

If you have any questions or suggestions, feel free to contact me at:
[LinkedIn](https://www.linkedin.com/in/maciej-figat/)


