import React, {useState} from 'react'
import Landing_pg from '../Landing_pg/Landing_pg'
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [responseMessage, setResponseMessage] = useState("");
    const [user, setuser] = useState({
        name: "",
        email: "",
        srn: "",
        password: "",
    });

    const navigate=useNavigate();
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        console.log(user);

        try{
            const response=await fetch(`http://localhost:3000/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(user)
            });

            const responseData = await response.text();
            
            if(responseData==="This SRN already exists. Try logging in." || responseData==="SRN is required" || responseData==="An error occurred during signup"){
                setResponseMessage(responseData);
            }
            else if(response.ok){
                const currentUser = { srn: user.srn };
                setuser({
                    name: "",
                    email: "",
                    srn: "",
                    password: "",         
                });
                navigate("/home", { state: { currentUser } });
            }
        }
        catch(err){
            console.log("error in registration", err);
        }
    }


    
    return <>
    <div>
        Signup
    </div>
        <form onSubmit={handleSubmit}>
            <div className='font-raleway fixed inset-0 w-full h-screen bg-black bg-opacity-60 z-10'>
            <div className='flex justify-center items-center h-screen'>
                <div className='bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col'> 
                    <label htmlFor="srn" className="mt-4 font-semibold text-gray-800">SRN</label>
                    <input type="text" name="srn" id="srn" value={user.srn} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, srn: e.target.value })}/>
                    <label htmlFor="email" className="font-semibold text-gray-800">Email</label>
                    <input type="email" name="email" id="email" value={user.email} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, email: e.target.value })}/>
                    <label htmlFor="name" className="mt-4 font-semibold text-gray-800">Name</label>
                    <input type="text" name="name" id="name" value={user.name} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, name: e.target.value })}/>
                    <label htmlFor="password" className="mt-4 font-semibold text-gray-800">Password</label>
                    <input type="password" name="password" id="password" value={user.password} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, password: e.target.value })}/>
                    <p className='text-red-700'>{responseMessage}</p>
                    <button type='submit' className='w-1/4 mx-auto px-3 py-1 my-4 bg-[#FFAC30] text-white rounded shadow hover:bg-[#D08D2A]'>Sign up</button>
                </div>
            </div>
            </div>
        </form>
        <Landing_pg/>
    </>
}

export default Signup
