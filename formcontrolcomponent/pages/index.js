import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import GoogleMapReact from "google-map-react";

const Formcontrol = ({
  label = "",
  validationFunc = () => {},
  customErrorMessage = "Default error message",
  data = [],
  id = null,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (err) setErr("");
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    if (err) setErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "https://jsonplaceholder.typicode.com/posts";
    const options = {
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        id,
      }),
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(url, options);
      const resOk = res && res.ok;
      if (resOk) {
        const data = await res.json();
        console.log("Response from post request", data);
        // clearing the text fields
        setTitle("");
        setBody("");
        setIsSubmitting(false);
        setErr("");
      } else {
        throw new Error("Oops! something went wrong while posting data.");
      }
    } catch (err) {
      console.log("Error during Post Request", err);
      setErr(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onChange={(e) => {
          // avoid triggering validationFunc if text input is changed.
          if (e.target.type === "text") {
            return;
          }
          validationFunc(e, customErrorMessage);
        }}
        onSubmit={handleSubmit}
      >
        <label
          style={{ display: "block", fontWeight: "bold", fontSize: "40px" }}
        >
          {label}
        </label>
        <select style={{ width: "max-content", height: 40 }}>
          {data.length &&
            data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            style={{ height: 40 }}
            required
          />
          <input
            type="text"
            name="body"
            placeholder="body"
            value={body}
            onChange={handleBodyChange}
            style={{ height: 40 }}
            required
          />
          <button>{isSubmitting ? "Submitting..." : "Submit"}</button>
        </div>
        <label style={{ color: "red" }}>{err && err}</label>
      </form>
    </>
  );
};

const UsersLocation = ({ text }) => <div>{text}</div>;

export default function Home() {
  const [users, setUsers] = useState([]);
  const idRef = useRef(null);

  useEffect(async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const resOk = res && res.ok;
      if (resOk) {
        const data = await res.json();
        console.log(data);
        setUsers(data);
      } else {
        throw new Error("Oops! something went wrong.");
      }
    } catch (err) {
      console.log("Error during API Request", err);
    }
  }, []);

  const validationFunction = (e, customErrorMessage) => {
    if (e.target.value) {
      idRef.current = Number(e.target.value);
      if (idRef.current < 5) {
        console.log(e.target.value);
      } else {
        console.log(customErrorMessage);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Formcontrol
          label="ReactJS(Next JS) Form control component"
          validationFunc={validationFunction}
          customErrorMessage="Error! Please select a user"
          data={users}
          id={idRef.current}
        />
        <div style={{ height: '40vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: /* YOUR KEY HERE */ }}
          defaultCenter={{lat:59.95, lng:30.33}}
          defaultZoom={11}
        >
          <UsersLocation
            lat={59.955413}
            lng={30.337844}
            text="My Location"
          />
        </GoogleMapReact>
      </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
