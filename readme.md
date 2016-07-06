# jQuery monitor download plugin

Note that this plugin should work with server side.

It submit a additional parameter download-token to server, and server should response a cookie with the same name and same value. 

# Demo

## Client

- Monitor on link:

	`$('a').monitorDownload();`
	
- Monitor on form:

	`$('form').monitorDownload();`
	
- Monitor on button:

	`$('form button').monitorDownload();`

## Server (Java)
```Java
String token = request.getParameter("download-token");
Cookie cookie = new Cookie("download-token", token);
response.addCookie(cookie);
```
