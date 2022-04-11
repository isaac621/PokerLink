import { Box, TextField, Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../ContextProvider/AuthProvider";



export const SignUp = () =>{
    const navigate = useNavigate();

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState('');

    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [emailHelperText, setEmailHelperText] = useState('')
    const [userNameHelperText, setUserNameHelperText] = useState('')

    const [validSubmission, setValidSubmisstion] = useState(false)
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState();


    const auth = useAuth();

    const handleSignUp = async () =>{
        setLoading(true)
        const response = await auth.signUp({userName, password, email})
        if(response.ok){
            navigate('/login', {replace: true})
        }
        else{
            setLoading(false)
        }
        
    }



    const handleValidation = async (itemType, item, setItemError, setItemHelperText)=>{

        const res = await fetch(`http://localhost:3001/validation/${itemType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({[itemType]: item})
        })
        const data = await res.json()


        setItemError(data.validation ? false : true)
        setItemHelperText(data.validation ? '' : data.error)

    }

    useEffect(async ()=>{    
        if(email){
        await handleValidation('email', email, setEmailError, setEmailHelperText)}
        const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!!email && !(!!email.match(emailRe))){
        setEmailError(true);
        setEmailHelperText('Please use an email with valid format');
        }
    }, [email])

    useEffect(()=>{
        (async ()=>{    
        await handleValidation('userName', userName, setUserNameError, setUserNameHelperText)
       })()
    }, [userName])

    
    useEffect(()=>{
        setValidSubmisstion(!(!emailError && !userNameError && (!!userName) && (!!password) && (!!email) ))
    }, [emailError, userNameError, password, userName, email])


    return(
        <Box sx={Style.container}>
            <Typography variant="h2" display="block"  gutterBottom>
                Sign Up
            </Typography>
            <Box sx={Style.formContainer}>
                <TextField sx={Style.formItem} error={userNameError} required label="Username" onChange={(e)=>{setUserName(e.target.value)}} helperText={userNameHelperText}/>
                <TextField sx={Style.formItem} error={emailError} required label="Email" onChange={(e)=>setEmail(e.target.value)} helperText={emailHelperText}/>
                <TextField sx={Style.formItem} error={passwordError} label="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                <Button sx={Style.formItem} variant="outlined" color='secondary' onClick={handleSignUp} disabled={validSubmission}>Create an Account</Button>
            </Box>
            <Typography variant="caption" display="block" >
                Already have an account? <Link to='/Login'>Login</Link>
            </Typography>
        </Box>
    )
}

const Style = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 250
    },
    formItem: {
        my: 1
    }
}