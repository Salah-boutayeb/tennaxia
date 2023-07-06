class TimeFormater {
    formatDate = (value) => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    formatDate1 = (value) => {
        return new Date(value).toLocaleString('en-US', { hour12: false });
    };

    formatDate2 = (value) => {
        return new Date(value).toLocaleTimeString('en-US', { hour12: false });
    };
    formatDate3 = (value) => {
        if (typeof value === 'string') {
            // Get the current date
            const currentDate = new Date();

            // Split the time string into hours, minutes, and seconds
            const [hours, minutes, seconds] = value.split(':');

            // Set the time on the current date
            currentDate.setHours(hours);
            currentDate.setMinutes(minutes);
            currentDate.setSeconds(seconds);

            // Format the date with the desired format
            value = currentDate.toString();
        }

        return value;
    };
}

export default new TimeFormater();
