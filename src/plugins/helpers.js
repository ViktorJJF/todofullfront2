export default {
    formattedDate: (dateInMilliseconds) => {
        let time = new Date(dateInMilliseconds);
        return time.toLocaleString();
    }
}