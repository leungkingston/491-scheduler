import pb from "lib/pocketbase";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [dummy, reload] = useState(false);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [collec, setCollec] = useState("");

  const adminuser = "admin@gmail.com";
  const adminpass = "adminadmin";

  function logout() {
    pb.authStore.clear();
    setCollec(""); // Reset the collection on logout
    localStorage.removeItem("currentuser");
    window.location.reload();
    reload(!dummy);
  }

  async function regnew(data) {
    setLoading(true);
    const newuser = {
      "email": data.r_user,
      "emailVisibility": true,
      "password": data.r_pass,
      "passwordConfirm": data.r_passConfirm,
      "getreadytime": data.r_ready
    };
    try {
      const anotheruser = await pb.collection('users').create(newuser);
      alert("NEW ACCOUNT CREATED!");
    
      const authData = await pb.admins.authWithPassword(adminuser, adminpass);
      const getusername = anotheruser.id;
      localStorage.setItem("currentuser", JSON.stringify(getusername));
      
      const base = await pb.collections.create({
        name: getusername,
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: '',
        deleteRule: '',
        schema: [
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'addr1',
            type: 'text',
            required: true,
          },
          {
            name: 'addr2',
            type: 'text',
            required: true,
          },
          {
            name: 'date',
            type: 'date',
            required: true,
          },
          {
            name: 'depart',
            type: 'date',
            required: true,
          },
          {
            name: 'prep',
            type: 'date',
            required: true,
          },
          {
            name: 'eta',
            type: 'number',
            required: true,
          },
          {
            name: 'getready',
            type: 'bool',
            required: false,
          },
        ],
      });
    
    } catch (e) {
      const alrt = 'ERROR: An account with that email already exists!';
      alert(alrt+"\n\n"+ e);    //i think that is what will happen in most cases
      //alert(e);
    } finally {
      logout();
      setLoading(false);
    }
    
  }
  return (
    <>
      {isLoading && <p>Loading...</p>}
      <h1>Register New Account</h1>
      <div className="login">
        <form onSubmit={handleSubmit(regnew)}>
          <input type="text" placeholder="email" {...register("r_user")} />
          <input
            type="password"
            placeholder="password"
            {...register("r_pass")}
          />
          <input
            type="password"
            placeholder="Confirm password"
            {...register("r_passConfirm")}
          />
          <input type="text" placeholder="How much time does it take you to get ready? (minutes)" {...register("r_ready")} />
          <div className="centerButton">
            <button type="submit" disabled={isLoading}>
            Register
          </button>
          </div>
        </form>
      </div>
    </>
  );
}
