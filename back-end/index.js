const express = require('express');
require('./config/conn.js');
const bodyParser= require("body-parser");
const app =express();
const cookieParser = require("cookie-parser");
const morgan =require("morgan");
const dotenv =require("dotenv").config();
const PORT =process.env.PORT || 5000;
const authRauter = require('./routes/authRoutes');
const productRoter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoutes");
const categoryRoutes = require("./routes/prodCategoryRoutes");
const blogcategoryRoutes = require("./routes/blogCatgRoutes");
const brandRoutes = require("./routes/brandRaouts");
const colorRoutes = require("./routes/colorRoutes");
const coupenRoutes = require("./routes/coupenRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require('./middlewares/errorHandler.js');
const cors = require("cors");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());





app.use('/api/user', authRauter)
app.use('/api/product', productRoter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRoutes)
app.use('/api/blogcategory', blogcategoryRoutes)
app.use('/api/brand', brandRoutes)
app.use('/api/coupen', coupenRoutes)
app.use('/api/color', colorRoutes)
app.use('/api/enquiry', enquiryRoutes)
app.use('/api/upload', uploadRoutes)



app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server are listninig on ${PORT} .....`)
})

