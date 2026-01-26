## CtD Group Mentor Session Notes for Lesson 10 / Jobs API Part 2.

Wednesday, 28 January 2026

### Table of contents

1. [Dependencies used in this lesson](#dependencies-used-in-this-lesson)

2. [Deploying to Render.com](#deploying-to-rendercom)

### Dependencies used in this lesson.

---

#### 🛡️ 1. **Helmet dependency** (https://www.npmjs.com/package/helmet)

**What it is**
A middleware for Node.js/Express that **helps secure your app by setting security-related HTTP response headers**.
_As a reminder_, HTTP response header provide important information about the response or the server itself, such as

- the type of content being returned,
- how long the content is valid,
- the status of the request,
- and much more.

Helmet is essentially a collection of smaller middleware functions that apply useful HTTP headers. ([npm][1])

**How it works**
When you `app.use(helmet())`, Helmet automatically sets a set of HTTP headers (like `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, etc.) on every response, based on sensible defaults. These headers instruct browsers to block or restrict certain behaviors that could be exploited. ([npm][1])

**Why it’s useful**
Express doesn’t provide most security headers by default. Helmet fills in those gaps easily, hardening your app against risks like clickjacking, MIME sniffing, and various injection attacks at the HTTP level. ([Howik][2])

**An example of an HTTP response header WITHOUT any dependency**

```
HTTP/1.1 200 OK
Date: Fri, 26 Jan 2026 14:00:00 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Connection: keep-alive
Cache-Control: max-age=3600
```

**An example of an HTTP response header WITH the Helmet dependency**

```
HTTP/1.1 200 OK
Date: Fri, 26 Jan 2026 14:00:00 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Connection: keep-alive
Cache-Control: max-age=3600
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Feature-Policy: microphone 'none'; camera 'none'
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
```

**Breakdown of Helmet-Added Headers:**

- Strict-Transport-Security (HSTS): Forces the browser to only use HTTPS to access the site, preventing downgrade attacks.

- X-Content-Type-Options: Prevents browsers from guessing the MIME type of a response (stopping "content sniffing" attacks).

- X-Frame-Options: Protects against Clickjacking attacks by preventing your site from being embedded in a `<frame>`, `<iframe>`, `<object>`, etc., on another page. SAMEORIGIN means only pages from the same origin can embed the content.

- X-XSS-Protection: Enables the browser's built-in XSS filtering. If malicious content is detected, it will prevent the page from rendering.

- Referrer-Policy: Controls how much referrer information should be included with requests. no-referrer-when-downgrade ensures that the referrer is only sent over secure connections.

- Feature-Policy (now Permissions-Policy): Restricts the use of certain browser features (e.g., microphone, camera) to protect users' privacy and security.

- Content-Security-Policy (CSP): Specifies which content (scripts, styles, etc.) is allowed to be loaded by the browser. This can greatly reduce the risk of cross-site scripting (XSS) attacks.

---

#### 🔄 2. **CORS dependency** (https://www.npmjs.com/package/cors)

**What it is**
A middleware to enable **Cross-Origin Resource Sharing (CORS)** in your Express app, which controls how your API responds to requests from web pages hosted on **different origins** (i.e., different domains/ports).

_As a reminder_,

- CORS is a security feature implemented by browsers to control how web pages from one origin can request resources (like APIs, images, etc.) from a different origin.
- When a web page makes a request to a server on a different domain (or port), the browser will check whether the server allows such a cross-origin request. If the server permits it, the browser will allow the request; if not, it will block the request for security reasons.

**How it works**
Browsers enforce a same-origin policy that blocks cross-origin requests unless the server explicitly allows them.
Specifically,

- the front end sends a Preflight Request: For certain types of requests (like PUT, DELETE, or custom headers), the browser first sends a preflight request (an OPTIONS request) to check if the server allows the actual request.
- Server Response: The server responds with CORS headers to indicate whether the request is allowed.
- Using `app.use(cors(options))`, the cors middleware adds appropriate `Access-Control-*` headers so that browsers know which origins, methods, and headers are permitted.

**Why it’s useful**
Without CORS headers, browsers will block legitimate cross-domain requests (for example, your React/Vue frontend calling your API). CORS lets you **safely allow only specific client origins to access your backend**, avoiding unwanted cross-site access.

**An example of an HTTP response header WITH the cors dependency**

```
HTTP/1.1 200 OK
Date: Fri, 26 Jan 2026 14:00:00 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Connection: keep-alive
Cache-Control: max-age=3600
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type
```

**Common CORS Headers:**

- Access-Control-Allow-Origin: Specifies which origins are allowed to access the resource (e.g., \* for any origin or https://example.com for a specific origin).

- Access-Control-Allow-Methods: Specifies which HTTP methods are allowed (e.g., GET, POST, PUT).

- Access-Control-Allow-Headers: Specifies which headers can be used in the actual request.

- Access-Control-Allow-Credentials: Specifies whether the browser should include credentials (cookies, HTTP authentication) in the request.

---

#### 🧹 3. **xss-clean dependency** (https://www.npmjs.com/package/xss-clean)

**What it is**
Middleware that **sanitizes user input** (like data in `req.body`, `req.query`, and `req.params`) to remove potentially dangerous HTML or scripts that could lead to **Cross-Site Scripting (XSS)** issues. ([npm][4])

**How it works**
When placed early in the middleware chain (e.g., `app.use(xss())`), it examines incoming request data and **escapes or removes characters/constructs that resemble script tags or HTML that could be executed in a browser**. ([npm][4])

Specifically, it

- intercepts incoming requests (typically POST or PUT data) and sanitizes any user input that might include malicious JavaScript code. It does this by removing or encoding potentially dangerous characters like `<`, `>`, `&`, and others that can be used in XSS attacks.
- prevents malicious HTML and JavaScript from being injected into user input fields by encoding certain characters, effectively neutralizing any scripts that might be injected.

**Why it’s useful**
XSS attacks occur when malicious input (like `<script>…</script>`) ends up being rendered in a user’s browser and executes code. Sanitizing input reduces the risk that unsafe content will ever be stored or echoed back in responses. ([MoldStud][5])

_Note:_ While widely used for basic sanitization, input sanitization should be paired with proper output encoding and validation in more complex apps. ([Stack Overflow][6])

Example before Sanitization. User submits the following input: `<script>alert('XSS Attack!');</script>`

Example after xss-clean Sanitization. The input would be sanitized to: `&lt;script&gt;alert('XSS Attack!');&lt;/script&gt;`

In this case, the script will not be executed.

---

#### 🛑 4. **express-rate-limit dependency** ([https://www.npmjs.com/package/express-rate-limit](https://www.npmjs.com/package/express-rate-limit))

**What it is**
An Express middleware that **limits how many requests a client can make in a given timeframe** — commonly used to protect against brute-force or DoS-type abuse. ([npm][7])

**How it works**
You create a limiter (e.g., `rateLimit({ windowMs: 15*60*1000, max: 100 })`) and apply it with `app.use(limiter)`. This tracks requests (usually by IP) and once the limit is exceeded within that window, the middleware sends back a “Too Many Requests” (429) response. ([CodingEasyPeasy][8])

**Why it’s useful**
Without rate limiting, an attacker (or even a well-intentioned bot) could flood your API with requests, consuming CPU/memory and possibly degrading service — or repeatedly trying credentials (login brute force). Rate limiting helps **protect resources and improve fairness and availability**. ([CodingEasyPeasy][8])

Additional thoughts

- Custom Response Message:

  You can customize the response message and status code to better fit your app’s needs:

  ```
  const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Custom Too Many Requests Message',
  statusCode: 429
  });
  ```

- Bypass Mechanism (Whitelisting):

  Sometimes, you might want to bypass rate limiting for trusted clients (e.g., for admin users or internal services). You can achieve this by adding a check to your limiter middleware:

  ```
  const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req, res) => req.user && req.user.isAdmin // Bypass for admins
  });

  ```

- Global Rate Limiting vs. Route-Specific Limiting:

  You can apply rate limiting globally to the entire app or just to specific routes.
  - Global (for all routes):

    ```
    app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
    }));
    ```

  - Route-specific:

    ```
    app.use('/api/endpoint', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
    }));
    ```

---

### Deploying to Render.com

Back to [Table of contents](#table-of-contents)

I'll add content here if/when there is any to add.

I intend on walking through the process of deploying the Node Express app to Render. We may not have enough time to finish. And/or we may run into unforeseen issues. But this will be a learning experience either way.

---

[1]: https://www.npmjs.com/package/helmet?utm_source=chatgpt.com "Helmet"
[2]: https://howik.com/expressjs-security-middleware?utm_source=chatgpt.com "Understanding ExpressJS Security Middleware - Howik"
[4]: https://www.npmjs.com/package/xss-clean?utm_source=chatgpt.com "xss-clean"
[5]: https://moldstud.com/articles/p-expressjs-security-essentials-protecting-your-applications-from-threats?utm_source=chatgpt.com "Express.js Security Practices for Application Protection | MoldStud"
[6]: https://stackoverflow.com/questions/59242927/node-express-security?utm_source=chatgpt.com "Node/Express security - javascript"
[7]: https://www.npmjs.com/package/express-rate-limit?utm_source=chatgpt.com "express-rate-limit"
[8]: https://www.codingeasypeasy.com/blog/secure-your-express-apis-cors-rate-limiting-and-best-practices?utm_source=chatgpt.com "Secure Your Express APIs: CORS, Rate Limiting, and Best Practices | CodingEasyPeasy"

---

Draft note to share with students in Slack regarding Swagger portion of the lesson:

```
Heads Up

This lesson has an optional component with Swagger. For that, the video has you navigate to APIMatic.io to convert the exported Postman Collection json file to a format that can be imported into Swagger.

I attempted to sign up for their free tier with my gmail account and received an error indicating that I needed to use a `valid business email address`.

I am looking for alternatives to this website. If/when I find one, I'll follow up here to share it.
Likewise, if anyone has an alternative, please share it with the rest of us.

Thank you!

EDIT: later I have received a `Unable to complete sign-up. please try again.` response to the sign-up form.
```
