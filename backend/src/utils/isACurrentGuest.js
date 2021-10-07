const isACurrentGuest = (user, UTCToTurkey) => {
    let checkIn = user.arriveDate
    let checkOut = user.departDate
    let today = new Date()
    // Converting from UTC to Turkish Time.
    today.setTime(today.getTime() + UTCToTurkey)

    if (today <= checkOut && today >= checkIn){
        return true
    }
    return false
    }



module.exports = isACurrentGuest