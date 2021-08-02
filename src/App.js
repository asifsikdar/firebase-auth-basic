
import './App.css';
import React , {useState} from "react";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig)
const provider = new firebase.auth.GoogleAuthProvider();
const providerFb = new firebase.auth.FacebookAuthProvider();

function App() {
    const [user, setUser] = useState({
        issignIn: 'false',
        name: '',
        email: '',
        password: ''
    })
    const [newUser, setNewUser] = useState(false)
    const handlesignIn = () => {
        firebase.auth().signInWithPopup(provider)
            .then(res => {
                const {displayName, email} = res.user;
                const signIn = {
                    issignIn: true,
                    name: displayName,
                    email: email

                }
                setUser(signIn)
            })
    }
    const handleFbSignIn = () =>{
        firebase
            .auth()
            .signInWithPopup(providerFb)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // The signed-in user info.
                var user = result.user;
                console.log(user);

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var accessToken = credential.accessToken;

                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;

                // ...
            });
    }
    const handlesignOut = () => {
        firebase.auth().signOut()
            .then(res => {
                const usersignout = {
                    issignIn: false,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: ''
                }
                setUser(usersignout)
            }).catch((error) => {

        })
    }
    const getValue = (event) => {
        let isFromValid = true;
        if (event.target.name === 'email') {
            isFromValid = /\S+@\S+\.\S+/.test(event.target.value);

        }
        if (event.target.name === 'password') {
            const lengthValid = event.target.value.length > 6;
            const numberValid = /\d{1}/.test(event.target.value)
            isFromValid = lengthValid && numberValid;
        }
        if (isFromValid) {
            const copyState = {...user};
            copyState[event.target.name] = event.target.value;
            setUser(copyState);
        }

    }
    const getSubmit = (e) => {

        if ( newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    const handleError = {...user};
                    handleError.error = '';
                    handleError.success = true;
                    setUser(handleError);
                })
                .catch((error) => {
                    const handleError = {...user};
                    handleError.error = error.message;
                    handleError.success = false;
                    setUser(handleError);
                })
        }
        if(!newUser && user.email && user.password){
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    const handleError = {...user};
                    handleError.error = '';
                    handleError.success = true;
                    setUser(handleError);
                })
                .catch((error) => {
                    const handleError = {...user};
                    handleError.error = error.message;
                    handleError.success = false;
                    setUser(handleError);
                });
        }
        e.preventDefault()
    }

    return (
        <div className="App">
            {
                user.issignIn === true ? <button onClick={handlesignOut}>sign-out</button> :
                    <button onClick={handlesignIn}>sign-In</button>

            }
            <button onClick={handleFbSignIn}>Facebook</button>
            {
                <div>
                    <h3>Welcome To : {user.name} </h3>

                </div>
            }
            {
                <div>
                    <h1>Own Authentication</h1>
                    <input onChange={()=>setNewUser(!newUser)} type="checkbox" name="newUser" id="" />
                    <lebel htmlFor="newUser">Register</lebel>
                    <form onSubmit={getSubmit}>
                        { newUser && <input type="text" name="newUser" onBlur={getValue} id="" placeholder="Enter your name"
                               required/>}
                        <br/>
                        <input type="email" name="email" onBlur={getValue} id="" placeholder="Enter your email"
                               required/>
                        <br/>
                        <input type="password" name="password" onBlur={getValue} id="" placeholder="Enter your password"
                               required/>
                        <br/>
                        <input type="submit" value="submit"/>
                    </form>

                    <p style={{color: 'red'}}>{user.error}</p>
                    {user.success && <p style={{color: 'green'}}>{newUser ? 'created' : 'logIn' } Successfully</p>}
                </div>
            }

        </div>
    );

};
    export default App;
