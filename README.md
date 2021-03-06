# QNotify
Notification Module

### Usage HTTP:

URL: : `https://qnotify.quezx.com/api/send`
METHOD: `POST`
Headers: `Content-Type:application/json`
Payload: 
```js
{
   "user_id":"13",
   "payload":{
     "title":"Dipak Thakur - Bewakoof - HR Manager",
     "body":"Updated Status: Interview Backout. Please Inform the client ASAP",
     "tag":"Simple Tag",
     "icon":"https://app.quezx.com/img/quezx-png-logo.png",
     "link":"https://app.quezx.com/Applicants/view/2937"
   }
 }
```


### Usage PHP:
```php
function send_push_message(){
  // Set QNotify endpoint
  $url = 'http://qnotify.quezx.com/api/send';
  
  $fields = array(
      'user_id' => 13,
	  'payload' => array(
		'title' => 'Simple PHP Title',
		'body' => 'Simple PHP Title',
		'tag' => 'Simple PHP Title',
		'icon' => 'Simple PHP Title',
		
	  )
  );
  
  $ch = curl_init();

  // Set the url, number of POST vars, POST data
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  $data_string = json_encode($fields); 
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string))                                                                       
  );                                         

  // Execute post
  $result = curl_exec($ch);
  if ($result === FALSE) {
      die('Push msg send failed in curl: ' . curl_error($ch));
  } else {
	  
  }

  // Close connection
  curl_close($ch);
}
```

### Usage in NodeJS

`npm install --save request`

 ```js
   var request = require('request');
   var options = {
           url:"http://qnotify.quezx.com/api/send",
           method:"POST",
           headers: {
             'Content-Type': 'application/json'
           },
           json:true,
           body: {
                   "user_id":"13",
                   "payload":{
                     "title":"Dipak Thakur - Bewakoof - HR Manager",
                     "body":"Updated Status: Interview Backout. Please Inform the client ASAP",
                     "tag":"Simple Tag",
                     "icon":"https://app.quezx.com/img/quezx-png-logo.png",
                     "link":"https://app.quezx.com/Applicants/view/2937"
                   }
                 }
         };
    // Sending POST Request to GCM
    request(options, function (error, response, body) {
      if (error) { return handleError(res, err); }
      res.json({
        message: 'success',
        data: body
      });
    });     
 
 ```
 

Generated by yeoman angular-fullstack

Keywords: NodeJS, ExpressJS, MongoDB, GCM

Local Setup:

`yo angular-fullstack`

Github: https://github.com/quarc/QNotify
Create 
