##### Branch edits

##### `week9` branch

Commit to compare to: commit 16d3a514b121764269fe9989729782c2c6d92429

##### `project-setup` branch

The files in this branch are edited for development purposes. Specifically, adding the linter dev dependency, eslint dev dependency, and the eslint.config.cjs config file.

##### `project-setup-establish-server-files` branch

The files that have been modified (and commited) in this `project-setup-establish-server-files` branch correspond to the video at 6:55:16 in this https://youtu.be/rltfdjcXjmk?si=wjeNmI4vImGI4PKh&t=24916 video. That is to say, this branch is up to date with the video at that timestamp.

Furthermore, the code that is commented out with `*** Original code commented out ***` and `// Original code commented out` was original to the Final/ directory of the original project that this repo stems from. That is to say, original to [this](https://github.com/JamieBort/node-express-course/tree/main/06-jobs-api/final) directory.

Lastly, `// NEW code` represents lines of code that were writen while following along with the vide up to the afformentioned timestamp above. The new code will eventually be replaced by the code that is currently commented out with `*** Original code commented out ***` or `// Original code commented out`.

#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet
- cors
- xss-clean
- express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```
