
export const getUser = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getuser`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token") || "",
        },
        credentials: "include",
    });

    const data = await res.json();
    if (!data.Status) {
        console.log("Something went wrong");
        return;
    }
    console.log(data);
    return data.user;
} 
