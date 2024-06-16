/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import instance from "../api/api_instance";

const Contact = ({ listing }) => {
  const [landLord, setLandLord] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await instance.get(`/user/${listing.userRef}`);
        setLandLord(response.data.email);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [listing.userRef]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landLord && (
        <div>
          <p className="mb-2">
            Contact{" "}
            <span className="lowercase text-slate-700 font-semibold">
              {landLord}
            </span>{" "}
            for{" "}
            <span className="lowercase text-slate-700 font-semibold">
              {listing.name}
            </span>
          </p>
          <textarea
            className="w-full p-3 mb-2 rounded-md"
            placeholder="Enter your message here..."
            onChange={handleMessage}
            value={message}
          />
          <a
            href={`mailto:${landLord}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white w-full block text-center uppercase p-3 rounded-md hover:opacity-95"
          >
            Send message
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
