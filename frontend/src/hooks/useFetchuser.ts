

export const useFetchuser = async(userid : any) =>{
    try {
        const res = await fetch("http://localhost:3000/api/auth/getotheruser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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