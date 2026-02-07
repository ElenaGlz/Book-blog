import express from "express";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;
var postId = 0;
var posts = [];


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})
const upload = multer({ storage: storage });

app.use(express.static("public"));

/* Home route */
app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

/* Editor route */
app.get("/editor", (req, res) => {
    res.render("editor.ejs", { genres });
});

/* Editor submit (new post) route */
app.post("/editor/submit", upload.single('coverImage'), (req, res) => {
    posts.push({
        id: postId,
        bookTitle: req.body.bookTitle,
        name: req.body.name,
        author: req.body.author,
        genre: req.body.genre,
        rating: req.body.rating,
        coverImage: req.file,
        review: req.body.review,
        date: new Date()
    });

    console.log(`New Book Review Submitted (post ${postId}): `, posts[postId]);
    postId += 1;
    res.redirect("/");
});

/* Post route */
app.get("/books/:bookTitle", (req, res) => {
    const post = posts.find(p => decodeURI(p.bookTitle) === req.params.bookTitle);
    if (post) {
        res.render("post.ejs", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

/* Editor edit post route */
app.get("/editor/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.render("editor.ejs", { post, genres });
    } else {
        res.status(404).send("Post not found");
    }
});

/* Editor update post route */
app.post("/editor/:id", upload.single('coverImage'), (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        post.bookTitle = req.body.bookTitle;
        post.name = req.body.name;
        post.author = req.body.author;
        post.genre = req.body.genre;
        post.rating = req.body.rating;
        post.review = req.body.review;
        if (req.file) {
            post.coverImage = req.file;
        } else {
            post.coverImage = post.coverImage;
        }
        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }
});

/* Delete post route */
app.get("/books/:id/delete", (req, res) => {
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    console.log(`Post ${req.params.id} deleted. Remaining posts: `, posts.map(a => a.bookTitle));
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});


const genres = [
    "Art & Entertainment",
    "Children's",
    "Classics",
    "Comic / Graphic novel",
    "Contemporary fiction",
    "Crime",
    "Fantasy",
    "Food & Lifestyle",
    "Historical fiction",
    "History & Politics",
    "Horror",
    "Memoir",
    "Mystery",
    "Nonfiction",
    "Philosophy",
    "Poetry",
    "Romance",
    "Science",
    "Science Fiction",
    "Thriller",
    "Travel",
    "Young Adult",
];