export const login = (req, res) => {
    res.send('Signup Route');
}

export const signup = (req, res) => {
    // res.send('Login Route');
    const {fullName, email, password} = req.body;
    try{
        
    }
    catch(err){

    }
}

export const logout = (req, res) => {
    res.send('Logout Route');
}
