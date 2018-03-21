# First Catering Ltd: Card Credit API

## Adding New Clients
Run the `newclient` task, passing the name of the client.
**Example:**
```commandline
$ npm run newclient -- Bows Kiosk
``` 
**Output:**   
Success
```
Created client 'Bows Kiosk'
Client ID: f98a6f71d96631e375c1871fb45053c7
Client Secret 789bbc56b3f75f674140d65662b16516
```
Failure (if a client with the same name already exists)
```
Error saving client: Client with name 'Bows Kiosk' already exists.
```
