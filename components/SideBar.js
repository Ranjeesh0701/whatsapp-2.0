import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import ChatIcon from "@mui/icons-material/Chat";
import { MoreVert, Search, Close } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Box, TextField, Typography } from "@mui/material";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "./Chat";

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  align-items: center;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const AvatarContainer = styled.div``;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchContainer = styled.div`
  display: flex;
  padding: 20px;
  border-radius: 2px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  outline: none;
  border: none;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid whitesmoke",
  boxShadow: 24,
  p: 4,
};
const StartChatButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

const SideBar = () => {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleChange = ({ target }) => {
    setCurrentEmail(target.value);
  };

  const createChat = () => {
    if (currentEmail === "") return;

    if (
      EmailValidator.validate(currentEmail) &&
      currentEmail !== user.email &&
      !chatAlreadyExists(currentEmail)
    ) {
      db.collection("chats").add({
        users: [user.email, currentEmail],
      });
    }
    setCurrentEmail("");
    handleClose();
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  const signOut = () => {
    auth.signOut();
  };

  return (
    <Container>
      <Header>
        <AvatarContainer>
          <UserAvatar src={user.photoURL} onClick={signOut} />
        </AvatarContainer>
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </IconsContainer>
      </Header>

      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search for chats" />
      </SearchContainer>
      <SidebarButton color="inherit" onClick={handleOpen}>
        Start a new chat
      </SidebarButton>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Start a new chat
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please enter an email address for the user you wish to chat with.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={currentEmail}
            onChange={handleChange}
          />
          <StartChatButton color="inherit" onClick={createChat}>
            Start Chat
          </StartChatButton>
        </Box>
      </Modal>
      {chatsSnapshot?.docs.map((chat) => {
        return <Chat key={chat.id} id={chat.id} users={chat.data().users} />;
      })}
    </Container>
  );
};

export default SideBar;
