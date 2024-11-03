

// export const Dashboard = () => {
//     return <div>
//         <Appbar />
//         <div className="m-8">
//             <Balance value={"10,000"} />
//             <Users />
//         </div>
//     </div>
// }


import { useEffect, useState } from "react"
import axios from "axios"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Button } from "../components/Button"
import { InputBox } from "../components/InputBox"
import { Users } from "../components/User"




export const Dashboard = () => {
    const [balance,setBalance]=useState();
    const [amount,setAmount]=useState();
    const fetchBalance = () => {
        axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(response => {
                setBalance(response.data.balance);
            })
            .catch(error => {
                console.error("Error fetching balance:", error);
            });
    };
    
    // Fetch balance initially on component mount
    useEffect(() => {
        fetchBalance();
    }, []);
    return <div>
        <Appbar />
    <div className=" flex flex-row justify-between m-8">
            <Balance value={balance} />
         {/* <Users /> */}
         <div>
         <InputBox onChange={e=>{
            setAmount(e.target.value)
         }}  placeholder="1234" label={"Amount"} />
         <Button onClick={async ()=>{
            await axios.put("http://localhost:3000/api/v1/account/balance", {
                amount
              },{
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            fetchBalance();
         }} label={"Add Amount"}/>
         </div>
    </div>
    <div>
        <Users/>
    </div>
 </div>
}

