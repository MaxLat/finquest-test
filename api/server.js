
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require('path')
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults();


server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(jsonServer.rewriter({
  '/api/reference/country' : '/country',
  '/api/reference/department' : '/department',
  '/api/reference/skills/$1' : '/skills/$1'
}))

const db = router.db;
server.post("/api/people/list", (req, res) => {
  
  var users = db.get("users");
  users = users.value();
  const data = req.body;

  users.forEach(user => {
      if(user.lastConnectionDate){
          user.lastConnectionDate = new Date(user.lastConnectionDate);
      }
  });

  if (!data.firstname && !data.lastname && data.isAlreadyConnected === null) {
    res.json(users);
    return;
  }

  users = users.filter(user => {
      
    let isFirstname = 0;
    let isLastname = 0;
    let isAlreadyConnected = 0;

    if (data.firstname){
        if (user.firstname.search(data.firstname) >= 0) isFirstname = 2;
        else isFirstname = 0;
    }else isFirstname =1;
    
    if (data.lastname){
        if (user.lastname.search(data.lastname) >= 0) isLastname = 2;
        else isLastname = 0;
    }else isLastname =1;
    
    if (data.isAlreadyConnected !== null){
      if (user.isAlreadyConnected === data.isAlreadyConnected) isAlreadyConnected = 2;
      else isAlreadyConnected = 0;
    }else isAlreadyConnected =1;

    return isFirstname >0 && isLastname>0 && isAlreadyConnected >0;

  })   
  res.json(users);
});

server.get("/api/people/:id", (req, res, next) => {
 
  const users = db.get('users').value();
  const user = users.find((user) => user.id === req.params.id);
  res.json(user);

});

server.post("/api/people/update",(req,res,next) => {
  
  const users = db.get('users');
  
  if(req.body.firstname === 'error' && req.body.lastname === '400') {
    res.status(400).json([
      {key : 'firstname' , value : 'firstname cannot be called error'},
      {key : 'lastname' , value : 'lastname cannot be called 400'}
    ]);
    return;
  }

  if(req.body.firstname === 'error' && req.body.lastname === '500') {
    res.status(400).json([
      {key : 'db' , value : 'something went wrong'},
    ]);
    return;
  }
  
  users.updateById(req.body.id,req.body)
  res.json(null)

})

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});


