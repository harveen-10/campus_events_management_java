import React from 'react'
import {Link} from 'react-router-dom'

function Landing_pg() {
    // return <>
    //     <Link to='/login'>
    //     <button className="absolute top-0 right-0 mx-20 my-1 px-3 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]">Login</button>
    //     </Link>
    //     <div className="flex">
    //         <img src="http://res.cloudinary.com/do6otllrf/image/upload/v1718473466/yfgvfib9rhnw9fkyalp8.jpg" className='h-50 mx-10 '/>
    //         <div className='ml-40 text-center font-raleway'>
    //             <div className='mt-16 font-black text-5xl'>
    //                 <h1 className='mb-4'>EVENT</h1>
    //                 <h1 className='mb-12'>HIVE</h1>
    //             </div>
    //             <p>
    //                 Experience the joy of shopping from the comfort
    //                 <br/>of your home - endless choices, unbeatable deals,
    //                 <br/>and seamless service.
    //             </p>
    //         </div>
    //     </div>
    // </>
    return <>
        <Link to='/login'>
        <button className="absolute top-0 right-0 mx-20 my-1 px-3 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]">Login</button>
        </Link>
        <div className="flex">
            <img src="https://res.cloudinary.com/dvkuv7afs/image/upload/v1731236737/WhatsApp_Image_2024-11-10_at_16.35.07_sijvi0.jpg" className='h-96 w-auto mx-10 rounded-lg'/>
            <div className='ml-40 text-center font-raleway'>
                <div className='mt-16 font-black text-5xl'>
                    <h1 className='mb-4'>EventHive</h1>
                    {/* <h1 className='mb-12'>HIVE</h1> */}
                </div>
                <p>
                Discover the excitement of campus events from wherever you are — limitless opportunities, 
                    <br/>unforgettable experiences, and effortless organization.
                    <br/>Join, explore, and make memories with ease!
                </p>
            </div>
        </div>
    </>
}

export default Landing_pg