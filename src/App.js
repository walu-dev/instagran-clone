import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post.js';
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase";
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from '@material-ui/core';
//import FlipMove from "react-flip-move";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



const App =() =>{
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  //create a piece of state to track if the modal is open
  const [open, setOpen]= useState(false);
  const [openSignIn, setOpenSignIn] =useState(false);
  const [username, setUsername]= useState('');
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const [user, setUser] = useState(null)

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup action
      unsubscribe();
    }
  }, [user, username]);

  //useEffect runs a piece of code based on a specific condition
  useEffect(()=> {
    //this is where the cod runs
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //evey time a new post is added, this codefires off
      setPosts(snapshot.docs.map(doc =>({id: doc.id, post: doc.data()})));
    })
  }, []);

  const signUp= (event) => {
    event.preventDefault(); //prevent from refreshing

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) =>alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

 return(
   <div className="app">


     <Modal
      open={open}
      onClose={()=> setOpen(false)} //any click outside the modal it closes
    
     >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup"> 
        <center>
          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>
        <Input 
           type="text"
           placeholder="username"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
        />
        <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} //keep updating when changed
        />
        <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signUp}>Sign Up</Button>
      </form>
        
       
      </div>
     </Modal>

     <Modal
      open={openSignIn}
      onClose={()=> setOpenSignIn(false)} //any click outside the modal it closes
    
     >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup"> 
        <center>
          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </center>
        <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
        />
        <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signIn}>Sign In</Button>
      </form>
        
       
      </div>
     </Modal>
 
     <div className="app__header">
       <img
       className="app__headerImage"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt=""
       />
        {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
      
     )}
     </div>

<div className="app__posts">
  <div className="app__postsLeft">
      {
       posts.map(({id, post}) => (
        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
       ))
      }

  </div>

  <div className="app__postsRight">
    <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
            
    />
  </div>

    
</div>
     


        

    {user?.displayName ? (
       <ImageUpload username={user.displayName} />   
     ) : (
       <h3>Sorry you need to log in</h3>
     )}
         
    

     
   </div>

 ); 

}

export default App;
