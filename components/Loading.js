import { Circle } from "better-react-spinkit";

const Loading = () => {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="https://logo-logos.com/2016/10/WhatsApp_logo_icon.png"
          alt=""
          style={{ marginBottom: 10 }}
          height={140}
        />
        <Circle color="#3CBC28" size={35} />
      </div>
    </center>
  );
};

export default Loading;
