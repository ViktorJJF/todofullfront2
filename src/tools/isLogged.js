import axios from "axios";
const isLogged = () => {
    console.log("ejectuando logged");
    return new Promise((resolve, reject) => {
        axios.post('/api/users/logged')
            .then(res => {
                if (res.data.ok) {
                    resolve(res.data.payload);
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
    });
}

export {
    isLogged
}