function getExpiryStatus(expiryDate) {
    const currentDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));
    let thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    if (expiryDate < currentDate) {
        return "Expired";
    } else if (expiryDate <= thirtyDaysFromNow) {
        return "Will Expire Soon";
    } else {
        return "Not Expired";
    }
}

module.exports = getExpiryStatus;