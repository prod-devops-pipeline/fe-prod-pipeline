import { useEffect, useState } from "react"

function TestPage3() {
    const [user, setUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Just the filter string

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    // Filter the list dynamically during render
    const filteredUsers = user.filter((u) =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('https://dummyjson.com/users');
            const data = await response.json();
            setUser(data.users)
        }
        fetchUser();
    }, [])

    console.log('user', user)
    return (
        <div>
            {filteredUsers.map((user: any) => (

                <div key={user.id}>
                    {user.firstName}
                </div>
            ))}
            <input type="text" onChange={handleChange} />
        </div>
    )
}

export default TestPage3
