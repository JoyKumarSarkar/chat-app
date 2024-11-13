import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import io from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("redux user", user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("current user Details", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  //  socket connection
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen text-white">
      <section className={`${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/* *message component* */}

      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <p className="text-xl mt-2 text-slate-300 italic text-4xl">
          Welcome to the Chat WebApp created by{" "}
          <span className="font-bold ">Joy</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
