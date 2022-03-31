import { Box, TextField, Button, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate,  } from "react-router-dom";
import { useAuth } from "../ContextProvider/AuthProvider";



export const Login = () =>{

    const auth = useAuth();
    const navigate = useNavigate();

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    const [userNameIsEmpty, setUserNameIsEmpty] = useState(false);
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false); 

    const [error, setError] = useState();

    const handleLogin = async() =>{
        await auth.login({userName, password}).then(res=>{
            if(res){
               localStorage.setItem('jwt', res.accessToken)
            }})
        navigate('/lobby', {replace: true})
        
    }
    

    return(
        <Box sx={Style.container}>
            <Typography variant="h2" display="block" gutterBottom >
                Login
            </Typography>
            <Box sx={Style.formContainer}>
                <TextField sx={Style.formItem} error={userNameIsEmpty} required label="Username" onChange={(e)=>{setUserName(e.target.value)}}/>
                <TextField sx={Style.formItem} error={passwordIsEmpty} label="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                <Button sx={Style.formItem} variant="outlined" onClick={handleLogin} >Login</Button>
            </Box>
            <Typography variant="caption" display="block" >
                Not registered? <Link to='/signUp'>Create an account</Link> | <Link to='/forgot'>Forgot Password</Link>
            </Typography>
        </Box>
    )
}

const Style = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    formItem: {
        my: 1
    }
}