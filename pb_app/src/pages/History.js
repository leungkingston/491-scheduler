import pb from "lib/pocketbase";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
// import axios from 'axios';

export default function PurchaseHist() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [dummy, reload] = useState(false);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [collec, setCollec] = useState("");
  const [eGRT, seteGRT] = useState(0);  
  const [selectedDate, setSelectedDate] = useState("");


  useEffect(() => {
    setCollec(JSON.parse(localStorage.getItem("currentuser")));
  }, [view]);

  // useEffect(() => {
  //   const userData = JSON.parse(localStorage.getItem("currentuser"));
  //   setCollec(userData);
  //   seteGRT(userData.getreadytime);
  //   console.log(eGRT);
  // }, [view]);
  

  const [hourState, setHours] = useState(0);
  const checkAndAlert = () => {
    const currentDate = new Date();

    records.forEach((item) => {
      const itemDate = new Date(item.depart);
      const prepDate = new Date(item.prep);

      if (Math.abs(itemDate.getTime() - currentDate.getTime()) < 5000) {
        alert(`It's time to depart for ${item.name}!`);
      }
      
      if (Math.abs(prepDate.getTime() - currentDate.getTime()) < 5000) {
        alert(`Get ready for ${item.name}!`);
      }
    });
  };
  useEffect(() => {
    // Check and alert every minute (adjust the interval as needed)
    const intervalId = setInterval(checkAndAlert, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [records]); // Trigger the effect when records are updated

  function alertf(){
    alert(`Alert for departure:\n\tIt's time to depart for {item.name}!\n\nAlert to get ready:\n\tGet ready for {item.name}!`);
  }

  async function view() {  // read

    setLoading(true);
    try {
      const itemRecords = await pb.collection(collec).getFullList({
        sort: 'date',
      });

      const results = itemRecords.map((record) => ({ name: record.name, addr1: record.addr1, addr2: record.addr2, date:record.date, depart:record.depart, prep:record.prep, readybool:record.getready, m_eta:record.eta}));
      //console.log(itemRecords.length);
      console.log(eGRT);
      setRecords(results);
      setTotal(itemRecords.length);
    } catch (e) {
      console.log("ERROR FETCHING RECORDS: ", e);
      alert(e);
    }
    setLoading(false);
  }
  async function del(dname) {  // delete
    setLoading(true);
    try {
      const findr = await pb.collection(collec).getFirstListItem(`name="${dname}"`);
      console.log(findr.id);
      console.log(dname);
      await pb.collection(collec).delete(findr.id);
    } catch (e) {
      console.log("ERROR FETCHING RECORDS: ", e);
      alert(e);
    }
    view();
    setLoading(false);
  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  async function itemYep(data) {
    // create
    setLoading(true);
    const neweta = getRandomInt(30);
    const datie = new Date(selectedDate);
    datie.setHours(data.hr);
    datie.setMinutes(data.min);
    console.log("ogDate" + datie);
    const departdatie = new Date(datie);
    departdatie.setMinutes(departdatie.getMinutes() - neweta);
    console.log("departDate" + departdatie);
    const prepdatie = new Date(departdatie);
    prepdatie.setMinutes(prepdatie.getMinutes() - 120);
    try {
      // setOrigin(data.startaddr);
      // setDestination(data.destaddr);
      // await wait();
      // const etaValue = await calculateEta();
      // await wait();
      // console.log("try eta: "+etaValue);

      const item = await pb.collection(collec).create({
        'name': data.name,
        'addr1': data.startaddr,
        'addr2': data.destaddr,
        // 'addr1': '3633 Ball Rd, Anaheim, CA',
        // 'addr2': '4902 Royal Pines Ct, Dublin, CA',
        // 'date' : "2022-01-01 12:34:56.000Z"
        'date' : datie.toISOString(),
        'depart' : departdatie.toISOString(),
        'prep' : prepdatie.toISOString(),
        'getready' : data.getRemindr,
        // 'eta': etaValue
        'eta': neweta
      });
      //console.log("idkwhatshappening "+ calculateEta());
    } catch (e) {
      alert(e);
    }
    view();
    setLoading(false);
    reset();
    reload(!dummy);
  }

  if (pb.authStore.isValid){
  return (
    <>
      {isLoading && <p>Loading...</p>}
      <h1>Schedule / Agenda </h1>
      <div className="purchase-history">
        <form onSubmit={handleSubmit(itemYep)}>
          Event:{" "}
          <input
            className="item-name"
            type="text"
            placeholder="event name"
            {...register("name")}
          />
          <div>
          <label>Origin Address:</label>
            <input
              type="text"
              // value={origin}
              // onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin address"
              {...register("startaddr")}
            />
          </div>
          <div>
            <label>Destination Address:</label>
            <input
              type="text"
              // value={destination}
              // onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination address"
              {...register("destaddr")}
            />
          </div>
            Date: <DatePicker 
                    value={selectedDate} 
                    onChange={setSelectedDate}
                    // dateFormat='yyyy/MM/dd'
                    //className="date-pick"
                    //{...register("datesies")}
                    />
                  <br />
                  <br />
            Time: {" "}
              <select className="hr" {...register("hr")}> 
                <option value="00" disabled selected>HR</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
              <select className="min" {...register("min")}>
                <option value="" disabled selected>MIN</option>
                <option value="00">00</option>
                <option value="05">05</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="55">55</option>
              </select>
              <select className="ampm" {...register("ampm")}>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
            <br />
            <br />
            Prep Reminder: 
              <select className="ampm" {...register("getRemindr")}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            <br /><div className="centerButton">
            <button className="add" type="submit" disabled={isLoading}>
            Add Event
          </button>
          </div>
        </form>
      </div>
      <h2 className="etitle">Schedule</h2>
      <form className="load" onSubmit={handleSubmit(view)}>
        <button className="lbut" type="submit" disabled={isLoading}>
          Load Agenda
        </button>
      </form>
      <h3 className="total">Total: {total} Events</h3>
      <h3 className="total">Prep Time: 120 min Before Departure</h3>
      <div className="purchase-history">
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {records.map((item, index) => (
            <li key={index} className="tab">
                  <div>
                    <strong>name:</strong> {item.name}
                  </div>
                  <div>
                    <strong>destination:</strong> {item.addr2}
                  </div>
                  <div>
                    <strong>date:</strong> {item.date.slice(0,10)}
                  </div>
                  <div>
                    <strong>time:</strong> {item.date.slice(11,16)}
                  </div>
                  <div>
                    <strong>reminder:</strong> {item.readybool.toString()}
                  </div>
                  <div>
                    <strong>eta:</strong> {item.m_eta} min
                  </div>
              <div>
                <form
                  className="delete-form"
                  onSubmit={(e) => handleSubmit(() => del(item.name))(e)}
                >
                  <button className="delete" type="submit" disabled={isLoading}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
  }
  return(
    <>
      <div className="section">
          <div className="title">
            <h1>Manage your Schedule</h1>
          </div>
          <div className="features">
            <div className="card">
              <div className="icon">
                <i class="fa-solid fa-user"></i>
              </div>
              <h2>Personalized Collections</h2>
              <p>
              Access your custom collection for seamless itinerary management. Ensure your schedule data 
              is securely stored, offering a personalized and convenient overview of your daily agenda.
              </p>
              <a href="https://pocketbase.io/docs/collections/" className="boottoon">Read More</a>
            </div>
            <div className="card">
              <div className="icon">
                <i class="fa-solid fa-hand-holding-dollar"></i>
              </div>
              <h2>Add / Delete Events</h2>
              <p>
              Efficiently control your schedule with our app. Seamlessly add or remove events for real-time updates, 
              providing a clear overview for effective time management. Stay on top of your tasks, 
              ensuring an up-to-date record of your commitments.
              </p>
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="boottoon rick"><span>Read More</span></a>
            </div>
            <div className="card">
              <div className="icon">
                <i class="fa-solid fa-address-card"></i>
              </div>
              <h2>Register or Log In</h2>
              <p>
              New users, register for complete schedule management. Unlock personalized features, secure data storage, 
              and powerful tools. Returning users, log in to access your tailored schedule dashboard.
              </p>
              <div className="nextTo">
                <a href="signup" className="boottoon">Sign Up</a><a href="login" className="boottoon">Log In</a>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}