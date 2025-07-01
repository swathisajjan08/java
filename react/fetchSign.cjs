const express = require("express");
const mysql2 = require("mysql2");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const JWT_SECRET = "mysecretkey"; // private key used to sign in 
const cors = require("cors");


const app = express(); // create an express server object and save it as apps
app.use(express.json());//Express to automatically parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const db = mysql2.createConnection({
  host: "35.244.19.98",
  user: "hubber",
  password: "VenaHub@18",
  database: "mhub",
});
db.connect();

//JWT verification middleware
// function verifyJWT(req, res, next) { // protects routes by checking for a valid token.
//     const auth = req.headers.authorization;//gets the token in auth header
  
//     const token = auth.split(' ')[1]; // splits to get only the token and remove bearer
  
//     jwt.verify(token, JWT_SECRET, (decoded) => { //jwt.verify checks if the token is valid
//      req.userId = decoded.id;//saves the userId inside req.userId and continues to next 
//       next();
//     });
//   }
app.get('/',(req,res)=>{
    res.setHeader('content-type','html')
    res.write('<h1>Page not found<h2>')
})
app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    db.query('SELECT * FROM users WHERE email = ?', [email], (error,results) => {
        
    if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const user = results[0]; //gets the user deatil after checking if the user is present
      
    if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
      // const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' }); // creates a token with user id and expires in 1 hour
  
      // res.json({ token }); // sends back the token to the client
      
    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
    });
  });

app.get("/loginbutton", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html")); //Serves the login.html file when /loginButton is accessed.
  });

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received form data:", req.body);

  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], () => {
    res.status(201).json({ message: "User created" }); //Adds a new user into the users table
  });
});

app.get("/signbutton", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.get("/fetchbutton", (req, res) => {
  res.sendFile(path.join(__dirname, "fetchPlant.html"));
});

app.get("/plantid", (req, res) => {
  const id = req.query.id;

db.query("SELECT * FROM mas_sites WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send("error");
    } else if (results.length === 0) {
      res.status(404).send("Plant not found");
    } else {
      res.json(results[0]);
    }
  });
});
const storage = multer.diskStorage({
    destination: 'public/uploads',//tells multer to save the file in the provided file
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // keeps the extension intact and also adds unique date name to the file
    }
  });
  const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => { // fetches only the file which is image file
  
    const filename = req.file.filename; // gets the name of the uploaded file
  
    db.query(
      'INSERT INTO test_logs (images) VALUES (?)', // inserts the image into the table
      [filename],
      (result) => {
        res.send('Image uploaded');
      }
    );
  });

app.get("/uploadbutton", (req, res) => {d
    res.sendFile(path.join(__dirname, "uploa.html")); // servers the uplaod.html file when /uploadbutton is called 
  });
app.get("/allbutton",(req,res)=>{
    res.sendFile(path.join(__dirname,"allbutton.html"))
})
app.listen(4000);
 