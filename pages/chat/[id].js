import Head from "next/head";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import SideBar from "../../components/SideBar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

const Chat = ({ messages, chat }) => {
  const [user] = useAuthState(auth);
  chat = JSON.parse(chat);

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [mobile, setMobile] = useState(false);
  window.addEventListener("resize", () => {
    setInnerWidth(window.innerWidth);
  });

  if (innerWidth <= 579) {
    if (!mobile) setMobile(true);
  } else {
    if (mobile) setMobile(false);
  }

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
        <link
          rel="icon"
          href="https://logo-logos.com/2016/10/WhatsApp_logo_icon.png"
        />
      </Head>
      {!mobile && <SideBar />}
      <ChatContainer mobile={mobile}>
        <ChatScreen chat={chat} messages={messages} mobile={mobile} />
      </ChatContainer>
    </Container>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((message) => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime(),
    }));

  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: JSON.stringify(chat),
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  width: ${(props) => (props.mobile ? "100%" : "")};

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;
