---
title: Get Off My Lawn! v0.0.1
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers:
  - <a href="https://kb.yaitde.io">stuff blah</a>
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="get-off-my-lawn-">Get Off My Lawn! v0.0.1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

mocks and such

Base URLs:

* <a href="https://api.getoffmylawn.xyz/">https://api.getoffmylawn.xyz/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

* API Key (apiKey)
    - Parameter Name: **apiKey**, in: header. 

<h1 id="get-off-my-lawn--default">Default</h1>

## post__auth

> Code samples

```shell
# You can also use wget
curl -X POST https://api.getoffmylawn.xyz/auth \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST https://api.getoffmylawn.xyz/auth HTTP/1.1
Host: api.getoffmylawn.xyz
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "userId": "string",
  "secret": "string",
  "scope": "mock"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('https://api.getoffmylawn.xyz/auth',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'https://api.getoffmylawn.xyz/auth',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('https://api.getoffmylawn.xyz/auth', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.getoffmylawn.xyz/auth', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/auth");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.getoffmylawn.xyz/auth", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth`

> Body parameter

```json
{
  "userId": "string",
  "secret": "string",
  "scope": "mock"
}
```

<h3 id="post__auth-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» userId|body|string|true|none|
|» secret|body|string|true|none|
|» scope|body|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» scope|mock|
|» scope|api|
|» scope|runner|

> Example responses

> 200 Response

```json
{
  "token": "string"
}
```

<h3 id="post__auth-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="post__auth-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» token|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None & None & None & None & None & None
</aside>

<h1 id="get-off-my-lawn--mock">mock</h1>

Mock Api end-points

## delete__api_{domain}_*

> Code samples

```shell
# You can also use wget
curl -X DELETE https://api.getoffmylawn.xyz/api/{domain}/* \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE https://api.getoffmylawn.xyz/api/{domain}/* HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/{domain}/*',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'https://api.getoffmylawn.xyz/api/{domain}/*',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('https://api.getoffmylawn.xyz/api/{domain}/*', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','https://api.getoffmylawn.xyz/api/{domain}/*', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/{domain}/*");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "https://api.getoffmylawn.xyz/api/{domain}/*", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /api/{domain}/*`

*You can use this endpoint to cleanup files at the end of a test run, etc.*

delete file from the mock repository

<h3 id="delete__api_{domain}_*-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|domain|path|string|true|just a way to categorize the data really|
|*|path|string|true|relative path into the mock repository|

<h3 id="delete__api_{domain}_*-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## get__api_{domain}_*

> Code samples

```shell
# You can also use wget
curl -X GET https://api.getoffmylawn.xyz/api/{domain}/* \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET https://api.getoffmylawn.xyz/api/{domain}/* HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/{domain}/*',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'https://api.getoffmylawn.xyz/api/{domain}/*',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('https://api.getoffmylawn.xyz/api/{domain}/*', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.getoffmylawn.xyz/api/{domain}/*', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/{domain}/*");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.getoffmylawn.xyz/api/{domain}/*", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/{domain}/*`

*the contents of the file in the repository is in the body of the response*

returns a file from the mock repository

<h3 id="get__api_{domain}_*-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|domain|path|string|true|just a way to categorize the data really|
|*|path|string|true|relative path into the mock repository|

<h3 id="get__api_{domain}_*-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## post__api_{domain}_*

> Code samples

```shell
# You can also use wget
curl -X POST https://api.getoffmylawn.xyz/api/{domain}/* \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST https://api.getoffmylawn.xyz/api/{domain}/* HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/{domain}/*',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'https://api.getoffmylawn.xyz/api/{domain}/*',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('https://api.getoffmylawn.xyz/api/{domain}/*', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.getoffmylawn.xyz/api/{domain}/*', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/{domain}/*");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.getoffmylawn.xyz/api/{domain}/*", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/{domain}/*`

saves a file into the mock data repository

<h3 id="post__api_{domain}_*-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|domain|path|string|true|just a way to categorize the data really|
|*|path|string|true|relative path into the mock repository|

<h3 id="post__api_{domain}_*-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## delete__api_echo

> Code samples

```shell
# You can also use wget
curl -X DELETE https://api.getoffmylawn.xyz/api/echo \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE https://api.getoffmylawn.xyz/api/echo HTTP/1.1
Host: api.getoffmylawn.xyz
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/echo',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'https://api.getoffmylawn.xyz/api/echo',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('https://api.getoffmylawn.xyz/api/echo', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','https://api.getoffmylawn.xyz/api/echo', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/echo");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "https://api.getoffmylawn.xyz/api/echo", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /api/echo`

*responds with a model that contains all the things you sent it*

echoes what you send it

> Example responses

> 200 Response

```json
{
  "method": "string",
  "params": {},
  "headers": {},
  "body": {}
}
```

<h3 id="delete__api_echo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="delete__api_echo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» method|string|false|none|none|
|» params|object|false|none|none|
|» headers|object|false|none|none|
|» body|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth ( Scopes: [object Object] )
</aside>

## get__api_echo

> Code samples

```shell
# You can also use wget
curl -X GET https://api.getoffmylawn.xyz/api/echo \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET https://api.getoffmylawn.xyz/api/echo HTTP/1.1
Host: api.getoffmylawn.xyz
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/echo',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'https://api.getoffmylawn.xyz/api/echo',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('https://api.getoffmylawn.xyz/api/echo', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.getoffmylawn.xyz/api/echo', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/echo");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.getoffmylawn.xyz/api/echo", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/echo`

*responds with a model that contains all the things you sent it*

echoes what you send it

> Example responses

> 200 Response

```json
{
  "method": "string",
  "params": {},
  "headers": {},
  "body": {}
}
```

<h3 id="get__api_echo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="get__api_echo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» method|string|false|none|none|
|» params|object|false|none|none|
|» headers|object|false|none|none|
|» body|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth ( Scopes: [object Object] )
</aside>

## head__api_echo

> Code samples

```shell
# You can also use wget
curl -X HEAD https://api.getoffmylawn.xyz/api/echo \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
HEAD https://api.getoffmylawn.xyz/api/echo HTTP/1.1
Host: api.getoffmylawn.xyz
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/echo',
{
  method: 'HEAD',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.head 'https://api.getoffmylawn.xyz/api/echo',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.head('https://api.getoffmylawn.xyz/api/echo', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('HEAD','https://api.getoffmylawn.xyz/api/echo', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/echo");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("HEAD");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("HEAD", "https://api.getoffmylawn.xyz/api/echo", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`HEAD /api/echo`

*responds with a model that contains all the things you sent it*

echoes what you send it

> Example responses

> 200 Response

```json
{
  "method": "string",
  "params": {},
  "headers": {},
  "body": {}
}
```

<h3 id="head__api_echo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="head__api_echo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» method|string|false|none|none|
|» params|object|false|none|none|
|» headers|object|false|none|none|
|» body|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth ( Scopes: [object Object] )
</aside>

## patch__api_echo

> Code samples

```shell
# You can also use wget
curl -X PATCH https://api.getoffmylawn.xyz/api/echo \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH https://api.getoffmylawn.xyz/api/echo HTTP/1.1
Host: api.getoffmylawn.xyz
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/echo',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'https://api.getoffmylawn.xyz/api/echo',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('https://api.getoffmylawn.xyz/api/echo', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','https://api.getoffmylawn.xyz/api/echo', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/echo");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "https://api.getoffmylawn.xyz/api/echo", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /api/echo`

*responds with a model that contains all the things you sent it*

echoes what you send it

> Example responses

> 200 Response

```json
{
  "method": "string",
  "params": {},
  "headers": {},
  "body": {}
}
```

<h3 id="patch__api_echo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="patch__api_echo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» method|string|false|none|none|
|» params|object|false|none|none|
|» headers|object|false|none|none|
|» body|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth ( Scopes: [object Object] )
</aside>

## post__api_echo

> Code samples

```shell
# You can also use wget
curl -X POST https://api.getoffmylawn.xyz/api/echo \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST https://api.getoffmylawn.xyz/api/echo HTTP/1.1
Host: api.getoffmylawn.xyz
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/echo',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'https://api.getoffmylawn.xyz/api/echo',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('https://api.getoffmylawn.xyz/api/echo', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.getoffmylawn.xyz/api/echo', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/echo");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.getoffmylawn.xyz/api/echo", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/echo`

*responds with a model that contains all the things you sent it*

echoes what you send it

> Example responses

> 200 Response

```json
{
  "method": "string",
  "params": {},
  "headers": {},
  "body": {}
}
```

<h3 id="post__api_echo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="post__api_echo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» method|string|false|none|none|
|» params|object|false|none|none|
|» headers|object|false|none|none|
|» body|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth ( Scopes: [object Object] )
</aside>

## put__api_echo

> Code samples

```shell
# You can also use wget
curl -X PUT https://api.getoffmylawn.xyz/api/echo \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT https://api.getoffmylawn.xyz/api/echo HTTP/1.1
Host: api.getoffmylawn.xyz
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/echo',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'https://api.getoffmylawn.xyz/api/echo',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('https://api.getoffmylawn.xyz/api/echo', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','https://api.getoffmylawn.xyz/api/echo', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/echo");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "https://api.getoffmylawn.xyz/api/echo", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /api/echo`

*responds with a model that contains all the things you sent it*

echoes what you send it

> Example responses

> 200 Response

```json
{
  "method": "string",
  "params": {},
  "headers": {},
  "body": {}
}
```

<h3 id="put__api_echo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="put__api_echo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» method|string|false|none|none|
|» params|object|false|none|none|
|» headers|object|false|none|none|
|» body|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth ( Scopes: [object Object] )
</aside>

## options__api_echo

> Code samples

```shell
# You can also use wget
curl -X OPTIONS https://api.getoffmylawn.xyz/api/echo \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
OPTIONS https://api.getoffmylawn.xyz/api/echo HTTP/1.1
Host: api.getoffmylawn.xyz
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/echo',
{
  method: 'OPTIONS',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.options 'https://api.getoffmylawn.xyz/api/echo',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.options('https://api.getoffmylawn.xyz/api/echo', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('OPTIONS','https://api.getoffmylawn.xyz/api/echo', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/echo");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("OPTIONS");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("OPTIONS", "https://api.getoffmylawn.xyz/api/echo", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`OPTIONS /api/echo`

*responds with a model that contains all the things you sent it*

echoes what you send it

> Example responses

> 200 Response

```json
{
  "method": "string",
  "params": {},
  "headers": {},
  "body": {}
}
```

<h3 id="options__api_echo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="options__api_echo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» method|string|false|none|none|
|» params|object|false|none|none|
|» headers|object|false|none|none|
|» body|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth ( Scopes: [object Object] )
</aside>

## delete__api_status_{statusCode}

> Code samples

```shell
# You can also use wget
curl -X DELETE https://api.getoffmylawn.xyz/api/status/{statusCode} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE https://api.getoffmylawn.xyz/api/status/{statusCode} HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/status/{statusCode}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'https://api.getoffmylawn.xyz/api/status/{statusCode}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('https://api.getoffmylawn.xyz/api/status/{statusCode}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','https://api.getoffmylawn.xyz/api/status/{statusCode}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/status/{statusCode}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "https://api.getoffmylawn.xyz/api/status/{statusCode}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /api/status/{statusCode}`

returns the HTTP status code you tell it to.

<h3 id="delete__api_status_{statuscode}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|statusCode|path|integer|true|the status code you want returned|

<h3 id="delete__api_status_{statuscode}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## get__api_status_{statusCode}

> Code samples

```shell
# You can also use wget
curl -X GET https://api.getoffmylawn.xyz/api/status/{statusCode} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET https://api.getoffmylawn.xyz/api/status/{statusCode} HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/status/{statusCode}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'https://api.getoffmylawn.xyz/api/status/{statusCode}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('https://api.getoffmylawn.xyz/api/status/{statusCode}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','https://api.getoffmylawn.xyz/api/status/{statusCode}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/status/{statusCode}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "https://api.getoffmylawn.xyz/api/status/{statusCode}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /api/status/{statusCode}`

returns the HTTP status code you tell it to.

<h3 id="get__api_status_{statuscode}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|statusCode|path|integer|true|the status code you want returned|

<h3 id="get__api_status_{statuscode}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## head__api_status_{statusCode}

> Code samples

```shell
# You can also use wget
curl -X HEAD https://api.getoffmylawn.xyz/api/status/{statusCode} \
  -H 'Authorization: Bearer {access-token}'

```

```http
HEAD https://api.getoffmylawn.xyz/api/status/{statusCode} HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/status/{statusCode}',
{
  method: 'HEAD',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.head 'https://api.getoffmylawn.xyz/api/status/{statusCode}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.head('https://api.getoffmylawn.xyz/api/status/{statusCode}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('HEAD','https://api.getoffmylawn.xyz/api/status/{statusCode}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/status/{statusCode}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("HEAD");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("HEAD", "https://api.getoffmylawn.xyz/api/status/{statusCode}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`HEAD /api/status/{statusCode}`

returns the HTTP status code you tell it to.

<h3 id="head__api_status_{statuscode}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|statusCode|path|integer|true|the status code you want returned|

<h3 id="head__api_status_{statuscode}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## patch__api_status_{statusCode}

> Code samples

```shell
# You can also use wget
curl -X PATCH https://api.getoffmylawn.xyz/api/status/{statusCode} \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH https://api.getoffmylawn.xyz/api/status/{statusCode} HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/status/{statusCode}',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'https://api.getoffmylawn.xyz/api/status/{statusCode}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('https://api.getoffmylawn.xyz/api/status/{statusCode}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','https://api.getoffmylawn.xyz/api/status/{statusCode}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/status/{statusCode}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "https://api.getoffmylawn.xyz/api/status/{statusCode}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /api/status/{statusCode}`

returns the HTTP status code you tell it to.

<h3 id="patch__api_status_{statuscode}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|statusCode|path|integer|true|the status code you want returned|

<h3 id="patch__api_status_{statuscode}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## post__api_status_{statusCode}

> Code samples

```shell
# You can also use wget
curl -X POST https://api.getoffmylawn.xyz/api/status/{statusCode} \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST https://api.getoffmylawn.xyz/api/status/{statusCode} HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/status/{statusCode}',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'https://api.getoffmylawn.xyz/api/status/{statusCode}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('https://api.getoffmylawn.xyz/api/status/{statusCode}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','https://api.getoffmylawn.xyz/api/status/{statusCode}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/status/{statusCode}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "https://api.getoffmylawn.xyz/api/status/{statusCode}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /api/status/{statusCode}`

returns the HTTP status code you tell it to.

<h3 id="post__api_status_{statuscode}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|statusCode|path|integer|true|the status code you want returned|

<h3 id="post__api_status_{statuscode}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## put__api_status_{statusCode}

> Code samples

```shell
# You can also use wget
curl -X PUT https://api.getoffmylawn.xyz/api/status/{statusCode} \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT https://api.getoffmylawn.xyz/api/status/{statusCode} HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/status/{statusCode}',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'https://api.getoffmylawn.xyz/api/status/{statusCode}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('https://api.getoffmylawn.xyz/api/status/{statusCode}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','https://api.getoffmylawn.xyz/api/status/{statusCode}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/status/{statusCode}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "https://api.getoffmylawn.xyz/api/status/{statusCode}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /api/status/{statusCode}`

returns the HTTP status code you tell it to.

<h3 id="put__api_status_{statuscode}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|statusCode|path|integer|true|the status code you want returned|

<h3 id="put__api_status_{statuscode}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

## options__api_status_{statusCode}

> Code samples

```shell
# You can also use wget
curl -X OPTIONS https://api.getoffmylawn.xyz/api/status/{statusCode} \
  -H 'Authorization: Bearer {access-token}'

```

```http
OPTIONS https://api.getoffmylawn.xyz/api/status/{statusCode} HTTP/1.1
Host: api.getoffmylawn.xyz

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('https://api.getoffmylawn.xyz/api/status/{statusCode}',
{
  method: 'OPTIONS',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.options 'https://api.getoffmylawn.xyz/api/status/{statusCode}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.options('https://api.getoffmylawn.xyz/api/status/{statusCode}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('OPTIONS','https://api.getoffmylawn.xyz/api/status/{statusCode}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("https://api.getoffmylawn.xyz/api/status/{statusCode}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("OPTIONS");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("OPTIONS", "https://api.getoffmylawn.xyz/api/status/{statusCode}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`OPTIONS /api/status/{statusCode}`

returns the HTTP status code you tell it to.

<h3 id="options__api_status_{statuscode}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|statusCode|path|integer|true|the status code you want returned|

<h3 id="options__api_status_{statuscode}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
BearerAuth
</aside>

