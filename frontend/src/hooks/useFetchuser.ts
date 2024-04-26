

export const useFetchuser = async(userid : any) =>{
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getotheruser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "authorization": localStorage.getItem("token") || "",
            },
            body :JSON.stringify({
                userid : userid
            }),
            credentials: "include",
          });
        const data = await res.json();
        if (data.Status === false) {
            return;
        }
        return data.user;          
    } catch (error) {
        console.log(error);

    }
   

    

}