# ff222ey-examination-3

### Url to the Application
The url to my application is https://cscloud702.lnu.se

## Making the Application secure

### Routes protection
Routes that should only be accessed if a user is authenticated or logged in are checked by a middleware to ensure that they are actually logged in
### Csurf protection
To minimize the risk of a csurf attack, A token is generated on each request and sent to the client which the client then sends in each post request. If the token does not match or the token is missing the server sends a 403 to the client.
### CSP
Using a module called Helmet js i was able to set a content security policy for which scripts are allowed to run on the server. This reduces the risk of XSS attacks.
### HTTPS
Instead of using normal HTTP i used https which creates a secure connection between the server and the client. Since HTTPS uses TLS it also provides message authentication and message verification so you can be certain that the sender or receiver is who he says is and that the message has not been tampered with while on transfer.
### Hooks
Using a module called express-github-webhook i was able to verify that the hooks i receive actually come from github. I pass it a secret and it does a hash och the body and it makes sure that the hash matches the x-hub signature or it throws an error.
## Terms explanations
### Reverse Proxy
A reverse proxy acts as a load balancer. It takes request from the internet and then forwards them to one of the web servers behind the proxy as can be seen in the picture below
![Minion](https://octodex.github.com/images/minion.png)







