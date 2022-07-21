import { Button } from "@mui/material";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import { auth, provider } from "../firebase";

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 70px 50px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 0px 10px -1px #ccc;
`;

const Logo = styled.img`
  height: 100px;
  width: 100px;
  margin-bottom: 40px;
`;

const SigninButton = styled(Button)`
    border: 1px solid #ccc !important;
`;

const login = () => {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
        <link
          rel="icon"
          href="https://logo-logos.com/2016/10/WhatsApp_logo_icon.png"
        />
      </Head>
      <LoginContainer>
        <Logo src="https://logo-logos.com/2016/10/WhatsApp_logo_icon.png" />
        <SigninButton varient="outlined" color="inherit" onClick={signIn}>
          Sign in with Google
        </SigninButton>
      </LoginContainer>
    </Container>
  );
};

export default login;
