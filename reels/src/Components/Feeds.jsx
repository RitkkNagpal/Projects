import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
const Feeds = (props) => {
    let {signout} = useContext(AuthContext);
    let handleLogout = async ()=>{
        try{
            let response = await signout();
            props.history.push("/login");
        }
        catch(err){
            console.log(err);
        }
    }
  return (
    <>
      <h1>Feeds</h1>
      <button onClick = {handleLogout}>Sign Out</button>
    </>
  );
};

export default Feeds;
