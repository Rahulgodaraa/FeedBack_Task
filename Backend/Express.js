import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import allRoutes from "./Routes/All.Routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

mongoose
  .connect(
    "mongodb+srv://noobproffessor:lAdQstm6Jlm9cfwg@cluster0.tumzn.mongodb.net/Jforce"
  )
  .then(() => {
    console.log("DB Connected");
  });

app.use("/api/v1", allRoutes);

app.get("/", (req, res) => {
  try {
    res.status(200).json("Welcome to FeedBack DashBoard");
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(8000, () => {
  console.log("Server Running on Port 8000...");
});

const fun1 = () =>{
  console.log("fun1");
  
}

function listen2(fun1) {
  fun1();
  //console.log("listen2 func");
  
}

 listen2(fun1);

//console.log(res);


// const num1 = [1,2,3,4,5,6,7,8,9,10,14];
// const num2 = [1,2,3,4,5,6,7,8,9,10,11,14];

// const res = [];

// // const merge = [...num1 , num2]

// // console.log(merge);


// for (let i = 0 ; i <= num1.length - 1 ; i++) {
//   for (let j = i; j <= num2.length -1; j++) {
//     if (num2[j] == num1[i] && num2[j] % 2===0) {
//       res.push(num2[j])
//     }
//   }
// }

// console.log(res);
